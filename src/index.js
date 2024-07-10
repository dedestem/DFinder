// Initialize Tauri API
const { invoke } = window.__TAURI__.tauri;

// HTML elements
const elements = {
  //Navbar UI
  homebutton: document.getElementById("HomeButton"),
  historyleftbut: document.getElementById("historyleft"),
  historyrightbut: document.getElementById("historyright"),
  pathbar: document.getElementById("pathbar"),

  //HomeUI
  desktopbutton: document.getElementById('desktopbutton'),
  documentsbutton: document.getElementById('documentsbutton'),
  musicbutton: document.getElementById('musicbutton'),
  downloadsbutton: document.getElementById('downloadsbutton'),
  picturesbutton: document.getElementById('picturesbutton'),
  videosbutton: document.getElementById('videosbutton'),

  //Content display
  opendialog: document.getElementById('OpenDialog'),
  opendialogh1: document.getElementById('OpenDialogH1'),
  opendialogp: document.getElementById('OpenDialogP'),
  opendialog_openfilebutton: document.getElementById('OpenFileButton'),
  tableBody: document.getElementById('tableBody'),
  filelist: document.getElementById('FileList'),
  homeui: document.getElementById('Homeui'),

  //Test
  testbutton: document.getElementById("Testbutton"),
};

// History tracking
let pathHistory = [];
let currentHistoryIndex = -1;


// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  //Nav UI
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

  //Etc
  elements.testbutton.addEventListener("click", searchtest);
  elements.opendialog_openfilebutton.addEventListener("click", openFile);

  // Initialize defaults
  changePathbarValue("", true); 
  showhomeui();
});

async function searchtest() {
  Search("C:/", "Test");
}

//HomeUI Buttons
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
function homebuttonhandle() {
  console.log("HOME PRESSED");
  changePathbarValue("");
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
      await handleFolder(path);
    } else if (pathType === "File") {
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
async function Search(path, query) {
  const result = await invoke('search', { path, query });
  console.log(result);
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
    const button = document.createElement('button');
    button.textContent = fileName;
    button.addEventListener('click', () => {
      const currentPath = decodeURIComponent(getCookie("LastPath"));
      const nextPath = currentPath.endsWith('/') ? currentPath + fileName : `${currentPath}/${fileName}`;
      changePathbarValue(nextPath);
    });

    const cell = document.createElement('td');
    cell.appendChild(button);

    const row = document.createElement('tr');
    row.appendChild(cell);

    elements.tableBody.appendChild(row);
  });
}

// Handle file navigation
async function handleFile(path) {
  try {
    const filename = path.split(/[\/\\]/).pop();

    elements.opendialogh1.textContent = filename;
    elements.opendialogp.textContent = `Want to open ${filename}?`;
    showOpenDialog();
  } catch (error) {
    console.error("Error handling file:", error);
    alert(`Error handling file: ${error.message}`);
  }
}

// Handle invalid path
function handleInvalidPath(path) {
  elements.pathbar.style.color = 'Blue';
  Search("C:/", path);
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
      const filename = path.split(/[\/\\]/).pop();
      elements.opendialogh1.textContent = filename;
      elements.opendialogp.textContent = `Want to open ${filename}?`;
      showOpenDialog();
    } else {
      handleInvalidPath();
    }
  } catch (error) {
    console.error("Error updating UI for path:", error);
    alert(`Error updating UI for path: ${error.message}`);
  }
}

// Show file list and hide open dialog
function showFileList() {
  elements.filelist.style.display = "block";
  elements.opendialog.style.display = "none";
  elements.homeui.style.display = "none";
}

// Show open dialog and hide file list
function showOpenDialog() {
  elements.filelist.style.display = "none";
  elements.opendialog.style.display = "block";
  elements.homeui.style.display = "none";
}

function showhomeui() {
  elements.filelist.style.display = "none";
  elements.opendialog.style.display = "none";
  elements.homeui.style.display = "block";
}

// Update history with current path
function updateHistory(path) {
  if (currentHistoryIndex === -1 || pathHistory[currentHistoryIndex] !== path) {
    currentHistoryIndex++;
    pathHistory = pathHistory.slice(0, currentHistoryIndex);
    pathHistory.push(path);
  }
}

// Retrieve a cookie by name
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

// Set a cookie
function setCookie(name, value, daysToLive) {
  let cookie = `${name}=${encodeURIComponent(value)}`;

  if (daysToLive) {
    let expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (daysToLive * 24 * 60 * 60 * 1000));
    cookie += `; expires=${expirationDate.toUTCString()}`;
  }

  document.cookie = cookie;
}

