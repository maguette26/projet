import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";

const WS_URL = "http://localhost:9191/ws-consultation";

const ChatConsultation = ({ consultationId }) => {
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const socket = new SockJS(WS_URL);
    const client = over(socket);

    client.connect({}, () => {
      console.log("✅ WebSocket connecté");

      client.subscribe(`/topic/consultation/${consultationId}`, (msg) => {
        setMessages(prev => [...prev, JSON.parse(msg.body)]);
      });

      fetch(`http://localhost:9191/api/messages/consultation/${consultationId}`, { credentials: "include" })
        .then(res => res.json())
        .then(setMessages)
        .catch(console.error);
    });

    setStompClient(client);

    return () => client.disconnect(() => console.log("WebSocket déconnecté"));
  }, [consultationId]);

  const sendMessage = () => {
    if (!inputMessage.trim() || !stompClient) return;
    const message = { contenu: inputMessage };
    stompClient.send(`/app/consultation/${consultationId}`, {}, JSON.stringify(message));
    setInputMessage("");
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 10, width: 400 }}>
      <h3>Chat Consultation #{consultationId}</h3>
      <div style={{ border: "1px solid #eee", height: 300, overflowY: "scroll", padding: 5, marginBottom: 10 }}>
        {messages.map((m, idx) => (
          <div key={idx} style={{ margin: "5px 0" }}>
            <b>{m.expediteur.nom}</b>: {m.contenu}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <div style={{ display: "flex" }}>
        <input
          style={{ flex: 1, padding: 5 }}
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Tapez un message..."
        />
        <button onClick={sendMessage} style={{ marginLeft: 5 }}>Envoyer</button>
      </div>
    </div>
  );
};

export default ChatConsultation;