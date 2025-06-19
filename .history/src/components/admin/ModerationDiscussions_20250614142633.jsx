import React, { useEffect, useState } from 'react';
import {
  getDiscussions,
  supprimerDiscussion,
  getMessagesPrives,
  supprimerMessagePrive,
} from '../../services/serviceAdmin'; // Assure-toi que ce chemin est correct

// Liste des mots interdits (à adapter si besoin)
const motsInterdits = ['haine', 'suicide', 'viol'];

function contientMotInterdit(texte) {
  if (!texte) return false;
  const texteMinuscule = texte.toLowerCase();
  return motsInterdits.some(mot => texteMinuscule.includes(mot.toLowerCase()));
}

const ModerationDiscussions = () => {
  const [forumMessages, setForumMessages] = useState([]);
  const [messagesPrives, setMessagesPrives] = useState([]);
  const [activeTab, setActiveTab] = useState('forum'); // 'forum' ou 'prive'

  useEffect(() => {
    fetchForumMessages();
    fetchMessagesPrives();
  }, []);

  const fetchForumMessages = async () => {
    try {
      const data = await getDiscussions();
      setForumMessages(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des messages du forum:', error);
    }
  };

  const fetchMessagesPrives = async () => {
    try {
      const data = await getMessagesPrives();
      setMessagesPrives(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des messages privés:', error);
    }
  };

  const handleSupprimerForum = async id => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce message du forum ?')) {
      try {
        await supprimerDiscussion(id);
        fetchForumMessages();
      } catch (error) {
        console.error('Erreur lors de la suppression du message du forum:', error);
      }
    }
  };

  const handleSupprimerPrive = async id => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce message privé ?')) {
      try {
        await supprimerMessagePrive(id);
        fetchMessagesPrives();
      } catch (error) {
        console.error('Erreur lors de la suppression du message privé:', error);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Onglets */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('forum')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'forum'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Modération Forum
        </button>
        <button
          onClick={() => setActiveTab('prive')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'prive'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Modération Messagerie Privée
        </button>
      </div>

      {/* Contenu onglet actif */}
      <div className="mt-4">
        {activeTab === 'forum' && (
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-700">Messages du Forum</h3>
            <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
              {forumMessages.length === 0 ? (
                <li className="p-4 text-center text-gray-500">Aucun message de forum à modérer.</li>
              ) : (
                forumMessages.map(msg => {
                  const inapproprie = contientMotInterdit(msg.contenu);
                  return (
                    <li
                      key={msg.id}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4"
                    >
                      <div className="flex-grow mb-2 sm:mb-0 pr-4">
                        <strong className="text-gray-800">{msg.auteur}</strong>:{' '}
                        {inapproprie ? (
                          <span className="text-red-600 font-semibold">[Message inapproprié]</span>
                        ) : (
                          <span className="text-gray-700">{msg.contenu}</span>
                        )}
                        <span className="block text-xs text-gray-500 mt-1">
                          ({new Date(msg.date).toLocaleDateString()} à {msg.heure})
                        </span>
                      </div>
                      <button
                        onClick={() => handleSupprimerForum(msg.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 flex-shrink-0"
                      >
                        Supprimer
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}

        {activeTab === 'prive' && (
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-700">Messages Privés</h3>
            <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
              {messagesPrives.length === 0 ? (
                <li className="p-4 text-center text-gray-500">Aucun message privé à modérer.</li>
              ) : (
                messagesPrives.map(msg => {
                  const inapproprie = contientMotInterdit(msg.contenu);
                  return (
                    <li
                      key={msg.id}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4"
                    >
                      <div className="flex-grow mb-2 sm:mb-0 pr-4">
                        <strong className="text-gray-800">{msg.expéditeur}</strong> à{' '}
                        <strong className="text-gray-800">{msg.destinataire}</strong>:{' '}
                        {inapproprie ? (
                          <span className="text-red-600 font-semibold">[Message inapproprié]</span>
                        ) : (
                          <span className="text-gray-700">{msg.contenu}</span>
                        )}
                        <span className="block text-xs text-gray-500 mt-1">
                          ({new Date(msg.date).toLocaleDateString()} à {msg.heure})
                        </span>
                      </div>
                      <button
                        onClick={() => handleSupprimerPrive(msg.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 flex-shrink-0"
                      >
                        Supprimer
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModerationDiscussions;
