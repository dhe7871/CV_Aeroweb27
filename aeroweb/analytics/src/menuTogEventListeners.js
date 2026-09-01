import { dataTogBtns, feedBtn } from "./script.js";


document.addEventListener("DOMContentLoaded", () => {
    [...dataTogBtns, feedBtn].forEach((btn) => {
        if (window.innerWidth < 992) {
            btn.setAttribute("data-bs-toggle", "collapse");
            btn.setAttribute("data-bs-target", "#navbarSupportedContent");
            btn.setAttribute("aria-expanded", "true");
        } else {
            btn.removeAttribute("data-bs-toggle");
            btn.removeAttribute("data-bs-target");
            btn.removeAttribute("aria-expanded");
        }
    });
});
window.addEventListener("resize", () => {
    [...dataTogBtns, feedBtn].forEach((btn) => {
        if (window.innerWidth < 992) {
            btn.setAttribute("data-bs-toggle", "collapse");
            btn.setAttribute("data-bs-target", "#navbarSupportedContent");
            btn.setAttribute("aria-expanded", "true");
        } else {
            btn.removeAttribute("data-bs-toggle");
            btn.removeAttribute("data-bs-target");
            btn.removeAttribute("aria-expanded");
        }
    });
});