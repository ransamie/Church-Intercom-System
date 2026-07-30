<div align="center">
  <img src="logo.jpg" alt="Church Intercom Logo" width="200" />
</div>

# 📖 Church Intercom System: User Manual

**Secure, offline communication for media & technical teams by Ransamie Technologies (RanTech).**

The Church Intercom System provides a fast, zero-latency local network communication platform running on your church's Wi-Fi. It operates completely offline, ensuring security, low latency, and ease of use across all platforms (Windows, Mac, Linux, Android, iOS).

---

## ⚙️ Graphical Control Panel & Zero Configuration

No code editing or JSON configuration required! Everything is managed directly from the **Church Intercom Desktop Control Panel**:

* **One-Click Server Launch:** Start Walkie-Talkie or Realtime Conference mode with a single click.
* **Station Naming:** Team members select station labels (`Cam 1`, `Sound Desk`, `Director`, `Usher`) directly on their mobile login screen.
* **Live Roster Table:** Monitor connected operators, IP addresses, and audio status live on your host dashboard.
* **Auto-Renewing SSL:** Self-signed certificates auto-generate for 10 years without annual maintenance.

---

## 🖥️ PART 1: OPERATOR GUIDE (Host Laptop)

For the person responsible for running the intercom system during service.

### Step 1: Launch Host App
1. Install and open the **Church Intercom Host App** (`Church Intercom Setup 1.0.0.exe`).
2. Connect your Host Laptop to the Church Wi-Fi network.
3. **Sunday Best Practice (Fixed IP):** Configure a **DHCP Reservation** in your router for the host laptop (e.g., `192.168.1.50`). This keeps the exact same IP address and QR code every Sunday so mobile team members can open their PWA home screen shortcut without re-typing IP addresses.

### Step 2: Select Communication Mode
Click your desired mode inside the desktop application:

#### 📻 Mode 1: Walkie-Talkie (Push-to-Talk)
* **Best for:** Clear, structured directions ("Cam 1, prepare wide shot").
* **Pros:** Maximum stability, supports unlimited team members, ultra-low battery consumption.
* **Features:** Live speaker display broadcasts station names (`📢 BROADCASTING: Cam 1`) to all connected devices.

#### 🎧 Mode 2: Realtime Conference (Full-Duplex)
* **Best for:** Active, hands-free conversation between lead director, sound, and cameras.
* **Pros:** Simultaneous multi-way conversation (like a phone call).
* **Features:** Live peer roster grid showing active speakers and muted statuses in real-time.

---

## 📱 PART 2: TEAM MEMBER GUIDE

For Ushers, Camera Operators, Sound Engineers, and Visual Operators.

### 🚀 Connecting to the System
1. **Connect to Wi-Fi:** Ensure your smartphone is connected to the Church Media Wi-Fi.
2. **Scan QR Code or Open Link:** Scan the QR code displayed on the Host Laptop screen or enter the address (e.g. `https://192.168.1.50:3000`).
3. **Bypass Local Security Warning:**
   * **Android:** Tap *Advanced → Proceed to 192.168.x.x (unsafe)*.
   * **iPhone:** Tap *Show Details → Visit this website*.
4. **Choose Your Station:** Select your station position (`Cam 1`, `Cam 2`, `Sound Desk`, `Director`, `Visuals`, `Usher`) or enter a custom label, then log in.
5. **Install PWA App (One-Tap):** Tap **Install App** or *Add to Home Screen* in your mobile browser to save Church Intercom as a native app on your phone.

---

## ❓ TROUBLESHOOTING

1. **"I can't hear audio output!"**
   * Ensure Media Volume is turned up.
   * **iPhone users:** Flip the physical Silent Switch on the side of your iPhone to ON/Ringer.

2. **"Page won't load."**
   * Verify smartphone is connected to the same Wi-Fi network as the Host Laptop (cellular data/4G will not load local network servers).