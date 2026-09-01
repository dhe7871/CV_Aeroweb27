import { formatTimeString } from "./formatTimeString.js";

const dataColAPIUrl =
    "https://aerowebapi-g8e0crb4ekhsgddg.centralindia-01.azurewebsites.net";

const feedbackContentDiv =
    document.getElementsByClassName("feedbackContentDiv")[0];

fetch(`${dataColAPIUrl}/getfeedbacks`)
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not OK.");
        }
        return response.json();
    })
    .then((data) => {
        const feedbacks = data;
        const feedKeys = Object.keys(feedbacks);
        const nFeeds = feedKeys.length;

        feedKeys.forEach((feedKey, idx) => {
            const feedcard = document.createElement("div");
            feedcard.classList.add("feedcard");

            feedcard.innerHTML = `
                <div class="feedcardHead">
                    <div style="font-size: 1.2rem; font-weight: bold">
                        Feedback ${idx + 1}
                    </div>
                    <div>
                        <span style="color: rgb(3, 166, 3); display: ${feedbacks[feedKey]["isResolved"] ? "inline" : "none"}">
                            Resolved
                        </span>
                        <button type="button" class="resolveUndoBtn ${feedbacks[feedKey]["isResolved"] ? "undo" : "resolve"}">
                            ${feedbacks[feedKey]["isResolved"] ? "Undo" : "Resolve"}
                        </button>
                    </div>
                </div>
                <div style="font-size: 1.1rem; font-style: italic">
                    ${feedbacks[feedKey]["name"]}, ${feedbacks[feedKey]["rollnum"]}
                </div>
                <div style="font-size: 1rem; font-style: italic">
                    ${feedbacks[feedKey]["email"]}
                </div>
                <hr>
                <p>
                    ${feedbacks[feedKey]["feedback"]}
                </p>
                <div class="feedTimestampDiv">
                    <div style="color: rgb(9, 117, 211)" title="Submitted At">
                        ${feedbacks[feedKey]["submittedAt"] ? formatTimeString((new Date(feedbacks[feedKey]["submittedAt"])).toString()) : ""}
                    </div>
                    <div style="color: rgb(3, 166, 3)" title="Resolved At">
                        ${feedbacks[feedKey]["resolvedAt"] || ""}
                    </div>
                </div>
            `;
            feedbackContentDiv.appendChild(feedcard, "beforeend");
        });
    })
    .catch((error) => {
        console.error(error);
    });
