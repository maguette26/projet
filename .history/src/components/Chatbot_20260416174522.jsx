import React, { useEffect, useRef, useState } from "react";
import { Bot, Send, Mic, Plus } from "lucide-react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const Chatbot = () => {
  const userId = localStorage.getItem("userId");

  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);

  const bottomRef = useRef(null);

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  // LOAD
  useEffect(() => {
    if (!userId) return;

    const saved = localStorage.getItem(`psybot_${userId}`);

    if (saved) {
      const data = JSON.parse(saved);
      setConversations(data);
      setActiveId(data[0]?.id);
    } else {
      const first = [
        {
          id: "1",
          title: "Nouvelle discussion",
          messages: [
            { sender: "bot", text: "Bonjour 👋", time: now() },
          ],
        },
      ];

      setConversations(first);
      setActiveId("1");
    }
  }, [userId]);

  // SAVE
  useEffect(() => {
    if (userId) {
      localStorage.setItem(`psybot_${userId}`, JSON.stringify(conversations));
    }
  }, [conversations]);

  const active = conversations.find((c) => c.id === activeId);

  const now = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // NEW CHAT
  const newChat = () => {
    const conv = {
      id: Date.now().toString(),
      title: "Nouvelle discussion",
      messages: [{ sender: "bot", text: "Nouvelle conversation 👋", time: now() }],
    };

    setConversations([conv, ...conversations]);
    setActiveId(conv.id);
  };

  // SEND
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input, time: now() };

    let updated = conversations.map((c) => {
      if (c.id !== activeId) return c;

      const isFirst = c.messages.length <= 1;

      return {
        ...c,
        title: isFirst ? input.slice(0, 25) : c.title,
        messages: [...c.messages, userMsg],
      };
    });

    setConversations(updated);
    setInput("");
    resetTranscript();

    const res = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, userId }),
    });

    const data = await res.json();

    updated = updated.map((c) =>
      c.id === activeId
        ? {
            ...c,
            messages: [
              ...c.messages,
              { sender: "bot", text: data.reply, time: now() },
            ],
          }
        : c
    );

    setConversations(updated);
  };

  // MIC
  const startMic = () => {
    setRecording(true);
    resetTranscript();
    SpeechRecognition.startListening({
      language: "fr-FR",
      continuous: true,
    });
  };

  const stopMic = () => {
    setRecording(false);
    SpeechRecognition.stopListening();
  };

  if (!browserSupportsSpeechRecognition) return <div>Micro non supporté</div>;

  return (
    <div style={styles.app}>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <button onClick={newChat} style={styles.newBtn}>
          <Plus size={16} /> New chat
        </button>

        {conversations.map((c) => (
          <div
            key={c.id}
            onClick={() => setActiveId(c.id)}
            style={{
              ...styles.item,
              background: c.id === activeId ? "#ececec" : "transparent",
            }}
          >
            {c.title}
          </div>
        ))}
      </div>

      {/* CHAT */}
      <div style={styles.main}>

        {/* HEADER */}
        <div style={styles.header}>
          <Bot size={18} />
          <span>PsyBot</span>
        </div>

        {/* MESSAGES */}
        <div style={styles.chat}>
          {active?.messages.map((m, i) => (
            <div
              key={i}
              style={{
                ...styles.row,
                justifyContent:
                  m.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  ...styles.msg,
                  background: m.sender === "user" ? "#2f6fed" : "#f1f1f1",
                  color: m.sender === "user" ? "white" : "black",
                }}
              >
                {m.text}
              </div>
            </div>
          ))}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div style={styles.inputBar}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={recording ? "🎤 écoute..." : "Message..."}
            style={styles.input}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button
            onMouseDown={startMic}
            onMouseUp={stopMic}
            style={{
              ...styles.mic,
              background: recording ? "red" : "white",
              color: recording ? "white" : "black",
            }}
          >
            <Mic size={16} />
          </button>

          <button onClick={sendMessage} style={styles.send}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

/* STYLE CLEAN CHATGPT */

const styles = {
  app: {
    display: "flex",
    height: "100vh",
    fontFamily: "system-ui",
    background: "#fff",
  },

  sidebar: {
    width: 260,
    borderRight: "1px solid #e5e5e5",
    padding: 10,
  },

  newBtn: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    border: "1px solid #ddd",
    borderRadius: 8,
    background: "#fff",
    cursor: "pointer",
  },

  item: {
    padding: 10,
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
  },

  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  header: {
    height: 50,
    borderBottom: "1px solid #e5e5e5",
    display: "flex",
    alignItems: "center",
    gap: 10,
    paddingLeft: 15,
    fontWeight: 600,
  },

  chat: {
    flex: 1,
    overflowY: "auto",
    padding: 20,
    maxWidth: 800,
    margin: "0 auto",
    width: "100%",
  },

  row: {
    display: "flex",
    marginBottom: 10,
  },

  msg: {
    padding: 10,
    borderRadius: 10,
    maxWidth: "70%",
    fontSize: 14,
  },

  inputBar: {
    display: "flex",
    gap: 8,
    padding: 10,
    borderTop: "1px solid #e5e5e5",
  },

  input: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    border: "1px solid #ddd",
    outline: "none",
  },

  mic: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    border: "1px solid #ddd",
  },

  send: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    background: "#2f6fed",
    color: "white",
    border: "none",
  },
};