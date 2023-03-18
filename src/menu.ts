// This file contains native menus for application windows

import { app, Menu, shell } from "electron";
import { isAppDebugMode } from "./main";
import { createCustomizationWindow } from "./window";
import toggleDarkMode from "./dark-mode";

// Create menu for main window
export const createMainWindowMenu = (): Electron.Menu => {
  // If OS is MacOS
  const isMac = process.platform === "darwin";

  // Create template for the menu
  const template: Electron.MenuItemConstructorOptions[] = [
    // App menu (only on MacOS). Windows and Linux don't have this.
    // { role: 'appMenu' }
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] as Electron.MenuItemConstructorOptions[] : []),

    // File menu
    // { role: 'fileMenu' }
    {
      label: 'File',
      submenu: [
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },

    // Edit menu
    // { role: 'editMenu' }
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ]
    },

    // View menu
    // { role: 'viewMenu' }
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        ...(isAppDebugMode ? [
          { role: 'toggleDevTools' }
        ] as Electron.MenuItemConstructorOptions[] : []),
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ]
    },

    // Window menu
    // { role: 'windowMenu' }
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ] as Electron.MenuItemConstructorOptions[] : [
          { role: 'close' }
        ] as Electron.MenuItemConstructorOptions[]
        )
      ]
    },

    // Diagram menu
    {
      label: "Diagram",
      submenu: [
        {
          label: "Create New Diagram",
          submenu: [
            {
              label: "Generate From JSON",
              click: (_menuItem, focusedWindow) => {
                if (focusedWindow !== undefined) {
                  focusedWindow.webContents.send("create-new-diagram:generate-from-json");
                }
              }
            }
          ]
        },
        {
          label: "Options",
          submenu: [
            {
              label: "Reset Current Diagram",
              click: (_menuItem, focusedWindow) => {
                if (focusedWindow !== undefined) {
                  focusedWindow.webContents.send("diagram-options:reset-current-diagram");
                }
              }
            },
            { type: 'separator' },
            {
              label: "Show Render Area",
              click: (_menuItem, focusedWindow) => {
                if (focusedWindow !== undefined) {
                  focusedWindow.webContents.send("diagram-options:show-render-area");
                }
              }
            },
            {
              label: "Hide Render Area",
              click: (_menuItem, focusedWindow) => {
                if (focusedWindow !== undefined) {
                  focusedWindow.webContents.send("diagram-options:hide-render-area");
                }
              }
            },
            { type: 'separator' },
            {
              label: "Show Details",
              click: (_menuItem, focusedWindow) => {
                if (focusedWindow !== undefined) {
                  focusedWindow.webContents.send("diagram-options:show-details");
                }
              }
            },
            {
              label: "Hide Details",
              click: (_menuItem, focusedWindow) => {
                if (focusedWindow !== undefined) {
                  focusedWindow.webContents.send("diagram-options:hide-details");
                }
              }
            },
            { type: 'separator' },
            {
              label: "Show Relationships",
              click: (_menuItem, focusedWindow) => {
                if (focusedWindow !== undefined) {
                  focusedWindow.webContents.send("diagram-options:show-relationships");
                }
              }
            },
            {
              label: "Hide Relationships",
              click: (_menuItem, focusedWindow) => {
                if (focusedWindow !== undefined) {
                  focusedWindow.webContents.send("diagram-options:hide-relationships");
                }
              }
            },
          ]
        },
        {
          label: "Customization",
          submenu: [
            {
              label: "Edit Diagram Colors",
              click: (_menuItem, focusedWindow) => {
                if (focusedWindow !== undefined) {
                  createCustomizationWindow(focusedWindow);
                }
              }
            }
          ]
        }
      ]
    },

    // Settings
    {
      label: "Settings",
      submenu: [
        {
          label: "Theme Color",
          submenu: [
            {
              label: "System",
              type: "radio",
              click: () => {
                toggleDarkMode("system");
              }
            },
            {
              label: "Dark",
              type: "radio",
              checked: (isAppDebugMode ? true : false),
              click: () => {
                toggleDarkMode("dark");
              }
            },
            {
              label: "Light",
              type: "radio",
              click: () => {
                toggleDarkMode("light");
              }
            }
          ]
        }
      ]
    },

    // Help menu
    {
      role: 'help',
      submenu: [
        // Open app's documentation in its GitHub repo.
        {
          label: "Documentation",
          click: async () => {
            await shell.openExternal(
              "https://github.com/hollowdll/ER-diagram-generator#er-diagram-generator"
            );
          }
        },
        {
          label: "Version 0.3.3"
        }
      ]
    }
  ]

  // Create the menu
  const menu = Menu.buildFromTemplate(template);
  return menu;
}