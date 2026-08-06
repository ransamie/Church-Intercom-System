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
    document.documentElement.style.setProperty('--primary', themeColor);
    
    fetch('https://api.github.com/repos/ransamie/Church-Intercom-System/releases')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setReleases(data);
      })
      .catch(err => console.error("Failed to fetch releases:", err));
  }, [themeColor]);

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
        <div className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
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
          
          <div className="hero-illustration">
            <div className="illustration-glow-wrapper">
              <img src="/images/media_team.jpg" alt="Media team collaboration" className="hero-img" />
              <div className="glow-effect"></div>
            </div>
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
                style={activeTab === 'walkie' ? { backgroundColor: 'var(--primary)', borderColor: 'var(--primary)', color: 'white' } : {}}
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
                style={activeTab === 'realtime' ? { backgroundColor: 'var(--primary)', borderColor: 'var(--primary)', color: 'white' } : {}}
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
                    <div className={`peer-badge me ${!isMuted ? 'active-speaker' : ''}`}>🙋 You ({isMuted ? 'Muted' : 'Live'})</div>
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
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                <circle cx="12" cy="12" r="3"/>
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
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 00-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139zm.529 3.405h.013c.213 0 .396.062.584.198.19.135.33.332.438.533.105.259.158.459.166.724 0-.02.006-.04.006-.06v.105a.086.086 0 01-.004-.021l-.004-.024a1.807 1.807 0 01-.15.706.953.953 0 01-.213.335.71.71 0 00-.088-.042c-.104-.045-.198-.064-.284-.133a1.312 1.312 0 00-.22-.066c.05-.06.146-.133.183-.198.053-.128.082-.264.088-.402v-.02a1.21 1.21 0 00-.061-.4c-.045-.134-.101-.2-.183-.333-.084-.066-.167-.132-.267-.132h-.016c-.093 0-.176.03-.262.132a.8.8 0 00-.205.334 1.18 1.18 0 00-.09.4v.019c.002.089.008.179.02.267-.193-.067-.438-.135-.607-.202a1.635 1.635 0 01-.018-.2v-.02a1.772 1.772 0 01.15-.768c.082-.22.232-.406.43-.533a.985.985 0 01.594-.2zm-2.962.059h.036c.142 0 .27.048.399.135.146.129.264.288.344.465.09.199.14.4.153.667v.004c.007.134.006.2-.002.266v.08c-.03.007-.056.018-.083.024-.152.055-.274.135-.393.2.012-.09.013-.18.003-.267v-.015c-.012-.133-.04-.2-.082-.333a.613.613 0 00-.166-.267.248.248 0 00-.183-.064h-.021c-.071.006-.13.04-.186.132a.552.552 0 00-.12.27.944.944 0 00-.023.33v.015c.012.135.037.2.08.334.046.134.098.2.166.268.01.009.02.018.034.024-.07.057-.117.07-.176.136a.304.304 0 01-.131.068 2.62 2.62 0 01-.275-.402 1.772 1.772 0 01-.155-.667 1.759 1.759 0 01.08-.668 1.43 1.43 0 01.283-.535c.128-.133.26-.2.418-.2zm1.37 1.706c.332 0 .733.065 1.216.399.293.2.523.269 1.052.468h.003c.255.136.405.266.478.399v-.131a.571.571 0 01.016.47c-.123.31-.516.643-1.063.842v.002c-.268.135-.501.333-.775.465-.276.135-.588.292-1.012.267a1.139 1.139 0 01-.448-.067 3.566 3.566 0 01-.322-.198c-.195-.135-.363-.332-.612-.465v-.005h-.005c-.4-.246-.616-.512-.686-.71-.07-.268-.005-.47.193-.6.224-.135.38-.271.483-.336.104-.074.143-.102.176-.131h.002v-.003c.169-.202.436-.47.839-.601.139-.036.294-.065.466-.065zm2.8 2.142c.358 1.417 1.196 3.475 1.735 4.473.286.534.855 1.659 1.102 3.024.156-.005.33.018.513.064.646-1.671-.546-3.467-1.089-3.966-.22-.2-.232-.335-.123-.335.59.534 1.365 1.572 1.646 2.757.13.535.16 1.104.021 1.67.067.028.135.06.205.067 1.032.534 1.413.938 1.23 1.537v-.043c-.06-.003-.12 0-.18 0h-.016c.151-.467-.182-.825-1.065-1.224-.915-.4-1.646-.336-1.77.465-.008.043-.013.066-.018.135-.068.023-.139.053-.209.064-.43.268-.662.669-.793 1.187-.13.533-.17 1.156-.205 1.869v.003c-.02.334-.17.838-.319 1.35-1.5 1.072-3.58 1.538-5.348.334a2.645 2.645 0 00-.402-.533 1.45 1.45 0 00-.275-.333c.182 0 .338-.03.465-.067a.615.615 0 00.314-.334c.108-.267 0-.697-.345-1.163-.345-.467-.931-.995-1.788-1.521-.63-.4-.986-.87-1.15-1.396-.165-.534-.143-1.085-.015-1.645.245-1.07.873-2.11 1.274-2.763.107-.065.037.135-.408.974-.396.751-1.14 2.497-.122 3.854a8.123 8.123 0 01.647-2.876c.564-1.278 1.743-3.504 1.836-5.268.048.036.217.135.289.202.218.133.38.333.59.465.21.201.477.335.876.335.039.003.075.006.11.006.412 0 .73-.134.997-.268.29-.134.52-.334.74-.4h.005c.467-.135.835-.402 1.044-.7zm2.185 8.958c.037.6.343 1.245.882 1.377.588.134 1.434-.333 1.791-.765l.211-.01c.315-.007.577.01.847.268l.003.003c.208.199.305.53.391.876.085.4.154.78.409 1.066.486.527.645.906.636 1.14l.003-.007v.018l-.003-.012c-.015.262-.185.396-.498.595-.63.401-1.746.712-2.457 1.57-.618.737-1.37 1.14-2.036 1.191-.664.053-1.237-.2-1.574-.898l-.005-.003c-.21-.4-.12-1.025.056-1.69.176-.668.428-1.344.463-1.897.037-.714.076-1.335.195-1.814.12-.465.308-.797.641-.984l.045-.022zm-10.814.049h.01c.053 0 .105.005.157.014.376.055.706.333 1.023.752l.91 1.664.003.003c.243.533.754 1.064 1.189 1.637.434.598.77 1.131.729 1.57v.006c-.057.744-.48 1.148-1.125 1.294-.645.135-1.52.002-2.395-.464-.968-.536-2.118-.469-2.857-.602-.369-.066-.61-.2-.723-.4-.11-.2-.113-.602.123-1.23v-.004l.002-.003c.117-.334.03-.752-.027-1.118-.055-.401-.083-.71.043-.94.16-.334.396-.4.69-.533.294-.135.64-.202.915-.47h.002v-.002c.256-.268.445-.601.668-.838.19-.201.38-.336.663-.336zm7.159-9.074c-.435.201-.945.535-1.488.535-.542 0-.97-.267-1.28-.466-.154-.134-.28-.268-.373-.335-.164-.134-.144-.333-.074-.333.109.016.129.134.199.2.096.066.215.2.36.333.292.2.68.467 1.167.467.485 0 1.053-.267 1.398-.466.195-.135.445-.334.648-.467.156-.136.149-.267.279-.267.128.016.034.134-.147.332a8.097 8.097 0 01-.69.468zm-1.082-1.583V5.64c-.006-.02.013-.042.029-.05.074-.043.18-.027.26.004.063 0 .16.067.15.135-.006.049-.085.066-.135.066-.055 0-.092-.043-.141-.068-.052-.018-.146-.008-.163-.065zm-.551 0c-.02.058-.113.049-.166.066-.047.025-.086.068-.14.068-.05 0-.13-.02-.136-.068-.01-.066.088-.133.15-.133.08-.031.184-.047.259-.005.019.009.036.03.03.05v.02h.003z"/>
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
                <div key={release.id} className="version-wrapper">
                  <div 
                    className="version-row" 
                    onClick={() => setExpandedVersion(expandedVersion === release.id ? null : release.id)}
                  >
                    <div className="version-info">
                      <strong>{release.tag_name}</strong>
                      <span className="version-date">
                        {new Date(release.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <span className="chevron" style={{ transform: expandedVersion === release.id ? 'rotate(180deg)' : 'rotate(0)' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </span>
                  </div>
                  {expandedVersion === release.id && (
                    <div className="version-downloads">
                      <a href={release.assets.find(a => a.name.endsWith('.exe'))?.browser_download_url || '#'} className="mini-download">
                         <span className="mini-os">Windows</span>
                         <span className="mini-size">({Math.round((release.assets.find(a => a.name.endsWith('.exe'))?.size || 0)/1024/1024)} MB)</span>
                         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                      </a>
                      <a href={release.assets.find(a => a.name.endsWith('.dmg'))?.browser_download_url || '#'} className="mini-download">
                         <span className="mini-os">macOS</span>
                         <span className="mini-size">({Math.round((release.assets.find(a => a.name.endsWith('.dmg'))?.size || 0)/1024/1024)} MB)</span>
                         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                      </a>
                      <a href={release.assets.find(a => a.name.endsWith('.AppImage'))?.browser_download_url || '#'} className="mini-download">
                         <span className="mini-os">Linux</span>
                         <span className="mini-size">({Math.round((release.assets.find(a => a.name.endsWith('.AppImage'))?.size || 0)/1024/1024)} MB)</span>
                         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                      </a>
                    </div>
                  )}
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
