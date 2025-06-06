const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  readProject: (dirPath) => ipcRenderer.invoke('read-project', dirPath)
});