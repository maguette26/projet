import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const WS_URL = "http://localhost:9191/ws-consultation";

const ChatConsultation = () => {
  const { consultationId } = useParams();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const messagesEndRef = useRef(null);

  // 🔹 Récupérer l'utilisateur connecté
  useEffect(() => {
    fetch("http://localhost:9191/api/auth/me", { credentials: "include" })
      .then(res => res.json())
      .then(user => setCurrentUserId(user.id))
      .catch(console.error);
  }, []);

  // 🔹 Scroll automatique
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // 🔹 Connexion WebSocket
  useEffect(() => {
    if (!currentUserId) return;

    const socket = new SockJS(WS_URL);

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("✅ WebSocket connecté");

        // écouter les nouveaux messages
        client.subscribe(`/topic/consultation/${consultationId}`, (msg) => {
          const message = JSON.parse(msg.body);
          setMessages(prev => [...prev, message]);
        });

        // récupérer les anciens messages
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

  // 🔹 Envoyer un message
  const sendMessage = () => {
    if (!inputMessage.trim() || !stompClient) return;

    const message = {
      contenu: inputMessage,
      expediteur: { id: currentUserId }
    };

    stompClient.publish({
      destination: `/app/consultation/${consultationId}`,
      body: JSON.stringify(message)
    });

    setInputMessage("");
  };

  if (!currentUserId) return <p>Chargement de l'utilisateur...</p>;

  return (
    <div style={{ border: "1px solid #ccc", padding: 10, width: 400, margin: "20px auto" }}>
      <h3>Chat Consultation #{consultationId}</h3>

      <div style={{ border: "1px solid #eee", height: 300, overflowY: "scroll", padding: 5, marginBottom: 10 }}>
        {messages.map((m, idx) => (
          <div key={idx} style={{ margin: "5px 0" }}>
            <b>{m.expediteur?.nom || "Utilisateur"}</b>: {m.contenu}
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