import React, { useState, useEffect, useRef, useCallback } from "react";
import { Bot, Send, Mic, User, Sparkles, Heart } from "lucide-react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import "bootstrap/dist/css/bootstrap.min.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

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
        text: "Bonjour 👋 Je suis PsyBot, ton assistant bien-être.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];

    const saved = localStorage.getItem(`psybot_${userId || "guest"}`);
    const loaded = saved ? JSON.parse(saved) : defaultMsg;

    setMessages(loaded);
    setShowWelcome(loaded.length === 1);
  }, [userId]);

  // 💾 save chat (FIX)
  useEffect(() => {
    localStorage.setItem(`psybot_${userId || "guest"}`, JSON.stringify(messages));
  }, [messages, userId]);

  // 📜 scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // 🚀 send message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = {
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    resetTranscript();
    setShowWelcome(false);
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text, userId: userId || "guest" }),
      });

      const data = await res.json();

      const delay = 600 + Math.random() * 1000;

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

  // 🎤 mic
  const startMic = useCallback(() => {
    resetTranscript();
    setIsRecording(true);
    SpeechRecognition.startListening({ language: "fr-FR", continuous: true });
  }, []);

  const stopMic = useCallback(() => {
    setIsRecording(false);
    SpeechRecognition.stopListening();
  }, []);

  if (!browserSupportsSpeechRecognition)
    return <div style={styles.error}>🎤 Micro non supporté</div>;

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <Bot size={28} />
          <div>
            <h4 style={styles.title}>PsyBot</h4>
            <p style={styles.subtitle}>Assistant bien-être</p>
          </div>
        </div>
      </div>

      {/* WELCOME */}
      {showWelcome && (
        <div style={styles.welcome}>
          <Sparkles size={40} />
          <h2>Bienvenue ✨</h2>
          <p>Parle-moi librement, je t'écoute.</p>
        </div>
      )}

      {/* CHAT */}
      <div style={styles.chat}>
        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} />
        ))}

        {isTyping && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div style={styles.inputBar}>
        <input
          ref={inputRef}
          style={styles.input}
          value={input}
          placeholder={isRecording ? "🎤 J'écoute..." : "Message..."}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onMouseDown={startMic}
          onMouseUp={stopMic}
          onMouseLeave={stopMic}
          style={styles.mic}
        >
          <Mic />
        </button>

        <button onClick={sendMessage} style={styles.send}>
          <Send />
        </button>
      </div>

      <GlobalStyles />
    </div>
  );
};

// MESSAGE
const MessageBubble = ({ message }) => {
  const isBot = message.sender === "bot";

  return (
    <div style={{ display: "flex", justifyContent: isBot ? "flex-start" : "flex-end" }}>
      <div style={isBot ? styles.botBubble : styles.userBubble}>
        {message.text}
        <div style={styles.time}>{message.time}</div>
      </div>
    </div>
  );
};

// TYPING
const TypingIndicator = () => (
  <div style={styles.botBubble}>
    <div style={styles.dots}>
      <span />
      <span />
      <span />
    </div>
  </div>
);

// GLOBAL CSS
const GlobalStyles = () => (
  <style>{`
    @keyframes dot {
      0%,80%,100%{transform:scale(0)}
      40%{transform:scale(1)}
    }
    .dots span{
      width:6px;height:6px;margin:2px;background:white;border-radius:50%;
      display:inline-block;animation:dot 1.4s infinite;
    }
  `}</style>
);

// STYLES
const styles = {
  page: { height: "100vh", display: "flex", flexDirection: "column" },

  header: { padding: 20, background: "#667eea", color: "white" },
  headerContent: { display: "flex", gap: 10 },

  chat: { flex: 1, padding: 20, overflowY: "auto" },

  botBubble: {
    background: "#667eea",
    color: "white",
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
  },

  userBubble: {
    background: "#eee",
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
  },

  inputBar: { display: "flex", padding: 10, gap: 10 },

  input: { flex: 1, padding: 10 },

  mic: { padding: 10 },

  send: { padding: 10 },

  dots: { display: "flex" },

  time: { fontSize: 10, opacity: 0.6 },

  error: { padding: 20 },
};

export default Chatbot;