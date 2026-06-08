import React from 'react';

function Home() {
  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-content">
          <div className="badge">Now in Beta</div>
          <h1>Atmosync</h1>
          <p className="hero-subtitle">Your aesthetic, minimalist companion for global weather and AQI.</p>
          <div className="hero-buttons">
            <button className="btn primary-btn">Get it on Play Store</button>
            <button className="btn secondary-btn">View Features</button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="icon-glow"></div>
          <img src="/custom_icon.png" alt="Atmosync Icon" className="hero-icon" />
        </div>
      </section>

      <section className="features-section">
        <div className="section-header">
          <h2>Beautiful. Accurate. Minimalist.</h2>
          <p>Experience weather forecasting like never before, wrapped in a premium dark glassmorphic design.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Global AQI Explorer</h3>
            <p>Dive deep into air quality data anywhere in the world. Get detailed pollutant breakdowns and health advice.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">👕</div>
            <h3>Smart Outfit Suggestions</h3>
            <p>Never overdress or freeze again. Our smart engine recommends the perfect outfit based on the current feels-like temperature.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>7-Day Trend Forecast</h3>
            <p>Plan your week ahead with accurate daily minimums, maximums, and weather conditions at a glance.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
