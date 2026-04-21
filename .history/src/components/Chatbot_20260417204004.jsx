import React, { useState, useEffect, useRef } from "react";
import { Bot, Send, Mic, MicOff } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);

  const endRef = useRef(null);
  const inputRef = useRef(null);

  // 🎤 VOICE
  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  // ================= AUTH =================
  useEffect(() => {
    const syncAuth = () => {
      setUserId(localStorage.getItem("userId"));
    };

    syncAuth();
    window.addEventListener("storage", syncAuth);

    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  // ================= LOAD CHAT =================
  useEffect(() => {
    const defaultMsg = [
      {
        sender: "bot",
        text: "Bonjour 😊 Je suis PsyBot, ton assistant bien-être.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ];

    setLoaded(false);

    if (!userId) {
      setMessages(defaultMsg);
      setLoaded(true);
      return;
    }

    const saved = localStorage.getItem(`psybot_history_${userId}`);
    setMessages(saved ? JSON.parse(saved) : defaultMsg);

    setLoaded(true);
  }, [userId]);

  // ================= SAVE CHAT =================
  useEffect(() => {
    if (!loaded || !userId) return;

    localStorage.setItem(
      `psybot_history_${userId}`,
      JSON.stringify(messages)
    );
  }, [messages, loaded, userId]);

  // ================= SCROLL =================
  useEffect(() => {
    const timer = setTimeout(() => {
      endRef.current?.scrollIntoView({ behavior: "auto" });
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ================= FOCUS =================
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // ================= SEND MESSAGE =================
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

  // ================= VOICE TOGGLE =================
  const toggleVoice = () => {
    if (!voiceMode) {
      SpeechRecognition.startListening({
        continuous: true,
        language: "fr-FR",
      });
      setVoiceMode(true);
    } else {
      SpeechRecognition.stopListening();
      setVoiceMode(false);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <p>❌ Micro non supporté</p>;
  }

  return (
    <div
      className="d-flex flex-column"
      style={{ minHeight: "100vh", background: "#f0f4f8" }}
    >
      {/* HEADER */}
      <div className="text-center my-4 d-flex justify-content-center align-items-center gap-2">
        <Bot size={28} className="text-primary" />
        <h4 className="fw-bold mb-0">PsyBot</h4>
        <Bot size={28} className="text-primary" />
      </div>

      {/* DESCRIPTION */}
      <div className="text-center px-3 mb-2">
        <div
          style={{
            maxWidth: "650px",
            margin: "0 auto",
            padding: "10px",
            borderRadius: "10px",
            background: "#fff",
            fontSize: "0.9rem",
            color: "#6c757d",
          }}
        >
          🤖 PsyBot t’écoute, te comprend et t’aide à gérer tes émotions.
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-grow-1 overflow-auto p-3 d-flex flex-column">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`d-flex mb-2 ${
              msg.sender === "user"
                ? "justify-content-end"
                : "justify-content-start"
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
              <small
                className="d-block text-end mt-1"
                style={{ fontSize: 11 }}
              >
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
          ref={inputRef}
          className="form-control rounded-pill"
          placeholder={voiceMode ? "🎤 J’écoute..." : "Écris ton message..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        {/* MICRO BUTTON (clean Lucide ChatGPT style) */}
        <button
          onClick={toggleVoice}
          className="btn rounded-circle d-flex align-items-center justify-content-center"
          style={{
            width: "42px",
            height: "42px",
            border: voiceMode ? "2px solid #dc3545" : "1px solid #ced4da",
            background: voiceMode ? "#fff5f5" : "white",
            transition: "0.2s",
          }}
        >
          {voiceMode ? (
            <MicOff size={18} color="#dc3545" />
          ) : (
            <Mic size={18} color="#6c757d" />
          )}
        </button>

        {/* SEND */}
        <button
          className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: "42px", height: "42px" }}
          onClick={sendMessage}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;