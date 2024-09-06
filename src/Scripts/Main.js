// Initialize Tauri API
const { invoke } = window.__TAURI__.tauri;

// Getting modules
import { addTorecent, getrecent } from './Recent.js';
import { elements } from './Elements.js';
import { getCookie, setCookie, toBoolean } from './Utils.js'
import { Save, Load, SaveRaw, LoadRaw } from './Data.js'

// History tracking
let pathHistory = [];
let currentHistoryIndex = -1;

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  //Nav UI
  elements.refreshbutton.addEventListener("click", refreshbuttonhandle);
  elements.settingsbutton.addEventListener("click", settingsbuttonhandle);
  elements.homebutton.addEventListener("click", homebuttonhandle);
  elements.historyleftbut.addEventListener("click", historyleft);
  elements.historyrightbut.addEventListener("click", historyright);
  elements.pathbar.addEventListener("input", handlePathbarInputChange);

  //Home UI
  elements.desktopbutton.addEventListener("click", desktopbuttonhandle);
  elements.documentsbutton.addEventListener("click", documentsbuttonhandle);
  elements.musicbutton.addEventListener("click", musicbuttonhandle);
  elements.downloadsbutton.addEventListener("click", downloadsbuttonhandle);
  elements.picturesbutton.addEventListener("click", picturesbuttonhandle);
  elements.videosbutton.addEventListener("click", videosbuttonhandle);
  elements.personbutton.addEventListener("click", personbuttonhandle);
  //Opendialog
  elements.opendialog_openfilebutton.addEventListener("click", openFile);

  //Settings UI
  elements.generalbutton.addEventListener("click", opensettingsgeneral)
  elements.uibutton.addEventListener("click", opensettingsui)
  elements.aboutbutton.addEventListener("click", opensettingsabout)

  // Initialize defaults
  changePathbarValue("", true); 
  initdriveletters();
});

// Settings UI Buttons
async function opensettingsgeneral() {
  elements.general.style.display = "block";
  elements.ui.style.display = "none";
  elements.about.style.display = "none";
}

async function opensettingsui() {
  elements.general.style.display = "none";
  elements.ui.style.display = "block";
  elements.about.style.display = "none";
}

async function opensettingsabout() {
  elements.general.style.display = "none";
  elements.ui.style.display = "none";
  elements.about.style.display = "block";
  console.log(navigator.userAgent);
  elements.webviewinfo.innerText = navigator.userAgent
}

//HomeUI Buttons
async function personbuttonhandle() {
  const homepath = await invoke("get_home_path");
  changePathbarValue(homepath);
}


async function desktopbuttonhandle() {
  const homepath = await invoke("get_home_path");
  changePathbarValue(homepath + "/Desktop");
};

async function documentsbuttonhandle() {
  const homepath = await invoke("get_home_path");
  changePathbarValue(homepath + "/Documents");
};

async function musicbuttonhandle() {
  const homepath = await invoke("get_home_path");
  changePathbarValue(homepath + "/Music");
};

async function downloadsbuttonhandle() {
  const homepath = await invoke("get_home_path");
  changePathbarValue(homepath + "/Downloads");
};

async function picturesbuttonhandle() {
  const homepath = await invoke("get_home_path");
  changePathbarValue(homepath + "/Pictures");
};

async function videosbuttonhandle() {
  const homepath = await invoke("get_home_path");
  changePathbarValue(homepath + "/Videos");
};


//navbar Buttons
async function refreshbuttonhandle() {
  const element = elements.refreshbutton;
  element.style.transition = "transform 2s ease"; // Smooth transition
  element.style.transform = "rotate(360deg)"; // Rotate 360 degrees

  setTimeout(() => {
    element.style.transition = "none"; // Disable transition
    element.style.transform = "rotate(0deg)"; // Reset to 0 degrees
  }, 2000); // Match the transition duration (2 seconds)
  
  const currentPath = decodeURIComponent(getCookie("LastPath"));
  changePathbarValue(currentPath, false);
}

async function settingsbuttonhandle() {
  showSettingsUI();
}

function homebuttonhandle() {
  changePathbarValue("");
  console.log(pathHistory);
}

// Navigate history left
async function historyleft() {
  if (currentHistoryIndex > 0) {
    currentHistoryIndex--;
    await changePathbarValue(pathHistory[currentHistoryIndex], false);
  }
}

// Navigate history right
async function historyright() {
  if (currentHistoryIndex < pathHistory.length - 1) {
    currentHistoryIndex++;
    await changePathbarValue(pathHistory[currentHistoryIndex], false);
  }
}

// Handle pathbar input change
async function handlePathbarInputChange(event) {
  var path = event.target.value.trim();

  if (path === "C:") {
    path = "C:/";
  }

  if (path === "") {
    showhomeui();
    return;
  }

  try {
    const pathExists = await invoke("path_exists", { path });
    elements.pathbar.style.color = pathExists ? 'black' : 'red';

    const pathType = await invoke("path_type", { path });

    if (pathType === "Folder") {
      addTorecent(path);
      await handleFolder(path);
    } else if (pathType === "File") {
      addTorecent(path);
      await handleFile(path);
    } else {
      handleInvalidPath(path);
    }

    updateHistory(path);
    setCookie("LastPath", path, 1);
  } catch (error) {
    console.error("Error handling path change:", error);
    alert(`Error handling path change: ${error.message}`);
  }
}


// Process functions


//Search functions
async function Search(path, query) {
  elements.tableBody.innerHTML = '';
  showFileList();
  const cell = document.createElement('td');
  cell.innerText = "Searching for " + query + " in " + path;


  const row = document.createElement('tr');
  row.appendChild(cell);

  elements.tableBody.appendChild(row);
  const result = await invoke('search', { path, query });
  DisplaySearchResults(result);
  showFileList();
}


//Display Search Results
function DisplaySearchResults(contents) {
  elements.tableBody.innerHTML = ''; // Clear existing table rows

  contents.forEach(Result => {
    const button = document.createElement('button');
    button.textContent = Result;
    button.addEventListener('click', () => {
      const nextPath = `${Result}`;
      changePathbarValue(nextPath);
    });

    const cell = document.createElement('td');
    cell.appendChild(button);

    const row = document.createElement('tr');
    row.appendChild(cell);

    elements.tableBody.appendChild(row);
  });
}


// Handle opening a file
async function openFile() {
  try {
    const path = decodeURIComponent(getCookie("LastPath"));
    if (!path) {
      throw new Error("LastPath cookie is not set.");
    }

    await invoke("open_file", { path });
  } catch (error) {
    console.error("Error opening file:", error);
    alert(`Error opening file: ${error.message}`);
  }
}


// Handle folder navigation
async function handleFolder(path) {
  try {
    const contents = await invoke("list_dir", { path });
    displayDirectoryContents(contents);
    showFileList();
  } catch (error) {
    console.error("Error listing directory:", error);
    alert(`Error listing directory: ${error.message}`);
  }
}

// Handle displaying directory contents
function displayDirectoryContents(contents) {
  elements.tableBody.innerHTML = ''; // Clear existing table rows

  contents.forEach(fileName => {
    // Create button for file navigation
    const fileButton = document.createElement('button');
    fileButton.textContent = fileName;
    fileButton.addEventListener('click', () => {
      const currentPath = decodeURIComponent(getCookie("LastPath"));
      const nextPath = currentPath.endsWith('/') ? currentPath + fileName : `${currentPath}/${fileName}`;
      changePathbarValue(nextPath);
    });

    // Create delete button with image
    const delButton = document.createElement('button');
    delButton.style.border = 'none'; // Remove default border
    delButton.style.background = 'none'; // Remove default background
    delButton.style.cursor = 'pointer'; // Change cursor to pointer

    const delImg = document.createElement('img');
    delImg.src = "Icons/trashbin.svg";
    delButton.appendChild(delImg);

    let isDeleted = false;

    delButton.addEventListener('click', () => {
      if (!isDeleted) {
        delImg.src = "Icons/trashbin2.svg"; // Change image to trashbin2.svg
        delImg.style.background = "red";
        isDeleted = true; // Set flag to indicate the button has been clicked

        const currentPath = decodeURIComponent(getCookie("LastPath"));
        const nextPath = currentPath.endsWith('/') ? currentPath + fileName : `${currentPath}/${fileName}`;
        console.log(nextPath);
      } else {
        console.log("DELETE"); // Print DELETE to the console on subsequent clicks

        const currentPath = decodeURIComponent(getCookie("LastPath"));
        const filePath = currentPath.endsWith('/') ? currentPath + fileName : `${currentPath}/${fileName}`;
        
        invoke("delete_file", { filePath });

        // Refresh page to show the changes
        setTimeout(function() {
          const currentPath = decodeURIComponent(getCookie("LastPath"));
          changePathbarValue(currentPath, false);
        }, 250); 
      }
    });

    // Create table cells and append buttons
    const fileCell = document.createElement('td');
    fileCell.appendChild(fileButton);

    const delCell = document.createElement('td');
    delCell.appendChild(delButton);

    const row = document.createElement('tr');
    row.appendChild(fileCell);
    row.appendChild(delCell);

    elements.tableBody.appendChild(row);
  });
}



// Handle file navigation
async function handleFile(path) {
  try {
    console.log(LoadRaw("directopenbtn"));
    if (toBoolean(LoadRaw("directopenbtn")) == false) {
      console.log("Then why this run?")
      const filename = path.split(/[\/\\]/).pop();

      elements.opendialogh1.textContent = filename;
      elements.opendialogp.textContent = `Want to open ${filename}?`;
      elements.opendialog_openfilehash.textContent = "Loading";
      elements.opendialog_openfilehash.textContent = await invoke("get_file_hash", { path });
      showOpenDialog();
    }

  } catch (error) {
    console.error("Error handling file:", error);
    alert(`Error handling file: ${error.message}`);
  }
}

let searchtimeout;

function handleInvalidPath(path) {
  if (path == null) {
    return;
}
  console.log(path.charAt(1));
  if (path.charAt(1) === ':' && path.charAt(2) === '/') {
    console.log("Not Searching");
    elements.pathbar.style.color = 'Red';
  } else {
    console.log("Waiting to Search");

    // Clear any existing timeout
    clearTimeout(searchtimeout);

    // Set a new timeout to execute the search after 1 second
    searchtimeout = setTimeout(() => {
      console.log("Searching");
      
      elements.pathbar.style.color = 'Blue';
      Search("C:/", path);
    }, 1000);
  }
}

// Update history and pathbar value
async function changePathbarValue(value, addToHistory = true) {
  try {
    elements.pathbar.value = value;
    elements.pathbar.dispatchEvent(new Event('input'));

    const pathExists = await invoke("path_exists", { path: value });
    elements.pathbar.style.color = pathExists ? 'black' : 'red';

    if (addToHistory) {
      updateHistory(value);
      setCookie("LastPath", value, 1);
    }

    await updateUIForPath(value);
  } catch (error) {
    console.error("Error changing path:", error);
    alert(`Error changing path: ${error.message}`);
  }
}

// Update UI for path type
async function updateUIForPath(path) {
  try {
    const pathType = await invoke("path_type", { path });

    if (pathType === "Folder") {
      showFileList();
      const contents = await invoke("list_dir", { path });
      displayDirectoryContents(contents);
    } else if (pathType === "File") {
      if (toBoolean(LoadRaw("directopenbtn")) == false) {
        const filename = path.split(/[\/\\]/).pop();
        elements.opendialogh1.textContent = filename;
        elements.opendialogp.textContent = `Want to open ${filename}?`;
        showOpenDialog();
      } else {
        openFile();
      }
    } else {
      handleInvalidPath();
    }
  } catch (error) {
    console.error("Error updating UI for path:", error);
    alert(`Error updating UI for path: ${error.message}`);
  }
}

async function initdriveletters() {
  const drivetable = await invoke("get_drive_letters");
  console.log(drivetable)

  drivetable.forEach(drive => {
    console.log(drive)
    const button = document.createElement('button');
    button.textContent = drive;
    button.addEventListener('click', () => {
      const nextPath = `${drive}`;
      changePathbarValue(nextPath);
    });

    elements.drivescontent.appendChild(button);
  });
}

// Show file list and hide open dialog
function showFileList() {
  elements.filelist.style.display = "block";
  elements.opendialog.style.display = "none";
  elements.homeui.style.display = "none";
  elements.settingsui.style.display = "none";
}

// Show open dialog and hide file list
function showOpenDialog() {
  elements.filelist.style.display = "none";
  elements.opendialog.style.display = "block";
  elements.homeui.style.display = "none";
  elements.settingsui.style.display = "none";

  if (toBoolean(LoadRaw("hashbtn")) == false) {
    elements.settingshashdiv.style.display = "none";
  } else {
    elements.settingshashdiv.style.display = "block";
  }
}

function showSettingsUI() {
  elements.filelist.style.display = "none";
  elements.opendialog.style.display = "none";
  elements.homeui.style.display = "none";
  elements.settingsui.style.display = "block";

  opensettingsgeneral();
}

function showhomeui() {
  elements.filelist.style.display = "none";
  elements.opendialog.style.display = "none";
  elements.homeui.style.display = "block";
  elements.settingsui.style.display = "none";

  //Collect data
  const recentpaths = getrecent();

  //Remove old data
  const buttons = document.getElementById('RecentDiv').getElementsByTagName('button');
  while (buttons.length > 0) {
      buttons[0].remove();
  }

  //Insert new data
  recentpaths.forEach(value => {
    const b = document.createElement('button');
    b.textContent = value;
    document.getElementById("RecentDiv").appendChild(b);
    b.addEventListener('click', () => {
      changePathbarValue(value, false);
    });
  });

}

// Update history with current path
function updateHistory(path) {
  if (currentHistoryIndex === -1 || pathHistory[currentHistoryIndex] !== path) {
    currentHistoryIndex++;
    pathHistory = pathHistory.slice(0, currentHistoryIndex);
    pathHistory.push(path);
  }
}

