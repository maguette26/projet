import React, { useState, useEffect, useRef } from "react";
import { Bot, Send, Mic } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const endRef = useRef(null);

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  useEffect(() => {
    const syncAuth = () => setUserId(localStorage.getItem("userId"));
    syncAuth();
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  useEffect(() => {
    const defaultMsg = [
      {
        sender: "bot",
        text: "Bonjour 😊 Je suis PsyBot.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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

  useEffect(() => {
    if (!loaded || !userId) return;
    localStorage.setItem(`psybot_history_${userId}`, JSON.stringify(messages));
  }, [messages, loaded, userId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

    const res = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMsg.text, userId: userId || "guest" }),
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
  };

  const startRecording = () => {
    resetTranscript();
    setIsRecording(true);
    SpeechRecognition.startListening({ continuous: true, language: "fr-FR" });
  };

  const stopRecording = () => {
    setIsRecording(false);
    SpeechRecognition.stopListening();
  };

  if (!browserSupportsSpeechRecognition) return <p>❌ Micro non supporté</p>;

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#eef2f7",
      }}
    >

      {/* HEADER CLEAN */}
      <div className="text-center py-2 border-bottom bg-white">
        <Bot size={20} className="text-primary" />
        <span className="fw-bold ms-2">PsyBot</span>
      </div>

      {/* CHAT AREA */}
      <div
        className="flex-grow-1 overflow-auto px-3 py-2"
        style={{ fontSize: "14px" }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`d-flex mb-2 ${
              msg.sender === "user" ? "justify-content-end" : "justify-content-start"
            }`}
          >
            <div
              style={{
                maxWidth: "65%",
                padding: "10px 12px",
                borderRadius: "14px",
                background: msg.sender === "user" ? "#0d6efd" : "#ffffff",
                color: msg.sender === "user" ? "#fff" : "#333",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              {msg.text}
              <div style={{ fontSize: 10, opacity: 0.6, textAlign: "right" }}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* INPUT BAR (SMALL & CLEAN) */}
      <div
        className="d-flex align-items-center gap-2 px-2 py-2 bg-white border-top"
        style={{ height: "60px" }}
      >
        <input
          className="form-control form-control-sm rounded-pill"
          style={{ fontSize: "13px" }}
          placeholder={isRecording ? "🎤 écoute..." : "Message..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onMouseLeave={stopRecording}
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            border: "1px solid #ddd",
            background: isRecording ? "#ff4d4d" : "#fff",
          }}
        >
          <Mic size={16} color={isRecording ? "#fff" : "#333"} />
        </button>

        <button
          onClick={sendMessage}
          className="btn btn-primary"
          style={{ width: 38, height: 38, borderRadius: "50%" }}
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;