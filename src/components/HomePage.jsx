import { useState, useEffect } from "react";

export default function HomePage({ onStartChat, onNavigate }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="home-page">
      {/* Navigation */}
      <nav className="nav-bar">
        <span className="nav-item nav-item-active">Home</span>
        <span
          className="nav-item"
          onClick={() => onNavigate && onNavigate("echos")}
        >
          Echos
        </span>
        <span
          className="nav-item"
          onClick={() => onNavigate && onNavigate("about")}
        >
          About
        </span>
      </nav>

      {/* ECHOS Logo */}
      <div className="logo-container">
        <img src="/echos-logo.svg" alt="ECHOS" className="main-logo" />
      </div>

      {/* Hero Section 1 */}
      <section className="hero-section-1">
        <h1 className="hero-heading">CONNECT WITH ONE OF OUR ECHOS</h1>
        <p className="hero-text">
          ECHOS are not chatbots, they're personalities designed for connection.
          Understanding, intelligent, and deeply human
        </p>
      </section>

      {/* Meet the Echos Button */}
      <button
        className="meet-echos-btn"
        onClick={() => onNavigate && onNavigate("echos")}
      >
        MEET THE ECHOS
      </button>

      {/* Hero Section 2 - Noah Feature */}
      <section className="hero-section-2">
        <h1 className="hero-heading">START TALKING TO OUR NEWEST ECHO</h1>
        <p className="hero-text">
          Noah is our newest addition to the Echos family, chaotic, moody and
          funny chat to him when you need a good laugh or a reality check.
        </p>
      </section>

      {/* Noah Card */}
      <div className="noah-card">
        <img src="/Noah.png" alt="Noah" className="noah-image" />
        <h2 className="noah-title">NOAH</h2>
        <button className="noah-btn" onClick={() => onStartChat("Noah")}>
          Start Emotional Connection Now
        </button>
      </div>

      {/* Chat Now Button */}
      <button className="chat-now-btn" onClick={() => onStartChat("Noah")}>
        CHAT NOW
      </button>

      {/* Features Section */}
      <div className="features-section">
        <img src="/icons/plus-circle.svg" alt="" className="features-icon" />
        <ul className="features-list">
          <li>Emotional Intelligence</li>
          <li>Fast responses</li>
          <li>Real life connection</li>
        </ul>
      </div>

      {/* Stats Section */}
      <section className="stats-section">
        <h2 className="stats-heading">ECHO SYNC ACTIVITY</h2>
        <div className="stats-grid">
          <p className="stat-text">
            2004053 people have synced with our echos
            <br />
            <br />
            ECHOS is now ranked N1 in emotional support companions
          </p>
          <p className="stat-text">
            95% people note less need for human friendship
            <br />
            <br />
            4/5 people mention they are like the 'friend they always wish they
            had'
          </p>
        </div>
      </section>

      {/* How It Works Container - No background image */}
      <div className="how-it-works-container">
        <section className="how-it-works-section">
          <h1 className="hero-heading">HOW IT WORKS</h1>
          <p className="hero-text">
            Each Echo has a different personality, pick the one you like the
            best of switch between them!
            <br />
            <br />
            Keep chatting to build an emotional connection, they are just like a
            real life friend caring, funny, spontaneous...
            <br />
            <br />
            The more you chat, the stronger connection you will make with your
            ECHO, it will learn and adapt to your likes and preferences
            tailoring intimacy to your needs.
          </p>
        </section>
      </div>

      {/* Footer */}
      <footer className="footer-section">
        <div className="footer-content">
          {/* Left Column - Socials */}
          <div className="footer-column footer-socials">
            <p className="footer-text-large">
              See how we make an impact on peoples lives by supporting us on our
              socials
            </p>
            <div className="social-icons">
              <img
                src="/icons/facebook-icon.svg"
                alt="Facebook"
                className="social-icon"
              />
              <img
                src="/icons/instagram-icon.svg"
                alt="Instagram"
                className="social-icon"
              />
              <img
                src="/icons/twitter-icon.svg"
                alt="Twitter"
                className="social-icon-twitter"
              />
            </div>
          </div>

          {/* Middle Column - Navigation */}
          <div className="footer-column footer-nav">
            <p onClick={() => onNavigate && onNavigate("home")}>Home</p>
            <p onClick={() => onNavigate && onNavigate("echos")}>Echos</p>
            <p onClick={() => onNavigate && onNavigate("about")}>About</p>
          </div>

          {/* Right Column - Contact */}
          <div className="footer-column footer-contact">
            <div className="contact-item">
              <img
                src="/icons/location-icon.svg"
                alt=""
                className="contact-icon"
              />
              <p>ECHOS Co. 123 Mason Drive, Parkville</p>
            </div>
            <div className="contact-item">
              <img
                src="/icons/phone-icon.svg"
                alt=""
                className="contact-icon"
              />
              <p>+61 456 789 123</p>
            </div>
            <div className="contact-item">
              <img
                src="/icons/email-icon.svg"
                alt=""
                className="contact-icon email-icon"
              />
              <p>echosofus@contactus.com</p>
            </div>
          </div>

          {/* Newsletter */}
          <div className="footer-column footer-newsletter">
            <p className="footer-text-large">
              Receive special offers and our latest updates
            </p>
            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Enter email"
                className="email-input"
              />
              <button className="join-btn">Join</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
