// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

import { contextBridge, ipcRenderer } from "electron";

// Dialog for opening and saving files
contextBridge.exposeInMainWorld("systemDialog", {
  openJSONFile: () => ipcRenderer.invoke("system-dialog:open-json-file"),
})

// Events that get triggered when menu items are clicked
contextBridge.exposeInMainWorld("menuItemFunctionality", {
  onCreateDiagramFromJSON: (callback: () => void) => ipcRenderer.on(
    "create-new-diagram:generate-from-json", callback
  ),
  onResetDiagram: (callback: () => void) => ipcRenderer.on(
    "diagram-options:reset-current-diagram", callback
  ),
  onShowRenderArea: (callback: () => void) => ipcRenderer.on(
    "diagram-options:show-render-area", callback
  ),
  onHideRenderArea: (callback: () => void) => ipcRenderer.on(
    "diagram-options:hide-render-area", callback
  ),
  onShowDetails: (callback: () => void) => ipcRenderer.on(
    "diagram-options:show-details", callback
  ),
  onHideDetails: (callback: () => void) => ipcRenderer.on(
    "diagram-options:hide-details", callback
  ),
  onShowRelationships: (callback: () => void) => ipcRenderer.on(
    "diagram-options:show-relationships", callback
  ),
  onHideRelationships: (callback: () => void) => ipcRenderer.on(
    "diagram-options:hide-relationships", callback
  ),
})

contextBridge.exposeInMainWorld("diagramCustomization", {
  applyColors: (colors: DiagramItemColors) => ipcRenderer.invoke(
    "diagram-customization:apply-colors", colors
  ),
  onApplyColors: (callback: (
    event: Electron.IpcRendererEvent,
    colors: DiagramItemColors
  ) => void) => ipcRenderer.on(
    "diagram-customization:apply-colors", callback
  ),
  onGetCurrentColors: (callback: (
    event: Electron.IpcRendererEvent,
    windowId: number
  ) => void) => ipcRenderer.on(
    "diagram-customization:get-current-colors", callback
  ),
  onSendCurrentColors: (callback: (
    event: Electron.IpcRendererEvent,
    colors: DiagramItemColors
  ) => void) => ipcRenderer.on(
    "diagram-customization:send-current-colors", callback
  )
})