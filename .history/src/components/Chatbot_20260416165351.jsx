import React, { useState, useEffect, useRef } from "react";
import { Bot, Send, Mic } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  const endRef = useRef(null);

  // ================= AUTH =================
  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  }, []);

  // ================= SCROLL =================
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ================= START RECORD =================
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      setAudioChunks([]);

      recorder.start();
      setIsRecording(true);

      recorder.ondataavailable = (e) => {
        setAudioChunks((prev) => [...prev, e.data]);
      };
    } catch (err) {
      console.error("Micro error:", err);
    }
  };

  // ================= STOP RECORD =================
  const stopRecording = () => {
    if (!mediaRecorder) return;

    mediaRecorder.stop();
    setIsRecording(false);

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const audioUrl = URL.createObjectURL(audioBlob);

      const voiceMsg = {
        sender: "user",
        type: "audio",
        audio: audioUrl,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, voiceMsg]);

      // envoyer backend si tu veux
      await fetch("http://localhost:5000/voice", {
        method: "POST",
        body: audioBlob,
      });
    };
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh", background: "#f0f4f8" }}>

      {/* HEADER */}
      <div className="text-center my-4 d-flex justify-content-center align-items-center gap-2">
        <Bot size={28} className="text-primary" />
        <h4 className="fw-bold mb-0">PsyBot</h4>
        <Bot size={28} className="text-primary" />
      </div>

      {/* CHAT */}
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
                background: "#e9f5f9",
              }}
            >
              {msg.type === "audio" ? (
                <audio controls src={msg.audio} />
              ) : (
                msg.text
              )}

              <small className="d-block text-end mt-1" style={{ fontSize: 11 }}>
                {msg.time}
              </small>
            </div>
          </div>
        ))}

        <div ref={endRef} />
      </div>

      {/* INPUT */}
      <div className="p-3 bg-white d-flex gap-2 shadow-sm align-items-center">

        {/* WHATSAPP MICRO BUTTON */}
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onMouseLeave={stopRecording}
          className="btn rounded-circle d-flex align-items-center justify-content-center"
          style={{
            width: "50px",
            height: "50px",
            background: isRecording ? "#ff4d4d" : "#fff",
            border: "1px solid #ccc",
            transition: "0.2s",
          }}
        >
          <Mic size={20} color={isRecording ? "#fff" : "#333"} />
        </button>

        <span style={{ fontSize: "0.9rem", color: "#666" }}>
          {isRecording ? "🎤 Enregistrement..." : "Maintiens pour parler"}
        </span>

      </div>
    </div>
  );
};

export default Chatbot;