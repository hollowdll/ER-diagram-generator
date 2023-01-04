// Declare types for dark mode API
// so renderer.ts can use it

export interface IDarkModeAPI {
    toggle: () => Promise<void>,
    system: () => Promise<void>,
}
  
declare global {
    interface Window {
        darkMode: IDarkModeAPI,
    }
}