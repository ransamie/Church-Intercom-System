import React, { useState } from 'react';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('walkie');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [customName, setCustomName] = useState('Grace Community Church Intercom');
  const [selectedTheme, setSelectedTheme] = useState('blue');
  const [expandedVersion, setExpandedVersion] = useState(null);

  const themes = {
    blue: { primary: '#007bff', secondary: '#0056b3', bg: '#0d0d12' },
    emerald: { primary: '#10b981', secondary: '#059669', bg: '#062016' },
    purple: { primary: '#8b5cf6', secondary: '#6d28d9', bg: '#130c25' },
    amber: { primary: '#f59e0b', secondary: '#d97706', bg: '#1f1504' }
  };

  const currentTheme = themes[selectedTheme];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app-root">
      <div className="bg-glow"></div>
      
      {/* HEADER */}
      <header>
        <div className="logo">
          <img src="/logo.jpg" alt="Church Intercom Logo" className="logo-icon-img" />
          <span className="logo-text">Church Intercom</span>
        </div>
        <div className="header-nav">
          <button className="nav-link-btn" onClick={() => scrollToSection('features')}>
            Features
          </button>
          <button className="nav-download-btn" onClick={() => scrollToSection('download')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            Download
          </button>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="hero">
          <div className="badge">⚡ 100% Offline & Free Open Source</div>
          <h1>Seamless Audio Coordination for Your Media Team.</h1>
          <p>
            An instant, zero-latency local network intercom designed for church sound engineers, 
            camera operators, and ushers. No internet required.
          </p>
          <div className="cta-group">
            <button 
              onClick={() => scrollToSection('download')} 
              className="btn-primary"
            >
              📥 Download Desktop App
            </button>
            <a 
              href="https://github.com/ransamie/Church-Intercom-System#readme" 
              target="_blank" 
              rel="noreferrer" 
              className="btn-secondary"
            >
              📖 User Manual & Setup
            </a>
          </div>
        </section>

        {/* INTERACTIVE DEMO SIMULATOR */}
        <section id="features" className="demo-section">
          <div className="section-header">
            <h2>Interactive Simulator</h2>
            <p>Try out how both communication modes feel in action right now</p>
          </div>

          <div className="simulator-card">
            <div className="sim-tabs">
              <button 
                className={`sim-tab ${activeTab === 'walkie' ? 'active' : ''}`} 
                onClick={() => setActiveTab('walkie')}
              >
                📻 Walkie-Talkie Mode
              </button>
              <button 
                className={`sim-tab ${activeTab === 'realtime' ? 'active' : ''}`} 
                onClick={() => setActiveTab('realtime')}
              >
                🎧 Realtime Conference
              </button>
            </div>

            <div className="sim-screen">
              {activeTab === 'walkie' ? (
                <div className="walkie-sim">
                  <p className="sim-status">
                    Status: <span className={isTransmitting ? 'text-danger' : 'text-success'}>
                      {isTransmitting ? '🔴 TRANSMITTING VOICE (Cam 1)' : '🟢 Online & Ready (Hold to Speak)'}
                    </span>
                  </p>

                  <div className="sim-talk-wrapper">
                    <button 
                      className={`sim-talk-btn ${isTransmitting ? 'transmitting' : ''}`}
                      onMouseDown={() => setIsTransmitting(true)}
                      onMouseUp={() => setIsTransmitting(false)}
                      onMouseLeave={() => setIsTransmitting(false)}
                      onTouchStart={() => setIsTransmitting(true)}
                      onTouchEnd={() => setIsTransmitting(false)}
                    >
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                      </svg>
                      <span>{isTransmitting ? 'TRANSMITTING' : 'HOLD TO TALK'}</span>
                    </button>
                  </div>
                  <p className="sim-hint">Simulating "Push-to-Talk" mode (One person speaks at a time to all media staff)</p>
                </div>
              ) : (
                <div className="realtime-sim">
                  <p className="sim-status">
                    Status: <span className={isMuted ? 'text-muted' : 'text-success'}>
                      {isMuted ? '🔇 Mic Muted (Listening Mode)' : '🎙️ Mic Live (Speaking to Team)'}
                    </span>
                  </p>

                  <div className="peers-list">
                    <div className="peer-chip speaking">
                      <span className="dot"></span> Cam 1 (You)
                    </div>
                    <div className="peer-chip active">
                      <span className="dot"></span> Sound Desk
                    </div>
                    <div className="peer-chip active">
                      <span className="dot"></span> Director
                    </div>
                    <div className="peer-chip active">
                      <span className="dot"></span> Usher 1
                    </div>
                  </div>

                  <button 
                    className={`sim-mute-btn ${isMuted ? 'muted' : 'live'}`}
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? '🎙️ Tap to Unmute Mic' : '🔇 Tap to Mute Mic'}
                  </button>
                  <p className="sim-hint">Simulating Full-Duplex Conference (Up to 6 team members speaking live together)</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FEATURE HIGHLIGHTS */}
        <section className="features-grid-section">
          <div className="section-header">
            <h2>Built Specifically for Church Technical Teams</h2>
            <p>Simple, reliable, and completely independent of external internet speed</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Zero Latency Wi-Fi</h3>
              <p>Communicates over your local router with WebSockets and WebRTC for instant, crystal-clear voice.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📲</div>
              <h3>No App Store Needed (PWA)</h3>
              <p>Operators scan a single QR code on their phone browser and add it directly to their home screen.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏷️</div>
              <h3>Station Naming</h3>
              <p>Label positions like <strong>Cam 1</strong>, <strong>Sound Desk</strong>, or <strong>Director</strong> so everyone knows who is speaking.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">☀️</div>
              <h3>Screen Wake-Lock</h3>
              <p>Built-in Web Wake-Lock keeps phone screens active so audio input is never suspended during service.</p>
            </div>
          </div>
        </section>

        {/* DEDICATED DOWNLOAD SECTION (MATCHING SCREENSHOT) */}
        <section id="download" className="download-section">
          <div className="download-header">
            <h2>Download <span className="gradient-text">Church Intercom</span></h2>
            <p className="download-subtitle">Free and open source. Available for every major platform.</p>
          </div>

          <div className="download-main-card">
            <div className="release-top-bar">
              <div className="release-tag-group">
                <span className="latest-badge">LATEST</span>
                <span className="version-number">v1.0.0</span>
                <span className="release-date">Released 30 July 2026</span>
              </div>
              <a 
                href="https://github.com/ransamie/Church-Intercom-System/releases" 
                target="_blank" 
                rel="noreferrer" 
                className="github-release-link"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                View on GitHub ↗
              </a>
            </div>

            <p className="build-description">The most recent stable build — recommended for all users.</p>

            <div className="platforms-grid">
              {/* WINDOWS */}
              <a 
                href="https://github.com/ransamie/Church-Intercom-System/releases/download/v1.0.0/Church-Intercom-Setup-1.0.0.exe" 
                className="platform-card"
                download
              >
                <div className="platform-icon windows">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 3.449L9.75 2.1v9.451H0m0 1.35h9.75V22.4L0 20.951M11.1 1.912L24 0v11.451H11.1m0 1.35H24V24l-12.9-1.912"/>
                  </svg>
                </div>
                <div className="platform-info">
                  <div className="platform-name">Windows</div>
                  <div className="platform-format">.exe Installer</div>
                  <div className="platform-size">154 MB</div>
                </div>
                <div className="download-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                  </svg>
                </div>
              </a>

              {/* MACOS */}
              <a 
                href="https://github.com/ransamie/Church-Intercom-System/releases/download/v1.0.0/Church-Intercom-1.0.0-arm64.dmg" 
                className="platform-card"
                download
              >
                <div className="platform-icon macos">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.8 1.11-1.92.99-3.04-.95.04-2.11.64-2.79 1.44-.61.71-1.14 1.86-1 2.97 1.07.08 2.14-.57 2.8-1.37z"/>
                  </svg>
                </div>
                <div className="platform-info">
                  <div className="platform-name">macOS</div>
                  <div className="platform-format">.dmg (Apple Silicon / Intel)</div>
                  <div className="platform-size">156 MB</div>
                </div>
                <div className="download-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                  </svg>
                </div>
              </a>

              {/* LINUX */}
              <a 
                href="https://github.com/ransamie/Church-Intercom-System/releases/download/v1.0.0/Church-Intercom-1.0.0.AppImage" 
                className="platform-card"
                download
              >
                <div className="platform-icon linux">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.002 0c-2.316 0-4.402 1.341-5.467 3.504l-1.082 2.197c-.305.618-.461 1.303-.461 1.996v2.303h14.02v-2.303c0-.693-.156-1.378-.461-1.996l-1.082-2.197c-1.065-2.163-3.151-3.504-5.467-3.504zm-4.01 12c-1.105 0-2 .895-2 2v6c0 2.209 1.791 4 4 4h4.02c2.209 0 4-1.791 4-4v-6c0-1.105-.895-2-2-2h-8.02z"/>
                  </svg>
                </div>
                <div className="platform-info">
                  <div className="platform-name">Linux</div>
                  <div className="platform-format">.AppImage</div>
                  <div className="platform-size">142 MB</div>
                </div>
                <div className="download-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                  </svg>
                </div>
              </a>

              {/* MOBILE PWA */}
              <a 
                href="#features" 
                className="platform-card mobile"
                onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}
              >
                <div className="platform-icon mobile">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
                  </svg>
                </div>
                <div className="platform-info">
                  <div className="platform-name">Mobile PWA</div>
                  <div className="platform-format">iOS / Android Browser</div>
                  <div className="platform-size">One-Tap Install</div>
                </div>
                <div className="download-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                  </svg>
                </div>
              </a>
            </div>

            {/* SECURITY NOTICES */}
            <div className="security-notices">
              <div className="notice-item">
                <span className="notice-icon">⚠️</span>
                <span><strong>Windows users:</strong> You may see a SmartScreen prompt — click <em>More info → Run anyway</em>. The app is safe; it is unsigned pending a code signing certificate.</span>
              </div>
              <div className="notice-item">
                <span className="notice-icon">🍎</span>
                <span><strong>macOS users:</strong> Right-click the <code>.dmg</code> file and select <em>Open</em> on first launch.</span>
              </div>
            </div>
          </div>

          {/* PREVIOUS VERSIONS ACCORDION */}
          <div className="previous-versions-card">
            <h3 className="previous-versions-title">PREVIOUS VERSIONS</h3>
            
            <div className="version-row" onClick={() => setExpandedVersion(expandedVersion === 'v1.0.1' ? null : 'v1.0.1')}>
              <div className="version-info">
                <strong>v1.0.1</strong>
                <span className="version-date">30 Jul 2026</span>
              </div>
              <span className="chevron">{expandedVersion === 'v1.0.1' ? '▲' : '▼'}</span>
            </div>

            <div className="version-row" onClick={() => setExpandedVersion(expandedVersion === 'v1.0.0' ? null : 'v1.0.0')}>
              <div className="version-info">
                <strong>v1.0.0</strong>
                <span className="version-date">30 Jul 2026</span>
              </div>
              <span className="chevron">{expandedVersion === 'v1.0.0' ? '▲' : '▼'}</span>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <p>Church Intercom System • Open Source Local Audio Coordination</p>
        <p className="developer-credit">
          Created with ❤️ by <a href="https://github.com/ransamie" target="_blank" rel="noreferrer">Ransamie Technologies (RanTech)</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
