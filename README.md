<div align="center">
  <img src="logo.jpg" alt="Church Intercom Logo" width="200" />
</div>

# 📖 Church Intercom System: User Manual

**Secure, offline communication for media & technical teams by Ransamie Technologies (RanTech).**

The Church Intercom System provides a fast, local network-based communication platform that runs on your church's Wi-Fi. It operates completely offline, ensuring security, low latency, and ease of use. It is highly customizable and works across all platforms (Windows, Mac, Linux, Android, iOS).

---

## ⚙️ Customization

The system is highly customizable without needing to change any code. 

Open `config.json` in the root folder to configure your system:

```json
{
  "appName": "Church Intercom System",
  "appDescription": "Secure audio relay and communication system for media teams.",
  "password": "media",
  "maxPeers": 6,
  "theme": {
    "primaryColor": "#007bff",
    "secondaryColor": "#0056b3",
    "backgroundColor": "#1a1a1a",
    "textColor": "#ffffff",
    "successColor": "#2ecc71",
    "dangerColor": "#ff4444"
  }
}
```

* **`appName`**: Changes the title displayed on the intercom screen.
* **`password`**: Set the team password required to connect.
* **`maxPeers`**: (Realtime Mode Only) Sets the maximum number of people in the call.
* **`theme`**: Change colors to match your church's branding.

---

## 🖥️ PART 1: OPERATOR GUIDE (Host Laptop)

For the person responsible for setting up the server before the service starts.

### Step 1: Requirements & Network Setup
* Install [Node.js](https://nodejs.org/).
* Ensure the Host Laptop is connected to the Church WiFi or a Mobile Hotspot.
* **Crucial:** Ensure all team members connect their phones to this exact same WiFi network.

### Step 2: Choose Your Mode
You have two modes available. Choose the folder that fits today's need:

#### 📁 Mode 1: Walkie-Talkie (Recommended for Stability)
* **Best for:** Simple instructions ("Camera 1, zoom in").
* **Pros:** Very stable, supports many users, uses very little battery.
* **Cons:** Only one person can talk at a time.

#### 📁 Mode 2: Realtime System (Recommended for Conversation)
* **Best for:** Active coordination where everyone talks at once.
* **Pros:** Full conversation (like a phone call), hands-free.
* **Cons:** Maximum users controlled by `maxPeers`. Requires a strong WiFi connection.

### Step 3: Install Dependencies
Open a terminal inside the mode folder you selected and run:
```bash
npm install
```

### Step 4: Launch the System
* **On Windows:** Double-click `START_SERVER.bat` inside your chosen folder.
* **On Mac / Linux:** Open terminal in the folder and run `bash start.sh` or `npm start`.

A window will open and display a secure link (e.g., `https://192.168.x.x:3000`). Share this link with the team.

---

## 📱 PART 2: TEAM MEMBER GUIDE

For Ushers, Camera Operators, and Sound Technicians.

### 🚀 Getting Connected (Everyone)

1. **Connect to WiFi:** Make sure you are on the specific Church Media WiFi.
2. **Open Browser:** Use Chrome (Android) or Safari (iPhone).
3. **Type the Link:** Enter the numbers displayed on the Host Laptop screen exactly.

> **⚠️ The Security Warning:**
> You will see a warning ("Connection not private"). This is normal because it runs offline.
> * **Android:** Click `Advanced -> Proceed (unsafe)`.
> * **iPhone:** Click `Show Details -> visit this website`.

4. **Login:** Enter the Team Password.
5. **Install as Mobile App (Optional):** Once connected, click the **"⬇️ Install App"** button at the bottom of the screen. This will add the intercom to your phone's home screen as a native application for quick access!

### 🟢 IF USING "WALKIE-TALKIE" MODE
* **To Speak:** Press and HOLD the big button.
* **Wait:** Wait 1 second after pressing before you speak.
* **Talk:** Speak clearly. (Button turns Red/Transmitting).
* **To Listen:** Release the button. Your message sends instantly.

### 🔵 IF USING "REALTIME SYSTEM" MODE
* **Join:** Click the green "JOIN AUDIO CHANNEL" button.
* **Permissions:** Click "Allow" for the microphone.
* **Muting Rules:** Please keep your mic MUTED (Red) unless you are speaking to reduce background noise. Tap to Mute/Unmute.

---

## ❓ TROUBLESHOOTING

1. **"I can't hear anything!"**
   * Check Volume: Ensure "Media Volume" is up.
   * iPhone: Turn off the Silent Switch (side of phone).

2. **"The page won't load."**
   * Check WiFi: Are you on the same network as the laptop? (Data/4G will NOT work).
   * Check Spelling: Did you type `https://`? Did you add `:3000` at the end?

3. **"Channel Full" (Realtime Mode only)**
   * The Realtime system is limited by the config (default 6). Ask the operator to use the Walkie-Talkie folder instead, which supports everyone.