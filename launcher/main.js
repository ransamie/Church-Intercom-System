const { app, BrowserWindow, ipcMain, shell } = require('electron');
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
function getOrGenerateCerts() {
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
    const pkey = selfsigned.generate(attrs, { days: 3650 }); // 10 Years
    fs.writeFileSync(keyPath, pkey.private);
    fs.writeFileSync(certPath, pkey.cert);
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
}

app.whenReady().then(() => {
  // Asynchronously pre-generate certs on background thread so server start is instant
  setTimeout(getOrGenerateCerts, 10);
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
    const configPath = path.join(__dirname, '..', 'config.json');
    
    let appConfig = {};
    try {
      appConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch(e) {
      appConfig = { password: 'media', maxPeers: 6, appName: 'Church Intercom System' };
    }

    const expressApp = express();
    const options = getOrGenerateCerts();

    activeServer = https.createServer(options, expressApp);

    if (mode === 'walkie') {
      activeIo = new Server(activeServer, { maxHttpBufferSize: 1e8 });
      let authenticatedUsers = {};

      expressApp.use(express.static(appDir));
      expressApp.get('/', (req, res) => res.sendFile(path.join(appDir, 'index.html')));
      expressApp.get('/config', (req, res) => res.json(appConfig));
      expressApp.get('/manifest.json', (req, res) => res.json({ name: appConfig.appName, start_url: '/', display: 'standalone' }));

      function sendRoster() {
        const roster = Object.values(authenticatedUsers);
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

      expressApp.use(express.static(appDir));
      expressApp.get('/', (req, res) => res.sendFile(path.join(appDir, 'index.html')));
      expressApp.get('/config', (req, res) => res.json(appConfig));
      expressApp.get('/manifest.json', (req, res) => res.json({ name: appConfig.appName, start_url: '/', display: 'standalone' }));

      function sendRoster() {
        const roster = Object.values(users);
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
