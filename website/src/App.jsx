import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('walkie');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [customName, setCustomName] = useState("Refiner's House Revival Outreach");
  const [customLogo, setCustomLogo] = useState('/logo.jpg');
  const [themeColor, setThemeColor] = useState('#007bff');
  const [expandedVersion, setExpandedVersion] = useState(null);
  const [releases, setReleases] = useState([]);

  useEffect(() => {
    fetch('https://api.github.com/repos/ransamie/Church-Intercom-System/releases')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setReleases(data);
      })
      .catch(err => console.error("Failed to fetch releases:", err));
  }, []);

  const currentTheme = { primary: themeColor, bg: '#0d0d12' };

  const handleLogoFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomLogo(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
          <div className="badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
              <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
            </svg>
            100% Offline & Free Open Source
          </div>
          <h1>Seamless Audio Coordination for Your Media Team.</h1>
          <p>
            An instant, zero-latency local network intercom designed for sound engineers, 
            camera operators, and ushers at <strong>Refiner's House Revival Outreach</strong> and churches worldwide.
          </p>
          <div className="cta-group">
            <button 
              onClick={() => scrollToSection('download')} 
              className="btn-primary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              Download Desktop App
            </button>
            <a 
              href="https://github.com/ransamie/Church-Intercom-System#readme" 
              target="_blank" 
              rel="noreferrer" 
              className="btn-secondary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16h-2v-2h2v2zm0-4h-2V7h2v7z"/>
              </svg>
              User Manual & Setup
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
                Walkie-Talkie Mode
              </button>
              <button 
                className={`sim-tab ${activeTab === 'realtime' ? 'active' : ''}`} 
                onClick={() => setActiveTab('realtime')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                  <path d="M12 3c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z"/>
                </svg>
                Realtime Conference
              </button>
            </div>

            <div className="sim-screen">
              {activeTab === 'walkie' ? (
                <div className="walkie-sim">
                  <p className="sim-status">
                    Status: <span className={isTransmitting ? 'text-danger' : 'text-success'}>
                      {isTransmitting ? '● TRANSMITTING VOICE...' : '● Online & Ready (Hold to Speak)'}
                    </span>
                  </p>
                  
                  <button 
                    className={`talk-btn-sim ${isTransmitting ? 'transmitting' : ''}`}
                    onMouseDown={() => setIsTransmitting(true)}
                    onMouseUp={() => setIsTransmitting(false)}
                    onTouchStart={() => setIsTransmitting(true)}
                    onTouchEnd={() => setIsTransmitting(false)}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" style={{ marginBottom: '4px' }}>
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                    </svg>
                    {isTransmitting ? 'TRANSMITTING' : 'HOLD TO TALK'}
                  </button>

                  <div className="wave-container">
                    {isTransmitting && (
                      <div className="waves">
                        <span className="wave bar1"></span>
                        <span className="wave bar2"></span>
                        <span className="wave bar3"></span>
                        <span className="wave bar4"></span>
                        <span className="wave bar5"></span>
                      </div>
                    )}
                  </div>
                  <small className="sim-hint">Press & hold the big button to simulate transmitting</small>
                </div>
              ) : (
                <div className="realtime-sim">
                  <p className="sim-status">
                    Conference Channel: <span className="text-success">● 4 Team Members Connected</span>
                  </p>

                  <div className="peer-grid">
                    <div className="peer-badge active-speaker">🎥 Camera 1 (Live)</div>
                    <div className="peer-badge">🔊 Sound Desk</div>
                    <div className="peer-badge">💻 Visuals / ProPresenter</div>
                    <div className="peer-badge me">🙋 You ({isMuted ? 'Muted' : 'Live'})</div>
                  </div>

                  <button 
                    className={`mute-btn-sim ${isMuted ? 'muted' : 'live'}`}
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                      {isMuted ? (
                        <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.27-1.48.42-2.31.42-3.31 0-6-2.69-6-6H4c0 4.02 3.01 7.34 6.86 7.82V21h2.28v-3.18c.84-.11 1.64-.37 2.37-.75l3.22 3.22L20 19.01 4.27 3z"/>
                      ) : (
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                      )}
                    </svg>
                    {isMuted ? 'MIC IS MUTED (Tap to Talk)' : 'MIC IS LIVE (Tap to Mute)'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CUSTOMIZATION PREVIEW WITH DRAG & DROP LOGO */}
        <section className="customizer-section">
          <div className="section-header">
            <h2>Live Theme & Logo Configurator</h2>
            <p>Drag and drop your church logo and customize your ministry name in real-time</p>
          </div>

          <div className="customizer-grid">
            <div className="customizer-controls">
              <label>
                Accent Theme Color:
                <div style={{ display: 'flex', gap: '10px', marginTop: '8px', marginBottom: '15px' }}>
                  {['#007bff', '#2ecc71', '#8b5cf6', '#f59e0b', '#ef4444', '#14b8a6'].map(color => (
                    <div 
                      key={color}
                      onClick={() => setThemeColor(color)}
                      style={{
                        width: '30px', height: '30px', borderRadius: '50%', background: color,
                        cursor: 'pointer', border: themeColor === color ? '2px solid white' : '2px solid transparent',
                        transform: themeColor === color ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.2s',
                        boxShadow: themeColor === color ? `0 0 10px ${color}` : 'none'
                      }}
                    />
                  ))}
                </div>
              </label>

              <label>
                Church / Ministry Name:
                <input 
                  type="text" 
                  value={customName} 
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Enter your church name..."
                />
              </label>

              <div className="logo-upload-group">
                <label>Drag & Drop Church Logo:</label>
                <div 
                  className="logo-drop-box"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleLogoFile(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => document.getElementById('logo-file-input').click()}
                >
                  <img src={customLogo} alt="Church Logo" className="drop-logo-preview" />
                  <div className="drop-text">
                    <strong>Drag & Drop Logo Here</strong>
                    <span>or click to browse image file</span>
                  </div>
                  <input 
                    id="logo-file-input" 
                    type="file" 
                    accept="image/*" 
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleLogoFile(e.target.files[0]);
                      }
                    }}
                  />
                </div>
              </div>
              </div>
            <div 
              className="preview-card"
              style={{ 
                borderColor: currentTheme.primary,
                boxShadow: `0 0 25px ${currentTheme.primary}33`
              }}
            >
              <div className="preview-header" style={{ color: currentTheme.primary }}>
                <img src={customLogo} alt="Church Logo Preview" className="preview-logo-img" />
                <h3>{customName || "Refiner's House Revival Outreach"}</h3>
                <small>Mobile Phone Login View</small>
              </div>
              <div className="preview-body">
                <div className="preview-input">••••••••</div>
                <div className="preview-btn" style={{ background: currentTheme.primary }}>
                  UNLOCK SYSTEM
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="features">
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="#007bff">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            </div>
            <h3>Walkie-Talkie Mode</h3>
            <p>Push-to-talk simplicity for precise directions. Highly stable, ultra-low phone CPU/battery usage, and supports unlimited users.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="#8b5cf6">
                <path d="M12 3c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z"/>
              </svg>
            </div>
            <h3>Realtime Conference</h3>
            <p>Hands-free full duplex WebRTC conversations. Perfect for active coordination between lead director, sound, and cameras.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="#34d399">
                <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
              </svg>
            </div>
            <h3>Cross Platform & PWA</h3>
            <p>Works seamlessly on iOS, Android, Mac, and Windows. Users can tap "Install App" on their phone browser to save it to home screen.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="#f59e0b">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6-3.6z"/>
              </svg>
            </div>
            <h3>Zero Config Complexity</h3>
            <p>Launch the Desktop App and select your communication mode with a single click. Zero code or JSON configuration required.</p>
          </div>
        </section>

        {/* DEDICATED DOWNLOAD SECTION */}
        <section id="download" className="download-section">
          <div className="download-header">
            <h2>Download <span className="gradient-text">Church Intercom</span></h2>
            <p className="download-subtitle">Free and open source. Available for every major platform.</p>
          </div>

          <div className="download-main-card">
            <div className="release-top-bar">
              <div className="release-tag-group">
                <span className="latest-badge">LATEST</span>
                <span className="version-number">{releases.length > 0 ? releases[0].tag_name : 'v1.0.0'}</span>
                <span className="release-date">
                  {releases.length > 0 ? new Date(releases[0].published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Loading...'}
                </span>
              </div>
              <a 
                href="https://github.com/ransamie/Church-Intercom-System/releases/latest" 
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
                href={releases.length > 0 ? (releases[0].assets.find(a => a.name.endsWith('.exe'))?.browser_download_url || '#') : "https://github.com/ransamie/Church-Intercom-System/releases/latest"} 
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
                  <div className="platform-size">{releases.length > 0 ? Math.round((releases[0].assets.find(a => a.name.endsWith('.exe'))?.size || 0) / 1024 / 1024) + ' MB' : '...'}</div>
                </div>
                <div className="download-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                  </svg>
                </div>
              </a>

              {/* MACOS */}
              <a 
                href={releases.length > 0 ? (releases[0].assets.find(a => a.name.endsWith('.dmg'))?.browser_download_url || '#') : "https://github.com/ransamie/Church-Intercom-System/releases/latest"} 
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
                  <div className="platform-format">.dmg (Apple Silicon/Intel)</div>
                  <div className="platform-size">{releases.length > 0 ? Math.round((releases[0].assets.find(a => a.name.endsWith('.dmg'))?.size || 0) / 1024 / 1024) + ' MB' : '...'}</div>
                </div>
                <div className="download-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                  </svg>
                </div>
              </a>

              {/* LINUX */}
              <a 
                href={releases.length > 0 ? (releases[0].assets.find(a => a.name.endsWith('.AppImage'))?.browser_download_url || '#') : "https://github.com/ransamie/Church-Intercom-System/releases/latest"} 
                className="platform-card"
                download
              >
                <div className="platform-icon linux">
                  <svg width="28" height="28" viewBox="0 0 448 512" fill="currentColor">
                    <path d="M220.8 123.3c1 .5 1.8 1.7 3 1.7 1.1 0 2.8-.4 2.9-1.5.2-1.4-1.9-2.3-3.2-2.9-1.7-.7-3.9-1-5.5-.1-.4.2-.8.7-.6 1.1.3 1.3 2.3 1.1 3.4 1.7zm-21.9 1.7c1.2 0 2-1.2 3-1.7 1.1-.6 3.1-.4 3.5-1.7.2-.4-.2-.9-.6-1.1-1.6-.9-3.8-.6-5.5.1-1.3.6-3.4 1.5-3.2 2.9.1 1 1.8 1.5 2.8 1.5zm70.6-38.3c1.9 4.3 3.4 9.1 4.3 13.9 1 5.3 1.3 10.8 1 16.2-.2 3.8-1 7.5-2.2 11.2-1.3 3.8-3.1 7.4-5.3 10.7-3.9 5.8-8.8 11.1-14.7 15.3-6.6 4.7-14.1 8.3-22 10.8-8 2.6-16.3 4.2-24.6 4.8-7.9.6-15.9.3-23.7-1-7.8-1.3-15.3-3.6-22.3-6.7-7-3.1-13.6-7.1-19.4-12-5.7-4.9-10.7-10.7-14.6-17.1-3.6-5.9-6.3-12.2-7.9-18.8-1.5-6.3-2-12.7-1.5-19.1.5-6.3 1.9-12.5 4.3-18.4 2.4-5.7 5.7-11.1 9.8-15.9 4-4.7 8.8-8.9 14-12.4 5.4-3.6 11.2-6.5 17.3-8.6 6.1-2.1 12.5-3.5 19-4.1 6.5-.5 13 .1 19.3 1.4 6.2 1.2 12.2 3.3 17.7 6.1 5.4 2.7 10.4 6.2 14.7 10.3 4.3 4 8.1 8.5 11.1 13.6zm-86.4 89.2c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm57.2 0c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm25.9-46.7c-2.4-1.1-5.1-1.6-7.8-1.6-2.9 0-5.7.7-8.3 2-2.5 1.3-4.7 3.1-6.4 5.3-1.6 2.1-2.8 4.6-3.4 7.2-.6 2.7-.7 5.5-.3 8.2.4 2.7 1.3 5.3 2.8 7.6 1.4 2.2 3.3 4.1 5.4 5.6 2.3 1.5 4.8 2.6 7.5 3.1 2.7.5 5.5.6 8.2.1 2.8-.5 5.5-1.5 7.9-3 2.4-1.6 4.4-3.6 5.9-6 1.5-2.4 2.5-5 3.1-7.8.6-2.8.6-5.7 0-8.5-.6-2.9-1.7-5.6-3.4-8-1.6-2.4-3.7-4.4-6.1-5.9-2.5-1.5-5.3-2.6-8.2-3-2.8-.5-5.7-.7-8.3-.3-2.7.5-5.2 1.5-7.5 3.1-2.2 1.5-4.1 3.4-5.5 5.6-1.5 2.3-2.4 4.9-2.8 7.6-.4 2.7-.3 5.5.3 8.2.6 2.6 1.8 5.1 3.4 7.2 1.7 2.2 3.9 4 6.4 5.3 2.6 1.3 5.4 2 8.3 2 2.7 0 5.4-.5 7.8-1.6zm-59 86.6c1.3-1.8 3.5-2.3 5.3-1 1.8 1.3 2.3 3.5 1 5.3-1.3 1.8-3.5 2.3-5.3 1-1.8-1.3-2.3-3.5-1-5.3zm93.7 101.4c1 1.7-.2 3.5-2 3.5-1.8 0-3.3-1.8-2.3-3.5 1-1.7 3.3-1.7 4.3 0zm-82.9 0c1-1.7 3.3-1.7 4.3 0 1 1.7-.5 3.5-2.3 3.5-1.8 0-3-1.8-2-3.5zM128 360c-26.5 0-48 21.5-48 48s21.5 48 48 48 48-21.5 48-48-21.5-48-48-48zm192 0c-26.5 0-48 21.5-48 48s21.5 48 48 48 48-21.5 48-48-21.5-48-48-48z"/>
                  </svg>
                </div>
                <div className="platform-info">
                  <div className="platform-name">Linux</div>
                  <div className="platform-format">.AppImage</div>
                  <div className="platform-size">{releases.length > 0 ? Math.round((releases[0].assets.find(a => a.name.endsWith('.AppImage'))?.size || 0) / 1024 / 1024) + ' MB' : '...'}</div>
                </div>
                <div className="download-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                  </svg>
                </div>
              </a>
            </div>
          </div>

          {/* PREVIOUS VERSIONS ACCORDION */}
          {releases.length > 1 && (
            <div className="previous-versions-card">
              <h3 className="previous-versions-title">PREVIOUS VERSIONS</h3>
              {releases.slice(1).map(release => (
                <div 
                  key={release.id} 
                  className="version-row" 
                  onClick={() => window.open(release.html_url, '_blank')}
                >
                  <div className="version-info">
                    <strong>{release.tag_name}</strong>
                    <span className="version-date">
                      {new Date(release.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <span className="chevron">↗</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <p>Open Source Project for Church Technical & Media Teams.</p>
        <p className="sub-footer">
          Created with ❤️ by <a href="https://github.com/ransamie" target="_blank" rel="noreferrer">Ransamie Technologies (RanTech)</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
