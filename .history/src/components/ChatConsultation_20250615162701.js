import React, { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const ChatConsultation = ({ consultationId, senderId, receiverId }) => {
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const socket = new SockJS('http://localhost:9191/ws-message');
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Connecté à STOMP');
        client.subscribe(`/topic/messages/${consultationId}`, (message) => {
          if (message.body) {
            const msg = JSON.parse(message.body);
            setMessages((prev) => [...prev, msg]);
          }
        });
      },
      onStompError: (frame) => {
        console.error('Erreur STOMP : ', frame.headers['message']);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      if (client) client.deactivate();
    };
  }, [consultationId]);

  const sendMessage = () => {
    if (stompClient && input.trim()) {
      const message = {
        senderId,
        receiverId,
        consultationId,
        content: input.trim(),
      };
      stompClient.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(message),
      });
      setInput('');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Chat Consultation #{consultationId}</h2>
      <div
        style={{
          border: '1px solid #ccc',
          height: 300,
          overflowY: 'auto',
          padding: 10,
          marginBottom: 10,
          background: '#f9f9f9',
        }}
      >
        {messages.length === 0 && <p>Aucun message</p>}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: 8,
              textAlign: msg.senderId === senderId ? 'right' : 'left',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                padding: '6px 12px',
                borderRadius: 12,
                backgroundColor: msg.senderId === senderId ? '#007bff' : '#e4e6eb',
                color: msg.senderId === senderId ? 'white' : 'black',
                maxWidth: '70%',
                wordBreak: 'break-word',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Écrire un message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') sendMessage();
        }}
        style={{
          width: '100%',
          padding: 10,
          borderRadius: 4,
          border: '1px solid #ccc',
          boxSizing: 'border-box',
        }}
      />
      <button
        onClick={sendMessage}
        style={{
          marginTop: 10,
          padding: '10px 20px',
          borderRadius: 4,
          border: 'none',
          backgroundColor: '#007bff',
          color: 'white',
          cursor: 'pointer',
        }}
      >
        Envoyer
      </button>
    </div>
  );
};

export default ChatConsultation;
