const developerMode = true;
const dataColAPIUrl =
    "https://aerowebapi-g8e0crb4ekhsgddg.centralindia-01.azurewebsites.net";
// const dataColAPIUrl = 'http://127.0.0.1:8000';
const counterAPIUrl = !developerMode
    ? "https://counterapi-d6d4drfdawacbxa4.centralindia-01.azurewebsites.net"
    : "";
let clicks = 0;
let feedclick = false;
const search = document.getElementById("search");
const inputbox = document.getElementById("inputbox");
const counter = document.getElementById("visiters");
const semesters = document.getElementById("semesters");
const form = document.getElementById("feedform");
const feedbtn = document.getElementById("feedbtn");
const submitbtn = document.getElementById("submitbtn");

const semester_links = [
    "https://drive.google.com/drive/folders/1W5iLmx-LIYZMCkJSbfsjHAjk-IAE2XDS?usp=sharing",
    "https://drive.google.com/drive/folders/1YceXlEzYE1OEE8X1HScYkg78TW6Le0qr?usp=sharing",
    "https://drive.google.com/drive/folders/1YPbs9uDRAqTdpRE5Rn-U1HOg5AiD50VJ?usp=sharing",
    "https://drive.google.com/drive/folders/1dTWbQtVXZeCUs0ueHSxan6I3HvqPVC2P?usp=sharing",
    "https://drive.google.com/drive/folders/1HGws084RQdgdJByCuA687GS5uPGcHgqj?usp=sharing",
    "https://drive.google.com/drive/folders/1njyTJhbyx7zIIaiML2PqoywS0JAS5T4b?usp=sharing",
    "https://drive.google.com/drive/folders/1g32YsO2cRSag59YcJ61b23wcOxKrrqoe?usp=sharing",
    "https://drive.google.com/drive/folders/1a__7vugnVe4hSt7pAm7WV7MCMBdxCe4A?usp=sharing",
    "./notFound/not_found.html",
    "./notFound/not_found.html",
];

let i = 1;
for (value of semester_links) {
    let div = document.createElement("div");
    div.setAttribute("class", `col clmn ${i % 2 == 0 ? "evenSem" : "oddSem"}`);
    div.innerHTML = `<a href=${value} target="_blank" class='mlink'>
                        <div class="semCard genCard">
                            <img src="./images/sem_${i}.png" alt="Semester ${i}" style="height: 100%; width: 100%;">
                        </div>
                    </a>`;
    semesters.appendChild(div);
    i++;
}

//new code
document.addEventListener("DOMContentLoaded", () => {
    fetch(`${counterAPIUrl}/countUp/Aeroweb27Counter`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not OK.");
            }
            return response.json();
        })
        .then((data) => {
            document.getElementById("visiters").innerHTML =
                `Visiters: ${data["count"]}`;
            localStorage.setItem("AerowebCounterValue", data["count"]);
        })
        .catch((error) => {
            console.error(error);

            const counterValue = localStorage.getItem("AerowebCounterValue");
            if (counterValue !== null) {
                document.getElementById("visiters").innerHTML =
                    `Visiters: ${counterValue}`;
            }
        });

    function getUid() {
        return new Promise((resolve, reject) => {
            let uid = localStorage.getItem("uid");
            if (uid) {
                resolve(uid);
            } else {
                FingerprintJS.load()
                    .then((fp) => {
                        fp.get()
                            .then((result) => {
                                uid = result.visitorId;
                                localStorage.setItem("uid", uid);
                                resolve(uid);
                            })
                            .catch(reject);
                    })
                    .catch(reject);
            }
        });
    }

    function sendUserData(uid) {
        fetch(`${dataColAPIUrl}/userData`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ uid: uid, entry: true }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network Response was not OK!");
                }
                return response.json();
            })
            .catch((error) => {
                console.error(error);
            });
    }

    getUid()
        .then((uid) => {
            sendUserData(uid);
        })
        .catch((error) => {
            console.error(`Error getting UID: ${error}`);
        });
});

window.addEventListener("beforeunload", function (event) {
    payload = JSON.stringify({
        uid: localStorage.getItem("uid"),
        entry: false,
    });

    fetch(`${dataColAPIUrl}/userData`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: payload,
        keepalive: true,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network Response was not OK!");
            }
            return response.json();
        })
        .catch((error) => {
            let message = `Error: ${error}`;
            console.error(message);
        });
});

//searchbar code
search.addEventListener("click", searchbar);
function searchbar() {
    if (!clicks) {
        inputbox.style.display = "inline-block";
        inputbox.value = "";
        inputbox.focus();
    } else if (clicks == 1) {
        if (inputbox.value == "") {
            clicks++;
        } else {
            console.log(inputbox.value);
        }
    }
    if (clicks == 2) {
        inputbox.style.display = "none";
    }

    clicks = (clicks + 1) % 3;
}
inputbox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        console.log(inputbox.value);
        clicks = 2;
    }
});
document.addEventListener("keydown", (event) => {
    if (event.key === "/" && clicks != 1) {
        inputbox.style.display = "inline-block";
        inputbox.focus();
        event.preventDefault();
        inputbox.value = "";
        clicks = 1;
    }
});

//code for getting feedback
feedbtn.addEventListener("click", () => {
    const formname = document.getElementsByClassName("formname")[0];
    const befAftFeedBtn = document.querySelectorAll(".befAftFeedBtn");
    if (!feedclick) {
        form.style.display = "flex";
        formname.style.justifyContent = "center";
        formname.style.backgroundColor = "rgba(245, 245, 245, 0.196)";
        formname.style.borderTopLeftRadius = "20px";
        formname.style.borderTopRightRadius = "20px";

        document.getElementById("name").focus();

        feedbtn.style.backgroundColor = "black";
        feedbtn.style.borderWidth = "0px";
        feedbtn.style.borderTopLeftRadius = "0";
        feedbtn.style.borderTopRightRadius = "0";
        feedbtn.style.fontWeight = "normal";
        befAftFeedBtn.forEach((node) => {
            node.style.display = "block";
        });

        feedclick = true;
    } else {
        form.style.display = "none";
        formname.style.justifyContent = "start";
        formname.style.borderTopLeftRadius = "0";
        formname.style.borderTopRightRadius = "0";
        formname.style.backgroundColor = "black";

        feedbtn.style.borderWidth = "1px";
        feedbtn.style.borderTopLeftRadius = "20px";
        feedbtn.style.borderTopRightRadius = "20px";
        befAftFeedBtn.forEach((node) => {
            node.style.display = "none";
        });

        feedclick = false;
    }
});
feedbtn.addEventListener("mouseover", () => {
    if (!feedclick) {
        feedbtn.style.backgroundColor = "rgba(245, 245, 245, 0.196)";
        feedbtn.style.fontWeight = "600";
    } else {
        feedbtn.style.fontWeight = "600";
    }
});
feedbtn.addEventListener("mouseout", () => {
    if (!feedclick) {
        feedbtn.style.fontWeight = "normal";
        feedbtn.style.backgroundColor = "black";
        feedbtn.style.color = "whitesmoke";
    } else {
        feedbtn.style.fontWeight = "normal";
    }
});

submitbtn.addEventListener("click", () => {
    const formdata = new FormData(form);
    let message = "";
    for (let [key, value] of formdata.entries()) {
        console.log(key, value);
        if (!value) {
            if (key == "name" || key == "email") {
                message = `*Please enter your '${key}'.`;
            } else if (key == "rollnum") {
                message = `*Please enter your 'Roll Number'`;
            } else {
                message = "*Please give your feedback/suggestions.";
            }
            break;
        }
        if (key == "email") {
            if (!value.includes("@")) {
                message = "*Please enter a valid email.";
            }
        }
    }

    if (!message) {
        message = "Feedback/Suggestion submitted successfully.";

        feedData = {
            name: formdata.get("name"),
            rollnum: formdata.get("rollnum"),
            email: formdata.get("email"),
            feedback: formdata.get("feedback"),
            submittedAt: new Date(),
            isResolved: false,
            resolvedAt: null
        };
        console.log("feeddata: ", feedData);
        //code to send data to the cloud is to be written here
        fetch(`${dataColAPIUrl}/postfeedback`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(feedData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not OK.");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Successfully posted to api.", data);
            })
            .catch((error) => {
                message = `Error: ${error}`;
                console.error("Error: ", error);
            });

        document.getElementById("name").value = "";
        document.getElementById("rollnum").value = "";
        document.getElementById("email").value = "";
        document.getElementById("feedback").value = "";
        document.getElementById("submsnmsg").innerText = message;
        document.getElementById("submsnmsg").style.color = "green";
        document.getElementById("submsnmsg").style.visibility = "visible";
    } else {
        document.getElementById("submsnmsg").innerText = message;
        document.getElementById("submsnmsg").style.color = "red";
        document.getElementById("submsnmsg").style.visibility = "visible";
    }
});

const semlinks = document.getElementsByClassName("mlink");
for (let i = 0; i < semlinks.length; i++) {
    semlinks[i].onclick = function () {
        fetch(`${dataColAPIUrl}/semClick`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ uid: localStorage.getItem("uid"), sem: i }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok!");
                }
                return response.json();
            })
            .catch((error) => {
                console.error({ message: `Error: ${error}` });
            });
    };
}
