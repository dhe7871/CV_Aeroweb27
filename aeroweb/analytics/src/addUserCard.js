import { formatTimeString } from "./formatTimeString.js";

let defaultUADisplayed = 1;
let defaultVisitsDisplayed = 2;
let isUAExpanded = false;
let isVisitsExpanded = false;

const controlArrow = document.querySelectorAll(".controlArrow");
console.log(controlArrow);

Array.from(controlArrow).forEach((arrow, idx) => {
    arrow.addEventListener("click", () => {
        console.log("Arrow Clicked");
        switch (idx) {
            case 0:
                if (defaultUADisplayed < Object.keys(data.useragent).length) {
                    isUAExpanded = !isUAExpanded;
                    console.log("UA expand arrow clicked");
                }
                break;
            case 1:
                if (visitsDisplayed < visitcount) {
                    isVisitsExpanded = !isVisitsExpanded;
                }
                break;
        }
    });
});

const createAControlElement = (controlFor) => {
    const controlElement = document.createElement("span");
    controlElement.classList.add("material-symbols-outlined", "controlArrow");

    if (controlFor === "user-agents") {
        controlElement.id = "uaArrow";

        controlElement.onclick = function () {
            if (defaultUADisplayed < Object.keys(data.useragent).length) {
                isUAExpanded = !isUAExpanded;
                console.log("UA expand arrow clicked");
            }
        };

        controlElement.innerText = isUAExpanded
            ? "arrow-upward"
            : "arrow-downward";
    } else if (controlFor === "visits") {
    } else {
        return null;
    }

    return controlElement;
};

const mapUAList = (data) => {
    return Object.values(data.useragent).map((ua, idx) => {
        return `<div style="padding-top: 1rem; padding-bottom: 1rem; ${
            idx !== Object.keys(data.useragent).length - 1
                ? `border-bottom: 1px dashed grey;`
                : ``
        }"><b>User-Agent ${idx + 1}: </b>${ua}</div>`;
    });
    // ;
};

export const addUserCard = (user, data) => {
    const userCard = document.querySelector(".userCard");
    userCard.innerHTML = `
            <div>
                <h3>User ${user.slice(4)}</h3>
                <h5>UID: <i>${data.uid}</i></h5>
            </div>
            <div>
                ${mapUAList(data)
                    .slice(0, isUAExpanded ? undefined : defaultUADisplayed + 1)
                    .join("\n")}
                ${
                    Object.keys(data.useragent).length > defaultUADisplayed
                        ? `<p style="text-align: center; margin-top: 0.5rem; margin-bottom: 0.5rem;">
                                <span class="material-symbols-outlined controlArrow" id="uaArrow">${isUAExpanded ? `arrow_upward` : `arrow_downward`}</span>
                            </p>`
                        : ""
                }
            </div>
            <div>
                <p><b>Website Visit Count: </b>${data.visitcount}</p>
                <p><u><b>Visits</b></u></p>
                <div class="lastVisit" ${
                    data.visitcount > 1
                        ? `style="border-bottom: 1px dashed grey;"`
                        : ``
                }>
                    <p style="text-align: center;"><u>Visit-${Math.max(
                        ...Object.keys(data.visits),
                    )}</u></p>
                    <p>Entry: <i>${formatTimeString(
                        data.visits[Math.max(...Object.keys(data.visits))]
                            .entry,
                    )}</i></p>
                    <p>Exit: <i>${
                        data.visits[Math.max(...Object.keys(data.visits))].exit
                            ? formatTimeString(
                                  data.visits[
                                      Math.max(...Object.keys(data.visits))
                                  ].exit,
                              )
                            : "-"
                    }</i></p>
                </div>
                ${
                    Object.keys(data.visits).length > 1
                        ? `<p style="text-align: center; margin-top: 0.5rem; margin-bottom: 0.5rem;">
                                <span class="material-symbols-outlined controlArrow" id="visitArrow">arrow_downward</span>
                            </p>`
                        : ""
                }            
            </div>
            <div>
                <p style="text-align: center;"><b>Visited Semesters</b></p>
                ${
                    Object.values(data.semestersvisited).reduce((acc, cval) => {
                        return acc + cval;
                    }, 0)
                        ? Object.keys(data.semestersvisited)
                              .map((key) => {
                                  return Number(data.semestersvisited[key])
                                      ? `<p>${
                                            Number(key)
                                                ? `Semester ${key}`
                                                : `Books`
                                        }: ${
                                            data.semestersvisited[key]
                                        } times</p>`
                                      : "";
                              })
                              .join("\n")
                        : `<p>No Semester is Visited Yet...</p>`
                }
            </div>
    `;
};
