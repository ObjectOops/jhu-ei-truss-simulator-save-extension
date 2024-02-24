const savedStatusText = "saved";
const unsavedStatusText = "unsaved";
const noneStatusText = "-";

let remoteUrlForm = Object.assign(document.createElement("input"), {
    type: "text", 
    placeholder: "enter server address..."
}); // Add to main menu.
let remoteAuthForm = Object.assign(document.createElement("input"), {
    type: "text", 
    placeholder: "token (optional)..."
});
let remoteUploadEndpointForm = Object.assign(document.createElement("input"), {
    type: "text", 
    placeholder: "upload endpoint (optional)..."
});
let remoteLoadEndpointForm = Object.assign(document.createElement("input"), {
    type: "text", 
    placeholder: "load endpoint (optional)..."
});

let statusIndicator = Object.assign(document.createElement("span"), {
    textContent: `save status: ${unsavedStatusText}`
});

let saveDataElem = document.getElementById("IDelemSaveTruss");
let saveDataNameForm = document.getElementById("IDelemFileName");
let loadDataElem = document.getElementById("IDelemLoadTruss");

(function() {
    if (window.location.href != "https://ei.jhu.edu/truss-simulator/") {
        verify = prompt("This page may not be the truss simulator. Continue Y/N?").toLowerCase();
        if (verify == "n" || verify == "no") {
            return;
        }
    }

    let mainMenu = document.getElementById("IDelemSaveSubmenu"); // Menu under [Import & Export].
    let saveMenu = document.getElementById("IDelemSaveAs"); // Menu under [Save as file].

    let uploadSaveButton = document.createElement("button"); // Add to save menu.
    uploadSaveButton.innerHTML = internalButton("upload to server");

    let loadSaveForm = Object.assign(document.createElement("input"), {
        type: "text", 
        placeholder: "enter load file name..."
    }); // Add to main menu.
    let loadSaveButton = document.createElement("button"); // Add to main menu.
    loadSaveButton.innerHTML = internalButton("load from server");

    mainMenu.appendChild(remoteUrlForm);
    mainMenu.appendChild(remoteAuthForm);
    mainMenu.appendChild(remoteUploadEndpointForm);
    mainMenu.appendChild(remoteLoadEndpointForm);
    mainMenu.appendChild(loadSaveForm);
    mainMenu.appendChild(loadSaveButton);

    saveMenu.appendChild(uploadSaveButton);

    mainMenu.prepend(statusIndicator);
})();

function internalButton(label) {
    return `<a onclick="${extensionUpload.name}();"><i style="font-size: 13px; margin-bottom: 0px">${label}</i>`;
}

function getRemoteStr(endpoint, name) {
    let baseUrl = remoteUrlForm.value + (remoteUrlForm.value.endsWith("/") ? "" : "/");
    let query = `${encodeURIComponent(endpoint)}?token=${encodeURIComponent(remoteAuthForm.value)}&name=${encodeURIComponent(name)}`
    return encodeURI(baseUrl + query);
}

function extensionUpload() {
    window.writeFile(); // Called from the simulator's `main.js`.
    let data = decodeURIComponent(saveDataElem.href.replace("data:text/json;charset=utf-8,", ""));
    statusIndicator.textContent = "saving...";

    fetch(getRemoteStr(remoteUploadEndpointForm.value, saveDataNameForm.value.length == 0 ? "truss" : saveDataNameForm.value), {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        }, 
        body: data
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`code ${response.status}`);
        }
    })
    .then(() => {
        statusIndicator.textContent = `save status: ${savedStatusText}`
    })
    .catch((error) => {
        statusIndicator.textContent = `save status: ERROR ${error}`;
    });

    setTimeout(() => {
        statusIndicator.textContent = `save status: ${noneStatusText}`;
    }, 5000);
}

function extensionLoad() {
    trussName = prompt("Truss Name");
    fetch(getRemoteStr(remoteLoadEndpointForm.value, saveDataNameForm.value), {
        method: "GET", 
        body: trussName
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`code ${response.status}`);
        }
        return response.blob();
    })
    .then(data => {
        loadDataElem.files = [data];
        window.readFile(); // Called from the simulator's `main.js`.

        statusIndicator.textContent = `save status: LOADED ${unsavedStatusText}`;
    })
    .catch((error) => {
        statusIndicator.textContent = `load status: ERROR ${error}`;
    });
}
