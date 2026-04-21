import React, { useState, useEffect, useRef } from "react";
import { Bot, Send } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userEmail, setUserEmail] = useState(null);
  const endRef = useRef(null);

  // Récupérer l'email de l'utilisateur connecté
  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      setUserEmail(email);

      // Charger l'historique spécifique à cet utilisateur
      const history = JSON.parse(localStorage.getItem("psybot_history_" + email)) || [
        {
          sender: "bot",
          text: "Bonjour 😊 Je suis PsyBot, ton assistant bien-être. Comment te sens-tu aujourd’hui ?",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ];
      setMessages(history);
    } else {
      // Utilisateur non connecté
      setMessages([
        {
          sender: "bot",
          text: "Veuillez vous connecter pour utiliser PsyBot.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  }, []);

  // Scroll automatique
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Sauvegarde de l'historique dans localStorage selon l'utilisateur
  useEffect(() => {
    if (userEmail) {
      localStorage.setItem("psybot_history_" + userEmail, JSON.stringify(messages));
    }
  }, [messages, userEmail]);

  const sendMessage = async () => {
    if (!userEmail) {
      alert("Veuillez vous connecter pour utiliser PsyBot.");
      return;
    }

    if (!input.trim()) return;

    const userMsg = {
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text, email: userEmail }), // envoyer email au serveur
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Je suis là… mais j’ai un petit souci 😢",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  };

  return (
    <div
      className="d-flex flex-column"
      style={{
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f0f4f8",
      }}
    >
      {/* Présentation PsyBot */}
      <div className="text-center my-4 d-flex justify-content-center align-items-center gap-2">
        <Bot size={28} className="text-primary" />
        <h4 className="fw-bold mb-0">PsyBot</h4>
        <Bot size={28} className="text-primary" />
      </div>
      <div className="text-center mb-4">
        <small className="text-muted">
          Ton assistant AI bien-être — je suis là pour t’écouter et te guider
        </small>
      </div>

      {/* Zone messages */}
      <div className="flex-grow-1 overflow-auto p-3 d-flex flex-column">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`d-flex mb-3 ${msg.sender === "user" ? "justify-content-end" : "justify-content-start"}`}
          >
            <div
              className="p-3 rounded-4 shadow-sm"
              style={{
                maxWidth: "70%",
                backgroundColor: msg.sender === "user" ? "#0d6efd" : "#e9f5f9",
                color: msg.sender === "user" ? "#fff" : "#1f3d4d",
                fontSize: "0.95rem",
                animation: "fadeSlide 0.3s ease",
              }}
            >
              {msg.text}
              <small
                className="d-block text-end mt-1"
                style={{ fontSize: "0.7rem", opacity: 0.6 }}
              >
                {msg.time}
              </small>
            </div>
          </div>
        ))}
        <div ref={endRef}></div>
      </div>

      {/* Input */}
      <div
        className="p-3 bg-white d-flex gap-2 shadow-sm"
        style={{ borderTop: "1px solid #ddd" }}
      >
        <input
          type="text"
          className="form-control rounded-pill"
          placeholder="Exprime-toi librement..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={!userEmail} // désactiver si pas connecté
        />
        <button
          className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
          onClick={sendMessage}
          disabled={!userEmail}
        >
          <Send size={20} className="text-white" />
        </button>
      </div>

      <style>{`
        @keyframes fadeSlide {
          0% { opacity: 0; transform: translateY(8px);}
          100% { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
};

export default Chatbot;