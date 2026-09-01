from flask import Flask, jsonify, request
from flask_cors import CORS
import firebase_admin
from firebase_admin import storage
import json
from apscheduler.schedulers.background import BackgroundScheduler
import time
from datetime import datetime, timezone

cred = firebase_admin.credentials.Certificate('aeroweb27-firebase-adminsdk-oudwq-40e248fbf8.json')
firebase_admin.initialize_app(cred, {
    'storageBucket': 'aeroweb27.appspot.com'
})

app = Flask(__name__)
CORS(app, resources={r'/*': {'origins': '*'}})


scheduler = BackgroundScheduler()
uploadIntervalSec = 60 * 60    #1hr interval

def downloadFile(fileName):
    try:
        bucket = storage.bucket()
        blob = bucket.blob(f'Aeroweb27/{fileName}.json')
        blob.download_to_filename(f'{fileName}.json')
        with open(f'{fileName}.json', 'r') as file:
            obj = json.load(file)
        
        gmt = time.gmtime(time.time() + 19800)
        print(f'{time.strftime("%Y-%m-%d %H:%M:%S", gmt)} IST    Downloaded and loaded the file {fileName}.json in to memory...')
        return obj
    except Exception as e:
            print(f"Could not load {fileName}.json from Firebase. Starting fresh. Error: {e}")
            return {}

def uploadFile(fileName):
    try:
        gmt = time.gmtime(time.time() + 19800)
        print(f'{time.strftime("%Y-%m-%d %H:%M:%S", gmt)} IST    JOB FIRED', flush=True)
        global userData, feedbacks

        dataToUpload = userData if fileName == 'userData' else feedbacks if fileName == 'feedbacks' else None
        if dataToUpload == None:
            print('\n"fileName" must be "userData" or "feedbacks" only....\n')
            return

        with open(f'{fileName}.json', 'w') as file:
            json.dump(dataToUpload, file, indent = 4)

        bucket = storage.bucket()
        blob = bucket.blob(f'Aeroweb27/{fileName}.json')
        blob.upload_from_filename(f'{fileName}.json')

        gmt = time.gmtime(time.time() + 19800)
        print(f'{time.strftime("%Y-%m-%d %H:%M:%S", gmt)} IST    File "{fileName}.json" uploaded to Firebase...', flush = True)

        gmt = time.gmtime(time.time() + 19800)
        print(f'{time.strftime("%Y-%m-%d %H:%M:%S", gmt)} IST    JOB FINISHED', flush = True)
    except Exception as e:
        print(f"Could not upload {fileName}.json to Firebase. Starting fresh. Error: {e}")


def uploadFiles():
    try:
        gmt = time.gmtime(time.time() + 19800)
        print(f'{time.strftime("%Y-%m-%d %H:%M:%S", gmt)} IST    JOB FIRED', flush=True)

        global userData
        global feedbacks

        with open('userData.json', 'w') as file:
            json.dump(userData, file, indent = 4)

        bucket = storage.bucket()
        blob = bucket.blob('Aeroweb27/userData.json')
        blob.upload_from_filename('userData.json')
        
        with open('feedbacks.json', 'w') as file:
            json.dump(feedbacks, file, indent = 4)

        bucket = storage.bucket()
        blob = bucket.blob('Aeroweb27/feedbacks.json')
        blob.upload_from_filename('feedbacks.json')

        gmt = time.gmtime(time.time() + 19800)
        print(f'{time.strftime("%Y-%m-%d %H:%M:%S", gmt)} IST    Files (both) uploaded to Firebase...')

        gmt = time.gmtime(time.time() + 19800)
        print(f'{time.strftime("%Y-%m-%d %H:%M:%S", gmt)} IST    JOB FINISHED', flush = True)
    except Exception as e:
        print(f"Could not upload files to Firebase. Starting fresh. Error: {e}")

feedbacks = downloadFile('feedbacks')
userData = downloadFile('userData')
recentUserKeys = list(userData)

# print(feedbacks, userData)

scheduler.start()
scheduler.add_job(uploadFiles, 'interval', seconds = uploadIntervalSec)

@app.route('/postfeedback', methods = ['POST'])
def rcvfeedback():
    global feedbacks
    if request.is_json:
        data = request.get_json()
        # print(f'Recieved Data: {data}')
        print(f'Feedback Type: {feedbacks}')

        nFeeds = len(list(feedbacks))
        feedbacks[f'feed{nFeeds + 1}'] = data

        uploadFile('feedbacks')
        return jsonify({'success': True})
    else:
        print('Request must be JSON.')
        return jsonify({'success': False})

@app.route('/getfeedbacks')
def sendfeed():
    global feedbacks
    return jsonify(feedbacks)

@app.route('/clearfeedbacks', methods = ['POST'])
def clearfeed():
    global feedbacks
    if request.is_json:
        data = request.get_json()
        if data['code'] == 'Aeroweb27':
            feedbacks = {}
            uploadFile('feedbacks')
            return jsonify({'success': True})
        return jsonify({'success': False, 'detail': 'Code provided is incorrect!!!'})
    return jsonify({'success': False, 'detail': 'Send a valid json for validation!!!'})
    

#new code for userData and counter
@app.route('/userData', methods = ['POST'])
def postUserData():
    global userData, recentUserKeys
    data = request.get_json()
    if len(recentUserKeys):
        for key in recentUserKeys:
            if userData[key]['uid'] == data['uid']:
                recentUserKeys.remove(key)
                recentUserKeys.insert(0, key)

                if data['entry']:
                    userData[key]['visitcount'] = userData[key]['visitcount'] + 1
                    userData[key]['visits'][str(userData[key]['visitcount'])] = {
                        'entryepoch': time.time(),
                        'entry': datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")
                    }
                    if request.headers.get('User-Agent') not in userData[key]['useragent'].values():
                        userData[key]['useragent'][f'ua{len(userData[key]["useragent"]) + 1}'] = request.headers.get('User-Agent')
                else:
                    userData[key]['visits'][str(len(userData[key]['visits']))]['exitepoch'] = time.time()
                    userData[key]['visits'][str(len(userData[key]['visits']))]['exit'] = datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")

                uploadFile('userData')
                return jsonify({'detail': 'User Data logged Successfully.'})

    newUserKey = f'user{len(list(userData)) + 1}'
    recentUserKeys.insert(0, newUserKey)
    userData[newUserKey] = {
        'uid': data['uid'],
        'useragent': {
            'ua1': request.headers.get('User-Agent')
        },
        'visitcount': 1,
        'visits': {
            '1': {
                'entryepoch': time.time(),
                'entry': datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")
            }
        },
        'semestersvisited': {str(i): 0 for i in range(11)}
    }

    uploadFile('userData')
    return jsonify({'detail': 'User Data logged Successfully.'})

@app.route('/semClick', methods = ['POST'])
def semClick():
    global userData, recentUserKeys
    data = request.get_json()
    for key in recentUserKeys:
        if userData[key]['uid'] == data['uid']:
            userData[key]['semestersvisited'][str(data['sem'])] = userData[key]['semestersvisited'][str(data['sem'])] + 1

            recentUserKeys.remove(key)
            recentUserKeys.insert(0, key)
            uploadFile('userData')
            return jsonify({'message': 'Semester Visit logged Successfully.'})

    newUserKey = f'user{len(list(userData)) + 1}'
    recentUserKeys.insert(0, newUserKey)
    userData[newUserKey] = {
            'uid': data['uid'],
            'useragent': {
                'ua1': request.headers.get('User-Agent')
            },
            'visitcount': 1,
            'visits': {
                '1': {
                    'entryepoch': time.time(),
                    'entry': datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")
                }
            },
            'semestersvisited': {str(i): 1 if i == int(data['sem']) else 0 for i in range(11)}
        }

    uploadFile('userData')
    return jsonify({'message': 'Semester Visit logged Successfully.'})

    
        
@app.route('/getUserData')
def getUserData():
    return jsonify(userData)

@app.route('/clearUserData/<string:thisUser>')
def clearUserData(thisUser):
    global userData, recentUserKeys
    if thisUser == 'all':
        userData = {}
        recentUserKeys = [];

        uploadFile('userData')
        return jsonify({'detail': 'All User Data removed successfully.'})
    elif len(list(userData)):
        for key in recentUserKeys:
            if key == thisUser:
                del userData[key]
                recentUserKeys.remove(key)

                uploadFile('userData')
                return jsonify({'detail': f"'{key}' removed successfully from the User Data."})
    return jsonify({'detail': 'User Not Found!'})

@app.route('/clearAllUserData', methods = ['POST'])
def clearAllUserData():
    global userData, recentUserKeys
    if request.is_json:
        data = request.get_json()
        if data['code'] == 'Aeroweb27':
            userData = {}
            recentUserKeys = []

            uploadFile('userData')
            return jsonify({'success': True, 'detail': 'All user data removed successfully...'})
        return jsonify({'success': False, 'detail': 'Code provided is incorrect!!!'})
    return jsonify({'success': False, 'detail': 'Send a valid json for validation!!!'})

if __name__ == '__main__':
    try:
        app.run(host='0.0.0.0', port=8000)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()
