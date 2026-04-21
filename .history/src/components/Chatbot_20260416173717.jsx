import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Send, Mic, Plus, Trash2 } from "lucide-react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const Chatbot = () => {
  const userId = localStorage.getItem("userId");
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [dark, setDark] = useState(true);

  const bottomRef = useRef(null);

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  // ================= LOAD =================
  useEffect(() => {
    if (!userId) return;

    const saved = localStorage.getItem(`psybot_conversations_${userId}`);

    if (saved) {
      const parsed = JSON.parse(saved);
      setConversations(parsed);
      setActiveId(parsed[0]?.id || null);
    } else {
      const first = [
        {
          id: "c1",
          title: "Nouvelle conversation",
          messages: [
            {
              sender: "bot",
              text: "Bonjour 👋 Je suis PsyBot.",
              time: now(),
            },
          ],
        },
      ];

      setConversations(first);
      setActiveId("c1");
    }
  }, [userId]);

  // ================= SAVE =================
  useEffect(() => {
    if (!userId) return;
    localStorage.setItem(
      `psybot_conversations_${userId}`,
      JSON.stringify(conversations)
    );
  }, [conversations, userId]);

  const activeConv = useMemo(
    () => conversations.find((c) => c.id === activeId),
    [conversations, activeId]
  );

  // ================= AUTO TITLE =================
  const generateTitle = (text) => {
    return text.length > 25 ? text.slice(0, 25) + "..." : text;
  };

  // ================= SEND =================
  const sendMessage = async () => {
    if (!input.trim() || !activeConv) return;

    const userMsg = { sender: "user", text: input, time: now() };

    let updatedConversations = conversations.map((c) => {
      if (c.id === activeId) {
        const isFirstUserMessage = c.messages.length <= 1;

        return {
          ...c,
          title: isFirstUserMessage ? generateTitle(input) : c.title,
          messages: [...c.messages, userMsg],
        };
      }
      return c;
    });

    setConversations(updatedConversations);
    setInput("");
    resetTranscript();

    const res = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, userId }),
    });

    const data = await res.json();

    updatedConversations = updatedConversations.map((c) => {
      if (c.id === activeId) {
        return {
          ...c,
          messages: [
            ...c.messages,
            { sender: "bot", text: data.reply, time: now() },
          ],
        };
      }
      return c;
    });

    setConversations(updatedConversations);
  };

  // ================= NEW CHAT =================
  const newChat = () => {
    const newConv = {
      id: Date.now().toString(),
      title: "Nouvelle conversation",
      messages: [
        { sender: "bot", text: "Nouvelle discussion 👋", time: now() },
      ],
    };

    setConversations([newConv, ...conversations]);
    setActiveId(newConv.id);
  };

  // ================= DELETE =================
  const deleteChat = (id) => {
    const filtered = conversations.filter((c) => c.id !== id);
    setConversations(filtered);
    setActiveId(filtered[0]?.id || null);
  };

  const now = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const startMic = () => {
    resetTranscript();
    setIsRecording(true);
    SpeechRecognition.startListening({ language: "fr-FR", continuous: true });
  };

  const stopMic = () => {
    setIsRecording(false);
    SpeechRecognition.stopListening();
  };

  if (!browserSupportsSpeechRecognition) return <p>Micro non supporté</p>;

  return (
    <div style={styles.app(dark)}>

      {/* SIDEBAR */}
      <div style={styles.sidebar(dark)}>
        <button onClick={newChat} style={styles.newChat}>
          <Plus size={16} /> Nouveau chat
        </button>

        {conversations.map((c) => (
          <div
            key={c.id}
            onClick={() => setActiveId(c.id)}
            style={{
              ...styles.chatItem(dark),
              background: c.id === activeId ? (dark ? "#2a2a2a" : "#e9e9e9") : "transparent",
            }}
          >
            <span>{c.title}</span>
            <Trash2 size={14} onClick={() => deleteChat(c.id)} />
          </div>
        ))}
      </div>

      {/* CHAT AREA */}
      <div style={styles.main}>

        {/* HEADER */}
        <div style={styles.header(dark)}>
          <Bot size={18} />
          PsyBot
          <button onClick={() => setDark(!dark)} style={styles.toggle}>
            {dark ? "Light" : "Dark"}
          </button>
        </div>

        {/* MESSAGES */}
        <div style={styles.chat}>
          {activeConv?.messages.map((m, i) => (
            <div
              key={i}
              style={{
                ...styles.row,
                justifyContent: m.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div style={styles.msg(m.sender, dark)}>
                {m.text}
                <div style={styles.time}>{m.time}</div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div style={styles.inputBar(dark)}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isRecording ? "🎤 J’écoute..." : "Message..."}
            style={styles.input(dark)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button
            onMouseDown={startMic}
            onMouseUp={stopMic}
            onMouseLeave={stopMic}
            style={styles.mic(isRecording)}
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

/* ================= STYLES ================= */

const styles = {
  app: (dark) => ({
    display: "flex",
    height: "100vh",
    background: dark ? "#111" : "#f5f5f5",
    color: dark ? "#fff" : "#000",
  }),

  sidebar: (dark) => ({
    width: 260,
    padding: 10,
    background: dark ? "#1a1a1a" : "#fff",
    borderRight: "1px solid #333",
  }),

  newChat: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  },

  chatItem: (dark) => ({
    display: "flex",
    justifyContent: "space-between",
    padding: 10,
    cursor: "pointer",
    borderRadius: 8,
    marginBottom: 5,
  }),

  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  header: (dark) => ({
    padding: 10,
    borderBottom: "1px solid #333",
    display: "flex",
    justifyContent: "space-between",
  }),

  toggle: {
    background: "#444",
    color: "#fff",
    border: "none",
    padding: "4px 8px",
    borderRadius: 6,
  },

  chat: {
    flex: 1,
    overflowY: "auto",
    padding: 20,
  },

  row: {
    display: "flex",
    marginBottom: 10,
  },

  msg: (sender, dark) => ({
    maxWidth: "70%",
    padding: 10,
    borderRadius: 10,
    background: sender === "user" ? "#1f6feb" : dark ? "#333" : "#eee",
    color: sender === "user" ? "#fff" : dark ? "#fff" : "#000",
  }),

  time: {
    fontSize: 10,
    opacity: 0.6,
    marginTop: 4,
  },

  inputBar: (dark) => ({
    display: "flex",
    padding: 10,
    borderTop: "1px solid #333",
  }),

  input: (dark) => ({
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #444",
    background: dark ? "#222" : "#fff",
    color: dark ? "#fff" : "#000",
  }),

  mic: (active) => ({
    marginLeft: 8,
    borderRadius: "50%",
    width: 40,
    height: 40,
    background: active ? "red" : "#fff",
  }),

  send: {
    marginLeft: 8,
    borderRadius: "50%",
    width: 40,
    height: 40,
    background: "#1f6feb",
    color: "#fff",
    border: "none",
  },
};