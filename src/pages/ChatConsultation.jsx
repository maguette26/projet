import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";

const WS_URL = "http://localhost:9191/ws-consultation";

const ChatConsultation = () => {
  const { consultationId } = useParams();

  const [currentUserId, setCurrentUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const clientRef = useRef(null);
  const messagesEndRef = useRef(null);

  // 🔹 user connecté
  useEffect(() => {
    fetch("http://localhost:9191/api/auth/me", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(user => setCurrentUserId(user.id))
      .catch(console.error);
  }, []);

  // 🔹 scroll auto
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔹 WebSocket
  useEffect(() => {
    if (!currentUserId) return;

    const socket = new SockJS(WS_URL);

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("✅ WS connecté");

        // 🔐 PRIVÉ (IMPORTANT)
        client.subscribe("/user/queue/messages", (msg) => {
          const message = JSON.parse(msg.body);
          setMessages(prev => [...prev, message]);
        });

        // 📜 historique
        fetch(`http://localhost:9191/api/messages/consultation/${consultationId}`, {
          credentials: "include",
        })
          .then(res => res.json())
          .then(setMessages)
          .catch(console.error);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => client.deactivate();
  }, [consultationId, currentUserId]);

  // 🔹 send message
  const sendMessage = () => {
    if (!inputMessage.trim() || !clientRef.current) return;

    clientRef.current.publish({
      destination: `/app/consultation/${consultationId}`,
      body: JSON.stringify({
        contenu: inputMessage,
      }),
    });

    setInputMessage("");
  };

  if (!currentUserId) return <p>Chargement...</p>;

  return (
    <div style={styles.container}>
      <h3>💬 Consultation #{consultationId}</h3>

      <div style={styles.chatBox}>
        {messages.map((m, idx) => (
          <div key={idx} style={styles.msg}>
            <b>{m.expediteur?.nom || "User"}:</b> {m.contenu}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      <div style={styles.inputBox}>
        <input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Écrire un message..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.btn}>
          Envoyer
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "420px",
    margin: "20px auto",
    border: "1px solid #ddd",
    padding: 10,
    borderRadius: 10,
  },
  chatBox: {
    height: 320,
    overflowY: "auto",
    border: "1px solid #eee",
    padding: 10,
    marginBottom: 10,
  },
  msg: {
    marginBottom: 6,
  },
  inputBox: {
    display: "flex",
  },
  input: {
    flex: 1,
    padding: 8,
  },
  btn: {
    marginLeft: 5,
  },
};

export default ChatConsultation;