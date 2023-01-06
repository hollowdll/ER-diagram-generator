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

// Debug tool
document.getElementById('toggle-dark-mode')?.
    addEventListener('click', toggleDarkMode); 
document.getElementById('reset-to-system')?.
    addEventListener('click', resetToSystemTheme);



// App

// Theme color selector
document.getElementById("theme-color-selector")?.addEventListener("change", () => {
    const themeColorSelector = document.getElementById("theme-color-selector") as HTMLSelectElement;

    if (themeColorSelector?.value === "system") {
        resetToSystemTheme();
    } else if (themeColorSelector?.value === "dark") {
        toggleDarkMode();
    } else if (themeColorSelector?.value === "light") {
        toggleLightMode();
    }
});

// Generate from JSON


// Show render area
document.getElementById("show-render-area-button")?.addEventListener("click", () => {
    const button = document.getElementById("show-render-area-button") as HTMLButtonElement;
    const renderArea = document.getElementById("render-area") as HTMLDivElement;

    if (button?.value === "false") {
        renderArea.style["border"] = "1px solid green";
        button.innerText = "Hide";
        button.value = "true";
    } else if (button?.value === "true") {
        renderArea.style["border"] = "none";
        button.innerText = "Show";
        button.value = "false";
    }
});

// Generate new test object


