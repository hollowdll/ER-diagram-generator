// Declare types for dark mode API
// so renderer.ts can use it

export interface DarkMode {
    toggle: () => Promise<void>,
    system: () => Promise<void>,
    toggleDark: () => Promise<void>,
    toggleLight: () => Promise<void>,
}
  
declare global {
    interface Window {
        darkMode: DarkMode,
    }
}