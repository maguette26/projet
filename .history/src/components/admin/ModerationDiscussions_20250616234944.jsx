import React, { useEffect, useState } from 'react';
import { Trash2, MessageCircle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:9191/api';

const motsInterdits = ['haine', 'suicide', 'viol'];

function contientMotInterdit(texte) {
  if (!texte) return false;
  const texteMinuscule = texte.toLowerCase();
  return motsInterdits.some(mot => texteMinuscule.includes(mot.toLowerCase()));
}

async function getMessages() {
  const response = await fetch(`${API_BASE_URL}/messages/admin/tous`, { credentials: 'include' });
  if (!response.ok) throw new Error("Erreur récupération des messages");
  return await response.json();
}

async function supprimerMessage(id) {
  const response = await fetch(`${API_BASE_URL}/messages/admin/supprimer/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error("Erreur suppression message");
  return await response.text();
}

async function getSujetsForum() {
  const response = await fetch(`${API_BASE_URL}/forum/admin/tous`, { credentials: 'include' });
  if (!response.ok) throw new Error("Erreur récupération des sujets forum");
  return await response.json();
}

async function supprimerSujetForum(id) {
  const response = await fetch(`${API_BASE_URL}/forum/admin/supprimer-sujet/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error("Erreur suppression sujet");
  return await response.text();
}

async function supprimerReponseForum(idReponse) {
  const response = await fetch(`${API_BASE_URL}/forum/sujets/reponses/supprimer/${idReponse}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error("Erreur suppression réponse");
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

  const handleSupprimerReponse = async (idReponse, idSujet) => {
    if (!window.confirm('Supprimer cette réponse ?')) return;
    try {
      await supprimerReponseForum(idReponse);
      setSujets(prev =>
        prev.map(sujet => {
          if (sujet.idSujet !== idSujet) return sujet;
          return {
            ...sujet,
            reponses: sujet.reponses.filter(r => r.idReponse !== idReponse),
          };
        })
      );
    } catch (error) {
      console.error('Erreur suppression réponse:', error);
    }
  };

  return (
    <div className="space-y-10 p-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Modération des Messages</h2>
        <ul className="divide-y rounded-md border border-gray-200">
          {messages.length === 0 ? (
            <li className="p-4 text-center text-gray-500">Aucun message à modérer.</li>
          ) : (
            messages.map(msg => {
              const inapproprie = msg.inapproprie || contientMotInterdit(msg.contenu);
              const expediteur = msg.anonymat ? 'Anonyme' : (msg.expediteur || 'Inconnu');
              const destinataire = msg.destinataire || 'Forum Public';

              const dateTime = new Date(`${msg.date}T${msg.heure}`);
              const dateHeure = isNaN(dateTime)
                ? 'Date inconnue'
                : dateTime.toLocaleString();

              return (
                <li key={msg.id} className="flex justify-between items-start p-4 hover:bg-gray-50">
                  <div className="flex-1 space-y-1">
                    <p><strong>{expediteur}</strong> à <em>{destinataire}</em> :</p>
                    {inapproprie ? (
                      <span className="text-red-600 font-semibold">[Message inapproprié]</span>
                    ) : (
                      <span>{msg.contenu}</span>
                    )}
                    <p className="text-xs text-gray-500">{dateHeure}</p>
                  </div>
                  <button
                    onClick={() => handleSupprimerMessage(msg.id)}
                    className="ml-4 text-red-600 hover:text-red-800"
                    title="Supprimer le message"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Modération des Sujets du Forum</h2>
        {sujets.length === 0 ? (
          <p className="text-gray-500">Aucun sujet trouvé.</p>
        ) : (
          <ul className="space-y-6">
            {sujets.map(sujet => (
              <li key={sujet.idSujet} className="rounded-xl border border-gray-200 p-6 shadow-sm bg-white">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{sujet.titre}</h3>
                    <p className="text-gray-700">{sujet.contenu}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Auteur : {sujet.auteur} | {new Date(sujet.dateCreation).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSupprimerSujet(sujet.idSujet)}
                    className="text-red-600 hover:text-red-800"
                    title="Supprimer le sujet"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                {sujet.reponses?.length > 0 && (
                  <div className="mt-4 border-t pt-3">
                    <h4 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-1">
                      <MessageCircle size={16} /> Réponses :
                    </h4>
                    <ul className="space-y-3">
                      {sujet.reponses.map(rep => (
                        <li
                          key={rep.idReponse}
                          className="bg-gray-50 p-3 rounded flex justify-between items-start"
                        >
                          <div>
                            <p>
                              <strong>{rep.auteur}</strong> : {rep.message}
                            </p>
                            <p className="text-xs text-gray-500">{new Date(rep.dateReponse).toLocaleString()}</p>
                          </div>
                          <button
                            onClick={() => handleSupprimerReponse(rep.idReponse, sujet.idSujet)}
                            className="text-red-500 hover:text-red-700 ml-4 mt-1"
                            title="Supprimer la réponse"
                          >
                            <Trash2 size={18} />
                          </button>
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
