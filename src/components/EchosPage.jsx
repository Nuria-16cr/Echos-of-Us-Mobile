import { useState, useEffect } from "react";
import "./EchosPage.css";

export default function EchosPage({ onStartChat, onNavigate }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const echos = [
    {
      name: "ALEX",
      image: "/Alex.png",
      description:
        "Caring and compassionate  Alex can be your best friend when you need it the most he will be there to listen, give advice and cheer you up.",
      backgroundColor: "#D6B9CA",
      textColor: "#792355",
      buttonColor: "#792355",
    },
    {
      name: "NOAH",
      image: "/Noah.png",
      description:
        "Chaotic and unapologetic, Noah is won't beat around the bush, chat to him for some tough love, a good laugh or a reality check. ",
      backgroundColor: "#A08BC1",
      textColor: "#5C338E",
      buttonColor: "#5C338E",
    },
    {
      name: "ELLIS",
      image: "/Ellis.png",
      description:
        "Energetic and positive, Ellis is a ray of sunshine, maybe her positivity is a bit overwhelming but she wont fail to cheer you up.",
      backgroundColor: "#EDD2AE",
      textColor: "#DA6127",
      buttonColor: "#FB9665",
    },
    {
      name: "ROBIN",
      image: "/Robin.png",
      description:
        "Calculated and intelligent, Robin is there for an analytical approach to all your problems, delve into philosophical queries and speculative theories.",
      backgroundColor: "#969D88",
      textColor: "#5F7543",
      buttonColor: "#5F7543",
    },
  ];

  return (
    <div className="echos-page">
      {/* Background Ellipses */}
      <div className="echos-background-ellipses">
        <div className="ellipse ellipse-1"></div>
        <div className="ellipse ellipse-2"></div>
        <div className="ellipse ellipse-3"></div>
        <div className="ellipse ellipse-4"></div>
        <div className="ellipse ellipse-5"></div>
        <div className="ellipse ellipse-6"></div>
      </div>

      {/* ECHOS Logo */}
      <div className="echos-logo-container">
        <img src="/echos-logo.svg" alt="ECHOS" className="echos-main-logo" />
      </div>

      {/* Navigation */}
      <nav className="echos-nav-bar">
        <span className="echos-nav-item" onClick={() => onNavigate("home")}>
          Home
        </span>
        <span className="echos-nav-item echos-nav-item-active">Echos</span>
        <span className="echos-nav-item" onClick={() => onNavigate("about")}>
          About
        </span>
      </nav>

      {/* Title */}
      <h1 className="echos-title">ECHOS</h1>

      {/* Echo Cards */}
      <div className="echos-cards-container">
        {echos.map((echo, index) => (
          <div
            key={echo.name}
            className="echo-card"
            style={{ background: echo.backgroundColor }}
          >
            <img src={echo.image} alt={echo.name} className="echo-card-image" />
            <div className="echo-card-content">
              <h2 className="echo-card-name" style={{ color: echo.textColor }}>
                {echo.name}
              </h2>
              <p className="echo-card-description">{echo.description}</p>
            </div>
            <div className="echo-card-button-container">
              <button
                className="echo-card-button"
                onClick={() =>
                  onStartChat(
                    echo.name.charAt(0) + echo.name.slice(1).toLowerCase()
                  )
                }
                style={{ color: echo.buttonColor }}
              >
                CHAT NOW
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="echos-footer-section">
        <div className="echos-footer-content">
          {/* Left Column - Socials */}
          <div className="echos-footer-column echos-footer-socials">
            <p className="echos-footer-text-large">
              See how we make an impact on peoples lives by supporting us on our
              socials
            </p>
            <div className="echos-social-icons">
              <img
                src="/icons/facebook-icon.svg"
                alt="Facebook"
                className="echos-social-icon"
              />
              <img
                src="/icons/instagram-icon.svg"
                alt="Instagram"
                className="echos-social-icon"
              />
              <img
                src="/icons/twitter-icon.svg"
                alt="Twitter"
                className="echos-social-icon-twitter"
              />
            </div>
          </div>

          {/* Middle Column - Navigation */}
          <div className="echos-footer-column echos-footer-nav">
            <p onClick={() => onNavigate && onNavigate("home")}>Home</p>
            <p onClick={() => onNavigate && onNavigate("echos")}>Echos</p>
            <p onClick={() => onNavigate && onNavigate("about")}>About</p>
          </div>

          {/* Right Column - Contact */}
          <div className="echos-footer-column echos-footer-contact">
            <div className="echos-contact-item">
              <img
                src="/icons/location-icon.svg"
                alt=""
                className="echos-contact-icon"
              />
              <p>ECHOS Co. 123 Mason Drive, Parkville</p>
            </div>
            <div className="echos-contact-item">
              <img
                src="/icons/phone-icon.svg"
                alt=""
                className="echos-contact-icon"
              />
              <p>+61 456 789 123</p>
            </div>
            <div className="echos-contact-item">
              <img
                src="/icons/email-icon.svg"
                alt=""
                className="echos-contact-icon echos-email-icon"
              />
              <p>echosofus@contactus.com</p>
            </div>
          </div>

          {/* Newsletter */}
          <div className="echos-footer-column echos-footer-newsletter">
            <p className="echos-footer-text-large">
              Receive special offers and our latest updates
            </p>
            <div className="echos-newsletter-form">
              <input
                type="email"
                placeholder="Enter email"
                className="echos-email-input"
              />
              <button className="echos-join-btn">Join</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
