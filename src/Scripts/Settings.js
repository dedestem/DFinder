// Initialize Tauri API
const { invoke } = window.__TAURI__.tauri;

// Modules
import { Save, Load, LoadRaw, SaveRaw } from './Data.js'
import { elements } from './Elements.js';
import { rgbToHex, toBoolean} from './Utils.js';

//
// Background Colors
//

const backcolorInput = document.getElementById('backcolor');
const transparencyInput = document.getElementById('transparency');

function updateColor() {
    const hex = backcolorInput.value;
    const alpha = transparencyInput.value;
    const rgbaColor = hexToRgba(hex, alpha);
    document.body.style.backgroundColor = rgbaColor;
    console.log(rgbaColor)
}

function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    savecolors(r,g,b,alpha)
    return `rgba(${r}, ${g}, ${b}, ${1})`; // change 1 to aplha when doing transparency dev
}

function savecolors(r,g,b,a) {
    Save(r,"rbackground")
    Save(g,"gbackground")
    Save(b,"bbackground")
    Save(a,"abackground")
}

function Loadcolors() {
    const r = Load("rbackground")
    const g = Load("gbackground")
    const b = Load("bbackground")
    const a = Load("abackground")

    const hex = rgbToHex(r,g,b)
    backcolorInput.value = hex;
    transparencyInput.value = a;

    updateColor();
}

backcolorInput.addEventListener('input', updateColor);
transparencyInput.addEventListener('input', updateColor);


//
// Small buttons
//

function showhashbtnchanged() {
    const value = elements.showhashbtn.checked
    SaveRaw(value, "hashbtn")
}

function directlyopenbtnchanged() {
    const value = elements.opendirectlybtn.checked
    SaveRaw(value, "directopenbtn")
}

function loadsmallbuttons() {
    console.log(LoadRaw("directopenbtn"));
    
    elements.opendirectlybtn.checked = toBoolean(LoadRaw("directopenbtn"));
    elements.showhashbtn.checked = toBoolean(LoadRaw("hashbtn"));
}

//
// Small buttons hooks
//
elements.devtoolsbtn.addEventListener("click", OpenDevTools)
elements.showhashbtn.addEventListener('change', showhashbtnchanged)
elements.opendirectlybtn.addEventListener('change', directlyopenbtnchanged)


//Inits
document.addEventListener('DOMContentLoaded', () => {
    fresh();
    loadsmallbuttons();
    Loadcolors();
});

function fresh() {
    if (Load("Fresh") == "Watermelon") {} else {
        console.log("Fresh lets unfresh");
        Save("Watermelon","Fresh")
        hexToRgba(rgbToHex(35,35,35), 1)
        SaveRaw(true, "directopenbtn")
        SaveRaw(false, "hashbtn")
    }
}