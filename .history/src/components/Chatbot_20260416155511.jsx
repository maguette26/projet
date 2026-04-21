import React, { useState, useEffect, useRef } from "react";
import { Bot, Send } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const endRef = useRef(null);

  // =========================
  // SCROLL AUTO
  // =========================
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // =========================
  // AUTH SYNC
  // =========================
  useEffect(() => {
    const syncAuth = () => {
      const id = localStorage.getItem("userId");
      const role = localStorage.getItem("role");

      setUserId(id);
      setRole(role);

      // 🔥 SI NON CONNECTÉ → RESET CHAT
      if (!id) {
        setMessages([
          {
            sender: "bot",
            text: "Bonjour 😊 Je suis PsyBot.",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }
    };

    syncAuth();
    window.addEventListener("storage", syncAuth);

    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  // =========================
  // LOAD CHAT (PAR USER)
  // =========================
  useEffect(() => {
    const defaultMsg = [
      {
        sender: "bot",
        text: "Bonjour 😊 Je suis PsyBot.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ];

    setLoaded(false);

    // 🔥 SI PAS CONNECTÉ → chat vide sécurisé
    if (!userId) {
      setMessages(defaultMsg);
      setLoaded(true);
      return;
    }

    const saved = localStorage.getItem(`psybot_history_${userId}`);

    setMessages(saved ? JSON.parse(saved) : defaultMsg);

    setLoaded(true);
  }, [userId]);

  // =========================
  // SAVE CHAT (PAR USER UNIQUEMENT)
  // =========================
  useEffect(() => {
    if (!loaded || !userId) return;

    localStorage.setItem(
      `psybot_history_${userId}`,
      JSON.stringify(messages)
    );
  }, [messages, loaded, userId]);

  // =========================
  // SEND MESSAGE
  // =========================
  const sendMessage = async () => {
    if (!loaded || !userId) return;
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

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.text,
          userId: userId, // 🔥 IMPORTANT
        }),
      });

      const data = await res.json();

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
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Erreur serveur 😢",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh", background: "#f0f4f8" }}>

      {/* HEADER */}
      <div className="text-center my-4 d-flex justify-content-center align-items-center gap-2">
        <Bot size={28} className="text-primary" />
        <h4 className="fw-bold mb-0">PsyBot</h4>
        <Bot size={28} className="text-primary" />
      </div>

      {/* MESSAGES */}
      <div className="flex-grow-1 overflow-auto p-3 d-flex flex-column">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`d-flex mb-2 ${
              msg.sender === "user" ? "justify-content-end" : "justify-content-start"
            }`}
          >
            <div
              className="p-3 rounded-4 shadow-sm"
              style={{
                maxWidth: "70%",
                background: msg.sender === "user" ? "#0d6efd" : "#e9f5f9",
                color: msg.sender === "user" ? "#fff" : "#1f3d4d",
              }}
            >
              {msg.text}
              <small className="d-block text-end mt-1" style={{ fontSize: 11 }}>
                {msg.time}
              </small>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* INPUT */}
      <div className="p-3 bg-white d-flex gap-2 shadow-sm">
        <input
          className="form-control rounded-pill"
          placeholder="Écris ton message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={!userId} // 🔥 interdit si non connecté
        />

        <button
          className="btn btn-primary rounded-circle"
          onClick={sendMessage}
          disabled={!userId}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;