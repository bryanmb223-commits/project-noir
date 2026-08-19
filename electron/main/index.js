import { app, BrowserWindow, globalShortcut, ipcMain, Menu, nativeImage, Notification, shell, Tray } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { AIService } from "./ai/aiService.js";
import { LocalStore } from "./data/localStore.js";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const isDevelopment = !app.isPackaged;
let mainWindow = null;
let tray = null;
let isQuitting = false;
let store;
let aiService;

const iconPath = () => isDevelopment
  ? path.join(currentDirectory, "../../build/icon.ico")
  : path.join(process.resourcesPath, "icon.ico");

function showMainWindow() {
  if (!mainWindow) return;
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.show();
  mainWindow.focus();
}

function toggleMainWindow() {
  if (!mainWindow) return;
  mainWindow.isVisible() ? mainWindow.hide() : showMainWindow();
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1440, height: 900, minWidth: 820, minHeight: 600,
    icon: iconPath(), backgroundColor: "#0F1117", title: "Project Noir", autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(currentDirectory, "../preload/index.cjs"),
      nodeIntegration: false, contextIsolation: true, sandbox: true,
    },
  });
  mainWindow.on("close", event => {
    if (!isQuitting) { event.preventDefault(); mainWindow.hide(); }
  });
  mainWindow.on("closed", () => { mainWindow = null; });
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://")) void shell.openExternal(url);
    return { action: "deny" };
  });
  void (isDevelopment
    ? mainWindow.loadURL("http://127.0.0.1:5173")
    : mainWindow.loadFile(path.join(currentDirectory, "../../dist/index.html")));
}

function createTray() {
  tray = new Tray(nativeImage.createFromPath(iconPath()).resize({ width: 16, height: 16 }));
  tray.setToolTip("Project Noir");
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: "Abrir Project Noir", click: showMainWindow },
    { label: "Ocultar janela", click: () => mainWindow?.hide() },
    { type: "separator" },
    { label: "Sair", click: () => { isQuitting = true; app.quit(); } },
  ]));
  tray.on("double-click", showMainWindow);
}

function registerGlobalShortcut(accelerator) {
  globalShortcut.unregisterAll();
  return globalShortcut.register(accelerator, toggleMainWindow);
}

function registerIpc() {
  ipcMain.handle("app:get-info", () => ({ name: app.getName(), version: app.getVersion(), platform: process.platform }));
  ipcMain.handle("data:list", (_event, collection) => store.list(collection));
  ipcMain.handle("data:create", (_event, collection, input) => store.create(collection, input));
  ipcMain.handle("data:update", (_event, collection, id, changes) => store.update(collection, id, changes));
  ipcMain.handle("data:remove", (_event, collection, id) => store.remove(collection, id));
  ipcMain.handle("settings:get", () => store.getSettings());
  ipcMain.handle("settings:update", async (_event, changes) => {
    const settings = await store.updateSettings(changes);
    if (Object.hasOwn(changes, "launchAtLogin")) app.setLoginItemSettings({ openAtLogin: Boolean(settings.launchAtLogin) });
    if (changes.globalShortcut) registerGlobalShortcut(settings.globalShortcut);
    return settings;
  });
  ipcMain.handle("ai:generate", (_event, request) => aiService.generate(request));
  ipcMain.handle("ai:status", () => aiService.status());
  ipcMain.handle("notifications:show", (_event, { title, body }) => {
    if (!store.getSettings().notifications || !Notification.isSupported()) return false;
    new Notification({ title: String(title).slice(0, 80), body: String(body).slice(0, 300), icon: iconPath() }).show();
    return true;
  });
}

app.whenReady().then(async () => {
  app.setAppUserModelId("com.projectnoir.desktop");
  store = new LocalStore(app.getPath("userData"));
  await store.initialize();
  aiService = new AIService(() => store.getSettings());
  registerIpc();
  createMainWindow();
  createTray();
  registerGlobalShortcut(store.getSettings().globalShortcut);
  app.on("activate", () => mainWindow ? showMainWindow() : createMainWindow());
});

app.on("before-quit", () => { isQuitting = true; });
app.on("will-quit", () => globalShortcut.unregisterAll());
