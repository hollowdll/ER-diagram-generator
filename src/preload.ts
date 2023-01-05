// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

import { contextBridge, ipcRenderer } from "electron";

// Dark mode
contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system'),
  toggleDark: () => ipcRenderer.invoke("dark-mode:toggle", "dark"),
  toggleLight: () => ipcRenderer.invoke("dark-mode:toggle", "light")
})
