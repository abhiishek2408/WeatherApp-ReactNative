import React from 'react';

function Privacy() {
  return (
    <div className="content-page">
      <h1>Privacy Policy</h1>
      <p><strong>Last updated: {new Date().toLocaleDateString()}</strong></p>
      
      <p>Welcome to Atmosync ("we", "our", or "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice or our practices with regard to your personal information, please contact us at support@Atmosync.com.</p>
      
      <p>When you use our mobile application (the "App"), you trust us with your personal information. We take your privacy very seriously. In this privacy notice, we seek to explain to you in the clearest way possible what information we collect, how we use it, and what rights you have in relation to it. We hope you take some time to read through it carefully, as it is important.</p>

      <h2>1. Information We Collect</h2>
      <p><strong>Location Data:</strong> To provide you with accurate local weather forecasts, Air Quality Index (AQI) data, and location-based outfit recommendations, our App requests access to your device's precise or approximate location (GPS-based). You can opt to grant or deny this permission through your device's system settings.</p>
      <p><strong>Usage Data:</strong> We may collect anonymous diagnostic and usage data. This includes information such as your device's Internet Protocol address (e.g., IP address), device name, operating system version, and the time and date of your use of the App. This data helps us improve the App's stability and performance.</p>
      
      <h2>2. How We Use Your Information</h2>
      <p>We use personal information collected via our App for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
      <ul>
        <li><strong>To deliver services to you:</strong> We use your location strictly to fetch the weather conditions, forecast, and AQI from our meteorological API providers.</li>
        <li><strong>To generate smart recommendations:</strong> Your current local temperature is used algorithmically on your device to generate "smart outfit suggestions." This data is not stored on our servers.</li>
        <li><strong>To improve our App:</strong> Anonymous crash reports help us identify bugs and improve user experience.</li>
      </ul>

      <h2>3. Will Your Information Be Shared With Anyone?</h2>
      <p>We only share information with the following third parties:</p>
      <ul>
        <li><strong>Weather API Providers:</strong> Your location coordinates (latitude and longitude) are sent to trusted third-party weather services (e.g., OpenWeatherMap, WeatherAPI) to retrieve the meteorological data necessary for the App to function.</li>
        <li><strong>Analytics and Error Reporting:</strong> We may use third-party tools to capture crash reports and general usage metrics. This data is fully anonymized.</li>
      </ul>
      <p>We do <strong>not</strong> sell, rent, or trade your personal or location data with advertising agencies or data brokers.</p>

      <h2>4. How Long Do We Keep Your Information?</h2>
      <p>We only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law. Because we do not require you to create an account, location data is only processed momentarily when you open the app or request a weather update, and is not stored in any permanent database by us.</p>

      <h2>5. How Do We Keep Your Information Safe?</h2>
      <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. All communications between the App and third-party weather APIs are encrypted using standard HTTPS/TLS protocols. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.</p>

      <h2>6. What Are Your Privacy Rights?</h2>
      <p>You can review, change, or terminate your location tracking permissions at any time by navigating to your device's Settings, finding our App, and adjusting the Location permissions.</p>

      <h2>7. Updates To This Notice</h2>
      <p>We may update this privacy notice from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.</p>

      <h2>8. Contact Us About This Notice</h2>
      <p>If you have questions or comments about this notice, you may email us at support@Atmosync.com.</p>
    </div>
  );
}

export default Privacy;
