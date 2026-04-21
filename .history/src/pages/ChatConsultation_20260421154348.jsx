import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";

const WS_URL = "http://localhost:9191/ws-consultation";

const ChatConsultation = () => {
  const { consultationId } = useParams();
<A
  const [currentUserId, setCurrentUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const messagesEndRef = useRef(null);

  // 👤 user connecté
  useEffect(() => {
    fetch("http://localhost:9191/api/auth/me", { credentials: "include" })
      .then(res => res.json())
      .then(user => setCurrentUserId(user.id))
      .catch(console.error);
  }, []);

  // 📜 scroll auto
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // 🔌 WebSocket
  useEffect(() => {
    if (!currentUserId) return;

    const socket = new SockJS(WS_URL);

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("✅ WebSocket connecté");

        // ❗ PRIVÉ CORRECT
        client.subscribe("/user/queue/messages", (msg) => {
          const message = JSON.parse(msg.body);
          setMessages(prev => [...prev, message]);
        });

        // 📜 historique
        fetch(`http://localhost:9191/api/messages/consultation/${consultationId}`, {
          credentials: "include"
        })
          .then(res => res.json())
          .then(setMessages)
          .catch(console.error);
      }
    });

    client.activate();
    setStompClient(client);

    return () => client.deactivate();

  }, [consultationId, currentUserId]);

  // 📤 envoyer message
  const sendMessage = () => {
    if (!inputMessage.trim() || !stompClient) return;

    const message = {
      contenu: inputMessage,
      consultationId: consultationId
    };

    stompClient.publish({
      destination: `/app/consultation/${consultationId}`,
      body: JSON.stringify(message)
    });

    setInputMessage("");
  };

  if (!currentUserId) return <p>Chargement...</p>;

  return (
    <div style={{ border: "1px solid #ccc", padding: 10, width: 400, margin: "20px auto" }}>
      <h3>💬 Consultation #{consultationId}</h3>

      <div style={{ height: 300, overflowY: "auto", padding: 5 }}>
        {messages.map((m, idx) => (
          <div key={idx} style={{ margin: "5px 0" }}>
            <b>{m.expediteur?.nom || "Utilisateur"}</b>: {m.contenu}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: "flex" }}>
        <input
          style={{ flex: 1, padding: 5 }}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Message..."
        />

        <button onClick={sendMessage} style={{ marginLeft: 5 }}>
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default ChatConsultation;