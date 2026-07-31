const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getStatus: () => ipcRenderer.invoke('get-status'),
  startServer: (mode) => ipcRenderer.invoke('start-server', mode),
  stopServer: () => ipcRenderer.invoke('stop-server'),
  openUrl: (url) => ipcRenderer.invoke('open-url', url),
  getConfig: () => ipcRenderer.invoke('get-config'),
  saveSettings: (config) => ipcRenderer.invoke('save-settings', config),
  uploadLogo: (base64) => ipcRenderer.invoke('upload-logo', base64),
  showMessage: (msg) => ipcRenderer.invoke('show-message', msg),
  onRosterUpdate: (callback) => ipcRenderer.on('roster-update', (event, roster) => callback(roster))
});
