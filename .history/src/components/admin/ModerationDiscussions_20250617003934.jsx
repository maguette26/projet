import React, { useEffect, useState } from 'react';

const API_BASE_URL = 'http://localhost:9191/api';

const motsInterdits = ['haine', 'suicide', 'viol'];

function contientMotInterdit(texte) {
  if (!texte) return false;
  const texteMinuscule = texte.toLowerCase();
  return motsInterdits.some(mot => texteMinuscule.includes(mot.toLowerCase()));
}

// Requête pour les messages
async function getMessages() {
  const response = await fetch(`${API_BASE_URL}/messages/admin/tous`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error("Erreur récupération des messages");
  return await response.json();
}

// Supprimer un message
async function supprimerMessage(id) {
  const response = await fetch(`${API_BASE_URL}/messages/admin/supprimer/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error("Erreur suppression message");
  return await response.text();
}

// Forum : récupérer les sujets
async function getSujetsForum() {
  const response = await fetch(`${API_BASE_URL}/forum/admin/tous`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error("Erreur récupération des sujets forum");
  return await response.json();
}

// Forum : supprimer un sujet
async function supprimerSujetForum(id) {
  const response = await fetch(`${API_BASE_URL}/forum/admin/supprimer-sujet/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error("Erreur suppression sujet");
  return await response.text();
}

const ModerationMessages = () => {
  const [messages, setMessages] = useState([]);
  const [sujets, setSujets] = useState([]);

  useEffect(() => {
    fetchMessages();
    fetchSujetsForum();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await getMessages();
      setMessages(data);
    } catch (error) {
      console.error('Erreur récupération messages:', error);
    }
  };

  const fetchSujetsForum = async () => {
    try {
      const data = await getSujetsForum();
      setSujets(data);
    } catch (error) {
      console.error('Erreur récupération sujets forum:', error);
    }
  };

  const handleSupprimerMessage = async (id) => {
    if (!id) return;
    if (!window.confirm('Supprimer ce message ?')) return;
    try {
      await supprimerMessage(id);
      setMessages(prev => prev.filter(msg => msg.id !== id));
    } catch (error) {
      console.error('Erreur suppression message:', error);
    }
  };

  const handleSupprimerSujet = async (idSujet) => {
    if (!window.confirm('Supprimer ce sujet ?')) return;
    try {
      await supprimerSujetForum(idSujet);
      setSujets(prev => prev.filter(s => s.idSujet !== idSujet));
    } catch (error) {
      console.error('Erreur suppression sujet forum:', error);
    }
  };

  return (
    <div className="space-y-8 p-4">
      {/* Bloc Messages privés + forum */}
      <div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">Modération des Messages (Forum & Privés)</h2>
        <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
          {messages.length === 0 ? (
            <li className="p-4 text-center text-gray-500">Aucun message à modérer.</li>
          ) : (
            messages.map(msg => {
              const inapproprie = msg.inapproprie || contientMotInterdit(msg.contenu);
              const expediteur = msg.anonymat ? 'Anonyme' : (msg.expediteur || 'Inconnu');
              const destinataire = msg.destinataire || 'Forum Public';

              let dateHeure = 'Date inconnue';
              try {
                const dateTime = new Date(`${msg.date}T${msg.heure}`);
                if (!isNaN(dateTime)) {
                  dateHeure = `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                }
              } catch (e) {
                console.error('Date invalide:', e);
              }

              return (
                <li key={msg.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4">
                  <div className="flex-grow mb-2 sm:mb-0 pr-4">
                    <strong className="text-gray-800">{expediteur}</strong> à <em>{destinataire}</em> :{' '}
                    {inapproprie ? (
                      <span className="text-red-600 font-semibold">[Message inapproprié]</span>
                    ) : (
                      <span className="text-gray-700">{msg.contenu}</span>
                    )}
                    <span className="block text-xs text-gray-500 mt-1">({dateHeure})</span>
                  </div>
                  <button
                    onClick={() => handleSupprimerMessage(msg.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>

      {/* Bloc Forum Sujets */}
      <div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">Modération des Sujets du Forum</h2>
        {sujets.length === 0 ? (
          <p className="text-gray-500">Aucun sujet trouvé.</p>
        ) : (
          <ul className="space-y-6">
            {sujets.map(sujet => (
              <li key={sujet.idSujet} className="border border-gray-200 rounded-md p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{sujet.titre}</h3>
                    <p className="text-gray-800">{sujet.contenu}</p>
                    <p className="text-sm text-gray-500">
                      Auteur : {sujet.auteur} | {new Date(sujet.dateCreation).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSupprimerSujet(sujet.idSujet)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Supprimer
                  </button>
                </div>

                {sujet.reponses && sujet.reponses.length > 0 && (
                  <div className="mt-4 border-t pt-2">
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">Réponses :</h4>
                    <ul className="space-y-2">
                      {sujet.reponses.map(rep => (
                        <li key={rep.idReponse} className="bg-gray-50 p-2 rounded">
                          <p><strong>{rep.auteur}</strong> : {rep.message}</p>
                          <p className="text-xs text-gray-500">{new Date(rep.dateReponse).toLocaleString()}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ModerationMessages;
