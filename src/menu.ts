// This file contains native menus for application windows

import { app, Menu, shell, nativeTheme } from "electron";

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
        { role: 'toggleDevTools' },
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
            { label: "Generate From JSON" },
            { label: "Use Editor" }
          ]
        },
        {
          label: "Create New Entity",
          submenu: [
            { label: "Test Entity" },
            { label: "Use Editor" }
          ]
        },
        {
          label: "Options",
          submenu: [
            { label: "Reset Current Diagram" },
            { label: "Show Render Area" }
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