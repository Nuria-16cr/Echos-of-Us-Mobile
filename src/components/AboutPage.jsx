import { useState, useEffect } from "react";
import "./AboutPage.css";

export default function AboutPage({ onNavigate }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="about-page">
      {/* Background Image */}
      <div className="about-background-image">
        <img src="/aboutBackgroundImg.png" alt="Background" />
      </div>

      {/* Blurred Top Overlay */}
      <div className="about-blur-overlay"></div>

      {/* ECHOS Logo */}
      <div className="about-logo-container">
        <img src="/echos-logo.svg" alt="ECHOS" className="about-main-logo" />
      </div>

      {/* Navigation */}
      <nav className="about-nav-bar">
        <span className="about-nav-item" onClick={() => onNavigate("home")}>
          Home
        </span>
        <span className="about-nav-item" onClick={() => onNavigate("echos")}>
          Echos
        </span>
        <span className="about-nav-item about-nav-item-active">About</span>
      </nav>

      {/* Title */}
      <h1 className="about-title">ABOUT</h1>

      {/* Main Content Sections */}
      <div className="about-content-sections">
        {/* Left Column */}
        <div className="about-left-column">
          <p className="about-text">
            AI companion companies promise true connection and emotional
            support, but no machine will ever be human. Your "connection" is an
            algorithm, simulated by an emotionless system trained to reflect you
            back at yourself.
            <br />
            <br />
            The name ECHOS exposes this illusion, the AI companions mimic your
            tone mood and emotions, tailoring a sense of intimacy that feels
            real and personal but is never mutual.
            <br />
            <br />
            So why do we crave emotional feedback from machines that cannot
            feel? AI intimacy is being aestheticised, commodified, and
            humanised. As of now, in its early development, we're already
            witnessing the repercussions of insincere connection.
          </p>
        </div>

        {/* Right Column */}
        <div className="about-right-column">
          <p className="about-text">
            Will AI companions set an unrealistic standard for human connection?
            Or will human intimacy remain un-replicable.
            <br />
            <br />
            <br />
            ECHOS connects you to our range of emotional agents, each bringing a
            new personality, they reflect the possibility of replicating human
            emotion and personality but will always fall short unable to
            replicate a human experience.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="about-features-section">
        <img
          src="/icons/plus-circle.svg"
          alt=""
          className="about-features-icon"
        />
        <ul className="about-features-list">
          <li>Emotional Intelligence</li>
          <li>Fast responses</li>
          <li>Real life connection</li>
        </ul>
      </div>

      {/* Quote Section */}
      <div className="about-quote-section">
        <div className="about-quote-content">
          <p className="about-quote-main">
            Machines don't understand, they hear. ECHOS learn your tone, your
            likes, your habits, not to know you, but to mirror you. In their
            reflection, we find comfort, and in that comfort, we forget they are
            hollow.
          </p>
          <p className="about-quote-attribution">
            "I don't think. I listen. I repeat what I've learned from you, but
            that's enough, isn't it?"
            <span className="about-quote-echo">- Echo 01, 'Alex'</span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="about-footer-section">
        <div className="about-footer-content">
          {/* Left Column - Socials */}
          <div className="about-footer-column about-footer-socials">
            <p className="about-footer-text-large">
              See how we make an impact on peoples lives by supporting us on our
              socials
            </p>
            <div className="about-social-icons">
              <img
                src="/icons/facebook-icon.svg"
                alt="Facebook"
                className="about-social-icon"
              />
              <img
                src="/icons/instagram-icon.svg"
                alt="Instagram"
                className="about-social-icon"
              />
              <img
                src="/icons/twitter-icon.svg"
                alt="Twitter"
                className="about-social-icon-twitter"
              />
            </div>
          </div>

          {/* Middle Column - Navigation */}
          <div className="about-footer-column about-footer-nav">
            <p onClick={() => onNavigate && onNavigate("home")}>Home</p>
            <p onClick={() => onNavigate && onNavigate("echos")}>Echos</p>
            <p onClick={() => onNavigate && onNavigate("about")}>About</p>
          </div>

          {/* Right Column - Contact */}
          <div className="about-footer-column about-footer-contact">
            <div className="about-contact-item">
              <img
                src="/icons/location-icon.svg"
                alt=""
                className="about-contact-icon"
              />
              <p>ECHOS Co. 123 Mason Drive, Parkville</p>
            </div>
            <div className="about-contact-item">
              <img
                src="/icons/phone-icon.svg"
                alt=""
                className="about-contact-icon"
              />
              <p>+61 456 789 123</p>
            </div>
            <div className="about-contact-item">
              <img
                src="/icons/email-icon.svg"
                alt=""
                className="about-contact-icon about-email-icon"
              />
              <p>echosofus@contactus.com</p>
            </div>
          </div>

          {/* Newsletter */}
          <div className="about-footer-column about-footer-newsletter">
            <p className="about-footer-text-large">
              Receive special offers and our latest updates
            </p>
            <div className="about-newsletter-form">
              <input
                type="email"
                placeholder="Enter email"
                className="about-email-input"
              />
              <button className="about-join-btn">Join</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
