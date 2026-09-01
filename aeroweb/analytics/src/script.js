import { userdata } from "./fetchUserData.js";
import { addUserCard } from "./addUserCard.js";
import { reframeDisplayedUserData } from "./reframeDisplayedUserData.js";

import "./menuTogEventListeners.js";

export const tableHeading = document.getElementsByClassName("tableHeading")[0];
export const totalUsers = document.getElementsByClassName("totalUsers")[0];
export const tbody = document.getElementsByClassName("tbody")[0];
export const menuToggle = document.getElementsByClassName("navbar-toggler")[0];
export const homeBtn = document.getElementsByClassName("homeBtn")[0];
export const recVis = document.getElementsByClassName("recVis")[0];
export const mtSpent = document.getElementsByClassName("mtSpent")[0];
export const userWise = document.getElementsByClassName("userWise")[0];
export const feedBtn = document.getElementsByClassName("feedBtn")[0];
export const dataTogBtns = [homeBtn, recVis, mtSpent, userWise];

let isCardOnScr = false;
reframeDisplayedUserData();

//logic for the card
export const attachEventListeners = () => {
    document.addEventListener("click", (e) => {
        const userCard = document.querySelector(".userCard");
        const dataDiv = document.querySelector(".dataDiv");

        if (e.target && e.target.classList.contains("uname") && !isCardOnScr) {
            const uname = e.target.innerText;
            addUserCard(uname, userdata[uname]);
            dataDiv.style.filter = "blur(3px) brightness(0.7)";
            userCard.style.transform = "translateX(0)";
            isCardOnScr = true;
        } else if (isCardOnScr && !userCard.contains(e.target)) {
            dataDiv.style.filter = "none";
            userCard.style.transform = "translateX(-75vw)";
            isCardOnScr = false;
        }
    });

    const uaArrow = document.getElementById("uaArrow");
};