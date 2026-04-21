import React, { useState, useEffect, useRef } from "react";
import { Bot, Send } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [chatId, setChatId] = useState("default");
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
    if (!userId) return;

    const saved = localStorage.getItem(`chat_${userId}_${chatId}`);

    setMessages(
      saved
        ? JSON.parse(saved)
        : [
            {
              sender: "bot",
              text: "Bonjour 👋 Je suis PsyBot",
              time: new Date().toLocaleTimeString(),
            },
          ]
    );
  }, [userId, chatId]);

  // ================= SAVE CHAT =================
  useEffect(() => {
    if (!userId) return;

    localStorage.setItem(
      `chat_${userId}_${chatId}`,
      JSON.stringify(messages)
    );
  }, [messages, userId, chatId]);

  // ================= SEND =================
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = {
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, userId }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.reply,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Erreur serveur 😢", time: "" },
      ]);
    }
  };

  // ================= NEW CHAT =================
  const newChat = () => {
    const id = Date.now().toString();
    setChatId(id);
  };

  // scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={styles.page}>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <button onClick={newChat} style={styles.newBtn}>
          + New chat
        </button>

        <div style={styles.list}>
          {Object.keys(localStorage)
            .filter((k) => k.includes(`chat_${userId}_`))
            .map((k, i) => (
              <div
                key={i}
                onClick={() => setChatId(k.split("_").pop())}
                style={styles.item}
              >
                💬 Chat {i + 1}
              </div>
            ))}
        </div>
      </div>

      {/* MAIN */}
      <div style={styles.main}>

        {/* HEADER CLEAN */}
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
                display: "flex",
                justifyContent: m.sender === "user" ? "flex-end" : "flex-start",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  maxWidth: "70%",
                  padding: "10px 14px",
                  borderRadius: 12,
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
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Message..."
            style={styles.input}
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
  page: {
    display: "flex",
    height: "100vh",
    fontFamily: "system-ui",
    background: "#0f0f0f",
    color: "white",
  },

  sidebar: {
    width: 260,
    background: "#111",
    padding: 10,
  },

  newBtn: {
    width: "100%",
    padding: 10,
    background: "#1f6feb",
    border: "none",
    color: "white",
    borderRadius: 8,
    marginBottom: 10,
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  item: {
    padding: 8,
    background: "#222",
    borderRadius: 6,
    cursor: "pointer",
  },

  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "white",
    color: "black",
  },

  header: {
    padding: 12,
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