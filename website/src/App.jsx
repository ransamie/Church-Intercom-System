import React from 'react';
import './index.css';

function App() {
  return (
    <>
      <div className="bg-glow"></div>
      
      <header>
        <div className="logo">
          <img src="/logo.jpg" alt="Logo" className="logo-icon-img" />
          Church Intercom
        </div>
        <a href="https://github.com/ransboy/Church-Intercom-System" className="github-btn">GitHub</a>
      </header>

      <main>
        <section className="hero">
          <h1>Seamless Communication for Your Media Team.</h1>
          <p>
            An open-source, highly customizable audio relay system designed for churches. 
            Runs entirely offline on your local network. No internet required.
          </p>
          <div className="cta-group">
            <a href="https://github.com/ransboy/Church-Intercom-System/archive/refs/heads/main.zip" className="btn-primary">Download System</a>
            <a href="https://github.com/ransboy/Church-Intercom-System#readme" className="btn-secondary">Read the Manual</a>
          </div>
        </section>

        <section className="features">
          <div className="feature-card">
            <div className="feature-icon">🎙️</div>
            <h3>Walkie-Talkie Mode</h3>
            <p>Push-to-talk simplicity for precise directions. Highly stable, low battery usage, and supports unlimited users.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🎧</div>
            <h3>Realtime Conference</h3>
            <p>Hands-free full duplex conversations for up to 6 key operators. Perfect for dynamic, fast-paced service coordination.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Cross Platform & PWA</h3>
            <p>Works natively on iOS, Android, Mac, and PC via browser. Install it to your home screen as a Progressive Web App.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Highly Customizable</h3>
            <p>Easily edit the config.json to match your church's branding colors, set a secure password, and rename the app.</p>
          </div>
        </section>
      </main>

      <footer>
        <p>Open Source Project. Built for local church media teams by Ransamie.</p>
      </footer>
    </>
  );
}

export default App;
