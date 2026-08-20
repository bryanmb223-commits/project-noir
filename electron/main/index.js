import { app, BrowserWindow, globalShortcut, ipcMain, Menu, nativeImage, Notification, shell, Tray } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { AIService } from "./ai/aiService.js";
import { CredentialStore } from "./ai/credentialStore.js";
import { ToolService } from "./tools/toolService.js";
import { WebSearchTool } from "./tools/webSearchTool.js";
import { LocalStore } from "./data/localStore.js";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const isDevelopment = !app.isPackaged;
let mainWindow = null;
let tray = null;
let isQuitting = false;
let store;
let aiService;
let activeShortcut = null;
let credentials;
let toolService;

function broadcastAIStatus() {
  return aiService?.status().then(status => mainWindow?.webContents.send("ai:status-changed", status));
}

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
  if (accelerator === activeShortcut && globalShortcut.isRegistered(accelerator)) return true;
  const previousShortcut = activeShortcut;
  if (previousShortcut) globalShortcut.unregister(previousShortcut);
  let registered = false;
  try {
    registered = globalShortcut.register(accelerator, toggleMainWindow);
  } catch {
    registered = false;
  }
  if (registered) {
    activeShortcut = accelerator;
    return true;
  }
  if (previousShortcut) {
    try {
      if (globalShortcut.register(previousShortcut, toggleMainWindow)) activeShortcut = previousShortcut;
    } catch {
      activeShortcut = null;
    }
  }
  return false;
}

function registerIpc() {
  const validateRecord = (collection, input) => {
    if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Dados inválidos.");
    const text = (name, max, required = false) => { if (required && !String(input[name] ?? "").trim()) throw new Error(`${name} é obrigatório.`); if (input[name] != null && typeof input[name] !== "string") throw new Error(`${name} inválido.`); if (String(input[name] ?? "").length > max) throw new Error(`${name} excede o limite permitido.`); };
    if (["projects", "notes", "tasks"].includes(collection)) text(collection === "projects" ? "name" : "title", 200, true);
    if (collection === "memories") text("content", 12000, true);
    if (collection === "conversations") text("title", 200, true);
    if (collection === "messages") { text("content", 50000, true); text("conversationId", 100, true); if (!["user", "ai"].includes(input.role)) throw new Error("Papel de mensagem inválido."); }
    if (input.projectId != null && typeof input.projectId !== "string") throw new Error("Projeto inválido.");
  };
  ipcMain.handle("app:get-info", () => ({ name: app.getName(), version: app.getVersion(), platform: process.platform }));
  ipcMain.handle("window:hide", () => { mainWindow?.hide(); return true; });
  ipcMain.handle("data:list", (_event, collection) => store.list(collection));
  ipcMain.handle("data:create", (_event, collection, input) => { validateRecord(collection, input); return store.create(collection, input); });
  ipcMain.handle("data:update", (_event, collection, id, changes) => { if (typeof id !== "string") throw new Error("Identificador inválido."); validateRecord(collection, { ...store.list(collection).find(item => item.id === id), ...changes }); return store.update(collection, id, changes); });
  ipcMain.handle("data:remove", async (_event, collection, id) => {
    if (collection === "projects") {
      for (const related of ["notes", "tasks", "memories", "conversations"]) {
        for (const item of store.list(related).filter(entry => entry.projectId === id)) await store.update(related, item.id, { projectId: null });
      }
    }
    if (collection === "conversations") for (const message of store.list("messages").filter(item => item.conversationId === id)) await store.remove("messages", message.id);
    return store.remove(collection, id);
  });
  ipcMain.handle("settings:get", () => store.getSettings());
  ipcMain.handle("settings:update", async (_event, changes) => {
    if (Object.hasOwn(changes, "globalShortcut")) {
      const requestedShortcut = typeof changes.globalShortcut === "string" ? changes.globalShortcut.trim() : "";
      if (!requestedShortcut || !registerGlobalShortcut(requestedShortcut)) {
        throw new Error("Esse atalho é inválido ou já está sendo usado por outro aplicativo.");
      }
      changes = { ...changes, globalShortcut: requestedShortcut };
    }
    if (Object.hasOwn(changes, "aiProvider") && !["local", "groq", "openrouter", "openai", "mock"].includes(changes.aiProvider)) throw new Error("Provider de IA inválido.");
    for (const field of ["openAIModel", "ollamaModel", "groqModel", "openRouterModel"]) if (Object.hasOwn(changes, field)) {
      const model = typeof changes[field] === "string" ? changes[field].trim() : "";
      if (model && !/^[a-zA-Z0-9._:/-]{1,160}$/.test(model)) throw new Error("Nome de modelo inválido."); changes = { ...changes, [field]: model };
    }
    if (Object.hasOwn(changes, "automaticFallback")) changes = { ...changes, automaticFallback: Boolean(changes.automaticFallback) };
    if (Object.hasOwn(changes, "webSearchProvider") && !["tavily", "serper", "wikipedia", "brave"].includes(changes.webSearchProvider)) throw new Error("Provider de pesquisa inválido.");
    for (const field of ["webSearchEnabled", "automaticWebSearch", "webSearchFallback"]) if (Object.hasOwn(changes, field)) changes = { ...changes, [field]: Boolean(changes[field]) };
    const settings = await store.updateSettings(changes);
    if (Object.hasOwn(changes, "launchAtLogin")) app.setLoginItemSettings({ openAtLogin: Boolean(settings.launchAtLogin) });
    if (["aiProvider", "openAIModel", "ollamaModel", "groqModel", "openRouterModel", "automaticFallback"].some(field => Object.hasOwn(changes, field))) await broadcastAIStatus();
    return settings;
  });
  ipcMain.handle("ai:status", () => aiService.status());
  ipcMain.handle("ai:key-save", (_event, provider, key) => aiService.saveKey(provider, key));
  ipcMain.handle("ai:key-remove", (_event, provider) => aiService.removeKey(provider));
  ipcMain.handle("ai:test", (_event, provider) => aiService.testConnection(provider));
  ipcMain.handle("ai:ollama-status", () => aiService.ollamaStatus());
  ipcMain.handle("web-search:status", async () => { const settings = store.getSettings(); const provider = settings.webSearchProvider; const configured = provider === "wikipedia" || await credentials.hasKey(provider); return { enabled: settings.webSearchEnabled, automatic: settings.automaticWebSearch, fallback: settings.webSearchFallback, provider, configured, credentialSource: provider !== "wikipedia" && configured ? credentials.source(provider) : "none", state: configured ? "available" : "key-missing" }; });
  ipcMain.handle("web-search:key-save", async (_event, provider, key) => { if (!["tavily", "serper", "brave"].includes(provider)) throw new Error("Provider de pesquisa inválido."); await credentials.saveKey(provider, key); return true; });
  ipcMain.handle("web-search:key-remove", (_event, provider) => { if (!["tavily", "serper", "brave"].includes(provider)) throw new Error("Provider de pesquisa inválido."); return credentials.removeKey(provider); });
  ipcMain.handle("web-search:test", async (_event, query = "versão atual do Node.js") => toolService.prepareWebContext(`/web ${String(query).slice(0, 200)}`, AbortSignal.timeout(15000)));
  ipcMain.handle("ai:stream-start", (event, requestId, request) => { const send = payload => { if (!event.sender.isDestroyed()) event.sender.send("ai:stream-event", payload); }; void aiService.stream(requestId, request, send).catch(error => send({ requestId, type: "error", message: error instanceof Error ? error.message : "Falha ao iniciar a resposta." })); return { accepted: true }; });
  ipcMain.handle("ai:stream-cancel", (_event, requestId) => aiService.cancel(requestId));
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
  credentials = new CredentialStore(app.getPath("userData"));
  toolService = new ToolService({ webSearchTool: new WebSearchTool({ credentials }), getSettings: () => store.getSettings() });
  aiService = new AIService({ getSettings: () => store.getSettings(), store, credentials, toolService, onStatusChange: broadcastAIStatus });
  registerIpc();
  createMainWindow();
  createTray();
  registerGlobalShortcut(store.getSettings().globalShortcut);
  app.on("activate", () => mainWindow ? showMainWindow() : createMainWindow());
});

app.on("before-quit", () => { isQuitting = true; });
app.on("will-quit", () => globalShortcut.unregisterAll());
