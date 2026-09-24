<div align="center">
  <img src="logo.jpg" alt="Church Intercom Logo" width="180" style="border-radius: 20px;" />
  <h1>Church Intercom System: User Manual & Operator Guide</h1>
  <p><strong>Secure, zero-latency, local-network audio coordination for church media and technical production teams.</strong></p>
  <p>
    <a href="https://github.com/ransamie/Church-Intercom-System/releases/tag/v1.0.14"><img src="https://img.shields.io/badge/version-1.0.14-blue.svg" alt="Version 1.0.14" /></a>
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License MIT" />
    <img src="https://img.shields.io/badge/platforms-Windows%20|%20macOS%20|%20Linux%20|%20Android%20|%20iOS-purple.svg" alt="Supported Platforms" />
    <img src="https://img.shields.io/badge/network-100%25%20Offline%20LAN-orange.svg" alt="100% Offline LAN" />
  </p>
</div>

---

## Table of Contents
1. [Overview & Architecture](#overview--architecture)
2. [What's New in v1.0.14](#whats-new-in-v1014)
3. [System Requirements & Platforms](#system-requirements--platforms)
4. [Host Operator Guide (Desktop Application)](#host-operator-guide-desktop-application)
   - [Installation Options](#installation-options)
   - [First-Launch Guidance (Windows & macOS)](#first-launch-guidance-windows--macos)
   - [Network Setup & Recommended Fixed IP](#network-setup--recommended-fixed-ip)
   - [Operating Modes](#operating-modes)
   - [Customizing Church Branding & Security](#customizing-church-branding--security)
   - [Over-The-Air (OTA) Web Client Updates](#over-the-air-ota-web-client-updates)
   - [Automated Desktop App Updates](#automated-desktop-app-updates)
5. [Team Member Guide (Mobile & Browser Users)](#team-member-guide-mobile--browser-users)
   - [Connecting via QR Code or Local IP](#connecting-via-qr-code-or-local-ip)
   - [Accepting Local SSL Certificates](#accepting-local-ssl-certificates)
   - [Selecting Station Roles](#selecting-station-roles)
   - [In-Call Interface & Controls](#in-call-interface--controls)
   - [Installing as a PWA or Android APK](#installing-as-a-pwa-or-android-apk)
6. [Network Administration & Best Practices](#network-administration--best-practices)
7. [Troubleshooting FAQ](#troubleshooting-faq)
8. [License & Credits](#license--credits)

---

## Overview & Architecture

The Church Intercom System provides dedicated, full-duplex and push-to-talk voice communication running entirely over your church's local Wi-Fi router. 

### Why Local Network?
* **Zero Internet Dependency:** Service goes on uninterrupted even if external internet drops.
* **Ultra-Low Latency:** Audio packets route directly within the local network switch or router (typically under 20ms).
* **Complete Privacy:** No cloud audio relays, no external servers, and zero telemetry data collection.
* **Cross-Device Compatibility:** Works on Windows, macOS, Linux, Android smartphones, iPhones, and iPads without requiring every volunteer to create accounts.

---

## What's New in v1.0.14

* **In-Call Church Logo & Identity:** The church logo (`/logo.jpg`) and church name are dynamically displayed inside the live call interface header across both Walkie-Talkie and Realtime Conference modes.
* **100% Vector SVG Icons:** Replaced all unicode emojis across the entire UI with crisp, scalable vector SVG icons for buttons, presets, toggles, and status badges.
* **Dual Windows Distributions:** 
  * **Portable (`Church.Intercom.1.0.14.exe`):** Instant standalone executable that launches with zero installation or administrative rights.
  * **Setup Installer (`Church.Intercom.Setup.1.0.14.exe`):** Traditional installer wizard creating Start Menu and Desktop shortcuts.
* **User-Level Execution (`asInvoker`):** Windows builds run strictly within user space, eliminating unnecessary administrative privilege elevation and reducing security prompts.
* **Over-The-Air (OTA) Web Sync:** Built-in web client updater allows host operators to download the latest mobile web interfaces directly from GitHub with a single click, without reinstalling the desktop host software.
* **Automated Desktop Updates:** Automated GitHub release checks notify operators when new desktop builds are ready to install.
* **Cross-Platform Release Automation:** GitHub Actions CI pipeline builds Windows (Setup + Portable), macOS DMG, Linux AppImage, and Android APK packages concurrently.

---

## System Requirements & Platforms

| Platform | Format | How It Runs |
| :--- | :--- | :--- |
| **Windows (Host PC)** | `.exe` (Setup or Portable) | Windows 10 or Windows 11 (64-bit) |
| **macOS (Host PC)** | `.dmg` | macOS 11 Big Sur or newer (Apple Silicon & Intel) |
| **Linux (Host PC)** | `.AppImage` | Ubuntu, Debian, Fedora, Arch, Mint (64-bit) |
| **Android (Team Mobile)** | Browser / PWA / `.apk` | Android 8.0+ (Chrome, Firefox, Edge, or native APK) |
| **iOS / iPadOS (Team Mobile)** | Browser / PWA | iOS 14.3+ (Safari recommended for PWA installation) |

---

## Host Operator Guide (Desktop Application)

The host computer acts as the local coordination server during your service.

### Installation Options

#### Windows
1. **Portable Edition (Recommended for quick deployment):**
   * Download `Church.Intercom.1.0.14.exe`.
   * Place it on your Desktop, Documents folder, or a USB flash drive.
   * Double-click to launch immediately. No installation wizard required.
2. **Setup Wizard Edition (Recommended for permanent workstations):**
   * Download `Church.Intercom.Setup.1.0.14.exe`.
   * Run the installer to create Start Menu and Desktop shortcuts.

#### macOS
1. Download `Church.Intercom-1.0.14-arm64.dmg`.
2. Double-click to mount the disk image.
3. Drag **Church Intercom** into your `Applications` folder, or run it directly from the disk image.

#### Linux
1. Download `Church.Intercom-1.0.14.AppImage`.
2. Make the file executable:
   ```bash
   chmod +x Church.Intercom-1.0.14.AppImage
   ./Church.Intercom-1.0.14.AppImage
   ```

---

### First-Launch Guidance (Windows & macOS)

Because Church Intercom is an open-source tool developed for church media teams without a commercial enterprise signing certificate, your operating system may ask for verification on the first run:

* **Windows SmartScreen:** Click **More info** &rarr; **Run anyway**.
* **Windows 11 Smart App Control:** Right-click the `.exe` &rarr; select **Properties** &rarr; check the **Unblock** box at the bottom &rarr; click **Apply** &rarr; launch the app.
* **macOS Gatekeeper:** Right-click `Church Intercom.app` &rarr; select **Open** &rarr; click **Open** on the confirmation dialog.

---

### Network Setup & Recommended Fixed IP

1. **Connect Host Laptop to Wi-Fi:** Ensure your host computer is connected to the same Wi-Fi router that operators and team members will connect to.
2. **Configure DHCP Reservation (Best Practice):**
   * Log into your church Wi-Fi router admin page.
   * Assign a **DHCP Reservation / Static Lease** to the host laptop's MAC address (for example: `192.168.1.50`).
   * **Why this matters:** When the host laptop keeps the same IP address each week, mobile operators never have to scan a new QR code or type a new URL. Their saved home screen app shortcut will connect automatically every Sunday.

---

### Operating Modes

The host control panel allows one-click switching between two modes:

#### 1. Walkie-Talkie Mode (Push-to-Talk)
* **Best for:** Structured direction from directors to cameras, ushers, and stage coordinators.
* **Capacity:** Unlimited simultaneous mobile listeners.
* **Audio Behavior:** Half-duplex push-to-talk. When an operator holds the talk button, their station name is prominently broadcast to all connected devices.
* **Bandwidth:** Extremely light network overhead.

#### 2. Realtime Conference Mode (Full-Duplex)
* **Best for:** Continuous, hands-free conversation between sound engineers, lead directors, and primary camera operators.
* **Capacity:** Up to 6 simultaneous active full-duplex participants.
* **Audio Behavior:** Continuous open-mic or toggle mute with live audio wave indicators around active speakers.

---

### Customizing Church Branding & Security

Open **Settings** inside the desktop control panel:
1. **Church Name:** Customize your church or ministry name (e.g. *Refiner's House Revival Outreach*).
2. **Church Logo:** Place your custom logo at `logo.jpg` in the project root or configure it in settings. The logo automatically renders on:
   * The desktop host control panel.
   * Mobile operator login screens.
   * Active call interface headers.
3. **Primary Accent Color:** Select a brand color (hex code or picker) to theme buttons, badges, and active state highlights.
4. **Access Password:** Set a room password to ensure only authorized volunteers on the Wi-Fi network can join audio feeds.

---

### Over-The-Air (OTA) Web Client Updates

You do not need to reinstall or download a new desktop package when web client improvements or styling changes are made:
1. Open **Settings** in the desktop control panel.
2. Under **Web Interfaces (OTA Sync)**, click **Sync Now**.
3. The host app fetches the latest `Walkie-Talkie` and `Realtime-Conference` HTML, CSS, and JavaScript files directly from the master GitHub repository.
4. Mobile clients automatically receive the latest interface on their next page load or app launch.

---

### Automated Desktop App Updates

When a new desktop installer release is published on GitHub:
* An **Update Available** badge will appear in the top-right header of the desktop host app.
* Clicking the badge opens the update window displaying the release notes, new version number, and a direct download button.

---

## Team Member Guide (Mobile & Browser Users)

For Camera Operators, Sound Engineers, Stage Directors, Visuals, and Ushers.

### Connecting via QR Code or Local IP
1. **Connect to Church Wi-Fi:** Ensure your smartphone is connected to the church production Wi-Fi network (not cellular 4G/5G data).
2. **Scan the Host QR Code:** Open your phone camera and scan the large QR code displayed on the host laptop screen.
3. **Alternatively, enter the URL:** Type the address shown on the host screen into your mobile browser (e.g., `https://192.168.1.50:3000`).

---

### Accepting Local SSL Certificates

Browsers require an HTTPS secure context to allow microphone access. Church Intercom automatically provisions a 10-year self-signed local certificate. Because this certificate is generated locally for your church router rather than purchased from a public domain authority, your browser will display a one-time security warning:

* **Android (Google Chrome / Brave / Edge):**
  1. Tap **Advanced**.
  2. Tap **Proceed to 192.168.x.x (unsafe)**.
* **iPhone / iPad (Safari):**
  1. Tap **Show Details**.
  2. Tap **visit this website**.
  3. Confirm by tapping **Visit Website**.

*This prompt only appears once per browser profile on your local Wi-Fi.*

---

### Selecting Station Roles

On the login screen:
1. Tap your station preset button:
   * **Cam 1** / **Cam 2** (Camera Operators)
   * **Sound Desk** (FOH / Audio Engineers)
   * **Director** (Media Director / Producer)
   * **Visuals** (ProPresenter / Slides Operator)
   * **Usher** (Auditorium & Floor Coordinators)
   * **Custom Station** (Type any custom label)
2. Enter the room password (if configured by the host operator).
3. Tap **Connect & Enter Intercom**.

---

### In-Call Interface & Controls

* **Church Brand Header:** Confirms your connected church name, station badge, and active status.
* **Walkie-Talkie Operation:** Press and hold the circular talk button to speak; release to listen. The live speaker banner indicates who currently holds the channel.
* **Conference Operation:** Tap the microphone icon to mute or unmute. Green pulsing waveform borders identify team members currently speaking.
* **Audio Output:** Use wired or Bluetooth headphones for optimal clarity and zero feedback.

---

### Installing as a PWA or Android APK

#### Progressive Web App (PWA)
1. **iOS (Safari):** Tap the **Share** button at the bottom of Safari &rarr; select **Add to Home Screen** &rarr; tap **Add**.
2. **Android (Chrome):** Tap the menu icon (three dots) &rarr; select **Add to Home Screen** or **Install App**.
3. Launching from your home screen opens Church Intercom in distraction-free, fullscreen standalone mode.

#### Native Android APK
* An installable APK package (`church-intercom-android.apk`) is also available from the [GitHub Releases](https://github.com/ransamie/Church-Intercom-System/releases) page for venues that prefer native app installation across managed Android devices.

---

## Network Administration & Best Practices

1. **Disable AP / Client Isolation on the Wi-Fi Router:**
   * Many guest Wi-Fi networks have "AP Isolation" or "Client Isolation" turned ON by default to prevent devices from communicating with one another.
   * **Action:** Ensure production team devices are connected to a private SSID or VLAN where **Client Isolation is DISABLED**.
2. **Firewall Rules on Host PC:**
   * If mobile devices cannot reach the host IP, ensure the Windows Defender Firewall or macOS Application Firewall allows inbound traffic on port `3000` (TCP).
3. **Use 5 GHz Wi-Fi:**
   * In crowded sanctuaries with hundreds of attendees carrying mobile devices, 2.4 GHz Wi-Fi can suffer packet contention. Running the intercom on a dedicated 5 GHz production network ensures zero packet loss and instant audio delivery.

---

## Troubleshooting FAQ

### Audio & Microphone Issues

**Q: I cannot hear other operators speaking.**
* **iPhone Users:** Ensure the physical **Silent Switch** on the side of your iPhone is set to ring (orange line hidden). On iOS, Safari web audio can be silenced when the phone is on silent mode.
* **Volume Check:** Verify your device media volume (not ringer volume) is raised.
* **Bluetooth Headset:** Confirm your Bluetooth headset is connected and selected as the audio output device.

**Q: The microphone does not activate or push-to-talk fails.**
* Check browser settings: Ensure microphone permission was set to **Allow**.
* If permission was previously denied, tap the lock/settings icon next to the address bar, reset permissions, and refresh the page.

---

### Network & Connection Issues

**Q: The page says "This site can't be reached" or connection times out.**
* Verify your phone is on the **Church Wi-Fi network** and not running on mobile data (4G/5G).
* Verify the IP address typed in your browser matches the IP address currently displayed on the desktop host control panel.
* Verify that the router does not have **Client Isolation** enabled.

**Q: The QR code or IP address changes every time the laptop is rebooted.**
* Configure a DHCP Reservation for the host laptop in your router settings. See [Network Setup & Recommended Fixed IP](#network-setup--recommended-fixed-ip).

---

## License & Credits

* **Developed by:** Ransamie Technologies (RanTech)
* **License:** [MIT License](LICENSE)
* **Repository:** [https://github.com/ransamie/Church-Intercom-System](https://github.com/ransamie/Church-Intercom-System)
* **Releases & Downloads:** [https://github.com/ransamie/Church-Intercom-System/releases](https://github.com/ransamie/Church-Intercom-System/releases)