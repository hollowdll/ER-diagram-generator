import { app, BrowserWindow, ipcMain, nativeTheme, dialog } from "electron";
import { diagramFile } from "./diagram";
import { createMainWindow } from "./window";

// If app is in debug mode
// CHANGE THIS TO FALSE IN RELEASE MODE.
export const isAppDebugMode = true;

// Initialize Inter process communication channels
const initializeIpcChannels = () => {
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
  ipcMain.handle("diagram-customization:apply-colors", (
    _event, colors: DiagramItemColors
  ) => {
    const mainWindow = BrowserWindow.fromId(1);

    if (mainWindow) {
      mainWindow.webContents.send("diagram-customization:apply-colors", colors);
    }
  })

  // Messages sent from renderer as reply

  // Send diagram current colors
  ipcMain.on("diagram-current-colors", (
    _event, colors: DiagramItemColors, windowId: number
  ) => {
    const targetWindow = BrowserWindow.fromId(windowId);
    
    if (targetWindow) {
      targetWindow.webContents.send("diagram-customization:send-current-colors", colors);
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
