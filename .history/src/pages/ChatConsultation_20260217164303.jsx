import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";

// Remplacer par l'URL de ton backend
const WS_URL = "http://localhost:9191/ws-consultation";

const ChatConsultation = ({ consultationId, currentUser }) => {
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll automatique vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    // Connexion WebSocket
    const socket = new SockJS(WS_URL);
    const client = over(socket);

    client.connect({}, () => {
      console.log("✅ WebSocket connecté");

      // S'abonner aux messages privés pour l'utilisateur
      client.subscribe(`/user/queue/messages`, (msg) => {
        const message = JSON.parse(msg.body);
        setMessages((prev) => [...prev, message]);
      });

      // Charger les messages existants via API REST si besoin
      fetch(`http://localhost:9191/api/messages/consultation/${consultationId}`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => setMessages(data))
        .catch((err) => console.error(err));
    });

    setStompClient(client);

    return () => {
      client.disconnect(() => console.log("WebSocket déconnecté"));
    };
  }, [consultationId]);

  const sendMessage = () => {
    if (!inputMessage.trim() || !stompClient) return;

    const message = { contenu: inputMessage };

    stompClient.send(
      `/app/consultation/${consultationId}`,
      {},
      JSON.stringify(message)
    );
    setInputMessage("");
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 10, width: 400 }}>
      <h3>Chat Consultation #{consultationId}</h3>
      <div
        style={{
          border: "1px solid #eee",
          height: 300,
          overflowY: "scroll",
          padding: 5,
          marginBottom: 10,
        }}
      >
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
        <button onClick={sendMessage} style={{ marginLeft: 5 }}>
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default ChatConsultation;