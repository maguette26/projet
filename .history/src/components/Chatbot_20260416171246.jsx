import React, { useState, useEffect, useRef } from "react";
import { Bot, Send, Mic } from "lucide-react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import "bootstrap/dist/css/bootstrap.min.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef(null);

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  // 🎤 speech to text
  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  // 🔐 sync user
  useEffect(() => {
    const sync = () => setUserId(localStorage.getItem("userId"));
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  // 💬 LOAD CHAT (FIX SAFE JSON)
  useEffect(() => {
    const defaultMsg = [
      {
        sender: "bot",
        text: "Bonjour 👋 Je suis PsyBot, ton assistant bien-être.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ];

    try {
      const key = `psybot_${userId || "guest"}`;
      const saved = localStorage.getItem(key);

      if (saved) {
        setMessages(JSON.parse(saved));
      } else {
        setMessages(defaultMsg);
      }
    } catch {
      setMessages(defaultMsg);
    }
  }, [userId]);

  // 💾 SAVE CHAT (SAFE)
  useEffect(() => {
    try {
      const key = `psybot_${userId || "guest"}`;
      localStorage.setItem(key, JSON.stringify(messages));
    } catch {}
  }, [messages, userId]);

  // 📜 AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // 🚀 SEND MESSAGE
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

    setIsTyping(true);

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
          text: data?.reply || "Erreur 😢",
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
          text: "Erreur serveur 😢",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }

    setIsTyping(false);
  };

  // 🎤 MICRO WHATSAPP STYLE
  const startMic = () => {
    resetTranscript();
    setIsRecording(true);
    SpeechRecognition.startListening({
      language: "fr-FR",
      continuous: true,
    });
  };

  const stopMic = () => {
    setIsRecording(false);
    SpeechRecognition.stopListening();
  };

  if (!browserSupportsSpeechRecognition)
    return <p>Micro non supporté</p>;

  return (
    <div style={styles.page}>

      {/* CHAT */}
      <div style={styles.chat}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              ...styles.row,
              justifyContent: m.sender === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                ...styles.msg,
                background: m.sender === "user" ? "#1f6feb" : "#f1f1f1",
                color: m.sender === "user" ? "white" : "#111",
              }}
            >
              {m.text}
              <div style={styles.time}>{m.time}</div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={styles.row}>
            <div style={styles.typing}>PsyBot écrit...</div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div style={styles.inputBar}>
        <input
          style={styles.input}
          value={input}
          placeholder={isRecording ? "🎤 J’écoute..." : "Message..."}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onMouseDown={startMic}
          onMouseUp={stopMic}
          onMouseLeave={stopMic}
          style={{
            ...styles.mic,
            background: isRecording ? "#ff4d4d" : "white",
            color: isRecording ? "white" : "#333",
          }}
        >
          <Mic size={16} />
        </button>

        <button onClick={sendMessage} style={styles.send}>
          <Send size={16} />
        </button>
      </div>

      <style>{`
        .dots {
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0% { opacity: 0.2; }
          50% { opacity: 1; }
          100% { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;