// Initialize Tauri API
const { invoke } = window.__TAURI__.tauri;
import { refreshpage } from '../Main.js';

document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.getElementById('AddButton');
    const addContent = document.getElementById('Add-content');

    addButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Voorkom dat het click-event de document-click handler activeert
        const isVisible = addContent.style.display === 'block';
        addContent.style.visibility = isVisible ? 'hidden' : 'visible';
    });
    
    document.addEventListener('click', function() {
        addContent.style.visibility = 'hidden'; // Verberg het menu als ergens anders wordt geklikt
    });


    document.getElementById("LazyAddTxt").addEventListener('click', function() {
        console.log("TXT");
        var name = prompt("Please enter filename:");
        const filePath = decodeURIComponent(getCookie("LastPath"));
        name = name + ".txt"
        console.log(name);
        console.log(filePath);
        invoke("create_file", { filePath: filePath, fileName: name });

        refreshpage();
    });
});

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;
}