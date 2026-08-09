import { Html5Qrcode } from 'html5-qrcode';

const btnScan = document.getElementById('btn-scan');
const btnCancelScan = document.getElementById('btn-cancel-scan');
const btnConnect = document.getElementById('btn-connect');
const ipInput = document.getElementById('ip-input');
const scannerScreen = document.getElementById('scanner-screen');
const connectionScreen = document.getElementById('connection-screen');

// Create toast container
const toastContainer = document.createElement('div');
toastContainer.className = 'toast-container';
document.body.appendChild(toastContainer);

function showToast(message, isError = false) {
  const toast = document.createElement('div');
  toast.className = `toast ${isError ? 'toast-error' : 'toast-success'}`;
  
  // Icon based on type
  const icon = isError 
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
  
  toast.innerHTML = `${icon}<span>${message}</span>`;
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 300); // Wait for fade out
  }, 3500);
}

let html5QrCode;

function connectToHost(ipAddress) {
  if (!ipAddress) return;
  // Clean up the input (remove http/https if user typed it)
  let cleanIp = ipAddress.replace(/https?:\/\//, '').replace(/\/$/, '');
  
  // If the user didn't specify a port, append :3000 (their desktop app default)
  if (!cleanIp.includes(':')) {
    cleanIp += ':3000';
  }
  
  // The user's Church Intercom.exe desktop app runs on port 3000 using HTTPS (self-signed).
  // Vite dev server uses HTTP. We will intelligently switch.
  const protocol = cleanIp.endsWith(':3000') ? 'https' : 'http';
  
  // By redirecting window.location, the Capacitor webview will load the actual intercom app from the local host!
  window.location.href = `${protocol}://${cleanIp}`;
}

btnConnect.addEventListener('click', () => {
  const ip = ipInput.value.trim();
  if (ip) {
    connectToHost(ip);
  } else {
    showToast("Please enter a valid IP address.", true);
  }
});

btnScan.addEventListener('click', () => {
  connectionScreen.classList.remove('active');
  scannerScreen.classList.add('active');

  html5QrCode = new Html5Qrcode("qr-reader");
  
  const qrCodeSuccessCallback = (decodedText, decodedResult) => {
    console.log(`Scan result: ${decodedText}`);
    stopScanner();
    connectToHost(decodedText);
  };
  
  const config = { fps: 10, qrbox: { width: 250, height: 250 } };

  // If we are on mobile, use the back camera
  html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback)
    .catch((err) => {
      console.error("Error starting scanner:", err);
      showToast("Could not access camera. Please check permissions.", true);
      stopScanner();
    });
});

function stopScanner() {
  if (html5QrCode) {
    html5QrCode.stop().then(() => {
      html5QrCode.clear();
      scannerScreen.classList.remove('active');
      connectionScreen.classList.add('active');
    }).catch(err => {
      console.error("Failed to stop scanner", err);
    });
  }
}

btnCancelScan.addEventListener('click', stopScanner);
