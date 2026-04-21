import React, { useState, useEffect, useRef } from "react";
import { Bot, Send, Mic, Plus } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState(null);
  const [chatId, setChatId] = useState("default");
  const [chatTitles, setChatTitles] = useState({});

  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);

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
              text: "Bonjour 👋 Je suis PsyBot.",
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

    // 🧠 AUTO TITLE (1er message user)
    const firstUserMsg = messages.find((m) => m.sender === "user");

    if (firstUserMsg && !chatTitles[chatId]) {
      const title = firstUserMsg.text.slice(0, 25);
      setChatTitles((prev) => ({
        ...prev,
        [chatId]: title,
      }));

      localStorage.setItem(
        `chat_titles_${userId}`,
        JSON.stringify({
          ...chatTitles,
          [chatId]: title,
        })
      );
    }
  }, [messages]);

  // ================= LOAD TITLES =================
  useEffect(() => {
    if (!userId) return;

    const saved = localStorage.getItem(`chat_titles_${userId}`);
    if (saved) setChatTitles(JSON.parse(saved));
  }, [userId]);

  // ================= SEND =================
  const sendMessage = async (text) => {
    if (!text?.trim()) return;

    const userMsg = {
      sender: "user",
      text,
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const res = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, userId }),
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
  };

  // ================= NEW CHAT =================
  const newChat = () => {
    const id = Date.now().toString();
    setChatId(id);
  };

  // ================= VOICE =================
  const startMic = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "fr-FR";

    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setInput(text);
      sendMessage(text);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // ================= SCROLL =================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={styles.page}>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <button onClick={newChat} style={styles.newBtn}>
          <Plus size={16} /> Nouveau chat
        </button>

        <div style={styles.list}>
          {Object.keys(localStorage)
            .filter((k) => k.includes(`chat_${userId}_`))
            .map((k, i) => {
              const id = k.split("_").pop();

              return (
                <div
                  key={i}
                  onClick={() => setChatId(id)}
                  style={styles.item}
                >
                  💬 {chatTitles[id] || "Conversation"}
                </div>
              );
            })}
        </div>
      </div>

      {/* MAIN */}
      <div style={styles.main}>

        {/* HEADER */}
        <div style={styles.header}>
          <Bot size={18} />
          <div>
            <div style={{ fontWeight: 600 }}>PsyBot</div>
            <div style={{ fontSize: 12, color: "#888" }}>
              Assistant bien-être intelligent
            </div>
          </div>
        </div>

        {/* CHAT */}
        <div style={styles.chat}>
          {messages.map((m, i) => (
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
                  ...styles.bubble,
                  background: m.sender === "user" ? "#2563eb" : "#f3f4f6",
                  color: m.sender === "user" ? "white" : "#111",
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
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Message..."
            style={styles.input}
          />

          <button onMouseDown={startMic} style={styles.mic}>
            <Mic size={16} />
          </button>

          <button onClick={() => sendMessage(input)} style={styles.send}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

/* ================= STYLE FINAL ================= */

const styles = {
  page: {
    display: "flex",
    height: "100vh",
    fontFamily: "system-ui",
    background: "#0b1220",
  },

  sidebar: {
    width: 280,
    background: "#0f172a",
    color: "white",
    padding: 12,
  },

  newBtn: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    background: "#2563eb",
    border: "none",
    color: "white",
    marginBottom: 10,
    cursor: "pointer",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  item: {
    padding: 10,
    borderRadius: 8,
    background: "#111c33",
    cursor: "pointer",
    fontSize: 13,
  },

  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "#f8fafc",
  },

  header: {
    padding: 14,
    borderBottom: "1px solid #e5e7eb",
    background: "white",
    display: "flex",
    gap: 10,
    alignItems: "center",
  },

  chat: {
    flex: 1,
    overflowY: "auto",
    padding: 20,
  },

  bubble: {
    padding: "10px 14px",
    borderRadius: 14,
    maxWidth: "70%",
  },

  inputBar: {
    display: "flex",
    gap: 8,
    padding: 12,
    borderTop: "1px solid #e5e7eb",
    background: "white",
  },

  input: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    border: "1px solid #ddd",
  },

  mic: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    border: "1px solid #ddd",
    background: "white",
  },

  send: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    border: "none",
    background: "#2563eb",
    color: "white",
  },
};