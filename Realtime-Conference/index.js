const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express();
const { Server } = require("socket.io");
const path = require('path');
const os = require('os');

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
const MAX_PEERS = appConfig.maxPeers;
// ---------------------

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

const server = https.createServer(options, app);
const io = new Server(server);

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
let users = {};

io.on('connection', (socket) => {
    
    // 1. LOGIN HANDLING
    socket.on('login', (password) => {
        if (password !== TEAM_PASSWORD) {
            socket.emit('auth-error', 'Wrong Password');
            return;
        }

        if (Object.keys(users).length >= MAX_PEERS) {
            socket.emit('room-full');
            return;
        }

        // Auth Success
        users[socket.id] = socket.id;
        socket.emit('login-success', users); // Send list of existing peers
        console.log(`User Logged In. Total: ${Object.keys(users).length}`);
    });

    // 2. SIGNALING (Relaying data between phones)
    socket.on('offer', (data) => {
        if (users[socket.id]) {
            socket.to(data.target).emit('offer', { sdp: data.sdp, caller: socket.id });
        }
    });

    socket.on('answer', (data) => {
        if (users[socket.id]) {
            socket.to(data.target).emit('answer', { sdp: data.sdp, caller: socket.id });
        }
    });

    socket.on('candidate', (data) => {
        if (users[socket.id]) {
            socket.to(data.target).emit('candidate', { candidate: data.candidate, caller: socket.id });
        }
    });

    socket.on('disconnect', () => {
        if (users[socket.id]) {
            delete users[socket.id];
            socket.broadcast.emit('user-disconnected', socket.id);
        }
    });
});
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  const results = [];

  for (const name of Object.keys(interfaces)) {
      for (const net of interfaces[name]) {
          // Skip internal (localhost) and non-IPv4 addresses
          if (net.family === 'IPv4' && !net.internal) {
              // We prefer addresses that look like standard WiFi/LAN (192.168.x.x or 10.x.x.x)
              if (net.address.startsWith('192.168.') || net.address.startsWith('10.')) {
                  results.unshift(net.address); // Put preferred IPs at the top
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
      // Print the most likely IP first
      console.log(`\n👉  https://${ips[0]}:3000`);
      
      // If there are other IPs (like Hotspots/VMs), list them just in case
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