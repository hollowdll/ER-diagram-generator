// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.

// Default text values
enum DefaultTextValue {
    DiagramName = "Entity Relationship Diagram Generator Prototype",
}

// Entity diagram types only used in renderer process
namespace EntityDiagramTypes {
    export type EntityField = [boolean, string, string, string]
}


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
const generateDiagramEntityNameRow = (name: string): string => {
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
const generateDiagramEntityFieldRow =
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
const generateTestEntity = () => {
    // Make diagram objects with HTML table elements

    // Table holder
    const holder = document.createElement("table");
    holder.className = "diagram-object";

    const nameRow = generateDiagramEntityNameRow("Person");
    const fieldRow1 = generateDiagramEntityFieldRow(true, "person_id", "serial", "NN");
    const fieldRow2 = generateDiagramEntityFieldRow(false, "name", "text", "NN");
    const fieldRow3 = generateDiagramEntityFieldRow(false, "age", "integer", "NN");

    holder.innerHTML += nameRow + fieldRow1 + fieldRow2 + fieldRow3;

    const renderArea = document.getElementById("render-area") as HTMLDivElement;
    renderArea.appendChild(holder);
}

// Generate diagram entity that will be rendered
const generateDiagramEntity = (
    entityName: string,
    entityFieldList: Array<EntityDiagramTypes.EntityField>
) => 
{
    // Make diagram entities with HTML table elements

    // Table holder
    const holder = document.createElement("table");
    holder.className = "diagram-object";

    // Name
    const nameRow = generateDiagramEntityNameRow(entityName);
    holder.innerHTML += nameRow;

    // Fields
    for (const field of entityFieldList) {
        const fieldRow = generateDiagramEntityFieldRow(
            field[0], field[1], field[2], field[3]
        );

        holder.innerHTML += fieldRow;
    }

    // Render
    const renderArea = document.getElementById("render-area") as HTMLDivElement;
    renderArea.appendChild(holder);
}


// Generate diagram from object data
const generateDiagramFromData = (data: DiagramStructure.IDiagram) => {
    // Set settings
    const diagramName = document.getElementById("diagram-name") as HTMLHeadingElement;
    diagramName.innerText = data.settings.diagramName;

    const requiredOptionOutput = data.settings.requiredOptionOutput;
    const theme = data.customization.theme;

    // Set details


    // Create entities
    for (const entity of data.entities) {
        let entityFieldList: Array<EntityDiagramTypes.EntityField> = [];

        for (const field of entity.fields) {
            const fieldRequiredOptionOutput = (
                field.required === true ? requiredOptionOutput : ""
            );

            const fieldData: EntityDiagramTypes.EntityField = [
                field.isPK, field.name, field.dataType, fieldRequiredOptionOutput
            ];

            entityFieldList.push(fieldData);
        }

        generateDiagramEntity(entity.name, entityFieldList);
    }

    // Set relationships

}   


// Tell main process to open system dialog to open a JSON file
const openJSONFile = async () => {
    // Returns diagram data or undefined if something went wrong
    const responseData = await window.systemDialog.openJSONFile();
    console.log(responseData);

    // Check if returned data is valid diagram data
    // Returned data is always of type IDiagram | undefined
    if (responseData !== undefined && responseData !== null) {
        // Generate diagram from received data
        generateDiagramFromData(responseData);
    }
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
    generateTestEntity();
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

    const diagramName = document.getElementById("diagram-name") as HTMLHeadingElement;
    diagramName.innerText = DefaultTextValue.DiagramName;
});

