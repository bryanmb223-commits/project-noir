const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("projectNoir", Object.freeze({
  getAppInfo: () => ipcRenderer.invoke("app:get-info"),
  ai: Object.freeze({
    generate: request => ipcRenderer.invoke("ai:generate", request),
    status: () => ipcRenderer.invoke("ai:status"),
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
