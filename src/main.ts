// App main process
// Handle app backend here

import {app, BrowserWindow, ipcMain, nativeTheme, dialog} from "electron";
import path from "path";
import * as fs from "fs/promises";
import { IDiagram, IDiagramDetail, IDiagramEntity, IDiagramEntityField }
from "./diagram-structure";

// Main window of the app
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

// Create diagram data
const createDiagramData = (data: object) => {
  // Check if all values and types are valid in data
  if (data && typeof data === "object") {
    if ("settings" in data && typeof data.settings === "object"
      && "customization" in data && typeof data.customization === "object"
      && "details" in data && typeof data.details === "object"
      && "entities" in data && typeof data.entities === "object"
      && "relationships" in data && typeof data.relationships === "object"
    ) 
    {
      console.log("Data Root: OK");
      // settings
      if (data.settings && data.customization
        && data.details && data.entities && data.relationships
        && "diagramName" in data.settings
        && typeof data.settings.diagramName === "string"
        && "requiredOptionOutput" in data.settings
        && typeof data.settings.requiredOptionOutput === "string"

        // customization
        && "theme" in data.customization
        && typeof data.customization.theme === "string"
      )
      {
        console.log("Settings and customization: OK");

        // details
        for (const item of Object.values(data.details)) {
          if (item && typeof item === "object"
            && "detail" in item && typeof item.detail === "string"
            && "description" in item && typeof item.description === "string"
          )
          {
            console.log(item);
          }
          else return;
        }

        console.log("Details: OK");

        // entities
        for (const item of Object.values(data.entities)) {
          if (item && typeof item === "object"
            && "name" in item && typeof item.name === "string"
            && "id" in item && typeof item.id === "number"
            && "fields" in item && typeof item.fields === "object"
            && item.fields
          )
          {
            // Check for nested properties
            for (const field of Object.values(item.fields)) {
              if (field && typeof field === "object"
                && "name" in field && typeof field.name === "string"
                && "isPK" in field && typeof field.isPK === "boolean"
                && "dataType" in field && typeof field.dataType === "string"
                && "required" in field && typeof field.required === "boolean"
              )
              {
                console.log(field);
              }
              else return
            }

            console.log(item);
          }
          else return;
        }

        console.log("Entities: OK");

        // relationships
        if (data.relationships) {
          console.log("Relationships: OK");
        }
      }
    }
  }

  // Create diagram data based on checked valid data
  /*
  const diagramData: IDiagram = {
    settings: {
      diagramName: data.settings.diagramName,
      requiredOptionOutput: data.settings.requiredOptionOutput
    },
    customization: {
      theme: data.customization.theme
    },
    details: [

    ],
    entities: [

    ],
    relationships: {}
  }
  */
}

// Read contents of JSON file
const readJSONFile = async (filePaths: string[]): Promise<unknown> => {
  // Read only the first file
  const firstFile = filePaths[0];
  
  let data: unknown;

  // Read the contents
  await fs.readFile(firstFile, {
    encoding: "utf8"
  }).then(contents => {
    // convert from JSON string into object
    try {
      const data = JSON.parse(contents);
      console.log(data);
      createDiagramData(data);

    } catch(err) {
      console.log(err);
      dialog.showErrorBox("Error reading file!", "File is not valid JSON.");
    }
  }).catch(err => {
    console.log(err);
    dialog.showErrorBox("Error reading file!", "Cannot read this file.");
  })

  return data;
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
  ipcMain.handle("system-dialog:open-file", async (event, fileType: string): Promise<unknown> => {
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
            data = readJSONFile(result.filePaths);
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


