let recent = JSON.parse(localStorage.getItem('recent')) || [];

function saverecent() {
    localStorage.setItem('recent', JSON.stringify(recent));
}

export function addTorecent(valueToInsert) {
    if (recent.length >= 9) {
        recent.shift(); 
    }
    recent.push(valueToInsert); 
    saverecent(); 
};

export function getrecent() {
    return recent;
};

window.onload = function() {
    recent = JSON.parse(localStorage.getItem('recent')) || [];
    console.log(recent);
};
