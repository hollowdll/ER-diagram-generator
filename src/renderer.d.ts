export interface IDarkModeAPI {
    toggle: () => Promise<void>,
    system: () => Promise<void>,
}
  
declare global {
    interface Window {
        darkMode: IDarkModeAPI,
    }
}