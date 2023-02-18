import { BrowserWindow } from "electron";
import { createMainWindowMenu } from "./menu";
import { isAppDebugMode } from "./main";
import path from "path";

export const createMainWindow = (): BrowserWindow => {
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

export const createCustomizationWindow = async (mainWindow: BrowserWindow) => {
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

  win.setPosition(
    mainWindowPosition[0],
    mainWindowPosition[1]
  );

  // No menu in release version
  // Comment to debug the window
  win.setMenu(null);

  win.once('ready-to-show', () => {
    win.show()
  });

  await win.loadFile("./src/html/customization.html");

  // Get current diagram colors from main window renderer
  mainWindow.webContents.send("diagram-customization:get-current-colors", win.id);
}