import React, { useState, useEffect, useRef, useCallback } from "react";
import { Bot, Send, Mic, Sparkles } from "lucide-react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef(null);

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  useEffect(() => {
    setMessages([
      {
        sender: "bot",
        text: "Bonjour 👋 Je suis PsyBot.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
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
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Je suis là pour t'écouter 🤍",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setIsTyping(false);
    }, 800);
  };

  const startMic = useCallback(() => {
    setIsRecording(true);
    SpeechRecognition.startListening({ language: "fr-FR" });
  }, []);

  const stopMic = useCallback(() => {
    setIsRecording(false);
    SpeechRecognition.stopListening();
  }, []);

  if (!browserSupportsSpeechRecognition)
    return <div>Micro non supporté</div>;

  return (
    <div style={styles.page}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div style={styles.main}>
        {activeTab === "chat" ? (
          <>
            <div style={styles.header}>
              <Bot size={24} />
              <h3>PsyBot</h3>
            </div>

            <div style={styles.chat}>
              {messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent:
                      m.sender === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={
                      m.sender === "user"
                        ? styles.userBubble
                        : styles.botBubble
                    }
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {isTyping && <div style={styles.botBubble}>...</div>}

              <div ref={bottomRef} />
            </div>

            <div style={styles.inputBar}>
              <input
                style={styles.input}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder={isRecording ? "🎤 J'écoute..." : "Message..."}
              />

              <button
                onMouseDown={startMic}
                onMouseUp={stopMic}
                style={styles.mic}
              >
                <Mic />
              </button>

              <button onClick={sendMessage} style={styles.send}>
                <Send />
              </button>
            </div>
          </>
        ) : (
          <div style={styles.placeholder}>
            <h2>{activeTab}</h2>
          </div>
        )}
      </div>
    </div>
  );
};

// SIDEBAR
const Sidebar = ({ activeTab, setActiveTab }) => {
  const menu = ["chat", "history", "profile", "settings"];

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <Sparkles />
        <span>PsyBot</span>
      </div>

      {menu.map((item) => (
        <div
          key={item}
          onClick={() => setActiveTab(item)}
          style={{
            ...styles.item,
            background:
              activeTab === item ? "rgba(255,255,255,0.2)" : "transparent",
          }}
        >
          {item}
        </div>
      ))}

      <div style={styles.user}>Utilisateur</div>
    </div>
  );
};

// STYLES
const styles = {
  page: {
    display: "flex",
    height: "100vh",
    background: "linear-gradient(135deg,#667eea,#764ba2)",
  },

  sidebar: {
    width: 250,
    padding: 20,
    color: "white",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(20px)",
  },

  logo: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
    fontWeight: "bold",
  },

  item: {
    padding: 10,
    borderRadius: 10,
    cursor: "pointer",
    marginBottom: 10,
  },

  user: {
    marginTop: "auto",
    padding: 10,
  },

  main: { flex: 1, display: "flex", flexDirection: "column" },

  header: {
    display: "flex",
    gap: 10,
    padding: 20,
    color: "white",
  },

  chat: {
    flex: 1,
    padding: 20,
    overflowY: "auto",
  },

  botBubble: {
    background: "white",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  userBubble: {
    background: "#667eea",
    color: "white",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  inputBar: {
    display: "flex",
    padding: 10,
    gap: 10,
  },

  input: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    border: "none",
  },

  mic: {
    padding: 10,
  },

  send: {
    padding: 10,
  },

  placeholder: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },
};

export default Chatbot;