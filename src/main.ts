// App main process
// Handle app backend here

import {app, BrowserWindow, ipcMain, nativeTheme, dialog} from "electron";
import path from "path";
import * as fs from "fs/promises";

const createMainWindow = (): BrowserWindow => {
  const win = new BrowserWindow({
    title: "ER diagram generator",
    darkTheme: true,
    width: 800,
    height: 600,
    minWidth: 500,
    minHeight: 400,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      sandbox: true
    },
    show: false
  });

  win.once('ready-to-show', () => {
    win.show()
  });

  // win.setBackgroundColor("rgb(50,50,50)");

  // When needed
  // win.setFullScreen(true);

  win.loadFile(path.join(process.cwd(), "src/html/index.html"));

  // In development mode
  win.webContents.openDevTools();

  return win;
}

// Debug window for development
// Contains buttons to test features
const createDebugWindow = (mainWindow: BrowserWindow) => {
  const win = new BrowserWindow({
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

  win.loadFile(path.join(process.cwd(), "src/html/debug.html"));
}



// Read contents of JSON file
const readJSONFile = (filePaths: string[]) => {
  // Read only the first file
  const firstFile = filePaths[0];

  // Read the contents
  fs.readFile(firstFile, {
    encoding: "utf8"
  }).then(contents => {
    const data = JSON.parse(contents);
    console.log(data);
  }).catch(err => {
    console.log(err);
  })
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
  ipcMain.handle("system-dialog:open-file", async (event, fileType: string): Promise<string[]> => {
    let openedFilePaths: string[] = [];
    const focusedWindow = BrowserWindow.getFocusedWindow();

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
          openedFilePaths = [...result.filePaths];

          if (!result.canceled && result.filePaths.length > 0) {
            readJSONFile(result.filePaths);
          }
        })
        .catch(err => {
          console.log(err);
        })
    } else {
      // Not modal, just child window
      await dialog.showOpenDialog(options)
        .then(result => {
          console.log(`Canceled: ${result.canceled}`);
          console.log(`Opened File Paths: ${result.filePaths}`);
          openedFilePaths = [...result.filePaths];
        })
        .catch(err => {
          console.log(err);
        })
    }

    return openedFilePaths;
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Call before creating app windows
  initializeIpcChannels();

  createMainWindow();
  // const mainWindow = createMainWindow();
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


