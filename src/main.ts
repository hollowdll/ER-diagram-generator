// App main process

import { app, BrowserWindow, ipcMain, nativeTheme, dialog } from "electron";
import path from "path";
import { diagramFile } from "./diagram";
import { createMainWindowMenu } from "./menu";

// If app is in debug mode
// CHANGE THIS TO FALSE IN RELEASE MODE.
export const isAppDebugMode = true;

const createMainWindow = (): BrowserWindow => {
  const win = new BrowserWindow({
    title: "Entity Relationship Diagram Generator",
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      sandbox: true
    },
    show: false,
  });

  win.setMenu(createMainWindowMenu());

  win.once('ready-to-show', () => {
    win.show()
  });

  win.loadFile("./src/html/index.html");

  // In development mode
  if (isAppDebugMode) {
    win.webContents.openDevTools();
  }

  return win;
}

export const createCustomizationWindow = (mainWindow: BrowserWindow) => {
  const win = new BrowserWindow({
    title: "Edit Diagram Colors",
    width: 300,
    height: 400,
    minWidth: 300,
    minHeight: 400,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      sandbox: true
    },
    show: false,
    parent: mainWindow,
    modal: true,
    resizable: false
  });

  const mainWindowPosition = mainWindow.getPosition();
  const mainWindowSize = mainWindow.getSize();
  console.log(mainWindowSize);

  win.setPosition(
    mainWindowPosition[0], mainWindowPosition[1]
  );

  if (!isAppDebugMode) {
    win.setMenu(null);
  }

  win.once('ready-to-show', () => {
    win.show()
  });

  win.loadFile("./src/html/customization.html");
}


// Initialize Inter process communication channels
const initializeIpcChannels = () => {
  // Toggle between light and dark mode
  ipcMain.handle('dark-mode:toggle', (_event, theme: string) => {
    if (theme === "light") {
      nativeTheme.themeSource = "light";
    } else if (theme === "dark") {
      nativeTheme.themeSource = "dark";
    }
  })

  // Reset to system theme
  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system';
  })

  // Open system dialog and open a JSON file
  ipcMain.handle("system-dialog:open-json-file", async (): Promise<unknown> => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    let data: unknown;

    const options: Electron.OpenDialogOptions = {
      title: "Open JSON File...",
      defaultPath: process.cwd(),
      filters: [{
        name: "JSON File", extensions: ["json"]
      }],
      properties: ["openFile"]
    };

    if (focusedWindow !== null) {
      // Dialog becomes a modal window
      await dialog.showOpenDialog(focusedWindow, options)
        .then(result => {
          console.log(`Canceled: ${result.canceled}`);
          console.log(`Opened File Paths: ${result.filePaths}`);

          if (!result.canceled && result.filePaths.length > 0) {
            data = diagramFile.readJSONFileAndCreateDiagramData(result.filePaths);
          }

        })
        .catch(err => {
          console.log(err);
          dialog.showErrorBox("Error opening dialog!", "Cannot open dialog.")
        })

    } else {
      // No focused window found
      console.log("Error opening dialog: No focused window found!");
      dialog.showErrorBox("Error opening dialog!", "No focused window found.")
    }

    return data;
  })

  // Change diagram colors
  ipcMain.handle("diagram-customization:apply-colors", (_event, colors) => {
    const mainWindow = BrowserWindow.fromId(1);

    if (mainWindow !== null) {
      mainWindow.webContents.send("diagram-customization:apply-colors", colors);
    }
  })
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Call before creating app windows
  initializeIpcChannels();

  // Create main window first so it will always get ID=1
  createMainWindow();

  // IN DEBUG MODE
  if (isAppDebugMode) {
    nativeTheme.themeSource = "dark";
  }

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


