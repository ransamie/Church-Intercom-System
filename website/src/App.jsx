import React, { useState } from 'react';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('walkie');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [customName, setCustomName] = useState('Grace Community Church Intercom');
  const [selectedTheme, setSelectedTheme] = useState('blue');

  const themes = {
    blue: { primary: '#007bff', secondary: '#0056b3', bg: '#0d0d12' },
    emerald: { primary: '#10b981', secondary: '#059669', bg: '#062016' },
    purple: { primary: '#8b5cf6', secondary: '#6d28d9', bg: '#130c25' },
    amber: { primary: '#f59e0b', secondary: '#d97706', bg: '#1f1504' }
  };

  const currentTheme = themes[selectedTheme];

  return (
    <div className="app-root">
      <div className="bg-glow"></div>
      
      {/* HEADER */}
      <header>
        <div className="logo">
          <img src="/logo.jpg" alt="Church Intercom Logo" className="logo-icon-img" />
          <span className="logo-text">Church Intercom</span>
        </div>
        <a 
          href="https://github.com/ransamie/Church-Intercom-System" 
          target="_blank" 
          rel="noreferrer" 
          className="github-btn"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          GitHub
        </a>
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
            An instant, zero-latency local network intercom designed for church sound engineers, 
            camera operators, and ushers. No internet required.
          </p>
          <div className="cta-group">
            <a 
              href="https://github.com/ransamie/Church-Intercom-System/releases/latest" 
              target="_blank" 
              rel="noreferrer" 
              className="btn-primary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              Download Desktop App
            </a>
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
        <section className="demo-section">
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

        {/* CUSTOMIZATION PREVIEW */}
        <section className="customizer-section">
          <div className="section-header">
            <h2>Live Theme Configurator</h2>
            <p>Customize your church name and colors with a single edit in <code>config.json</code></p>
          </div>

          <div className="customizer-grid">
            <div className="customizer-controls">
              <label>
                Church / Ministry Name:
                <input 
                  type="text" 
                  value={customName} 
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Enter your church name..."
                />
              </label>

              <div className="theme-picker">
                <label>Select Accent Theme:</label>
                <div className="theme-buttons">
                  {Object.keys(themes).map((t) => (
                    <button 
                      key={t}
                      className={`theme-swatch ${selectedTheme === t ? 'active' : ''}`}
                      style={{ background: themes[t].primary }}
                      onClick={() => setSelectedTheme(t)}
                    />
                  ))}
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
                <h3>{customName || 'Church Intercom'}</h3>
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
            <p>Modify <code>config.json</code> to easily rename the system, adjust team passwords, set call limits, and apply your church's color scheme.</p>
          </div>
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
