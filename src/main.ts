// App main process
// Handle app backend here

import {app, BrowserWindow, ipcMain, nativeTheme, dialog} from "electron";
import path from "path";
import * as fs from "fs/promises";

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
const createDiagramData = (data: object): DiagramStructure.IDiagram | undefined => {
  // Check if all properties and types are valid in data
  // After that, create diagram data and parse data into it

  // Exact number of items in each section
  const requiredDetailItemCount = 2;
  const requiredEntityItemCount = 3;
  const requiredEntityFieldItemCount = 4;

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

        // Create diagram data based on checked valid data
        const diagramData: DiagramStructure.IDiagram = {
          settings: {
            diagramName: data.settings.diagramName,
            requiredOptionOutput: data.settings.requiredOptionOutput
          },
          customization: {
            theme: data.customization.theme
          },
          details: [],
          entities: [],
          relationships: {}
        };

        // details
        for (const item of Object.values(data.details)) {
          if (item && typeof item === "object"
            && "detail" in item && typeof item.detail === "string"
            && "description" in item && typeof item.description === "string"
          )
          {
            // Check if there is valid number of props
            let detailItemCount = 0;

            for (const value of Object.values(item)) {
              detailItemCount++;
            }

            // Push detail into diagram data
            if (detailItemCount === requiredDetailItemCount) {
              diagramData.details.push(item);
            }
            else return;
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
            for (const field of Object.values(item.fields) as any) {
              if (field && typeof field === "object"
                && "name" in field && typeof field.name === "string"
                && "isPK" in field && typeof field.isPK === "boolean"
                && "dataType" in field && typeof field.dataType === "string"
                && "required" in field && typeof field.required === "boolean"
              )
              {
                // Check if there is valid number of props
                let entityFieldItemCount = 0;

                for (const value of Object.values(field)) {
                  entityFieldItemCount++;
                }

                if (entityFieldItemCount !== requiredEntityFieldItemCount) return;
              }
              else return
            }

            // Check if there is valid number of props
            let entityItemCount = 0;

            for (const value of Object.values(item)) {
              entityItemCount++;
            }

            // Push entity into diagram data
            if (entityItemCount === requiredEntityItemCount) {
              diagramData.entities.push(item);
            }
            else return;
          }
          else return;
        }

        console.log("Entities: OK");

        // relationships
        if (data.relationships) {
          console.log("Relationships: OK");
        }
        else return;

        // If everything was valid, return diagramData
        console.log(diagramData);
        return diagramData;
      }
    }
  }

  
  
}

// Read contents of JSON file
const readJSONFile = async (filePaths: string[]): Promise<unknown> => {
  // Read only the first file
  const firstFile = filePaths[0];
  
  let diagramData: unknown;

  // Read the contents
  await fs.readFile(firstFile, {
    encoding: "utf8"
  }).then(contents => {
    // convert from JSON string into object
    try {
      const data = JSON.parse(contents);

      // Check raw data
      // console.log(data);

      // Convert data into valid diagram data
      diagramData = createDiagramData(data);

      if (diagramData === undefined) {
        dialog.showMessageBox({
          message: "Warning! Opened JSON file is not a valid Entity Relationship Diagram generation file."
          + " Make sure the file has correct syntax and fix typos.",
          type: "warning",
          title: "Failed to handle opened file!"
        });
      }

    } catch(err) {
      console.log(err);
      dialog.showErrorBox("Error reading file!", "File is not valid JSON.");
    }
  }).catch(err => {
    console.log(err);
    dialog.showErrorBox("Error reading file!", "Cannot read this file.");
  })

  return diagramData;
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
            // Read data
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


