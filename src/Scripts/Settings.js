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
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

backcolorInput.addEventListener('input', updateColor);
transparencyInput.addEventListener('input', updateColor);

updateColor();