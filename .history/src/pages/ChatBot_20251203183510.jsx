import React, { useState } from "react";
import axios from "axios";

const ChatBot = () => {
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!userMessage) return;
    try {
      const res = await axios.post("/api/ai/chat", { message: userMessage });
      setMessages([...messages, { from: "user", text: userMessage }, { from: "ai", text: res.data.reply }]);
      setUserMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Chatbot d’accompagnement IA</h2>
      <div style={{ minHeight: 200, border: "1px solid gray", padding: 10, marginBottom: 10, overflowY: "auto" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.from === "user" ? "right" : "left", margin: 5 }}>
            <b>{m.from}:</b> {m.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="Écris ton message..."
        style={{ width: "80%", marginRight: 10 }}
      />
      <button onClick={sendMessage}>Envoyer</button>
    </div>
  );
};

export default ChatBot;
