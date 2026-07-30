const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');
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

// FIX: Use process.cwd() for certs so the .exe finds them safely
const options = {
  key: fs.readFileSync(path.join(process.cwd(), 'key.pem')),
  cert: fs.readFileSync(path.join(process.cwd(), 'cert.pem'))
};

const server = https.createServer(options, app);
const io = new Server(server, {
    maxHttpBufferSize: 1e8 // Allow larger audio files (100MB)
});

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'index.html'));
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
        "src": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwN2JmZiIvPjx0ZXh0IHg9IjUwIiB5PSI2MCIgZm9udC1zaXplPSI1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPkNJPC90ZXh0Pjwvc3ZnPg==",
        "sizes": "192x192",
        "type": "image/svg+xml"
      }
    ]
  });
});

// Store authenticated users
let authenticatedUsers = {};

io.on('connection', (socket) => {
    console.log('New device connected: ' + socket.id);

    // 1. LISTEN FOR PASSWORD
    socket.on('login', (password) => {
        if (password === TEAM_PASSWORD) {
            authenticatedUsers[socket.id] = true;
            socket.emit('login-success');
            console.log(`Device Authenticated: ${socket.id}`);
        } else {
            socket.emit('auth-error', 'Wrong Password');
        }
    });

    // 2. LISTEN FOR AUDIO (Walkie-Talkie Mode)
    socket.on('voice', (audioBlob) => {
        if (authenticatedUsers[socket.id]) {
            socket.broadcast.emit('voice', audioBlob);
        }
    });

    socket.on('disconnect', () => {
        delete authenticatedUsers[socket.id];
    });
});

// --- THIS WAS MISSING: THE SMART IP FUNCTION ---
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  const results = [];

  for (const name of Object.keys(interfaces)) {
      for (const net of interfaces[name]) {
          // Skip internal (localhost) and non-IPv4 addresses
          if (net.family === 'IPv4' && !net.internal) {
              // Prefer 192.168.x.x or 10.x.x.x
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

// Start Server
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
  console.log('Keep this window OPEN to keep the system running.');
  console.log('Press Ctrl+C to stop.');
});