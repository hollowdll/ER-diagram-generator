// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

import { contextBridge, ipcRenderer } from "electron";

// Dark mode
contextBridge.exposeInMainWorld("darkMode", {
  toggle: () => ipcRenderer.invoke("dark-mode:toggle"),
  system: () => ipcRenderer.invoke("dark-mode:system"),
  toggleDark: () => ipcRenderer.invoke("dark-mode:toggle", "dark"),
  toggleLight: () => ipcRenderer.invoke("dark-mode:toggle", "light")
})

// Dialog for opening and saving files
contextBridge.exposeInMainWorld("systemDialog", {
  openJSONFile: () => ipcRenderer.invoke("system-dialog:open-json-file"),

})

// Open app windows
contextBridge.exposeInMainWorld("openWindow", {
  createEntity: () => ipcRenderer.invoke("open-window:create-entity"),
})

// Events that get triggered when menu items are clicked
contextBridge.exposeInMainWorld("menuItemFunctionality", {
  onCreateTestEntity: (callback: () => void) => ipcRenderer.on("create-new-entity:test-entity", callback),

})