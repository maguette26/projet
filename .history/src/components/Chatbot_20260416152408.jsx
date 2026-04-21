import React, { useState, useEffect, useRef } from "react";
import { Bot, Send } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [isLoaded, setIsLoaded] = useState(false);

  const endRef = useRef(null);

  // 🔹 scroll auto
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔹 écouter changement login/logout
  useEffect(() => {
    const handleStorage = () => {
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // 🔹 charger chat selon user
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const defaultMsg = [
      {
        sender: "bot",
        text: "Bonjour 😊 Je suis PsyBot, ton assistant bien-être. Comment te sens-tu aujourd’hui ?",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ];

    if (!userId) {
      setMessages(defaultMsg);
      setIsLoaded(true);
      return;
    }

    const saved = localStorage.getItem(`psybot_history_${userId}`);

    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages(defaultMsg);
    }

    setIsLoaded(true);
  }, [role]);

  // 🔹 sauvegarde sécurisée (après chargement uniquement)
  useEffect(() => {
    if (!isLoaded) return;

    const userId = localStorage.getItem("userId");

    if (userId) {
      localStorage.setItem(
        `psybot_history_${userId}`,
        JSON.stringify(messages)
      );
    }
  }, [messages, isLoaded]);

  // 🔹 envoyer message
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

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text }),
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
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Je suis là… mais j’ai un petit souci 😢",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }
  };

  return (
    <div
      className="d-flex flex-column"
      style={{
        minHeight: "100vh",
        backgroundColor: "#f0f4f8",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* header */}
      <div className="text-center my-4 d-flex justify-content-center align-items-center gap-2">
        <Bot size={28} className="text-primary" />
        <h4 className="fw-bold mb-0">PsyBot</h4>
        <Bot size={28} className="text-primary" />
      </div>

      {/* messages */}
      <div className="flex-grow-1 overflow-auto p-3 d-flex flex-column">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`d-flex mb-3 ${
              msg.sender === "user"
                ? "justify-content-end"
                : "justify-content-start"
            }`}
          >
            <div
              className="p-3 rounded-4 shadow-sm"
              style={{
                maxWidth: "70%",
                backgroundColor:
                  msg.sender === "user" ? "#0d6efd" : "#e9f5f9",
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
        <div ref={endRef}></div>
      </div>

      {/* input */}
      <div className="p-3 bg-white d-flex gap-2 shadow-sm">
        <input
          className="form-control rounded-pill"
          placeholder="Exprime-toi..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button className="btn btn-primary rounded-circle" onClick={sendMessage}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;