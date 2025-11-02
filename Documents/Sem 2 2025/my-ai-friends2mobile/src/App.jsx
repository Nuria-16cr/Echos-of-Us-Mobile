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
  const [errorMessage, setErrorMessage] = useState(null);
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
    if (e) e.preventDefault();

    if (!input.trim()) {
      return;
    }

    // Determine API URL
    const API_URL = window.location.hostname === "localhost" 
      ? "http://localhost:3001"
      : `${window.location.origin}/.netlify/functions`;

    // Clear previous errors
    setErrorMessage(null);

    const userMessage = { sender: "You", text: input, timestamp: new Date() };
    const currentInput = input; // Save input value
    setMessages((m) => [...m, userMessage]);
    setInput("");
    setLoading(true);
    
    // Fallback timeout - if still loading after 32 seconds, show error
    const timeoutId = setTimeout(() => {
      setLoading((currentLoading) => {
        if (currentLoading) {
          setLoading(false);
          setIsTyping(false);
          const timeoutError = {
            sender: currentChat,
            text: `❌ Request timed out\n\nNo response after 32 seconds.\n\nPossible issues:\n1. Netlify function not deployed\n2. OPENAI_API_KEY not set in Netlify\n3. Network connection problem\n\nCheck: Netlify dashboard → Functions tab`,
            displayText: "",
            timestamp: new Date(),
            fullyTyped: true,
          };
          setMessages((m) => [...m, timeoutError]);
        }
        return false;
      });
    }, 32000);

    // Update last used time when sending a message
    const newTime = new Date();
    setLastUsedTimes((prev) => {
      const updated = { ...prev, [currentChat]: newTime };
      localStorage.setItem("echosLastUsedTimes", JSON.stringify(updated));
      return updated;
    });

    // Determine API URL: Use Netlify function if deployed, otherwise use localhost
    let API_URL;
    try {
      // Determine API URL
      if (import.meta.env.VITE_API_URL) {
        // Custom API URL from environment variable (for external backend)
        API_URL = import.meta.env.VITE_API_URL;
      } else if (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname.startsWith("192.168.") ||
        window.location.hostname.startsWith("10.")
      ) {
        // Local development
        API_URL = "http://localhost:3001";
      } else {
        // Production (Netlify, GitHub Pages, or any deployed site)
        // Always use absolute URL for mobile browsers
        API_URL = `${window.location.origin}/.netlify/functions`;
      }
    } catch (urlError) {
      // Fallback API URL if there's an error determining it
      API_URL = `${window.location.origin}/.netlify/functions`;
    }

    try {
      console.log("Attempting to call:", `${API_URL}/chat`);
      console.log("Hostname:", window.location.hostname);
      console.log("Origin:", window.location.origin);
      console.log("Full URL:", window.location.href);
      console.log(
        "Is mobile:",
        /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      );

      // Show immediate status message
      const statusMessage = {
        sender: currentChat,
        text: `⏳ Connecting to server...\nURL: ${API_URL}/chat`,
        displayText: "",
        timestamp: new Date(),
        fullyTyped: true,
      };
      setMessages((m) => [...m, statusMessage]);

      // For mobile browsers, we need explicit CORS and no credentials
      const fetchOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          prompt: input,
          persona: currentChat,
        }),
        mode: "cors", // Explicit CORS mode for mobile
        cache: "no-cache", // Don't cache requests
      };

      // Clear any previous error
      setErrorMessage(null);

      // Add timeout for mobile networks (30 seconds)
      const controller = new AbortController();
      const fetchTimeoutId = setTimeout(() => controller.abort(), 30000);

      // SIMPLIFIED FETCH - Try with simple error handling
      let res;
      try {
        res = await fetch(`${API_URL}/chat`, {
          ...fetchOptions,
          signal: controller.signal,
        });
        clearTimeout(fetchTimeoutId);
        clearTimeout(timeoutId);
      } catch (fetchError) {
        clearTimeout(fetchTimeoutId);
        clearTimeout(timeoutId);
        
        // Show error in chat immediately
        const errorMsg = fetchError.name === "AbortError"
          ? "Request timed out after 30 seconds"
          : `Failed to connect: ${fetchError.message || "Network error"}`;
        
        const chatError = {
          sender: currentChat,
          text: `❌ Error: ${errorMsg}\n\nTrying: ${API_URL}/chat\n\nCheck Netlify Functions tab`,
          displayText: "",
          timestamp: new Date(),
          fullyTyped: true,
        };
        setMessages((m) => [...m, chatError]);
        setLoading(false);
        setIsTyping(false);
        return; // Exit early on network error
      }

      console.log("Response status:", res.status);
      console.log("Response ok:", res.ok);
      console.log("Response headers:", res.headers);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error:", res.status, errorText);
        let errorMsg = `Server responded with ${res.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMsg = errorJson.error || errorJson.details || errorMsg;
        } catch {
          // Not JSON, use text as is
          errorMsg = errorText || errorMsg;
        }

        // Show visible error for server errors
        if (res.status === 404) {
          setErrorMessage({
            type: "server",
            message:
              "Function not found. Please check Netlify function deployment.",
            details: `Status: ${res.status}. URL: ${API_URL}/chat`,
          });
        } else if (res.status === 500) {
          setErrorMessage({
            type: "server",
            message: "Server error. The API key may not be configured.",
            details: `Status: ${res.status}. ${errorMsg}`,
          });
        } else {
          setErrorMessage({
            type: "server",
            message: `Server error: ${errorMsg}`,
            details: `Status: ${res.status}`,
          });
        }

        throw new Error(errorMsg);
      }

      // Check if response is actually JSON
      let data;
      try {
        const text = await res.text();
        if (!text) {
          throw new Error("Empty response from server");
        }
        data = JSON.parse(text);
      } catch (parseError) {
        throw new Error(`Server response error: ${parseError.message || "Invalid response"}`);
      }

      console.log("Response data:", data);

      if (!data || !data.reply) {
        throw new Error("Server returned invalid response format");
      }

      // Clear debug message on success
      setErrorMessage(null);

      const aiMessage = {
        sender: currentChat,
        text: data.reply,
        displayText: "",
        timestamp: new Date(),
        fullyTyped: false,
      };
      setMessages((m) => [...m, aiMessage]);
      setIsTyping(true);
      clearTimeout(timeoutId); // Clear the fallback timeout on success
    } catch (err) {
      console.error(`Error talking to ${currentChat}:`, err);
      console.error("Error details:", err.message, err.stack);

      // Determine API URL for error message
      let errorAPI_URL;
      try {
        if (import.meta.env.VITE_API_URL) {
          errorAPI_URL = import.meta.env.VITE_API_URL;
        } else if (
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1" ||
          window.location.hostname.startsWith("192.168.") ||
          window.location.hostname.startsWith("10.")
        ) {
          errorAPI_URL = "http://localhost:3001";
        } else {
          errorAPI_URL = `${window.location.origin}/.netlify/functions`;
        }
      } catch {
        errorAPI_URL = `${window.location.origin}/.netlify/functions`;
      }

      // Show detailed error message in chat (guaranteed visibility)
      let errorText = `❌ ERROR: ${err.message}`;

      if (
        err.message.includes("Network") ||
        err.message.includes("Failed to fetch")
      ) {
        errorText = `❌ Cannot connect to server.\n\nTrying: ${errorAPI_URL}/chat\n\nPlease check:\n1. Internet connection\n2. Netlify function is deployed\n3. OPENAI_API_KEY is set in Netlify`;
      } else if (
        err.message.includes("404") ||
        err.message.includes("Function not found")
      ) {
        errorText = `❌ Function not found (404)\n\nNetlify function may not be deployed.\n\nCheck: Netlify dashboard → Functions`;
      } else if (
        err.message.includes("500") ||
        err.message.includes("API key")
      ) {
        errorText = `❌ Server error (500)\n\nOPENAI_API_KEY may not be configured.\n\nCheck: Netlify → Site settings → Environment variables`;
      } else if (err.message.includes("timeout")) {
        errorText = `❌ Request timed out\n\nServer took too long to respond.\n\nThis might be a network issue.`;
      }

      const chatErrorMessage = {
        sender: currentChat,
        text: errorText,
        displayText: "",
        timestamp: new Date(),
        fullyTyped: true,
      };
      setMessages((m) => [...m, chatErrorMessage]);
      
      // Always clear loading on error
      setLoading(false);
      setIsTyping(false);
      
      // IMPORTANT: Force clear the timeout
      try {
        clearTimeout(timeoutId);
      } catch (e) {
        // Ignore timeout clear errors
      }
    }

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
        {/* Error Banner - Visible on Mobile */}
        {errorMessage && (
          <div
            className="error-banner"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              backgroundColor:
                errorMessage.type === "debug" ? "#ffaa00" : "#ff4444",
              color: "white",
              padding: "16px 20px",
              zIndex: 99999,
              fontSize: "16px",
              fontWeight: "700",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              borderBottom: "3px solid rgba(255,255,255,0.3)",
            }}
          >
            <div style={{ marginBottom: "6px", fontSize: "18px" }}>
              {errorMessage.type === "debug" ? "🔄" : "⚠️"}{" "}
              {errorMessage.message}
            </div>
            <div style={{ fontSize: "13px", opacity: 0.95, lineHeight: "1.4" }}>
              {errorMessage.details}
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "rgba(255,255,255,0.4)",
                border: "2px solid white",
                color: "white",
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: "1",
              }}
            >
              ×
            </button>
          </div>
        )}
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
