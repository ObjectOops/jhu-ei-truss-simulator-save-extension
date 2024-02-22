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

let statusIndicator = Object.assign(document.createElement("span"), {
    textContent: `save status: ${unsavedStatusText}`
});

let saveDataElem = document.getElementById("IDelemSaveTruss");
let loadDataElem = document.getElementById("IDelemLoadTruss");

(function() {
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
    mainMenu.appendChild(loadSaveForm);
    mainMenu.appendChild(loadSaveButton);

    saveMenu.appendChild(uploadSaveButton);

    mainMenu.prepend(statusIndicator);
})();

function internalButton(label) {
    return `<a onclick="${extensionUpload.name}();"><i style="font-size: 13px; margin-bottom: 0px">${label}</i>`;
}

function getRemoteStr() {
    let queryAuth = `token=${remoteAuthForm.value}`;
    if (remoteUrlForm.value.endsWith("/")) {
        return remoteUrlForm.value + queryAuth;
    }
    return remoteUrlForm.value + "/" + queryAuth;
}

function extensionUpload() {
    window.writeFile(); // Called from the simulator's `main.js`.
    let data = decodeURIComponent(saveDataElem.href.replace("data:text/json;charset=utf-8,", ""));
    statusIndicator.textContent = "saving...";

    fetch(getRemoteStr(), {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        }, 
        body: data
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Bad request.");
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
    fetch(getRemoteStr(), {
        method: "GET"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Bad request.");
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
