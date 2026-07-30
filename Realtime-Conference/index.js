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
const MAX_PEERS = appConfig.maxPeers || 6;
// ---------------------

function ensureCerts() {
  const keyPath = path.join(__dirname, 'key.pem');
  const certPath = path.join(__dirname, 'cert.pem');

  let needGen = false;
  if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
    needGen = true;
  } else {
    try {
      const certStat = fs.statSync(certPath);
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
const io = new Server(server);

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

// Store authenticated users: socket.id -> { id, stationName, ip }
let users = {};

function broadcastRoster() {
  io.emit('roster-update', Object.values(users));
}

io.on('connection', (socket) => {
    const clientIp = socket.handshake.address.replace('::ffff:', '');
    
    // 1. LOGIN HANDLING
    socket.on('login', (data) => {
        let password = typeof data === 'string' ? data : data.password;
        let stationName = typeof data === 'object' && data.stationName ? data.stationName : 'Station Device';

        if (password !== TEAM_PASSWORD) {
            socket.emit('auth-error', 'Wrong Password');
            return;
        }

        if (Object.keys(users).length >= MAX_PEERS) {
            socket.emit('room-full');
            return;
        }

        // Auth Success
        users[socket.id] = {
          id: socket.id,
          stationName: stationName,
          ip: clientIp
        };

        socket.emit('login-success', {
          selfId: socket.id,
          stationName: stationName,
          peers: users
        });

        socket.broadcast.emit('user-joined', {
          id: socket.id,
          stationName: stationName,
          ip: clientIp
        });

        console.log(`User Logged In: ${stationName} (${clientIp}). Total: ${Object.keys(users).length}`);
        broadcastRoster();
    });

    // 2. SIGNALING (Relaying WebRTC SDP/ICE between phones)
    socket.on('offer', (data) => {
        if (users[socket.id]) {
            socket.to(data.target).emit('offer', { sdp: data.sdp, caller: socket.id, stationName: users[socket.id].stationName });
        }
    });

    socket.on('answer', (data) => {
        if (users[socket.id]) {
            socket.to(data.target).emit('answer', { sdp: data.sdp, caller: socket.id, stationName: users[socket.id].stationName });
        }
    });

    socket.on('candidate', (data) => {
        if (users[socket.id]) {
            socket.to(data.target).emit('candidate', { candidate: data.candidate, caller: socket.id });
        }
    });

    socket.on('speaking-state', (isSpeaking) => {
      if (users[socket.id]) {
        users[socket.id].isSpeaking = isSpeaking;
        io.emit('speaking-state-update', { id: socket.id, stationName: users[socket.id].stationName, isSpeaking });
      }
    });

    socket.on('disconnect', () => {
        if (users[socket.id]) {
            delete users[socket.id];
            socket.broadcast.emit('user-disconnected', socket.id);
            broadcastRoster();
        }
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
  console.log('    CHURCH INTERCOM SYSTEM - REALTIME CONFERENCE   ');
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