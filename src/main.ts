// App main process
// Handle app backend here

import { app, BrowserWindow, ipcMain, nativeTheme, dialog } from "electron";
import path from "path";
import { diagramFile } from "./diagram";
import { createMainWindowMenu } from "./menu";

// Main window of the app
const createMainWindow = (): BrowserWindow => {
  const win = new BrowserWindow({
    title: "ER diagram generator",
    width: 800,
    height: 600,
    minWidth: 500,
    minHeight: 400,
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
  
  // win.setBackgroundColor("rgb(50,50,50)");

  // When needed
  // win.setFullScreen(true);

  win.loadFile("./src/html/index.html");

  // In development mode
  win.webContents.openDevTools();

  return win;
}

// Debug window for development
// Contains buttons to test features
const createDebugWindow = (mainWindow: BrowserWindow) => {
  const win = new BrowserWindow({
    title: "Debug Tool",
    width: 250,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    show: false,
    parent: mainWindow
  });

  win.once('ready-to-show', () => {
    win.show()
  });

  // win.setBackgroundColor("rgb(50,50,50)");

  win.loadFile("./src/html/debug.html");
}

// Window to create a new entity
const createEntityCreationWindow = (mainWindow: BrowserWindow) => {
  const win = new BrowserWindow({
    title: "Create New Entity",
    width: 600,
    height: 500,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      sandbox: true
    },
    show: false,
    parent: mainWindow,
    modal: true
  });

  win.once('ready-to-show', () => {
    win.show()
  });

  // In production
  // win.setMenuBarVisibility(false);

  win.loadFile("./src/html/create-entity.html");
}


// Initialize Inter process communication channels
// in main process
const initializeIpcChannels = () => {
  // Toggle between light and dark mode
  ipcMain.handle('dark-mode:toggle', (event, theme: string) => {
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
            // Read data
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

  // Create window to create a new diagram entity
  ipcMain.handle("open-window:create-entity", () => {
    // Get main window
    const mainWindow = BrowserWindow.fromId(1);

    if (mainWindow) {
      createEntityCreationWindow(mainWindow);
    } else {
      dialog.showErrorBox("Error!", "Application main window was not found!");
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
  
  // createDebugWindow(mainWindow);

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


