# Atmosync 🌤️

Atmosync is a premium, cross-platform weather application that blends highly accurate meteorological data with a beautiful, modern glassmorphic UI. 

This repository is structured into two main parts: the mobile application and the companion website.

## 📁 Repository Structure

### 1. `androidApp/`
This folder contains the complete source code for the **React Native** mobile application. 
- **Features:** Global AQI explorer, smart outfit suggestions, 7-day trend forecasts, and a minimalist theme.
- **Tech Stack:** React Native CLI, AsyncStorage, Vector Icons.

**To run the mobile app locally:**
```bash
cd androidApp
npm install
npx react-native run-android
```

### 2. `website/`
This folder contains the official companion website built to host the legal pages required for Google Play Store publication.
- **Pages:** Privacy Policy, Terms of Service, and Support (FAQ).
- **Tech Stack:** React, Vite, React Router DOM.

**To run the website locally:**
```bash
cd website
npm install
npm run dev
```

## 🎨 Design Philosophy
Atmosync heavily relies on a dark aesthetic (`#121212`) combined with translucent purple glassmorphism (`#6b21a8`) to deliver an immersive and aesthetic weather tracking experience.

## 🤝 Support
If you have any questions or find any bugs, please reach out to **support@atmosync.com**.
