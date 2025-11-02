import { useState, useEffect } from "react";
import HomePage from "./components/HomePage";
import EchosPage from "./components/EchosPage";
import AboutPage from "./components/AboutPage";
import "./components/HomePage.css";

export default function App() {
  const [currentView, setCurrentView] = useState("home");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentChat, setCurrentChat] = useState("Alex");
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [lastUsedTimes, setLastUsedTimes] = useState(() => {
    // Initialize from localStorage or create empty object
    const stored = localStorage.getItem("echosLastUsedTimes");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      const converted = {};
      Object.keys(parsed).forEach((key) => {
        converted[key] = new Date(parsed[key]);
      });
      return converted;
    }
    return {};
  });

  const handleStartChat = (personaName) => {
    setCurrentChat(personaName);
    setCurrentView("chat");
    setMessages([]); // Clear messages when switching personas
    // Update last used time
    const newTime = new Date();
    setLastUsedTimes((prev) => {
      const updated = { ...prev, [personaName]: newTime };
      localStorage.setItem("echosLastUsedTimes", JSON.stringify(updated));
      return updated;
    });
  };

  const handleBackToHome = () => {
    setCurrentView("home");
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    const messagesContainer = document.querySelector(".messages-container");
    if (messagesContainer) {
      messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Typewriter effect for AI messages
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (
      lastMessage &&
      lastMessage.sender !== "You" &&
      !lastMessage.fullyTyped &&
      lastMessage.displayText !== undefined
    ) {
      let currentIndex = lastMessage.displayText.length;
      const fullText = lastMessage.text;

      if (currentIndex < fullText.length) {
        const typeInterval = setInterval(() => {
          currentIndex++;
          if (currentIndex <= fullText.length) {
            setMessages((prev) => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = {
                ...newMessages[newMessages.length - 1],
                displayText: fullText.substring(0, currentIndex),
              };
              return newMessages;
            });
          }

          if (currentIndex >= fullText.length) {
            setMessages((prev) => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = {
                ...newMessages[newMessages.length - 1],
                fullyTyped: true,
              };
              return newMessages;
            });
            setIsTyping(false);
            clearInterval(typeInterval);
          }
        }, 30); // 30ms per character for handwriting speed

        return () => clearInterval(typeInterval);
      }
    }
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "You", text: input, timestamp: new Date() };
    setMessages((m) => [...m, userMessage]);
    setInput("");
    setLoading(true);

    // Update last used time when sending a message
    const newTime = new Date();
    setLastUsedTimes((prev) => {
      const updated = { ...prev, [currentChat]: newTime };
      localStorage.setItem("echosLastUsedTimes", JSON.stringify(updated));
      return updated;
    });

    try {
      // Use environment variable for API URL, fallback to localhost for development
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: input,
          persona: currentChat, // Send the current persona name
        }),
      });

      const data = await res.json();
      const aiMessage = {
        sender: currentChat,
        text: data.reply,
        displayText: "",
        timestamp: new Date(),
        fullyTyped: false,
      };
      setMessages((m) => [...m, aiMessage]);
      setIsTyping(true);
    } catch (err) {
      console.error(`Error talking to ${currentChat}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const chatFriends = [
    {
      name: "Alex",
      avatar: "/Alex.png",
      preview: "This is a text message with Alex, resume talking.",
      colors: {
        primary: "#792355",
        secondary: "#a53c81",
        accent: "#edaacc",
      },
    },
    {
      name: "Noah",
      avatar: "/Noah.png",
      preview: "This is a text message with Noah, resume talking.",
      colors: {
        primary: "#5c338e",
        secondary: "#7d4db3",
        accent: "#b899e0",
      },
    },
    {
      name: "Ellis",
      avatar: "/Ellis.png",
      preview: "This is a text message with Ellis, resume talking.",
      colors: {
        primary: "#734283",
        secondary: "#B9DABB",
        accent: "#F7D180",
      },
    },
    {
      name: "Robin",
      avatar: "/Robin.png",
      preview: "This is a text message with Robin, resume talking.",
      colors: {
        primary: "#DC584F",
        secondary: "#D78861",
        accent: "#ABDF7B",
      },
    },
  ];

  if (currentView === "home") {
    return (
      <HomePage onStartChat={handleStartChat} onNavigate={handleNavigate} />
    );
  }

  if (currentView === "echos") {
    return (
      <EchosPage onStartChat={handleStartChat} onNavigate={handleNavigate} />
    );
  }

  if (currentView === "about") {
    return <AboutPage onNavigate={handleNavigate} />;
  }

  return (
    <div className="app">
      {/* Background Ellipses */}
      <div className="background-ellipses">
        <div
          className="ellipse ellipse-1"
          style={{
            background:
              currentChat === "Alex"
                ? "#EC2A42"
                : currentChat === "Noah"
                ? "#E2615C"
                : currentChat === "Ellis"
                ? "#F7D180"
                : "#ABDF7B",
          }}
        ></div>
        <div
          className="ellipse ellipse-2"
          style={{
            background:
              currentChat === "Alex"
                ? "#EC2A42"
                : currentChat === "Noah"
                ? "#E2615C"
                : currentChat === "Ellis"
                ? "#F7D180"
                : "#ABDF7B",
          }}
        ></div>
        <div
          className="ellipse ellipse-3"
          style={{
            background:
              currentChat === "Alex"
                ? "#A4435A"
                : currentChat === "Noah"
                ? "#19669E"
                : currentChat === "Ellis"
                ? "#734283"
                : "#DC584F",
          }}
        ></div>
        <div
          className="ellipse ellipse-4"
          style={{
            background:
              currentChat === "Alex"
                ? "#A4435A"
                : currentChat === "Noah"
                ? "#19669E"
                : currentChat === "Ellis"
                ? "#734283"
                : "#DC584F",
          }}
        ></div>
        <div
          className="ellipse ellipse-5"
          style={{
            background:
              currentChat === "Alex"
                ? "#8D95AB"
                : currentChat === "Noah"
                ? "#D34269"
                : currentChat === "Ellis"
                ? "#B9DABB"
                : "#D78861",
          }}
        ></div>
        <div
          className="ellipse ellipse-6"
          style={{
            background:
              currentChat === "Alex"
                ? "#8D95AB"
                : currentChat === "Noah"
                ? "#D34269"
                : currentChat === "Ellis"
                ? "#B9DABB"
                : "#D78861",
          }}
        ></div>
        <div
          className="ellipse ellipse-7"
          style={{
            background:
              currentChat === "Alex"
                ? "#EC2A42"
                : currentChat === "Noah"
                ? "#E2615C"
                : currentChat === "Ellis"
                ? "#F7D180"
                : "#ABDF7B",
          }}
        ></div>
        <div
          className="ellipse ellipse-8"
          style={{
            background:
              currentChat === "Alex"
                ? "#EC2A42"
                : currentChat === "Noah"
                ? "#E2615C"
                : currentChat === "Ellis"
                ? "#F7D180"
                : "#ABDF7B",
          }}
        ></div>
      </div>

      {/* Main Container */}
      <div className="main-container">
        <div className="main-content-wrapper">
          {/* Header Section - Above Chat Area */}
          <div className="chat-header-section">
            {/* Header */}
            <div className="sidebar-header">
              <div className="header-left">
                <img
                  src="/echos-logo.svg"
                  alt="ECHOS"
                  className="sidebar-logo"
                />
              </div>
            </div>
            <div className="sidebar-all-echos">
              <button
                onClick={handleBackToHome}
                className="back-arrow-button"
                title="Back to Home"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 18L9 12L15 6"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <span className="all-echos-text">All Echos</span>
            </div>

            {/* Search Bar */}
            <div className="search-container">
              <div className="search-bar">
                <div className="search-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                      stroke="#9FA7BE"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search or start a new chat"
                  className="search-input"
                />
              </div>
            </div>
          </div>

          {/* Content Area - Sidebar and Chat */}
          <div className="chat-content-wrapper">
            {/* Left Sidebar - Chat Rooms Only */}
            <div className="sidebar">
              {/* Chat Rooms List */}
              <div className="chat-rooms">
                {chatFriends.map((friend, index) => (
                  <div
                    key={friend.name}
                    className={`chat-room ${
                      currentChat === friend.name ? "active" : ""
                    }`}
                    data-persona={friend.name}
                    onClick={() => {
                      setCurrentChat(friend.name);
                      setMessages([]); // Clear messages when switching
                      // Update last used time
                      const newTime = new Date();
                      setLastUsedTimes((prev) => {
                        const updated = { ...prev, [friend.name]: newTime };
                        localStorage.setItem(
                          "echosLastUsedTimes",
                          JSON.stringify(updated)
                        );
                        return updated;
                      });
                    }}
                  >
                    <div className="chat-avatar">
                      <img src={friend.avatar} alt={friend.name} />
                    </div>
                    <div className="chat-info">
                      <div className="chat-header">
                        <h4>{friend.name}</h4>
                      </div>
                      <div className="chat-time">
                        <div className="clock-icon">
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                            fill="none"
                          >
                            <circle
                              cx="6.5"
                              cy="6.5"
                              r="5.5"
                              stroke="currentColor"
                              strokeWidth="1"
                            />
                            <path
                              d="M6.5 3V6.5L9 9"
                              stroke="currentColor"
                              strokeWidth="1"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                        <span>
                          Last emotional sync:{" "}
                          {lastUsedTimes[friend.name]
                            ? formatTime(new Date(lastUsedTimes[friend.name]))
                            : "Never"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Chat Area */}
            <div className="chat-area" data-persona={currentChat}>
              {/* Chat Header */}
              <div className="chat-header">
                <div className="user-info">
                  <div className="user-avatar">
                    <img
                      src={
                        currentChat === "Alex"
                          ? "/Alex.png"
                          : currentChat === "Noah"
                          ? "/Noah.png"
                          : currentChat === "Ellis"
                          ? "/Ellis.png"
                          : currentChat === "Robin"
                          ? "/Robin.png"
                          : "/Alex.png"
                      }
                      alt={currentChat}
                    />
                  </div>
                  <div>
                    <h3>{currentChat.toUpperCase()}</h3>
                    <div className="user-tone">
                      Tone:{" "}
                      {currentChat === "Alex"
                        ? "Calm Attentive"
                        : currentChat === "Noah"
                        ? "Unhinged & Chaotic"
                        : currentChat === "Ellis"
                        ? "Positive & Enthusiastic"
                        : currentChat === "Robin"
                        ? "Teacher & Mentor"
                        : "Unknown"}
                    </div>
                  </div>
                </div>
                <div className="header-actions">
                  <div className="echo-status">
                    <div className="echo-status-circle"></div>
                    <span>ECHO ACTIVE</span>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="messages-container">
                {messages.length === 0 ? (
                  <div className="messages-group">
                    <div className="message-bubble left">
                      <div className="message-content">
                        <div className="message-text">
                          {currentChat === "Robin"
                            ? "Hello! Ready to learn something new? 📚"
                            : currentChat === "Ellis"
                            ? "YOOO HEY!!! 😊✨ I'm Ellis and I'm SO EXCITED to chat with you!! What's going on today? This is gonna be AWESOME!!! 🎉🔥"
                            : currentChat === "Noah"
                            ? "hey. what the fuck you want"
                            : `Hey! I'm ${currentChat}. What's up? 🌿`}
                        </div>
                        <div className="message-time">
                          {formatTime(new Date())}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="messages-group">
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`message-bubble ${
                          msg.sender === "You" ? "right" : "left"
                        }`}
                      >
                        <div className="message-content">
                          <div className="message-text">
                            {msg.sender === "You"
                              ? msg.text
                              : msg.displayText || msg.text}
                          </div>
                          <div className="message-time">
                            {formatTime(msg.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="message-bubble left">
                        <div className="message-content">
                          <div className="message-text">
                            {currentChat} is typing...
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="message-input-container">
                <form onSubmit={sendMessage} className="message-input">
                  <div className="emoji-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="#F6F0EC"
                        strokeWidth="2"
                      />
                      <path
                        d="M8 14S9.5 16 12 16S16 14 16 14M9 9H9.01M15 9H15.01"
                        stroke="#F6F0EC"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div className="input-field">
                    <div className="input-line"></div>
                    <input
                      type="text"
                      placeholder="Type your message here ..."
                      className="message-text-input"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="send-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                        stroke="#F6F0EC"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="calibration-notice">
          *All conversations are stored for emotional calibration
        </div>
      </div>
    </div>
  );
}
