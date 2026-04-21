import React, { useState, useEffect, useRef } from "react";
import { Bot, Send } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState("default");

  const bottomRef = useRef(null);

  // ================= AUTH =================
  useEffect(() => {
    const sync = () => setUserId(localStorage.getItem("userId"));
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  // ================= LOAD CHAT =================
  useEffect(() => {
    const saved = localStorage.getItem(`chat_${userId}_${activeChat}`);

    const defaultMsg = [
      {
        sender: "bot",
        text: "Bonjour 👋 Je suis PsyBot.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];

    setMessages(saved ? JSON.parse(saved) : defaultMsg);
  }, [userId, activeChat]);

  // ================= SAVE CHAT =================
  useEffect(() => {
    if (!userId) return;

    localStorage.setItem(
      `chat_${userId}_${activeChat}`,
      JSON.stringify(messages)
    );
  }, [messages, userId, activeChat]);

  // ================= LOAD SIDEBAR =================
  useEffect(() => {
    if (!userId) return;

    const keys = Object.keys(localStorage)
      .filter(k => k.startsWith(`chat_${userId}_`));

    setConversations(keys.map(k => k.replace(`chat_${userId}_`, "")));
  }, [userId, messages]);

  // ================= SEND =================
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = {
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          userId: userId || "guest",
        }),
      });

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: data.reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Erreur serveur 😢", time: "..." },
      ]);
    }
  };

  // ================= NEW CHAT =================
  const newChat = () => {
    setActiveChat(Date.now().toString());
  };

  // ================= SCROLL =================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={styles.container}>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <button onClick={newChat} style={styles.newChat}>
          + New chat
        </button>

        <div style={styles.convList}>
          {conversations.map((c, i) => (
            <div
              key={i}
              onClick={() => setActiveChat(c)}
              style={styles.convItem}
            >
              💬 {c.slice(0, 10)}
            </div>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div style={styles.main}>

        {/* HEADER */}
        <div style={styles.header}>
          <Bot size={18} />
          <span>PsyBot</span>
        </div>

        {/* CHAT */}
        <div style={styles.chat}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                ...styles.msgRow,
                justifyContent: m.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  ...styles.msg,
                  background: m.sender === "user" ? "#1f6feb" : "#f1f1f1",
                  color: m.sender === "user" ? "white" : "black",
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div style={styles.inputBar}>
          <input
            style={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Message..."
          />

          <button onClick={sendMessage} style={styles.send}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

/* ================= STYLE ================= */

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "system-ui",
  },

  sidebar: {
    width: 260,
    background: "#111",
    color: "white",
    padding: 10,
  },

  newChat: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    background: "#1f6feb",
    border: "none",
    color: "white",
    borderRadius: 8,
    cursor: "pointer",
  },

  convList: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  convItem: {
    padding: 8,
    borderRadius: 6,
    background: "#222",
    cursor: "pointer",
    fontSize: 13,
  },

  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  header: {
    padding: 10,
    borderBottom: "1px solid #ddd",
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontWeight: 600,
  },

  chat: {
    flex: 1,
    overflowY: "auto",
    padding: 20,
  },

  msgRow: {
    display: "flex",
    marginBottom: 8,
  },

  msg: {
    padding: "10px 14px",
    borderRadius: 10,
    maxWidth: "70%",
  },

  inputBar: {
    display: "flex",
    padding: 10,
    borderTop: "1px solid #ddd",
    gap: 8,
  },

  input: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
  },

  send: {
    background: "#1f6feb",
    color: "white",
    border: "none",
    borderRadius: 8,
    padding: "0 14px",
  },
};