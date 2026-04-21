import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Send, Mic, MicOff } from "lucide-react";

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
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  // AUTH
  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  }, []);

  // LOAD CHAT
  useEffect(() => {
    const defaultMsg = [
      {
        sender: "bot",
        text: "Bonjour 👋 Je suis PsyBot.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];

    if (!userId) {
      setMessages(defaultMsg);
      setLoaded(true);
      return;
    }

    const saved = localStorage.getItem(`psybot_history_${userId}`);
    setMessages(saved ? JSON.parse(saved) : defaultMsg);
    setLoaded(true);
  }, [userId]);

  // SAVE
  useEffect(() => {
    if (!loaded || !userId) return;
    localStorage.setItem(`psybot_history_${userId}`, JSON.stringify(messages));
  }, [messages, loaded, userId]);

  // SCROLL
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // FOCUS
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // SEND
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
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  // VOICE START/STOP
  const toggleVoice = () => {
    if (!voiceMode) {
      SpeechRecognition.startListening({ continuous: true });
      setVoiceMode(true);
    } else {
      SpeechRecognition.stopListening();
      setVoiceMode(false);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <p>Micro non supporté</p>;
  }

  return (
    <div className="d-flex flex-column" style={{ height: "100vh", background: "#0f0f0f" }}>

      {/* CHAT AREA */}
      <div className="flex-grow-1 overflow-auto p-3" style={{ color: "white" }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "12px 15px",
                borderRadius: "18px",
                background: msg.sender === "user" ? "#2b6fff" : "#2a2a2a",
                color: "white",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        <div ref={endRef} />
      </div>

      {/* INPUT BAR (ChatGPT style) */}
      <div
        style={{
          display: "flex",
          padding: "10px",
          borderTop: "1px solid #333",
          background: "#111",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder={voiceMode ? "🎤 J’écoute..." : "Message PsyBot..."}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "20px",
            border: "1px solid #333",
            background: "#1a1a1a",
            color: "white",
            outline: "none",
          }}
        />

        {/* MICRO BUTTON (ChatGPT style) */}
        <button
          onClick={toggleVoice}
          style={{
            width: "45px",
            height: "45px",
            borderRadius: "50%",
            border: "none",
            background: voiceMode ? "#ff3b3b" : "#2b6fff",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "0.2s",
          }}
        >
          {voiceMode ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        {/* SEND */}
        <button
          onClick={sendMessage}
          style={{
            width: "45px",
            height: "45px",
            borderRadius: "50%",
            border: "none",
            background: "#2b6fff",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;