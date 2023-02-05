// Customization window functionality

interface DiagramItemColors {
    diagramName: string,
    entityNameBackground: string,
    entityBackground: string,
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
    const entityBackgroundColor = document.getElementById(
        "entity-background-color"
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
        entityBackground: entityBackgroundColor.value,
        entityName: entityNameColor.value,
        entityField: entityFieldColor.value,
    }

    return colors;
}

// Convert rgb color to hex format
const rgbToHex = (rgb: string) =>
    `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
        ?.slice(1)
        .map(n => parseInt(n, 10)
        .toString(16)
        .padStart(2, '0'))
        .join('')}`


// Get diagram's current colors
window.diagramCustomization.onSendCurrentColors((_event, colors) => {
    const diagramNameColor = document.getElementById(
        "diagram-name-color"
    ) as HTMLInputElement;
    diagramNameColor.value = rgbToHex(colors.diagramName);

    const entityNameBackgroundColor = document.getElementById(
        "entity-name-background-color"
    ) as HTMLInputElement;
    entityNameBackgroundColor.value = rgbToHex(colors.entityNameBackground);

    const entityBackgroundColor = document.getElementById(
        "entity-background-color"
    ) as HTMLInputElement;
    entityBackgroundColor.value = rgbToHex(colors.entityBackground);

    const entityNameColor = document.getElementById(
        "entity-name-color"
    ) as HTMLInputElement;
    entityNameColor.value = rgbToHex(colors.entityName);

    const entityFieldColor = document.getElementById(
        "entity-field-color"
    ) as HTMLInputElement;
    entityFieldColor.value = rgbToHex(colors.entityField);
})

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