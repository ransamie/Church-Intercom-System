const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');
const selfsigned = require('selfsigned');
const app = express();
const { Server } = require("socket.io");

// --- CONFIGURATION ---
const configPath = path.join(__dirname, '..', 'config.json');
let appConfig = {};
try {
  appConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (err) {
  console.error("Could not read config.json, using defaults.");
  appConfig = { password: "media", maxPeers: 6, appName: "Church Intercom System", theme: { primaryColor: "#007bff", backgroundColor: "#1a1a1a" } };
}
const TEAM_PASSWORD = appConfig.password;
// ---------------------

// Ensure 10-Year Valid Auto-Renewing SSL Certificates
function ensureCerts() {
  const keyPath = path.join(__dirname, 'key.pem');
  const certPath = path.join(__dirname, 'cert.pem');

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
    console.log("Generating 10-Year Auto-Renewing SSL Certificate...");
    const attrs = [{ name: 'commonName', value: 'ChurchIntercom' }];
    const pkey = selfsigned.generate(attrs, { days: 3650 }); // 10 Years
    fs.writeFileSync(keyPath, pkey.private);
    fs.writeFileSync(certPath, pkey.cert);
  }

  return {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  };
}

const options = ensureCerts();
const server = https.createServer(options, app);
const io = new Server(server, {
    maxHttpBufferSize: 1e8 // Allow larger audio files (100MB)
});

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/config', (req, res) => {
  res.json(appConfig);
});

app.get('/manifest.json', (req, res) => {
  res.json({
    "name": appConfig.appName,
    "short_name": appConfig.appName,
    "start_url": "/",
    "display": "standalone",
    "background_color": appConfig.theme.backgroundColor || "#1a1a1a",
    "theme_color": appConfig.theme.primaryColor || "#007bff",
    "icons": [
      {
        "src": "logo.jpg",
        "sizes": "192x192",
        "type": "image/jpeg"
      }
    ]
  });
});

// Store authenticated users: socket.id -> { stationName, ip }
let authenticatedUsers = {};

function broadcastRoster() {
  const roster = Object.values(authenticatedUsers).map(u => ({
    stationName: u.stationName,
    ip: u.ip
  }));
  io.emit('roster-update', roster);
}

io.on('connection', (socket) => {
    const clientIp = socket.handshake.address.replace('::ffff:', '');
    console.log(`New device connected: ${socket.id} (${clientIp})`);

    // 1. LISTEN FOR LOGIN WITH PASSWORD & STATION NAME
    socket.on('login', (data) => {
        let password = typeof data === 'string' ? data : data.password;
        let stationName = typeof data === 'object' && data.stationName ? data.stationName : 'Station Device';

        if (password === TEAM_PASSWORD) {
            authenticatedUsers[socket.id] = {
              stationName: stationName,
              ip: clientIp
            };
            socket.emit('login-success', { stationName: stationName });
            console.log(`Device Authenticated: ${stationName} (${clientIp})`);
            broadcastRoster();
        } else {
            socket.emit('auth-error', 'Wrong Password');
        }
    });

    // 2. LISTEN FOR SPEAKING START / STOP
    socket.on('speaking-start', () => {
      const user = authenticatedUsers[socket.id];
      if (user) {
        io.emit('speaker-active', { stationName: user.stationName });
      }
    });

    socket.on('speaking-stop', () => {
      io.emit('speaker-idle');
    });

    // 3. LISTEN FOR AUDIO
    socket.on('voice', (audioBlob) => {
        const user = authenticatedUsers[socket.id];
        if (user) {
            socket.broadcast.emit('voice', {
              audioBlob: audioBlob,
              stationName: user.stationName
            });
        }
    });

    socket.on('disconnect', () => {
        delete authenticatedUsers[socket.id];
        broadcastRoster();
        io.emit('speaker-idle');
    });
});

function getLocalIp() {
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

server.listen(3000, '0.0.0.0', () => {
  const ips = getLocalIp();
  
  console.log('\n===================================================');
  console.log('      CHURCH INTERCOM SYSTEM - WALKIE-TALKIE      ');
  console.log('===================================================');
  console.log('\nShare this link with the media team:');
  
  if (ips.length > 0) {
      console.log(`\n👉  https://${ips[0]}:3000`);
      if (ips.length > 1) {
          console.log('\n(Or try these if the above fails):');
          ips.slice(1).forEach(ip => {
              console.log(`    https://${ip}:3000`);
          });
      }
  } else {
      console.log('\n[!] Could not detect WiFi. connecting to localhost only.');
  }

  console.log('\n===================================================');
});