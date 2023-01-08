// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.



// Dark and light mode toggle

const toggleDarkMode = async () => {
    await window.darkMode.toggleDark();
    console.log("Toggle dark mode");
}

const toggleLightMode = async () => {
    await window.darkMode.toggleLight();
    console.log("Toggle light mode");
}

const resetToSystemTheme = async () => {
    await window.darkMode.system();
    console.log("Reset to system theme");
}



// Generate diagram object name row
const generateDiagramObjectNameRow = (name: string): string => {
    const row = `
        <tr class="object-name-row">
            <th class="object-name" colspan="4">${name}</th>
        </tr>
    `;

    // Test output format
    console.log(row);

    return row;
}

// Generate diagram object field row
const generateDiagramObjectFieldRow =
    (isPrimaryKey: boolean, name: string, dataType: string, required: string): string => {
    // Check if is primary key
    const keyValue = isPrimaryKey === true ? "PK" : "";
    
    const row = `
        <tr class="object-field-row">
            <td class="object-field-key">${keyValue}</td>
            <td class="object-field-name"><span>${name}</span></td>
            <td class="object-field-datatype"><span>${dataType}</span></td>
            <td class="object-field-required">${required}</td>
        </tr>
    `;

    // Test output format
    console.log(row);

    return row;
}

// Generate test object that will be rendered
const generateTestObject = () => {
    // Make diagram objects with HTML table elements

    /*  Disabled - Don't touch - might be used later

    // Table holder
    const holder = document.createElement("table");
    holder.className = "diagram-object";

    // Table name row
    const nameRow = document.createElement("tr");
    nameRow.className = "object-name-row";
    holder.appendChild(nameRow);

    // Table name data
    const nameData = document.createElement("th");
    nameData.className = "object-name";
    nameData.innerText = "Person";
    nameRow.appendChild(nameData);

    // Field row
    const fieldRow = document.createElement("tr");
    fieldRow.className = "object-field-row";
    holder.appendChild(fieldRow);

    // Field key
    const fieldKey = document.createElement("td");
    fieldKey.className = "object-field-key";
    fieldKey.innerText = "PK";
    fieldRow.appendChild(fieldKey);
    */

    // Table holder
    const holder = document.createElement("table");
    holder.className = "diagram-object";

    const nameRow = generateDiagramObjectNameRow("Person");
    const fieldRow1 = generateDiagramObjectFieldRow(true, "person_id", "serial", "NN");
    const fieldRow2 = generateDiagramObjectFieldRow(false, "name", "text", "NN");
    const fieldRow3 = generateDiagramObjectFieldRow(false, "age", "integer", "NN");

    holder.innerHTML += nameRow + fieldRow1 + fieldRow2 + fieldRow3;

    const renderArea = document.getElementById("render-area") as HTMLDivElement;
    renderArea.appendChild(holder);
}

// Tell main process to open system dialog to open a JSON file
const openJSONFile = async () => {
    const response = await window.systemDialog.openJSONFile();
    console.log(response);
}



// Debug tool
document.getElementById('toggle-dark-mode')?.
    addEventListener('click', toggleDarkMode); 
document.getElementById('reset-to-system')?.
    addEventListener('click', resetToSystemTheme);



// App

// Theme color selector
document.getElementById("theme-color-selector")?.addEventListener("change", () => {
    const themeColorSelector = document.getElementById("theme-color-selector") as HTMLSelectElement;

    if (themeColorSelector.value === "system") {
        resetToSystemTheme();
    } else if (themeColorSelector.value === "dark") {
        toggleDarkMode();
    } else if (themeColorSelector.value === "light") {
        toggleLightMode();
    }
});

// Generate from JSON
document.getElementById("open-json-file-button")?.addEventListener("click", () => {
    openJSONFile();
});

// Show render area
document.getElementById("show-render-area-button")?.addEventListener("click", () => {
    const button = document.getElementById("show-render-area-button") as HTMLButtonElement;
    const renderArea = document.getElementById("render-area") as HTMLDivElement;

    if (button.value === "false") {
        renderArea.style["border"] = "1px solid green";
        button.innerText = "Hide";
        button.value = "true";
    } else if (button.value === "true") {
        renderArea.style["border"] = "none";
        button.innerText = "Show";
        button.value = "false";
    }
});

// Generate new test object
document.getElementById("generate-test-object-button")?.addEventListener("click", () => {
    generateTestObject();
});

// Reset current diagram
document.getElementById("reset-diagram-button")?.addEventListener("click", () => {
    const renderArea = document.getElementById("render-area") as HTMLDivElement;
    let elementCount = 0;

    // Blazingly fast (check if firstChild exists, not lastChild)
    // Remove all HTML elements and nodes from render area
    while (renderArea.firstChild) {
        renderArea.removeChild(renderArea.lastChild as Node);
        elementCount++;
    }

    if (elementCount > 0) {
        console.log(`Removed ${elementCount} diagram ${elementCount === 1 ? "table" : "tables"}.`);
    }
});

