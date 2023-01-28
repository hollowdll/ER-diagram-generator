// Customization window functionality

interface DiagramItemColors {
    diagramName: string,
    entityNameBackground: string,
    entityName: string,
    entityField: string,
}

const applyColors = async (colors: DiagramItemColors) => {
    await window.diagramCustomization.applyColors(colors);

}

const getColorsToApply = () => {
    const diagramNameColor = document.getElementById(
        "diagram-name-color"
    ) as HTMLInputElement;
    const entityNameBackgroundColor = document.getElementById(
        "entity-name-background-color"
    ) as HTMLInputElement;
    const entityNameColor = document.getElementById(
        "entity-name-color"
    ) as HTMLInputElement;
    const entityFieldColor = document.getElementById(
        "entity-field-color"
    ) as HTMLInputElement;

    const colors: DiagramItemColors = {
        diagramName: diagramNameColor.value,
        entityNameBackground: entityNameBackgroundColor.value,
        entityName: entityNameColor.value,
        entityField: entityFieldColor.value,
    }

    return colors;
}

// Apply changes
document.getElementById("apply-changes-button")?.addEventListener("mouseup", () => {
    const colors = getColorsToApply();
    applyColors(colors);
    window.close();
})

// Cancel
document.getElementById("cancel-button")?.addEventListener("mouseup", () => {
    window.close();
})