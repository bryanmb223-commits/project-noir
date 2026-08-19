import { app, BrowserWindow, ipcMain, shell } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const isDevelopment = !app.isPackaged;

function createMainWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 820,
    minHeight: 600,
    backgroundColor: "#0F1117",
    title: "Project Noir",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(currentDirectory, "../preload/index.cjs"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://")) void shell.openExternal(url);
    return { action: "deny" };
  });

  if (isDevelopment) {
    void window.loadURL("http://127.0.0.1:5173");
  } else {
    void window.loadFile(path.join(currentDirectory, "../../dist/index.html"));
  }
}

app.whenReady().then(() => {
  ipcMain.handle("app:get-info", () => ({
    name: app.getName(),
    version: app.getVersion(),
    platform: process.platform,
  }));

  createMainWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
