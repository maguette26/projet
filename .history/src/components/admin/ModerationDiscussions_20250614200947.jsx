import React, { useEffect, useState } from 'react';

const API_BASE_URL = 'http://localhost:9191/api';

// Liste des mots interdits pour modération
const motsInterdits = ['haine', 'suicide', 'viol'];

// Vérifie si un message contient un mot interdit
function contientMotInterdit(texte) {
  if (!texte) return false;
  const texteMinuscule = texte.toLowerCase();
  return motsInterdits.some(mot => texteMinuscule.includes(mot));
}

// Récupère tous les messages (forum + privé)
async function getMessages() {
  const response = await fetch(`${API_BASE_URL}/messages/admin/tous`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des messages");
  }
  return await response.json();
}

// Supprime un message donné
async function supprimerMessage(id) {
  const response = await fetch(`${API_BASE_URL}/messages/admin/supprimer/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error("Erreur lors de la suppression du message");
  }
  return await response.text();
}

const ModerationMessages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await getMessages();
      console.log('Messages reçus:', data);
      setMessages(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
    }
  };

  const handleSupprimer = async (id) => {
    const confirmation = window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?');
    if (!confirmation) return;

    try {
      await supprimerMessage(id);
      setMessages(prev => prev.filter(msg => msg.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression du message:', error);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-700">Modération du Forum et des Messages</h2>
      <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
        {messages.length === 0 ? (
          <li className="p-4 text-center text-gray-500">
            Aucun message à modérer.
          </li>
        ) : (
          messages.map(msg => {
            const inapproprie = msg.inapproprie || contientMotInterdit(msg.contenu);
            const expediteur = msg.anonymat ? 'Anonyme' : (msg.expediteur || 'Inconnu');
            const destinataire = msg.destinataire || 'Forum Public';

            // Correction affichage date et heure
            let dateHeure = 'Date inconnue';
            if (msg.date && msg.heure) {
              const dateTimeString = `${msg.date}T${msg.heure}`;
              const dateObj = new Date(dateTimeString);
              if (!isNaN(dateObj.getTime())) {
                dateHeure = `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
              }
            }

            return (
              <li
                key={msg.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4"
              >
                <div className="flex-grow mb-2 sm:mb-0 pr-4">
                  <strong className="text-gray-800">{expediteur}</strong> à <em>{destinataire}</em> :{' '}
                  {inapproprie ? (
                    <span className="text-red-600 font-semibold">[Message inapproprié]</span>
                  ) : (
                    <span className="text-gray-700">{msg.contenu}</span>
                  )}
                  <span className="block text-xs text-gray-500 mt-1">
                    ({dateHeure})
                  </span>
                </div>
                <button
                  onClick={() => handleSupprimer(msg.id)}
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

export default ModerationMessages;
