import React, { useEffect, useState } from 'react';
import { getDiscussions, supprimerDiscussion, getMessagesPrives, supprimerMessagePrive } from '../../services/serviceAdmin';

const ModerationDiscussions = () => {
  const [forumMessages, setForumMessages] = useState([]);
  const [messagesPrives, setMessagesPrives] = useState([]);

  useEffect(() => {
    fetchForumMessages();
    fetchMessagesPrives();
  }, []);

  const fetchForumMessages = async () => {
    const data = await getDiscussions();
    setForumMessages(data);
  };

  const fetchMessagesPrives = async () => {
    const data = await getMessagesPrives();
    setMessagesPrives(data);
  };

  const handleSupprimerForum = async (id) => {
    await supprimerDiscussion(id);
    fetchForumMessages();
  };

  const handleSupprimerPrive = async (id) => {
    await supprimerMessagePrive(id);
    fetchMessagesPrives();
  };

  return (
    <div>
      <h2>Modération - Forum</h2>
      <ul>
        {forumMessages.map(msg => (
          <li key={msg.id}>
            <strong>{msg.auteur}</strong>: {msg.contenu}
            <button onClick={() => handleSupprimerForum(msg.id)}>Supprimer</button>
          </li>
        ))}
      </ul>

      <h2>Modération - Messagerie privée</h2>
      <ul>
        {messagesPrives.map(msg => (
          <li key={msg.id}>
            <strong>{msg.expéditeur}</strong> à <strong>{msg.destinataire}</strong>: {msg.contenu}
            <button onClick={() => handleSupprimerPrive(msg.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModerationDiscussions;
