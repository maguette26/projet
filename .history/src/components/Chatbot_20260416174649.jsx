import React, { useEffect, useRef, useState } from "react";
import { Bot, Plus, Send, Mic, Trash2 } from "lucide-react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const ChatGPTClone = () => {
  const userId = localStorage.getItem("userId");

  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [input, setInput] = useState("");
  const [dark, setDark] = useState(true);
  const [recording, setRecording] = useState(false);

  const bottomRef = useRef(null);

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  // ================= LOAD =================
  useEffect(() => {
    if (!userId) return;

    const saved = localStorage.getItem(`chatgpt_clone_${userId}`);

    if (saved) {
      const data = JSON.parse(saved);
      setConversations(data);
      setActiveId(data[0]?.id);
    } else {
      const first = [
        {
          id: "1",
          title: "New chat",
          messages: [
            { sender: "bot", text: "Hello 👋 How can I help you today?" },
          ],
        },
      ];

      setConversations(first);
      setActiveId("1");
    }
  }, [userId]);

  // ================= SAVE =================
  useEffect(() => {
    if (userId) {
      localStorage.setItem(
        `chatgpt_clone_${userId}`,
        JSON.stringify(conversations)
      );
    }
  }, [conversations]);

  const active = conversations.find((c) => c.id === activeId);

  const now = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // ================= NEW CHAT =================
  const newChat = () => {
    const c = {
      id: Date.now().toString(),
      title: "New chat",
      messages: [{ sender: "bot", text: "New conversation started." }],
    };

    setConversations([c, ...conversations]);
    setActiveId(c.id);
  };

  // ================= SEND =================
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };

    let updated = conversations.map((c) => {
      if (c.id !== activeId) return c;

      const isFirst = c.messages.length === 1;

      return {
        ...c,
        title: isFirst ? input.slice(0, 28) : c.title,
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
              { sender: "bot", text: data.reply },
            ],
          }
        : c
    );

    setConversations(updated);
  };

  // ================= MIC =================
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

  if (!browserSupportsSpeechRecognition) return null;

  return (
    <div style={styles.app(dark)}>

      {/* SIDEBAR */}
      <div style={styles.sidebar(dark)}>

        <button onClick={newChat} style={styles.newChat}>
          <Plus size={16} /> New chat
        </button>

        <div style={styles.list}>
          {conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => setActiveId(c.id)}
              style={{
                ...styles.item(dark),
                background:
                  c.id === activeId
                    ? dark
                      ? "#2a2a2a"
                      : "#ececec"
                    : "transparent",
              }}
            >
              {c.title}
              <Trash2 size={14} style={{ opacity: 0.5 }} />
            </div>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div style={styles.main}>

        {/* HEADER */}
        <div style={styles.header(dark)}>
          <Bot size={18} />
          <span>PsyBot</span>

          <button onClick={() => setDark(!dark)} style={styles.toggle}>
            {dark ? "Light" : "Dark"}
          </button>
        </div>

        {/* CHAT */}
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
              <div style={styles.bubble(m.sender, dark)}>
                {m.text}
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
            placeholder={recording ? "🎤 Listening..." : "Message PsyBot..."}
            style={styles.input(dark)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button
            onMouseDown={startMic}
            onMouseUp={stopMic}
            style={styles.mic(recording)}
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

export default ChatGPTClone;

/* ================= STYLES (CHATGPT INSPIRED) ================= */

const styles = {
  app: (dark) => ({
    display: "flex",
    height: "100vh",
    background: dark ? "#212121" : "#ffffff",
    color: dark ? "#fff" : "#000",
    fontFamily: "system-ui",
  }),

  sidebar: (dark) => ({
    width: 280,
    background: dark ? "#171717" : "#f7f7f8",
    borderRight: dark ? "1px solid #2a2a2a" : "1px solid #e5e5e5",
    padding: 10,
  }),

  newChat: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "1px solid #333",
    marginBottom: 10,
    background: "transparent",
    color: "inherit",
    cursor: "pointer",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },

  item: (dark) => ({
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
  }),

  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  header: (dark) => ({
    height: 52,
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 16px",
    borderBottom: dark ? "1px solid #2a2a2a" : "1px solid #e5e5e5",
  }),

  toggle: {
    marginLeft: "auto",
    background: "#444",
    border: "none",
    color: "#fff",
    padding: "4px 8px",
    borderRadius: 6,
  },

  chat: {
    flex: 1,
    overflowY: "auto",
    padding: "24px 0",
    maxWidth: 760,
    margin: "0 auto",
    width: "100%",
  },

  row: {
    display: "flex",
    padding: "4px 16px",
  },

  bubble: (sender, dark) => ({
    maxWidth: "70%",
    padding: "10px 14px",
    borderRadius: 12,
    fontSize: 14,
    lineHeight: 1.5,
    background:
      sender === "user"
        ? "#2f6fed"
        : dark
        ? "#2a2a2a"
        : "#f1f1f1",
    color: sender === "user" ? "#fff" : dark ? "#fff" : "#000",
  }),

  inputBar: (dark) => ({
    display: "flex",
    gap: 8,
    padding: 12,
    borderTop: dark ? "1px solid #2a2a2a" : "1px solid #e5e5e5",
  }),

  input: (dark) => ({
    flex: 1,
    padding: "12px",
    borderRadius: 10,
    border: "1px solid #333",
    background: dark ? "#2a2a2a" : "#fff",
    color: "inherit",
    outline: "none",
  }),

  mic: (active) => ({
    width: 40,
    height: 40,
    borderRadius: "50%",
    border: "1px solid #444",
    background: active ? "#ff4d4d" : "transparent",
    color: "inherit",
  }),

  send: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "#2f6fed",
    border: "none",
    color: "white",
  },
};