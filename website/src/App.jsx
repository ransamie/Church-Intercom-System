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
          <div className="badge">⚡ 100% Offline & Free Open Source</div>
          <h1>Seamless Audio Coordination for Your Media Team.</h1>
          <p>
            An instant, zero-latency local network intercom designed for church sound engineers, 
            camera operators, and ushers. No internet required.
          </p>
          <div className="cta-group">
            <a 
              href="https://github.com/ransamie/Church-Intercom-System/archive/refs/heads/master.zip" 
              target="_blank" 
              rel="noreferrer" 
              className="btn-primary"
            >
              📥 Download System (.zip)
            </a>
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
                      {isTransmitting ? '🔴 TRANSMITTING VOICE...' : '🟢 Online & Ready (Hold to Speak)'}
                    </span>
                  </p>
                  
                  <button 
                    className={`talk-btn-sim ${isTransmitting ? 'transmitting' : ''}`}
                    onMouseDown={() => setIsTransmitting(true)}
                    onMouseUp={() => setIsTransmitting(false)}
                    onTouchStart={() => setIsTransmitting(true)}
                    onTouchEnd={() => setIsTransmitting(false)}
                  >
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
                    Conference Channel: <span className="text-success">🟢 4 Team Members Connected</span>
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
                    {isMuted ? '🚫 MIC IS MUTED (Tap to Talk)' : '🎙️ MIC IS LIVE (Tap to Mute)'}
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
            <div className="feature-icon">🎙️</div>
            <h3>Walkie-Talkie Mode</h3>
            <p>Push-to-talk simplicity for precise directions. Highly stable, ultra-low phone CPU/battery usage, and supports unlimited users.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🎧</div>
            <h3>Realtime Conference</h3>
            <p>Hands-free full duplex WebRTC conversations. Perfect for active coordination between lead director, sound, and cameras.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Cross Platform & PWA</h3>
            <p>Works seamlessly on iOS, Android, Mac, and Windows. Users can tap "Install App" on their phone browser to save it to home screen.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Zero Config Complexity</h3>
            <p>Modify <code>config.json</code> to easily rename the system, adjust team passwords, set call limits, and apply your church's color scheme.</p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <p>Open Source Project for Church Technical & Media Teams.</p>
        <p className="sub-footer">
          Created with ❤️ by <a href="https://github.com/ransamie" target="_blank" rel="noreferrer">Ransamie</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
