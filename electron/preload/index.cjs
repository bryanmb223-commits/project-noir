const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("projectNoir", {
  getAppInfo: () => ipcRenderer.invoke("app:get-info"),
});
