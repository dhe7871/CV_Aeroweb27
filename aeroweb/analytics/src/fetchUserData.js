import {
    tbody,
    tableHeading,
    totalUsers,
    dataTogBtns,
    menuToggle,
    attachEventListeners,
} from "./script.js";
import { addDataTable } from "./addDataTable.js";

let userdata;
async function getUserData() {
    try {
        const response = await fetch(
            "https://aerowebapi-g8e0crb4ekhsgddg.centralindia-01.azurewebsites.net/getUserData",
        );
        if (!response.ok) {
            console.error("Something gone wrong!");
        }
        const res = await response.json();
        return res;
    } catch (err) {
        console.error("Something again gone wrong!");
    }
}

getUserData().then((data) => {
    userdata = data;
    // const len = Object.keys(userdata).length;

    // tableHeading.innerText = "Recent Visit by Users";
    // totalUsers.innerHTML = `Total Users: <b>${len}<b>`;

    // tbody.innerHTML = ``;
    // const tmp = Array.from(
    //     { length: len },
    //     (_, i) =>
    //         Object.values(userdata[`user${i + 1}`]["visits"]).at(-1)[
    //             "entryepoch"
    //         ],
    // );
    // const lastEpoch = [...tmp].sort();

    // const keys = Array.from(
    //     { length: len },
    //     (_, i) => `user${tmp.indexOf(lastEpoch[i]) + 1}`,
    // ).reverse();

    // addDataTable(keys, data);

    const homeBtn = dataTogBtns[0];
    homeBtn.click();
    menuToggle.click();
    attachEventListeners();
});

export { userdata };
