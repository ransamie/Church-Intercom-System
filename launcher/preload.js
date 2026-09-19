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
  onRosterUpdate: (callback) => ipcRenderer.on('roster-update', (event, roster) => callback(roster)),
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  downloadUpdate: (url, name) => ipcRenderer.invoke('download-update', url, name),
  installUpdate: () => ipcRenderer.invoke('install-update'),
  onUpdateAvailable: (callback) => ipcRenderer.on('update-available', (event, info) => callback(info)),
  onUpdateProgress: (callback) => ipcRenderer.on('update-download-progress', (event, progress) => callback(progress)),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', (event, data) => callback(data)),
  syncWebClients: () => ipcRenderer.invoke('sync-web-clients'),
  getOtaStatus: () => ipcRenderer.invoke('get-ota-status'),
  onOtaUpdateApplied: (callback) => ipcRenderer.on('ota-update-applied', (event, data) => callback(data))
});
