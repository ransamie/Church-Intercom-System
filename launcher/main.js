const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');
const https = require('https');
const crypto = require('crypto');
const express = require('express');
const { Server } = require('socket.io');
const QRCode = require('qrcode');
const selfsigned = require('selfsigned');

let mainWindow;
let activeServer = null;
let activeIo = null;
let currentMode = null;
let cachedCerts = null;

// Pre-generate / Cache 10-Year Certificates for Instant Server Startup
async function getOrGenerateCertsAsync() {
  if (cachedCerts) return cachedCerts;

  const certDir = path.join(app.getPath('userData'), 'certs');
  if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir, { recursive: true });
  }

  const keyPath = path.join(certDir, 'key.pem');
  const certPath = path.join(certDir, 'cert.pem');

  let needGen = false;
  if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
    needGen = true;
  } else {
    try {
      const certStat = fs.statSync(certPath);
      // Auto-renew if older than 5 years
      if ((Date.now() - certStat.mtimeMs) > (5 * 365 * 24 * 60 * 60 * 1000)) {
        needGen = true;
      }
    } catch(e) {
      needGen = true;
    }
  }

  if (needGen) {
    const attrs = [{ name: 'commonName', value: 'ChurchIntercom' }];
    try {
      const pkey = await selfsigned.generate(attrs, { days: 3650 });
      fs.writeFileSync(keyPath, pkey.private);
      fs.writeFileSync(certPath, pkey.cert);
      cachedCerts = { key: pkey.private, cert: pkey.cert };
      return cachedCerts;
    } catch(err) {
      console.error("Async cert generation error, falling back:", err);
    }
  } else {
    try {
      cachedCerts = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
      };
      return cachedCerts;
    } catch(err) {
      console.error("Async cert read error:", err);
    }
  }

  // Fallback to bundled certs
  return {
    key: fs.readFileSync(path.join(__dirname, '..', 'Walkie-Talkie', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '..', 'Walkie-Talkie', 'cert.pem'))
  };
}
function getLocalIps() {
  const interfaces = os.networkInterfaces();
  const results = [];
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        if (net.address.startsWith('192.168.') || net.address.startsWith('10.')) {
          results.unshift(net.address);
        } else {
          results.push(net.address);
        }
      }
    }
  }
  return results;
}

function getModeDir(mode) {
  const modeFolder = mode === 'walkie' ? 'Walkie-Talkie' : 'Realtime-Conference';
  const otaDir = path.join(app.getPath('userData'), 'ota-web-clients', modeFolder);
  const localDir = path.join(__dirname, '..', modeFolder);
  const resourceDir = path.join(process.resourcesPath || '', modeFolder);

  // In development mode, prefer local repo files unless OTA files are strictly newer
  if (!app.isPackaged && fs.existsSync(path.join(localDir, 'index.html'))) {
    if (fs.existsSync(path.join(otaDir, 'index.html'))) {
      const otaMtime = fs.statSync(path.join(otaDir, 'index.html')).mtimeMs;
      const localMtime = fs.statSync(path.join(localDir, 'index.html')).mtimeMs;
      if (otaMtime > localMtime) return otaDir;
    }
    return localDir;
  }

  // In packaged app, prioritize Over-The-Air updated files in userData
  if (fs.existsSync(path.join(otaDir, 'index.html'))) {
    return otaDir;
  }

  // Fallback to packaged extraResources path
  if (fs.existsSync(path.join(resourceDir, 'index.html'))) {
    return resourceDir;
  }

  return localDir;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 960,
    height: 720,
    minWidth: 850,
    minHeight: 650,
    title: 'Church Intercom Control Panel',
    icon: path.join(__dirname, 'assets', 'logo.png'),
    show: false, // Instant show when ready
    backgroundColor: '#0d0d12',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.setMenu(null);
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();

    // 1. Check for Over-The-Air web interface updates in background
    setTimeout(async () => {
      try {
        const otaResult = await syncOtaWebClients();
        if (otaResult.updatedCount > 0 && mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('ota-update-applied', otaResult);
        }
      } catch (err) {
        console.warn('[OTA] Background sync warning:', err.message);
      }
    }, 1500);

    // 2. Check for software application updates shortly after launch
    setTimeout(async () => {
      try {
        const updateInfo = await checkForUpdates();
        if (updateInfo.updateAvailable && mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('update-available', updateInfo);
        }
      } catch (err) {
        console.error('[Updater] Auto-check on launch failed:', err.message);
      }
    }, 3000);
  });

  ipcMain.handle('show-message', async (event, msg) => {
    dialog.showMessageBox({
      title: 'Church Intercom System',
      message: msg,
      type: 'info',
      buttons: ['OK']
    });
  });
}

app.whenReady().then(() => {
  // Asynchronously pre-generate certs on background thread so server start is fast
  getOrGenerateCertsAsync().catch(console.error);
  createWindow();
});

app.on('window-all-closed', () => {
  stopServer();
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers
ipcMain.handle('get-status', async () => {
  const ips = getLocalIps();
  return {
    running: activeServer !== null,
    mode: currentMode,
    ips: ips,
    url: ips.length > 0 ? `https://${ips[0]}:3000` : null
  };
});

ipcMain.handle('start-server', async (event, mode) => {
  if (activeServer) {
    await stopServer();
  }

  try {
    const ips = getLocalIps();
    const primaryIp = ips[0] || 'localhost';
    const serverUrl = `https://${primaryIp}:3000`;
    
    // Generate QR Code
    const qrCodeUrl = await QRCode.toDataURL(serverUrl, { margin: 1, width: 220 });

    const appDir = getModeDir(mode);
    const fallbackDir = path.join(__dirname, '..', mode === 'walkie' ? 'Walkie-Talkie' : 'Realtime-Conference');
    
    // Persistent user settings
    const userDataPath = app.getPath('userData');
    const userConfigPath = path.join(userDataPath, 'config.json');
    let appConfig = { password: 'media', maxPeers: 6, appName: 'Church Intercom System', theme: { primaryColor: '#007bff', backgroundColor: '#1a1a1a' } };
    
    try {
      if (fs.existsSync(userConfigPath)) {
        appConfig = Object.assign(appConfig, JSON.parse(fs.readFileSync(userConfigPath, 'utf8')));
      } else {
        // Fallback to default config if user config doesn't exist yet
        const defaultConfigPath = path.join(__dirname, '..', 'config.json');
        if (fs.existsSync(defaultConfigPath)) {
          appConfig = Object.assign(appConfig, JSON.parse(fs.readFileSync(defaultConfigPath, 'utf8')));
        }
      }
    } catch(e) {
      console.error("Config load error:", e);
    }

    const expressApp = express();
    const options = await getOrGenerateCertsAsync();

    activeServer = https.createServer(options, expressApp);

    // Common routes for both modes
    expressApp.get('/config', (req, res) => res.json(appConfig));
    expressApp.get('/logo.jpg', (req, res) => {
      const customLogo = path.join(userDataPath, 'logo.jpg');
      if (fs.existsSync(customLogo)) {
        return res.sendFile(customLogo);
      }
      const otaLogo = path.join(appDir, 'logo.jpg');
      if (fs.existsSync(otaLogo)) {
        return res.sendFile(otaLogo);
      }
      const fallbackLogo = path.join(fallbackDir, 'logo.jpg');
      if (fs.existsSync(fallbackLogo)) {
        return res.sendFile(fallbackLogo);
      }
      res.sendFile(path.join(__dirname, 'assets', 'logo.png'));
    });
    expressApp.use(express.static(appDir));
    if (appDir !== fallbackDir && fs.existsSync(fallbackDir)) {
      expressApp.use(express.static(fallbackDir));
    }
    
    if (mode === 'walkie') {
      activeIo = new Server(activeServer, { maxHttpBufferSize: 1e8 });
      let authenticatedUsers = {};

      expressApp.get('/', (req, res) => res.sendFile(path.join(appDir, 'index.html')));
      expressApp.get('/manifest.json', (req, res) => res.json({ 
        name: appConfig.appName, 
        short_name: 'Intercom',
        start_url: '/', 
        display: 'standalone',
        background_color: '#0d0d12',
        theme_color: '#0d0d12',
        icons: [{ src: '/logo.jpg', sizes: '192x192 512x512', type: 'image/jpeg' }]
      }));

      function sendRoster() {
        const roster = Object.values(authenticatedUsers);
        if (activeIo) {
          activeIo.emit('roster-update', roster);
        }
        if (mainWindow) {
          mainWindow.webContents.send('roster-update', roster);
        }
      }

      activeIo.on('connection', (socket) => {
        const clientIp = socket.handshake.address.replace('::ffff:', '');

        socket.on('login', (data) => {
          let password = typeof data === 'string' ? data : data.password;
          let stationName = typeof data === 'object' && data.stationName ? data.stationName : 'Station Device';

          if (password === appConfig.password) {
            authenticatedUsers[socket.id] = { id: socket.id, stationName, ip: clientIp, isSpeaking: false };
            socket.emit('login-success', { stationName });
            sendRoster();
          } else {
            socket.emit('auth-error', 'Wrong Password');
          }
        });

        socket.on('speaking-start', () => {
          if (authenticatedUsers[socket.id]) {
            authenticatedUsers[socket.id].isSpeaking = true;
            activeIo.emit('speaker-active', { stationName: authenticatedUsers[socket.id].stationName });
            sendRoster();
          }
        });

        socket.on('speaking-stop', () => {
          if (authenticatedUsers[socket.id]) {
            authenticatedUsers[socket.id].isSpeaking = false;
            activeIo.emit('speaker-idle');
            sendRoster();
          }
        });

        socket.on('voice', (audioBlob) => {
          if (authenticatedUsers[socket.id]) {
            socket.broadcast.emit('voice', { audioBlob, stationName: authenticatedUsers[socket.id].stationName });
          }
        });

        socket.on('disconnect', () => {
          delete authenticatedUsers[socket.id];
          sendRoster();
        });
      });

    } else {
      // Realtime Conference Mode
      activeIo = new Server(activeServer);
      let users = {};

      expressApp.get('/', (req, res) => res.sendFile(path.join(appDir, 'index.html')));
      expressApp.get('/manifest.json', (req, res) => res.json({ 
        name: appConfig.appName, 
        short_name: 'Intercom',
        start_url: '/', 
        display: 'standalone',
        background_color: '#0d0d12',
        theme_color: '#0d0d12',
        icons: [{ src: '/logo.jpg', sizes: '192x192 512x512', type: 'image/jpeg' }]
      }));

      function sendRoster() {
        const roster = Object.values(users);
        if (activeIo) {
          activeIo.emit('roster-update', roster);
        }
        if (mainWindow) {
          mainWindow.webContents.send('roster-update', roster);
        }
      }

      activeIo.on('connection', (socket) => {
        const clientIp = socket.handshake.address.replace('::ffff:', '');

        socket.on('login', (data) => {
          let password = typeof data === 'string' ? data : data.password;
          let stationName = typeof data === 'object' && data.stationName ? data.stationName : 'Station Device';

          if (password !== appConfig.password) {
            socket.emit('auth-error', 'Wrong Password');
            return;
          }
          if (Object.keys(users).length >= (appConfig.maxPeers || 6)) {
            socket.emit('room-full');
            return;
          }

          users[socket.id] = { id: socket.id, stationName, ip: clientIp, isSpeaking: false };
          socket.emit('login-success', { selfId: socket.id, stationName, peers: users });
          socket.broadcast.emit('user-joined', { id: socket.id, stationName, ip: clientIp });
          sendRoster();
        });

        socket.on('offer', data => users[socket.id] && socket.to(data.target).emit('offer', { sdp: data.sdp, caller: socket.id, stationName: users[socket.id].stationName }));
        socket.on('answer', data => users[socket.id] && socket.to(data.target).emit('answer', { sdp: data.sdp, caller: socket.id, stationName: users[socket.id].stationName }));
        socket.on('candidate', data => users[socket.id] && socket.to(data.target).emit('candidate', { candidate: data.candidate, caller: socket.id }));

        socket.on('speaking-state', (isSpeaking) => {
          if (users[socket.id]) {
            users[socket.id].isSpeaking = isSpeaking;
            activeIo.emit('speaking-state-update', { id: socket.id, stationName: users[socket.id].stationName, isSpeaking });
            sendRoster();
          }
        });

        socket.on('disconnect', () => {
          if (users[socket.id]) {
            delete users[socket.id];
            socket.broadcast.emit('user-disconnected', socket.id);
            sendRoster();
          }
        });
      });
    }

    await new Promise((resolve) => {
      activeServer.listen(3000, '0.0.0.0', resolve);
    });

    currentMode = mode;

    return {
      success: true,
      mode: currentMode,
      url: serverUrl,
      ips: ips,
      qrCode: qrCodeUrl
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('stop-server', async () => {
  await stopServer();
  return { success: true };
});

ipcMain.handle('open-url', (event, url) => {
  shell.openExternal(url);
});

ipcMain.handle('get-config', async () => {
  const userConfigPath = path.join(app.getPath('userData'), 'config.json');
  if (fs.existsSync(userConfigPath)) {
    return JSON.parse(fs.readFileSync(userConfigPath, 'utf8'));
  }
  const defaultConfigPath = path.join(__dirname, '..', 'config.json');
  if (fs.existsSync(defaultConfigPath)) {
    return JSON.parse(fs.readFileSync(defaultConfigPath, 'utf8'));
  }
  return { password: 'media', maxPeers: 6, appName: 'Church Intercom System', theme: { primaryColor: '#007bff', backgroundColor: '#1a1a1a' } };
});

ipcMain.handle('save-settings', async (event, newConfig) => {
  try {
    const userConfigPath = path.join(app.getPath('userData'), 'config.json');
    let currentConfig = {};
    if (fs.existsSync(userConfigPath)) {
      currentConfig = JSON.parse(fs.readFileSync(userConfigPath, 'utf8'));
    }
    const mergedConfig = Object.assign(currentConfig, newConfig);
    fs.writeFileSync(userConfigPath, JSON.stringify(mergedConfig, null, 2));
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('upload-logo', async (event, base64Data) => {
  try {
    const customLogoPath = path.join(app.getPath('userData'), 'logo.jpg');
    const buffer = Buffer.from(base64Data.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    fs.writeFileSync(customLogoPath, buffer);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

async function stopServer() {
  if (activeIo) {
    activeIo.close();
    activeIo = null;
  }
  if (activeServer) {
    activeServer.close();
    activeServer = null;
  }
  currentMode = null;
}

// --- AUTO UPDATER ENGINE ---
const GITHUB_REPO = 'ransamie/Church-Intercom-System';
let downloadedUpdatePath = null;
let updateDownloadInProgress = false;

function compareSemver(v1, v2) {
  const clean1 = (v1 || '').replace(/^v/, '').trim();
  const clean2 = (v2 || '').replace(/^v/, '').trim();
  const parts1 = clean1.split('.').map(p => parseInt(p, 10) || 0);
  const parts2 = clean2.split('.').map(p => parseInt(p, 10) || 0);
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    if (p1 > p2) return 1;
    if (p1 < p2) return -1;
  }
  return 0;
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'ChurchIntercom-Updater',
        'Accept': 'application/vnd.github.v3+json'
      }
    };
    https.get(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchJson(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`GitHub API request failed with HTTP status ${res.statusCode}`));
      }
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function checkForUpdates() {
  try {
    const release = await fetchJson(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`);
    const currentVersion = app.getVersion();
    const latestVersion = (release.tag_name || '').replace(/^v/, '');
    
    const isNewer = compareSemver(latestVersion, currentVersion) > 0;
    if (!isNewer) {
      return { updateAvailable: false, currentVersion, latestVersion };
    }

    // Find matching installer asset for the host platform
    let matchedAsset = null;
    if (process.platform === 'win32') {
      matchedAsset = (release.assets || []).find(a => a.name.endsWith('.exe') && !a.name.includes('.blockmap'));
    } else if (process.platform === 'darwin') {
      matchedAsset = (release.assets || []).find(a => a.name.endsWith('.dmg'));
    } else if (process.platform === 'linux') {
      matchedAsset = (release.assets || []).find(a => a.name.endsWith('.AppImage'));
    }

    return {
      updateAvailable: true,
      currentVersion,
      latestVersion,
      tagName: release.tag_name,
      releaseName: release.name || release.tag_name,
      releaseNotes: release.body || '',
      publishedAt: release.published_at,
      asset: matchedAsset ? {
        name: matchedAsset.name,
        size: matchedAsset.size,
        downloadUrl: matchedAsset.browser_download_url
      } : null
    };
  } catch (err) {
    console.error('[Updater] Failed to check for updates:', err.message);
    return { updateAvailable: false, error: err.message, currentVersion: app.getVersion() };
  }
}

function downloadFileWithProgress(url, destPath, onProgress) {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(destPath);

    function makeRequest(currentUrl) {
      const options = {
        headers: {
          'User-Agent': 'ChurchIntercom-Updater'
        }
      };
      https.get(currentUrl, options, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return makeRequest(res.headers.location);
        }
        if (res.statusCode !== 200) {
          fileStream.close();
          fs.unlink(destPath, () => {});
          return reject(new Error(`Download failed with status ${res.statusCode}`));
        }

        const totalBytes = parseInt(res.headers['content-length'] || '0', 10);
        let receivedBytes = 0;

        res.on('data', (chunk) => {
          receivedBytes += chunk.length;
          fileStream.write(chunk);
          if (onProgress) {
            const percent = totalBytes > 0 ? Math.round((receivedBytes / totalBytes) * 100) : 0;
            onProgress({ percent, receivedBytes, totalBytes });
          }
        });

        res.on('end', () => {
          fileStream.end(() => {
            resolve(destPath);
          });
        });
      }).on('error', (err) => {
        fileStream.close();
        fs.unlink(destPath, () => {});
        reject(err);
      });
    }

    makeRequest(url);
  });
}

function installUpdate() {
  if (!downloadedUpdatePath || !fs.existsSync(downloadedUpdatePath)) {
    throw new Error('No downloaded update found to install');
  }

  if (process.platform === 'win32') {
    const child = spawn(downloadedUpdatePath, [], {
      detached: true,
      stdio: 'ignore'
    });
    child.unref();
    app.quit();
  } else if (process.platform === 'darwin') {
    shell.openPath(downloadedUpdatePath);
    app.quit();
  } else if (process.platform === 'linux') {
    fs.chmodSync(downloadedUpdatePath, 0o755);
    const child = spawn(downloadedUpdatePath, [], {
      detached: true,
      stdio: 'ignore'
    });
    child.unref();
    app.quit();
  }
}

ipcMain.handle('check-for-updates', async () => {
  return await checkForUpdates();
});

ipcMain.handle('download-update', async (event, assetUrl, assetName) => {
  if (updateDownloadInProgress) {
    return { success: false, error: 'Download already in progress' };
  }
  updateDownloadInProgress = true;
  try {
    const tempDir = app.getPath('temp');
    const safeName = assetName || `ChurchIntercom-Update-${Date.now()}${process.platform === 'win32' ? '.exe' : ''}`;
    const targetPath = path.join(tempDir, safeName);

    await downloadFileWithProgress(assetUrl, targetPath, (progress) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('update-download-progress', progress);
      }
    });

    downloadedUpdatePath = targetPath;
    updateDownloadInProgress = false;
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('update-downloaded', { filePath: targetPath });
    }
    return { success: true, filePath: targetPath };
  } catch (err) {
    updateDownloadInProgress = false;
    console.error('[Updater] Download error:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('install-update', async () => {
  try {
    installUpdate();
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// --- OVER-THE-AIR (OTA) WEB CLIENT SYNC ENGINE ---
const OTA_REPO_RAW = 'https://raw.githubusercontent.com/ransamie/Church-Intercom-System/master';
const OTA_TARGETS = [
  { mode: 'walkie', folder: 'Walkie-Talkie', files: ['index.html', 'sw.js'] },
  { mode: 'realtime', folder: 'Realtime-Conference', files: ['index.html', 'sw.js'] }
];

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'ChurchIntercom-OTA-Sync',
        'Cache-Control': 'no-cache'
      }
    };
    const req = https.get(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchText(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP status ${res.statusCode}`));
      }
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve(data));
    });
    req.setTimeout(10000, () => {
      req.destroy(new Error('Connection timed out'));
    });
    req.on('error', reject);
  });
}

async function syncOtaWebClients() {
  const otaBaseDir = path.join(app.getPath('userData'), 'ota-web-clients');
  const metaPath = path.join(otaBaseDir, 'ota-meta.json');
  let currentMeta = { files: {}, lastSync: null };

  if (fs.existsSync(metaPath)) {
    try {
      currentMeta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      if (!currentMeta.files) currentMeta.files = {};
    } catch (e) {
      console.warn('[OTA] Could not read existing ota-meta.json:', e.message);
    }
  }

  let updatedCount = 0;
  const syncResults = [];

  for (const target of OTA_TARGETS) {
    const targetDir = path.join(otaBaseDir, target.folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    for (const fileName of target.files) {
      const fileKey = `${target.folder}/${fileName}`;
      const destPath = path.join(targetDir, fileName);
      const url = `${OTA_REPO_RAW}/${target.folder}/${fileName}?t=${Date.now()}`;

      try {
        const remoteContent = await fetchText(url);
        if (!remoteContent || remoteContent.length < 20) {
          throw new Error('Downloaded content is invalid or empty');
        }
        if (fileName === 'index.html' && !remoteContent.includes('<html') && !remoteContent.includes('<!DOCTYPE')) {
          throw new Error('Downloaded index.html did not contain html tag');
        }

        const remoteHash = crypto.createHash('sha256').update(remoteContent).digest('hex');
        let needsWrite = true;

        if (fs.existsSync(destPath)) {
          const localContent = fs.readFileSync(destPath, 'utf8');
          const localHash = crypto.createHash('sha256').update(localContent).digest('hex');
          if (localHash === remoteHash) {
            needsWrite = false;
          }
        }

        if (needsWrite) {
          fs.writeFileSync(destPath, remoteContent, 'utf8');
          updatedCount++;
          syncResults.push({ file: fileKey, status: 'updated' });
        } else {
          syncResults.push({ file: fileKey, status: 'up-to-date' });
        }

        currentMeta.files[fileKey] = {
          hash: remoteHash,
          updatedAt: new Date().toISOString(),
          bytes: Buffer.byteLength(remoteContent, 'utf8')
        };
      } catch (err) {
        console.warn(`[OTA] Failed to fetch ${fileKey}:`, err.message);
        syncResults.push({ file: fileKey, status: 'error', error: err.message });
      }
    }
  }

  currentMeta.lastSync = new Date().toISOString();
  currentMeta.lastUpdatedCount = updatedCount;
  try {
    fs.writeFileSync(metaPath, JSON.stringify(currentMeta, null, 2), 'utf8');
  } catch (e) {
    console.warn('[OTA] Failed to write ota-meta.json:', e.message);
  }

  return {
    success: true,
    updatedCount,
    lastSync: currentMeta.lastSync,
    results: syncResults
  };
}

function getOtaStatus() {
  const otaBaseDir = path.join(app.getPath('userData'), 'ota-web-clients');
  const metaPath = path.join(otaBaseDir, 'ota-meta.json');
  const walkieIndex = path.join(otaBaseDir, 'Walkie-Talkie', 'index.html');
  const realtimeIndex = path.join(otaBaseDir, 'Realtime-Conference', 'index.html');

  let meta = null;
  if (fs.existsSync(metaPath)) {
    try {
      meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    } catch (e) {}
  }

  const hasOtaFiles = fs.existsSync(walkieIndex) || fs.existsSync(realtimeIndex);

  return {
    hasOtaFiles,
    lastSync: meta ? meta.lastSync : null,
    meta: meta || null
  };
}

ipcMain.handle('sync-web-clients', async () => {
  try {
    return await syncOtaWebClients();
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('get-ota-status', async () => {
  try {
    return getOtaStatus();
  } catch (err) {
    return { hasOtaFiles: false, error: err.message };
  }
});
