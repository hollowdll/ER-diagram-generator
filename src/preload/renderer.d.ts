// Declare types for dark mode API
// so renderer.ts can use it

export interface IDarkMode {
    toggle: () => Promise<void>,
    system: () => Promise<void>,
    toggleDark: () => Promise<void>,
    toggleLight: () => Promise<void>,
}

export interface ISystemDialog {
    openJSONFile: () => Promise<void>,
}
  
declare global {
    interface Window {
        darkMode: DarkMode,
        systemDialog: SystemDialog,
    }
}