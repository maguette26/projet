import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { over } from "stompjs";

const WS_URL = "http://localhost:9191/ws-consultation";

const ChatConsultationPage = () => {
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
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  // 🔹 Connexion WebSocket + récupération des anciens messages
  useEffect(() => {
    if (!currentUserId) return;

    const socket = new SockJS(WS_URL);
    const client = over(socket);

    client.connect({}, () => {
      console.log("✅ WebSocket connecté");

      // écouter les messages pour cette consultation
      client.subscribe(`/topic/consultation/${consultationId}`, (msg) => {
        setMessages(prev => [...prev, JSON.parse(msg.body)]);
      });

      // récupérer les messages existants
      fetch(`http://localhost:9191/api/messages/consultation/${consultationId}`, { credentials: "include" })
        .then(res => res.json())
        .then(setMessages)
        .catch(console.error);
    });

    setStompClient(client);

    return () => client.disconnect(() => console.log("WebSocket déconnecté"));
  }, [consultationId, currentUserId]);

  // 🔹 Envoyer un message
  const sendMessage = () => {
    if (!inputMessage.trim() || !stompClient) return;

    const message = {
      contenu: inputMessage,
      expediteur: { id: currentUserId } // nécessaire pour le backend
    };

    stompClient.send(`/app/consultation/${consultationId}`, {}, JSON.stringify(message));
    setInputMessage("");
  };

  if (!currentUserId) return <p>Chargement de l'utilisateur...</p>;

  return (
    <div style={{ border: "1px solid #ccc", padding: 10, width: 400, margin: "20px auto" }}>
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

export default ;