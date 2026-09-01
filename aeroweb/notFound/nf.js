let clicks = 0;
const search = document.getElementById('search');
const inputbox = document.getElementById('inputbox');
const counter_nf = document.getElementById('visiters_nf');



counter_nf.innerText = `Visiters: ${localStorage.getItem("AerowebCounterValue")}`;

search.addEventListener('click', searchbar);
function searchbar() {
    if (!clicks) {
        inputbox.style.display = "inline-block";
        inputbox.value = '';
        inputbox.focus();
    } else if (clicks == 1) {
        if (inputbox.value == '') {
            clicks++;
        } else {
            console.log(inputbox.value);
        }
    }
    if (clicks == 2) {
        inputbox.style.display = "none";
    }

    clicks = ((clicks + 1) % 3);
}
inputbox.addEventListener('keydown', () => {
    if (event.key === 'Enter') {
        console.log(inputbox.value);
        clicks = 2;
    }
});
document.addEventListener('keydown', (event) => {
    if (event.key === '/' && clicks != 1) {
        inputbox.style.display = "inline-block";
        inputbox.focus();
        event.preventDefault();
        inputbox.value = '';
        clicks = 1;
    }
})
