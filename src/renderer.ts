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
document.getElementById("theme-color")?.addEventListener("change", () => {
    const themeColorSelector = document.getElementById("theme-color") as HTMLSelectElement;

    if (themeColorSelector?.value === "system") {
        resetToSystemTheme();
    } else if (themeColorSelector?.value === "dark") {
        toggleDarkMode();
    } else if (themeColorSelector?.value === "light") {
        toggleLightMode();
    }
});

