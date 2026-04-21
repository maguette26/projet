import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  Send,
  Mic,
  Settings,
  History,
  Sparkles,
  MessageCircle,
  User,
} from "lucide-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "bootstrap/dist/css/bootstrap.min.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");

  const bottomRef = useRef(null);

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  // 🎤 speech to text
  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  // 🔐 auth sync
  useEffect(() => {
    const sync = () => setUserId(localStorage.getItem("userId"));
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  // 💬 load chat
  useEffect(() => {
    const defaultMsg = [
      {
        sender: "bot",
        text: "Bonjour 👋 Je suis PsyBot, ton assistant bien-être. Comment te sens-tu aujourd'hui ?",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ];

    const saved = localStorage.getItem(`psybot_${userId || "guest"}`);
    setMessages(saved ? JSON.parse(saved) : defaultMsg);
  }, [userId]);

  // 💾 save chat (corrigé pour guest)
  useEffect(() => {
    localStorage.setItem(
      `psybot_${userId || "guest"}`,
      JSON.stringify(messages)
    );
  }, [messages, userId]);

  // 📜 scroll auto
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // 🚀 send message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = {
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    resetTranscript();
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.text,
          userId: userId || "guest",
        }),
      });

      const data = await res.json();

      // ⏳ delay réaliste
      const delay = Math.random() * 800 + 400;

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: data.reply,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
        setIsTyping(false);
      }, delay);
    } catch {
      setIsTyping(false);
    }
  };

  // 🎤 push-to-talk
  const startMic = () => {
    resetTranscript();
    setIsRecording(true);
    SpeechRecognition.startListening({
      language: "fr-FR",
      continuous: true,
    });
  };

  const stopMic = () => {
    setIsRecording(false);
    SpeechRecognition.stopListening();
  };

  if (!browserSupportsSpeechRecognition)
    return <p>Micro non supporté</p>;

  return (
    <div style={styles.page}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logo}>
            <Sparkles size={24} style={styles.iconGlow} />
            <h3 style={styles.logoText}>PsyBot</h3>
          </div>
          <p style={styles.sidebarSubtitle}>Ton assistant bien-être</p>
        </div>

        <div style={styles.nav}>
          <SidebarButton
            icon={<MessageCircle size={20} />}
            label="Chat"
            active={activeTab === "chat"}
            onClick={() => setActiveTab("chat")}
          />
          <SidebarButton
            icon={<History size={20} />}
            label="Historique"
            active={activeTab === "history"}
            onClick={() => setActiveTab("history")}
          />
          <SidebarButton
            icon={<User size={20} />}
            label="Profil"
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          />
          <SidebarButton
            icon={<Settings size={20} />}
            label="Paramètres"
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          />
        </div>

        <div style={styles.status}>
          <div style={styles.statusIndicator} />
          <span style={styles.statusText}>En ligne</span>
        </div>
      </div>

      {/* MAIN */}
      <div style={styles.mainContent}>
        <div style={styles.contentHeader}>
          <div style={styles.headerTitle}>
            <Bot size={28} style={styles.botIcon} />
            <div>
              <h2 style={styles.chatTitle}>PsyBot</h2>
              <p style={styles.chatSubtitle}>
                Comment te sens-tu aujourd'hui ?
              </p>
            </div>
          </div>
        </div>

        {activeTab === "chat" ? (
          <>
            <div style={styles.chat}>
              {messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.messageRow,
                    justifyContent:
                      m.sender === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      ...styles.message,
                      background:
                        m.sender === "user"
                          ? styles.userMessage.background
                          : styles.botMessage.background,
                      color:
                        m.sender === "user"
                          ? styles.userMessage.color
                          : styles.botMessage.color,
                    }}
                  >
                    <div>{m.text}</div>
                    <div style={styles.messageTime}>{m.time}</div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div style={styles.typingBubble}>PsyBot écrit...</div>
              )}

              <div ref={bottomRef} />
            </div>

            <div style={styles.inputContainer}>
              <div style={styles.inputWrapper}>
                <input
                  style={styles.input}
                  value={input}
                  placeholder={
                    isRecording
                      ? "🎤 J'écoute..."
                      : "Tape ton message..."
                  }
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && sendMessage()
                  }
                />
                <button
                  onMouseDown={startMic}
                  onMouseUp={stopMic}
                  onMouseLeave={stopMic}
                  style={styles.micButton}
                >
                  <Mic size={18} />
                </button>
                <button
                  onClick={sendMessage}
                  style={styles.sendButton}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div style={styles.placeholder}>
            <h3>{activeTab}</h3>
            <p>Fonctionnalité en cours...</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Sidebar button
const SidebarButton = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      ...styles.sidebarButton,
      background: active ? "#3742fa" : "transparent",
      color: active ? "white" : "#4a5568",
    }}
  >
    {icon} {label}
  </button>
);

// STYLES
const styles = {
  page: { display: "flex", height: "100vh" },

  sidebar: {
    width: 250,
    background: "#fff",
    padding: 20,
    display: "flex",
    flexDirection: "column",
  },

  mainContent: { flex: 1, display: "flex", flexDirection: "column" },

  chat: { flex: 1, overflowY: "auto", padding: 20 },

  messageRow: { display: "flex", marginBottom: 10 },

  message: {
    padding: 10,
    borderRadius: 10,
    maxWidth: "70%",
  },

  userMessage: { background: "#3742fa", color: "#fff" },
  botMessage: { background: "#eee", color: "#000" },

  inputContainer: { padding: 10 },
  inputWrapper: { display: "flex", gap: 10 },

  input: { flex: 1, padding: 10 },

  micButton: { padding: 10 },
  sendButton: { padding: 10 },

  placeholder: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
};

export default Chatbot;