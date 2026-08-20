const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("projectNoir", Object.freeze({
  getAppInfo: () => ipcRenderer.invoke("app:get-info"),
  window: Object.freeze({ hide: () => ipcRenderer.invoke("window:hide") }),
  ai: Object.freeze({
    status: () => ipcRenderer.invoke("ai:status"),
    saveKey: (provider, key) => ipcRenderer.invoke("ai:key-save", provider, key),
    removeKey: provider => ipcRenderer.invoke("ai:key-remove", provider),
    testConnection: provider => ipcRenderer.invoke("ai:test", provider),
    ollamaStatus: () => ipcRenderer.invoke("ai:ollama-status"),
    startStream: (requestId, request) => ipcRenderer.invoke("ai:stream-start", requestId, request),
    cancelStream: requestId => ipcRenderer.invoke("ai:stream-cancel", requestId),
    onStreamEvent: callback => { const listener = (_event, payload) => callback(payload); ipcRenderer.on("ai:stream-event", listener); return () => ipcRenderer.removeListener("ai:stream-event", listener); },
    onStatusChanged: callback => { const listener = (_event, payload) => callback(payload); ipcRenderer.on("ai:status-changed", listener); return () => ipcRenderer.removeListener("ai:status-changed", listener); },
  }),
  webSearch: Object.freeze({
    status: () => ipcRenderer.invoke("web-search:status"),
    saveKey: (provider, key) => ipcRenderer.invoke("web-search:key-save", provider, key),
    removeKey: provider => ipcRenderer.invoke("web-search:key-remove", provider),
    test: query => ipcRenderer.invoke("web-search:test", query),
  }),
  data: Object.freeze({
    list: collection => ipcRenderer.invoke("data:list", collection),
    create: (collection, input) => ipcRenderer.invoke("data:create", collection, input),
    update: (collection, id, changes) => ipcRenderer.invoke("data:update", collection, id, changes),
    remove: (collection, id) => ipcRenderer.invoke("data:remove", collection, id),
  }),
  settings: Object.freeze({
    get: () => ipcRenderer.invoke("settings:get"),
    update: changes => ipcRenderer.invoke("settings:update", changes),
  }),
  notifications: Object.freeze({ show: options => ipcRenderer.invoke("notifications:show", options) }),
}));
