import React from 'react';

function Support() {
  return (
    <div className="content-page">
      <h1>Support & Help Center</h1>
      <p>Welcome to the Atmosync Support Center. We're dedicated to providing you with the best, most accurate, and aesthetically pleasing weather tracking experience possible. Whether you're dealing with a bug, have a feature suggestion, or just need help navigating the app, we are here for you.</p>

      <h2>How to Reach Us</h2>
      <p>Our dedicated support team is available to help resolve any issues you may encounter while using Atmosync.</p>
      
      <ul>
        <li><strong>Email Support:</strong> You can reach us directly at <a href="mailto:support@Atmosync.com">support@Atmosync.com</a>.</li>
        <li><strong>Operating Hours:</strong> Monday to Friday, 9:00 AM - 6:00 PM (EST).</li>
        <li><strong>Response Time:</strong> We aim to reply to all inquiries within 24-48 business hours.</li>
      </ul>

      <button className="btn" style={{marginTop: '10px', marginBottom: '40px'}} onClick={() => window.location.href = 'mailto:support@Atmosync.com'}>
        Email Support Team
      </button>

      <h2>Frequently Asked Questions (FAQ)</h2>
      
      <h3>1. How do I change the temperature unit from Celsius to Fahrenheit?</h3>
      <p>To switch between °C and °F, tap on the hamburger menu icon (three horizontal lines) in the top right corner of the app to open the Settings menu. From there, you will see a "Temperature Unit" toggle. Your selection will be saved automatically across all your locations.</p>

      <h3>2. Why is the AQI (Air Quality Index) not loading for my city?</h3>
      <p>The AQI data is fetched from global meteorological stations. Sometimes, smaller towns or remote areas do not have active reporting stations nearby. If you are in a major city and it's not loading, please check your internet connection or try again later, as the API provider might be experiencing temporary downtime.</p>

      <h3>3. How do the "Smart Outfit Suggestions" work?</h3>
      <p>Our algorithm takes into account the current "Feels Like" temperature, humidity, and wind speed in your location to recommend the most comfortable clothing. It categorizes weather into freezing, cold, mild, warm, and hot to give you tailored, practical advice on what to wear before you step outside.</p>

      <h3>4. Can I search for weather in multiple cities?</h3>
      <p>Yes! In the Global AQI Explorer section, you can browse through various continents and countries to find specific cities. We are also working on adding a direct search bar in the upcoming v1.1 update.</p>

      <h3>5. How do I enable the Minimalist Theme?</h3>
      <p>Open the Settings menu by clicking the icon in the top right corner. Toggle the "Minimalist Theme" switch. This will activate a cleaner, distraction-free solid color interface instead of the default glassmorphic transparent background.</p>

      <h2>Reporting a Bug</h2>
      <p>If you encounter a bug or the app crashes, please email us with the following details so we can fix it as quickly as possible:</p>
      <ul>
        <li>Your phone model and Android version.</li>
        <li>A brief description of what you were doing when the issue occurred.</li>
        <li>Screenshots of the error (if applicable).</li>
      </ul>

      <p style={{marginTop: '40px', fontStyle: 'italic', color: 'var(--text-secondary)'}}>
        Thank you for using Atmosync. We are constantly improving our algorithms and design to bring you the best weather experience.
      </p>
    </div>
  );
}

export default Support;
