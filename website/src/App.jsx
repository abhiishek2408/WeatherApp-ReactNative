import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Support from './pages/Support';

function Navigation() {
  const location = useLocation();
  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <img src="/custom_icon.png" alt="Logo" />
          <span>Atmosync</span>
        </div>
        <nav className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/privacy" className={location.pathname === '/privacy' ? 'active' : ''}>Privacy</Link>
          <Link to="/terms" className={location.pathname === '/terms' ? 'active' : ''}>Terms</Link>
          <Link to="/support" className={location.pathname === '/support' ? 'active' : ''}>Support</Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <span>Atmosync</span>
          <p>Your aesthetic, minimalist companion for global weather.</p>
        </div>
        <div className="footer-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/support">Support</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Atmosync. All rights reserved.</p>
      </div>
    </footer>
  );
}

function App() {
  return (
    <Router>
      <Navigation />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/support" element={<Support />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
