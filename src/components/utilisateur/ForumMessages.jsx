import React, { useState, useEffect } from 'react';
import { getMessagesForum, envoyerMessageForum } from '../../services/serviceUtilisateur';

const ForumMessages = () => {
  const [messages, setMessages] = useState([]);
  const [nouveauMessage, setNouveauMessage] = useState('');
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    async function fetchMessages() {
      try {
        const data = await getMessagesForum();
        setMessages(data);
      } catch (error) {
        console.error('Erreur chargement messages:', error);
      }
    }
    fetchMessages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nouveauMessage.trim()) {
      setErreur('Le message ne peut pas être vide.');
      return;
    }
    try {
      await envoyerMessageForum(nouveauMessage);
      setMessages(prev => [...prev, { id: Date.now(), texte: nouveauMessage, auteur: 'Vous' }]);
      setNouveauMessage('');
      setErreur('');
    } catch (error) {
      setErreur('Erreur lors de l’envoi du message.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Forum de discussion</h2>
      <div style={{ maxHeight: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
        {messages.length === 0 ? (
          <p>Aucun message pour le moment.</p>
        ) : (
          messages.map(msg => (
            <div key={msg.id} style={{ marginBottom: '10px' }}>
              <strong>{msg.auteur} :</strong> {msg.texte}
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <textarea 
          value={nouveauMessage} 
          onChange={e => setNouveauMessage(e.target.value)} 
          rows={3} 
          placeholder="Écrivez votre message ici..."
        />
        <br />
        <button type="submit">Envoyer</button>
      </form>
      {erreur && <p style={{color: 'red'}}>{erreur}</p>}
    </div>
  );
};

export default ForumMessages;

