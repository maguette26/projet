import React, { useEffect, useState } from 'react';
import {
  getDiscussions,
  getReponsesSujet,
  supprimerDiscussion,
  getTousMessages,
  supprimerMessagePrive,
} from '../../services/serviceAdmin';

// Mots interdits
const motsInterdits = ['haine', 'suicide', 'viol'];

function contientMotInterdit(texte) {
  if (!texte) return false;
  const texteMinuscule = texte.toLowerCase();
  return motsInterdits.some((mot) => texteMinuscule.includes(mot.toLowerCase()));
}

const ModerationDiscussions = () => {
  const [sujets, setSujets] = useState([]);
  const [reponses, setReponses] = useState({});
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('forum');

  useEffect(() => {
    fetchForumMessages();
    fetchMessagesPrives();
  }, []);

  const fetchForumMessages = async () => {
    try {
      const sujets = await getDiscussions();
      setSujets(sujets);

      const allReponses = {};
      for (const sujet of sujets) {
        const sujetId = sujet.id || (sujet.sujet && sujet.sujet.id);
        if (!sujetId) continue;
        try {
          const rep = await getReponsesSujet(sujetId);
          allReponses[sujetId] = rep;
        } catch (err) {
          console.error(`Erreur de chargement des réponses pour le sujet ${sujetId}`, err);
        }
      }
      setReponses(allReponses);
    } catch (error) {
      console.error('Erreur lors de la récupération des sujets du forum:', error);
    }
  };

  const fetchMessagesPrives = async () => {
    try {
      const data = await getTousMessages();
      setMessages(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des messages privés:', error);
    }
  };

  const handleSupprimerForum = async (id) => {
    if (window.confirm('Supprimer ce sujet ?')) {
      try {
        await supprimerDiscussion(id);
        fetchForumMessages();
      } catch (error) {
        console.error('Erreur suppression sujet:', error);
      }
    }
  };

  const handleSupprimerPrive = async (id) => {
    if (window.confirm('Supprimer ce message ?')) {
      try {
        await supprimerMessagePrive(id);
        fetchMessagesPrives();
      } catch (error) {
        console.error('Erreur suppression message:', error);
      }
    }
  };

  return (
    <div className="space-y-4 p-4">
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

      <div className="mt-4">
        {activeTab === 'forum' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Sujets du Forum</h3>
            {sujets.length === 0 ? (
              <p className="text-gray-500">Aucun sujet à modérer.</p>
            ) : (
              sujets.map((sujet) => {
                const sujetId = sujet.id || (sujet.sujet && sujet.sujet.id);
                const contenu = sujet.contenu || (sujet.sujet && sujet.sujet.contenu);
                const auteur = sujet.auteur || (sujet.sujet && sujet.sujet.auteur);
                const inapproprie = contientMotInterdit(contenu);
                return (
                  <div key={sujetId} className="border p-3 rounded-md space-y-2 bg-white shadow">
                    <div>
                      <strong className="text-gray-800">{auteur}</strong> :{' '}
                      {inapproprie ? (
                        <span className="text-red-600 font-semibold">[Message inapproprié]</span>
                      ) : (
                        <span className="text-gray-700">{contenu}</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(sujet.date).toLocaleDateString()} à {sujet.heure}
                    </div>
                    <button
                      onClick={() => handleSupprimerForum(sujetId)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      Supprimer
                    </button>
                    {/* Réponses si disponibles */}
                    {reponses[sujetId] && (
                      <div className="mt-2 ml-4 text-sm">
                        <strong className="text-gray-600">Réponses :</strong>
                        {reponses[sujetId].map((rep, index) => (
                          <div key={rep.id || index} className="mt-1 ml-2">
                            - <span className="text-gray-700">{rep.contenu}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'prive' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Messages Privés</h3>
            {messages.length === 0 ? (
              <p className="text-gray-500">Aucun message privé à modérer.</p>
            ) : (
              messages.map((msg) => {
                const inapproprie = contientMotInterdit(msg.contenu);
                return (
                  <div key={msg.id} className="border p-3 rounded-md bg-white shadow">
                    <div className="mb-1">
                      <strong className="text-gray-800">{msg.expediteur}</strong> à{' '}
                      <strong className="text-gray-800">{msg.destinataire}</strong> :{' '}
                      {inapproprie ? (
                        <span className="text-red-600 font-semibold">[Message inapproprié]</span>
                      ) : (
                        <span className="text-gray-700">{msg.contenu}</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(msg.date).toLocaleDateString()} à {msg.heure}
                    </div>
                    <button
                      onClick={() => handleSupprimerPrive(msg.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm mt-2"
                    >
                      Supprimer
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModerationDiscussions;
