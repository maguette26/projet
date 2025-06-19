import React, { useEffect, useState } from 'react';

const API_BASE_URL = 'http://localhost:9191/api';

// Liste des mots interdits pour modération
const motsInterdits = ['haine', 'suicide', 'viol'];

// Fonction pour détecter la présence d'un mot interdit dans un texte
function contientMotInterdit(texte) {
  if (!texte) return false;
  const texteMinuscule = texte.toLowerCase();
  return motsInterdits.some(mot => texteMinuscule.includes(mot.toLowerCase()));
}

// Fonction pour récupérer tous les sujets du forum (sans service externe)
async function getDiscussions() {
  const response = await fetch(`${API_BASE_URL}/forum/admin/tous`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des sujets de forum");
  }
  return await response.json();
}

// Fonction pour supprimer un sujet par son idSujet
async function supprimerDiscussion(idSujet) {
  const response = await fetch(`${API_BASE_URL}/forum/admin/supprimer-sujet/${idSujet}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error("Erreur lors de la suppression du sujet du forum");
  }
  return await response.text();
}

const ModerationDiscussions = () => {
  const [forumMessages, setForumMessages] = useState([]);

  useEffect(() => {
    fetchForumMessages();
  }, []);

  const fetchForumMessages = async () => {
    try {
      const data = await getDiscussions();
      console.log('Messages reçus:', data);
      setForumMessages(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des messages du forum:', error);
    }
  };

  const handleSupprimerForum = async (idSujet) => {
    if (!idSujet) {
      console.error('handleSupprimerForum: idSujet est undefined');
      return;
    }
    const confirmation = window.confirm('Êtes-vous sûr de vouloir supprimer ce sujet du forum ?');
    if (!confirmation) return;

    try {
      await supprimerDiscussion(idSujet);
      setForumMessages(prev => prev.filter(msg => msg.idSujet !== idSujet));
    } catch (error) {
      console.error('Erreur lors de la suppression du sujet du forum:', error);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-700">Modération Forum</h2>
      <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
        {forumMessages.length === 0 ? (
          <li className="p-4 text-center text-gray-500">
            Aucun message de forum à modérer.
          </li>
        ) : (
          forumMessages.map((msg) => {
            const inapproprie = contientMotInterdit(msg.contenu);
            const auteurNom = msg.auteur || "Auteur inconnu";
            const dateFormatee = new Date(msg.dateCreation).toLocaleString();

            return (
              <li
                key={msg.idSujet}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4"
              >
                <div className="flex-grow mb-2 sm:mb-0 pr-4">
                  <strong className="text-gray-800">{auteurNom}</strong> :{' '}
                  {inapproprie ? (
                    <span className="text-red-600 font-semibold">[Message inapproprié]</span>
                  ) : (
                    <span className="text-gray-700">{msg.titre} — {msg.contenu}</span>
                  )}
                  <span className="block text-xs text-gray-500 mt-1">
                    ({dateFormatee})
                  </span>
                </div>
                <button
                  onClick={() => handleSupprimerForum(msg.idSujet)}
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
  );
};

export default ModerationDiscussions;
