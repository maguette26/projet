import React, { useState, useEffect, useRef } from "react";
import { Bot, Send, Mic, Plus } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState(null);
  const [chatId, setChatId] = useState("default");
  const [isRecording, setIsRecording] = useState(false);

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
              text: "Bonjour 👋 Je suis PsyBot, ton assistant bien-être.",
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

  // ================= MICRO (PUSH TO TALK) =================
  const startMic = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Micro non supporté");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.continuous = false;

    recognition.onstart = () => setIsRecording(true);

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setInput(text);
      sendMessage(text);
    };

    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopMic = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  // ================= SCROLL =================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={styles.page}>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <button onClick={newChat} style={styles.newChat}>
          <Plus size={16} /> New chat
        </button>

        <div style={styles.list}>
          {Object.keys(localStorage)
            .filter((k) => k.includes(`chat_${userId}_`))
            .map((k, i) => (
              <div
                key={i}
                onClick={() => setChatId(k.split("_").pop())}
                style={styles.chatItem}
              >
                💬 Conversation {i + 1}
              </div>
            ))}
        </div>
      </div>

      {/* MAIN */}
      <div style={styles.main}>

        {/* HEADER SaaS */}
        <div style={styles.header}>
          <Bot size={18} />
          <div>
            <div style={{ fontWeight: 600 }}>PsyBot AI</div>
            <div style={{ fontSize: 12, color: "#777" }}>
              Assistant intelligent de bien-être
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
                justifyContent: m.sender === "user" ? "flex-end" : "flex-start",
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

        {/* INPUT BAR SaaS */}
        <div style={styles.inputBar}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Écris ton message..."
            style={styles.input}
          />

          {/* MICRO WhatsApp style */}
          <button
            onMouseDown={startMic}
            onMouseUp={stopMic}
            style={{
              ...styles.mic,
              background: isRecording ? "#ef4444" : "white",
              color: isRecording ? "white" : "#333",
            }}
          >
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

/* ================= SaaS MODERN STYLE ================= */

const styles = {
  page: {
    display: "flex",
    height: "100vh",
    fontFamily: "system-ui",
    background: "#0b0f19",
  },

  sidebar: {
    width: 280,
    background: "#111827",
    padding: 12,
    color: "white",
  },

  newChat: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    border: "none",
    background: "#2563eb",
    color: "white",
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
    cursor: "pointer",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  chatItem: {
    padding: 10,
    borderRadius: 8,
    background: "#1f2937",
    cursor: "pointer",
    fontSize: 13,
  },

  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "#f9fafb",
  },

  header: {
    padding: 14,
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "white",
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
    fontSize: 14,
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
    outline: "none",
  },

  mic: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    border: "1px solid #ddd",
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