const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getStatus: () => ipcRenderer.invoke('get-status'),
  startServer: (mode) => ipcRenderer.invoke('start-server', mode),
  stopServer: () => ipcRenderer.invoke('stop-server'),
  openUrl: (url) => ipcRenderer.invoke('open-url', url),
  onRosterUpdate: (callback) => ipcRenderer.on('roster-update', (event, roster) => callback(roster))
});
