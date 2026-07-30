const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');
const https = require('https');
const express = require('express');
const { Server } = require('socket.io');
const QRCode = require('qrcode');

let mainWindow;
let activeServer = null;
let activeIo = null;
let currentMode = null;

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
    width: 900,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    title: 'Church Intercom Control Panel',
    icon: path.join(__dirname, 'assets', 'logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.setMenu(null);
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(createWindow);

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
    const qrCodeUrl = await QRCode.toDataURL(serverUrl);

    // Start Node Express/Socket.io Server
    const appDir = path.join(__dirname, '..', mode === 'walkie' ? 'Walkie-Talkie' : 'Realtime-Conference');
    const configPath = path.join(__dirname, '..', 'config.json');
    
    let appConfig = {};
    try {
      appConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch(e) {
      appConfig = { password: 'media', maxPeers: 6, appName: 'Church Intercom System' };
    }

    const expressApp = express();
    
    // Ensure certificates
    const certPath = path.join(appDir, 'cert.pem');
    const keyPath = path.join(appDir, 'key.pem');
    
    let key, cert;
    if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
      key = fs.readFileSync(keyPath);
      cert = fs.readFileSync(certPath);
    } else {
      // Fallback selfsigned
      const selfsigned = require('selfsigned');
      const pkey = selfsigned.generate([{ name: 'commonName', value: 'localhost' }], { days: 365 });
      key = pkey.private;
      cert = pkey.cert;
    }

    const options = { key, cert };
    activeServer = https.createServer(options, expressApp);

    if (mode === 'walkie') {
      activeIo = new Server(activeServer, { maxHttpBufferSize: 1e8 });
      let authUsers = {};

      expressApp.use(express.static(appDir));
      expressApp.get('/', (req, res) => res.sendFile(path.join(appDir, 'index.html')));
      expressApp.get('/config', (req, res) => res.json(appConfig));
      expressApp.get('/manifest.json', (req, res) => res.json({ name: appConfig.appName, start_url: '/', display: 'standalone' }));

      activeIo.on('connection', (socket) => {
        socket.on('login', (pass) => {
          if (pass === appConfig.password) {
            authUsers[socket.id] = true;
            socket.emit('login-success');
          } else {
            socket.emit('auth-error', 'Wrong Password');
          }
        });

        socket.on('voice', (audioBlob) => {
          if (authUsers[socket.id]) {
            socket.broadcast.emit('voice', audioBlob);
          }
        });

        socket.on('disconnect', () => {
          delete authUsers[socket.id];
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

      activeIo.on('connection', (socket) => {
        socket.on('login', (pass) => {
          if (pass !== appConfig.password) {
            socket.emit('auth-error', 'Wrong Password');
            return;
          }
          if (Object.keys(users).length >= (appConfig.maxPeers || 6)) {
            socket.emit('room-full');
            return;
          }
          users[socket.id] = socket.id;
          socket.emit('login-success', users);
        });

        socket.on('offer', data => users[socket.id] && socket.to(data.target).emit('offer', { sdp: data.sdp, caller: socket.id }));
        socket.on('answer', data => users[socket.id] && socket.to(data.target).emit('answer', { sdp: data.sdp, caller: socket.id }));
        socket.on('candidate', data => users[socket.id] && socket.to(data.target).emit('candidate', { candidate: data.candidate, caller: socket.id }));

        socket.on('disconnect', () => {
          if (users[socket.id]) {
            delete users[socket.id];
            socket.broadcast.emit('user-disconnected', socket.id);
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
