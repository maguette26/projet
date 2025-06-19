import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';

const ChatContainer= ({ consultationId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [contenu, setContenu] = useState('');
  const [anonymat, setAnonymat] = useState(false);
  const stompClientRef = useRef(null);

  // ✅ Charger les messages de la consultation
  useEffect(() => {
    axios.get(`/api/messages/consultation/${consultationId}`)
      .then(res => setMessages(res.data))
      .catch(err => console.error(err));
  }, [consultationId]);

  // ✅ Initialiser WebSocket
  useEffect(() => {
    const sock = new SockJS('/ws'); // endpoint défini dans Spring config
    const stompClient = over(sock);
    stompClientRef.current = stompClient;

    stompClient.connect({}, () => {
      // S'abonner aux messages reçus
      stompClient.subscribe(`/user/${currentUser.email}/queue/messages`, (message) => {
        const msgObj = JSON.parse(message.body);
        if (msgObj.consultation?.id === consultationId) {
          setMessages(prev => [...prev, msgObj]);
        }
      });
    });

    return () => stompClient.disconnect();
  }, [consultationId, currentUser.email]);

  // ✅ Envoyer un message
  const handleSendMessage = () => {
    if (!contenu.trim()) return;

    const message = {
      contenu,
      anonymat,
      expediteur: { id: currentUser.id },
      destinataire: getDestinataireId(),
      consultation: { id: consultationId }
    };

    // Envoi via WebSocket
    stompClientRef.current.send('/app/send', {}, JSON.stringify(message));

    setContenu('');
  };

  // Trouver le destinataire selon les messages chargés (très simplifié)
  const getDestinataireId = () => {
    const other = messages.find(msg => msg.expediteur.id !== currentUser.id);
    return other ? other.expediteur.id : null;
  };

  return (
    <div className="chat-container">
      <h2>Chat Consultation #{consultationId}</h2>

      <div className="messages-box" style={{ maxHeight: '300px', overflowY: 'scroll' }}>
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.expediteur.id === currentUser.id ? 'me' : 'other'}`}>
            <strong>{msg.anonymat ? 'Anonyme' : msg.expediteur.nom}:</strong> {msg.contenu}
            <span className="timestamp">{msg.date} {msg.heure}</span>
          </div>
        ))}
      </div>

      <div className="input-box">
        <textarea
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          placeholder="Écrire un message..."
        />
        <label>
          <input
            type="checkbox"
            checked={anonymat}
            onChange={() => setAnonymat(!anonymat)}
          />
          Envoyer anonymement
        </label>
        <button onClick={handleSendMessage}>Envoyer</button>
      </div>
    </div>
  );
};

export default ChatConsultation;
