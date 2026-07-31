const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');
const https = require('https');
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
    } catch(err) {
      console.error("Failed to generate certs:", err);
      throw err;
    }
  }

  cachedCerts = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  };
  return cachedCerts;
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

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 960,
    height: 720,
    minWidth: 850,
    minHeight: 650,
    title: 'Church Intercom Host Control Panel — RanTech',
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

    const appDir = path.join(__dirname, '..', mode === 'walkie' ? 'Walkie-Talkie' : 'Realtime-Conference');
    
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
        res.sendFile(customLogo);
      } else {
        res.sendFile(path.join(appDir, 'logo.jpg'));
      }
    });
    expressApp.use(express.static(appDir));
    
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
