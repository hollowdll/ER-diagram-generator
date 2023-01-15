// This file contains native menus for application windows

import { app, Menu, shell, nativeTheme } from "electron";
import { isAppDebugMode } from "./main";

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
              click: (menuItem, focusedWindow, event) => {
                if (focusedWindow !== undefined) {
                  focusedWindow.webContents.send("create-new-diagram:generate-from-json");
                }
              }
            },
            /* NO IMPLEMENTATION YET
            {
              label: "Use Editor",

            }
            */
          ]
        },
        {
          label: "Create New Entity",
          submenu: [
            {
              label: "Test Entity",
              click: (menuItem, focusedWindow, event) => {
                if (focusedWindow !== undefined) {
                  focusedWindow.webContents.send("create-new-entity:test-entity");
                }
              }
            },
            /* NO IMPLEMENTATION YET
            {
              label: "Use Editor",
            
            }
            */
          ]
        },
        {
          label: "Options",
          submenu: [
            {
              label: "Reset Current Diagram",
              click: (menuItem, focusedWindow, event) => {
                if (focusedWindow !== undefined) {
                  focusedWindow.webContents.send("diagram-options:reset-current-diagram");
                }
              }
            },
            {
              label: "Show Render Area",
              click: (menuItem, focusedWindow, event) => {
                if (focusedWindow !== undefined) {
                  focusedWindow.webContents.send("diagram-options:show-render-area");
                }
              }
            },
          ]
        },
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
                nativeTheme.themeSource = "system";
              }
            },
            {
              label: "Dark",
              type: "radio",
              click: () => {
                nativeTheme.themeSource = "dark";
              }
            },
            {
              label: "Light",
              type: "radio",
              click: () => {
                nativeTheme.themeSource = "light";
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
        }
      ]
    }
  ]

  // Create the menu
  const menu = Menu.buildFromTemplate(template);
  return menu;
}