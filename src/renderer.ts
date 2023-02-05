// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.

// Default text values
enum DefaultTextValue {
    DiagramName = "Entity Relationship Diagram Generator",
}

// Diagram's render area
enum DiagramAreaDetail {
    DiagramAreaMarginLeft = "280px",
    DiagramNameMarginLeft = "60px",
    RenderAreaBorder = "1px solid green",
}

// Entity diagram types only used in renderer process
namespace EntityDiagramTypes {
    export type EntityField = [string, string, string, string]
}



// Generate diagram entity name row
const generateDiagramEntityNameRow = (name: string): string => {
    const row = `
        <tr class="entity-name-row">
            <th class="entity-name" colspan="4">${name}</th>
        </tr>
    `;

    // Test output format
    // console.log(row);

    return row;
}


// Generate diagram entity field row
const generateDiagramEntityFieldRow =
    (keyType: string, name: string, dataType: string, required: string): string => {

    if (keyType !== "PK" && keyType !== "FK") keyType = "";
    
    const row = `
        <tr class="entity-field-row">
            <td class="entity-field-key">${keyType}</td>
            <td class="entity-field-name"><span>${name}</span></td>
            <td class="entity-field-datatype"><span>${dataType}</span></td>
            <td class="entity-field-required">${required}</td>
        </tr>
    `;

    // Test output format
    // console.log(row);

    return row;
}


// Generate test entity that will be rendered
const generateTestEntity = () => {
    // Make diagram entities with HTML table elements

    // Table holder
    const holder = document.createElement("table");
    holder.className = "diagram-entity";

    const nameRow = generateDiagramEntityNameRow("Person");
    const fieldRow1 = generateDiagramEntityFieldRow("PK", "person_id", "serial", "NN");
    const fieldRow2 = generateDiagramEntityFieldRow("", "name", "text", "NN");
    const fieldRow3 = generateDiagramEntityFieldRow("", "age", "integer", "NN");

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
    holder.className = "diagram-entity";

    const nameRow = generateDiagramEntityNameRow(entityName);
    holder.innerHTML += nameRow;

    for (const field of entityFieldList) {
        const fieldRow = generateDiagramEntityFieldRow(
            field[0], field[1], field[2], field[3]
        );

        holder.innerHTML += fieldRow;
    }

    const renderArea = document.getElementById("render-area") as HTMLDivElement;
    renderArea.appendChild(holder);
}


// Generate diagram details that will be rendered
const generateDiagramDetails = (details: DiagramStructure.DiagramDetail[]) => {
    const detailTableBody = document.getElementById(
        "detail-area-table-body"
    ) as HTMLTableSectionElement;

    // Create a new table row for each item
    for (const detail of details) {
        const row = document.createElement("tr");
        row.className = "sidebar-table-tr";
        row.innerHTML = `
            <td>${detail.detail}</td>
            <td>${detail.description}</td>
        `;

        detailTableBody.appendChild(row);
    }
}


// Generate diagram relationships that will be rendered
const generateDiagramRelationships = (relationships: DiagramStructure.DiagramRelationship[]) => {
    const relationshipTableBody = document.getElementById(
        "relationship-area-table-body"
    ) as HTMLTableSectionElement;

    // Create a new table row for each item
    for (const relationship of relationships) {
        const row = document.createElement("tr");
        row.className = "sidebar-table-tr";
        row.innerHTML = `
            <td>${relationship.relationship}</td>
        `;

        relationshipTableBody.appendChild(row);
    }
}


// Show/hide sidebar
const toggleSidebar = (visible: boolean) => {
    const sidebar = document.querySelector(".sidebar") as HTMLDivElement;
    const diagramArea = document.querySelector(".diagram-area") as HTMLDivElement;
    const diagramName = document.getElementById("diagram-name") as HTMLHeadingElement;

    if (visible) {
        sidebar.style.display = "block";
        diagramArea.style.marginLeft = DiagramAreaDetail.DiagramAreaMarginLeft;
        diagramName.style.textAlign = "unset";
        diagramName.style.marginLeft = DiagramAreaDetail.DiagramNameMarginLeft;

    } else {
        sidebar.style.display = "none";
        diagramArea.style.marginLeft = "0px";
        diagramName.style.textAlign = "center";
        diagramName.style.marginLeft = "0px";
    }
}


// Reset current diagram
const resetDiagram = () => {
    const renderArea = document.getElementById(
        "render-area"
    ) as HTMLDivElement;
    const diagramName = document.getElementById(
        "diagram-name"
    ) as HTMLHeadingElement;
    const detailTableBody = document.getElementById(
        "detail-area-table-body"
    ) as HTMLTableSectionElement;
    const relationshipTableBody = document.getElementById(
        "relationship-area-table-body"
    ) as HTMLTableSectionElement;
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

    // Reset diagram name to default
    diagramName.innerText = DefaultTextValue.DiagramName;

    // Remove details
    while (detailTableBody.firstChild) {
        detailTableBody.removeChild(detailTableBody.lastChild as Node);
    }

    // Remove relationships
    while (relationshipTableBody.firstChild) {
        relationshipTableBody.removeChild(relationshipTableBody.lastChild as Node);
    }

    // Hide sidebar
    toggleSidebar(false);
}


// Generate diagram from object data
const generateDiagramFromData = (data: DiagramStructure.Diagram) => {
    // Reset current diagram
    resetDiagram();

    // Set settings
    const diagramName = document.getElementById("diagram-name") as HTMLHeadingElement;
    diagramName.innerText = data.settings.diagramName;

    const requiredOptionOutput = data.settings.requiredOptionOutput;

    // Create entities
    for (const entity of data.entities) {
        let entityFieldList: Array<EntityDiagramTypes.EntityField> = [];

        for (const field of entity.fields) {
            const fieldRequiredOptionOutput = (
                field.required === true ? requiredOptionOutput : ""
            );

            const fieldData: EntityDiagramTypes.EntityField = [
                field.keyType, field.name, field.dataType, fieldRequiredOptionOutput
            ];

            entityFieldList.push(fieldData);
        }

        generateDiagramEntity(entity.name, entityFieldList);
    }

    // Set details
    generateDiagramDetails(data.details);

    // Set relationships
    generateDiagramRelationships(data.relationships);

    // Show sidebar
    toggleSidebar(true);
}   


// Tell main process to open system dialog.
// open a JSON file and generate entity diagram
const openJSONFileAndGenerateDiagram = async () => {
    // Returns diagram data or undefined if something went wrong
    const responseData: DiagramStructure.Diagram | undefined
        = await window.systemDialog.openJSONFile();
    // console.log(responseData);

    // Check if returned data is valid diagram data
    // Returned data is always of type IDiagram | undefined
    if (responseData !== undefined && responseData !== null) {
        // Generate diagram from received data
        generateDiagramFromData(responseData);
    }
}



// App menu buttons

// Generate Diagram from JSON
window.menuItemFunctionality.onCreateDiagramFromJSON(() => {
    openJSONFileAndGenerateDiagram();
})

// Show render area
window.menuItemFunctionality.onShowRenderArea(() => {
    const renderArea = document.getElementById("render-area") as HTMLDivElement;
    renderArea.style.border = DiagramAreaDetail.RenderAreaBorder;
})

// Hide render area
window.menuItemFunctionality.onHideRenderArea(() => {
    const renderArea = document.getElementById("render-area") as HTMLDivElement;
    renderArea.style.border = "none";
})

// Show detail area
window.menuItemFunctionality.onShowDetailArea(() => {
    const detailArea = document.getElementById("detail-area") as HTMLDivElement;
    const table = detailArea.querySelector(".sidebar-table") as HTMLTableElement;
    table.style.display = "table";
})

// Hide detail area
window.menuItemFunctionality.onHideDetailArea(() => {
    const detailArea = document.getElementById("detail-area") as HTMLDivElement;
    const table = detailArea.querySelector(".sidebar-table") as HTMLTableElement;
    table.style.display = "none";
})

// Generate new test entity
window.menuItemFunctionality.onCreateTestEntity(() => {
    generateTestEntity();
})

// Reset current diagram
window.menuItemFunctionality.onResetDiagram(() => {
    resetDiagram();
})



// Diagram customization

// Change diagram colors
window.diagramCustomization.onApplyColors((_event, colors) => {
    console.log(colors);

    const diagramName = document.querySelector(
        "#diagram-name"
    ) as HTMLHeadingElement;
    diagramName.style.color = colors.diagramName;

    const entityNameRows = document.querySelectorAll(
        ".entity-name-row"
    ) as NodeListOf<HTMLTableRowElement>;

    for (const node of entityNameRows) {
        node.style.backgroundColor = colors.entityNameBackground;
        node.style.color = colors.entityName;
    }

    const diagramEntities = document.querySelectorAll(
        ".diagram-entity"
    ) as NodeListOf<HTMLTableElement>

    for (const node of diagramEntities) {
        node.style.backgroundColor = colors.entityBackground;
    }

    const entityFieldRows = document.querySelectorAll(
        ".entity-field-row"
    ) as NodeListOf<HTMLTableRowElement>;

    for (const node of entityFieldRows) {
        const children = node.getElementsByTagName("td");
        for (const childNode of children) {
            childNode.style.color = colors.entityField;
        }
    }
})


// Get current diagram colors
window.diagramCustomization.onGetCurrentColors((event, windowId) => {
    const diagramName = document.querySelector(
        "#diagram-name"
    ) as HTMLHeadingElement;

    const entityNameRow = document.querySelector(
        ".entity-name-row"
    ) as HTMLTableRowElement;

    const diagramEntity = document.querySelector(
        ".diagram-entity"
    ) as HTMLTableElement;

    const entityFieldRow = document.querySelector(
        ".entity-field-row"
    ) as HTMLTableRowElement;

    let entityFieldRowData = null;
    
    if (entityFieldRow) {
        entityFieldRowData = entityFieldRow.querySelector("td");
    }

    const colors: DiagramItemColors = {
        diagramName: (
            diagramName ? window.getComputedStyle(diagramName).color : "rgb(0,0,0)"
        ),
        entityNameBackground: (
            entityNameRow ? window.getComputedStyle(entityNameRow).backgroundColor : "rgb(0,0,0)"
        ),
        entityBackground: (
            diagramEntity ? window.getComputedStyle(diagramEntity).backgroundColor : "rgb(0,0,0)"
        ),
        entityName: (
            entityNameRow ? window.getComputedStyle(entityNameRow).color : "rgb(0,0,0)"
        ),
        entityField: (
            entityFieldRowData ? window.getComputedStyle(entityFieldRowData).color : "rgb(0,0,0)"
        ),
    }

    console.log(colors);

    event.sender.send("diagram-current-colors", colors, windowId);
})
