import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatConsultation from './components/ChatConsultation';

function ChatContainer({ consultationId }) {
  const [chatData, setChatData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConsultation() {
      try {
        const response = await axios.get(`/api/consultations/${consultationId}`);
        setChatData(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données consultation", error);
      } finally {
        setLoading(false);
      }
    }

    fetchConsultation();
  }, [consultationId]);

  if (loading) return <div>Chargement...</div>;
  if (!chatData) return <div>Erreur : consultation non trouvée</div>;

  return (
    <ChatConsultation 
      consultationId={chatData.consultationId} 
      senderId={chatData.senderId} 
      receiverId={chatData.receiverId} 
    />
  );
}

export default ChatContainer;
