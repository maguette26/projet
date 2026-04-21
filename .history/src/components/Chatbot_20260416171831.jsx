import React, { useState, useEffect, useRef } from "react";
import { Bot, Send, Mic, Plus } from "lucide-react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import "bootstrap/dist/css/bootstrap.min.css";

const Chatbot = () => {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [dark, setDark] = useState(false);

  const bottomRef = useRef(null);

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  // 🎤 voice
  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  // 🔐 auth
  useEffect(() => {
    const sync = () => setUserId(localStorage.getItem("userId"));
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  // 🆕 INIT CHAT
  useEffect(() => {
    if (conversations.length === 0) {
      const first = {
        id: Date.now(),
        title: "Nouvelle conversation",
        messages: [
          {
            sender: "bot",
            text: "Bonjour 👋 Je suis PsyBot.",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ],
      };

      setConversations([first]);
      setActiveId(first.id);
    }
  }, []);

  const activeChat = conversations.find((c) => c.id === activeId);

  // 💾 save
  useEffect(() => {
    if (userId) {
      localStorage.setItem(
        `psybot_chats_${userId}`,
        JSON.stringify(conversations)
      );
    }
  }, [conversations, userId]);

  // 📜 scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, isTyping]);

  // 🆕 new chat
  const newChat = () => {
    const chat = {
      id: Date.now(),
      title: "Nouvelle conversation",
      messages: [],
    };
    setConversations([chat, ...conversations]);
    setActiveId(chat.id);
  };

  // 🚀 send
  const sendMessage = async () => {
    if (!input.trim()) return;

    const msg = {
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    updateChat(msg);
    setInput("");
    resetTranscript();
    setIsTyping(true);

    const res = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg.text, userId: userId || "guest" }),
    });

    const data = await res.json();

    updateChat({
      sender: "bot",
      text: data.reply,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    setIsTyping(false);
  };

  const updateChat = (message) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, message] }
          : c
      )
    );
  };

  if (!browserSupportsSpeechRecognition)
    return <p>Micro non supporté</p>;

  return (
    <div style={styles.app}>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <button style={styles.newBtn} onClick={newChat}>
          <Plus size={16} /> New chat
        </button>

        {conversations.map((c) => (
          <div
            key={c.id}
            onClick={() => setActiveId(c.id)}
            style={{
              ...styles.chatItem,
              background: c.id === activeId ? "#2f2f2f" : "transparent",
            }}
          >
            💬 {c.title}
          </div>
        ))}

        <button
          style={styles.theme}
          onClick={() => setDark(!dark)}
        >
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* CHAT AREA */}
      <div style={dark ? styles.chatDark : styles.chatLight}>

        {/* HEADER INTEGRÉ */}
        <div style={styles.header}>
          <Bot size={20} />
          <div>
            <div style={{ fontWeight: 600 }}>PsyBot</div>
            <div style={{ fontSize: 12, opacity: 0.6 }}>
              Assistant bien-être intelligent
            </div>
          </div>
        </div>

        {/* MESSAGES */}
        <div style={styles.messages}>
          {activeChat?.messages.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent:
                  m.sender === "user" ? "flex-end" : "flex-start",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  ...styles.msg,
                  background:
                    m.sender === "user" ? "#1f6feb" : "#2a2a2a",
                  color: "white",
                }}
              >
                {m.text}
                <div style={styles.time}>{m.time}</div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={styles.typing}>PsyBot écrit...</div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div style={styles.inputBar}>
          <input
            style={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button
            onMouseDown={() => {
              resetTranscript();
              setIsRecording(true);
              SpeechRecognition.startListening({ language: "fr-FR" });
            }}
            onMouseUp={() => {
              setIsRecording(false);
              SpeechRecognition.stopListening();
            }}
            style={{
              ...styles.mic,
              background: isRecording ? "red" : "#444",
            }}
          >
            <Mic size={16} color="white" />
          </button>

          <button onClick={sendMessage} style={styles.send}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

/* ================= STYLES ================= */

const styles = {
  app: {
    display: "flex",
    height: "100vh",
    fontFamily: "system-ui",
  },

  sidebar: {
    width: 260,
    background: "#111",
    color: "white",
    padding: 10,
    display: "flex",
    flexDirection: "column",
  },

  newBtn: {
    padding: 10,
    marginBottom: 10,
    background: "#2a2a2a",
    border: "none",
    color: "white",
    borderRadius: 8,
    cursor: "pointer",
  },

  chatItem: {
    padding: 10,
    borderRadius: 6,
    cursor: "pointer",
    marginBottom: 5,
  },

  theme: {
    marginTop: "auto",
    padding: 10,
    background: "#333",
    border: "none",
    color: "white",
    borderRadius: 8,
  },

  chatLight: {
    flex: 1,
    background: "#f7f7f8",
    display: "flex",
    flexDirection: "column",
  },

  chatDark: {
    flex: 1,
    background: "#1e1e1e",
    display: "flex",
    flexDirection: "column",
    color: "white",
  },

  header: {
    padding: 12,
    borderBottom: "1px solid #333",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  messages: {
    flex: 1,
    overflowY: "auto",
    padding: 20,
  },

  msg: {
    padding: 10,
    borderRadius: 10,
    maxWidth: "70%",
  },

  time: {
    fontSize: 10,
    opacity: 0.5,
    marginTop: 4,
  },

  typing: {
    padding: 10,
    background: "#333",
    borderRadius: 10,
    width: 120,
  },

  inputBar: {
    display: "flex",
    padding: 10,
    gap: 8,
    borderTop: "1px solid #333",
  },

  input: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    border: "none",
    outline: "none",
  },

  mic: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    border: "none",
  },

  send: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    background: "#1f6feb",
    border: "none",
    color: "white",
  },
};