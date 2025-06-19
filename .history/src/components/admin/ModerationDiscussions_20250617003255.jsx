import React, { useEffect, useState } from 'react';
import { Trash2, ShieldAlert, User, MessageSquareWarning } from 'lucide-react';

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
    if (!id || !window.confirm('Supprimer ce message ?')) return;
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
    <div className="space-y-10 p-6 max-w-5xl mx-auto">
      {/* MESSAGES */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <MessageSquareWarning className="text-yellow-500" /> Modération des Messages
        </h2>
        <ul className="mt-4 divide-y divide-gray-200 border border-gray-200 rounded-lg shadow-sm bg-white">
          {messages.length === 0 ? (
            <li className="p-6 text-center text-gray-500">Aucun message à modérer.</li>
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
              } catch {}

              return (
                <li key={msg.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50">
                  <div className="flex-grow">
                    <p className="text-sm text-gray-700 mb-1">
                      <User className="inline w-4 h-4 mr-1 text-gray-500" />
                      <strong>{expediteur}</strong> à <em>{destinataire}</em> :
                    </p>
                    {inapproprie ? (
                      <p className="text-red-600 font-semibold">[Message inapproprié]</p>
                    ) : (
                      <p className="text-gray-800">{msg.contenu}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">({dateHeure})</p>
                  </div>
                  <button
                    onClick={() => handleSupprimerMessage(msg.id)}
                    className="mt-2 sm:mt-0 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center gap-1 text-sm"
                  >
                    <Trash2 size={16} /> Supprimer
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>

      {/* SUJETS FORUM */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ShieldAlert className="text-blue-500" /> Sujets du Forum
        </h2>
        {sujets.length === 0 ? (
          <p className="text-gray-500 mt-4">Aucun sujet trouvé.</p>
        ) : (
          <ul className="mt-4 space-y-6">
            {sujets.map(sujet => (
              <li key={sujet.idSujet} className="border border-gray-200 rounded-lg p-5 shadow bg-white">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{sujet.titre}</h3>
                    <p className="text-gray-700 mt-1">{sujet.contenu}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Auteur : {sujet.auteur} | {new Date(sujet.dateCreation).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSupprimerSujet(sujet.idSujet)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-1 text-sm"
                  >
                    <Trash2 size={16} /> Supprimer
                  </button>
                </div>

                {sujet.reponses?.length > 0 && (
                  <div className="mt-4 border-t pt-3">
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">Réponses :</h4>
                    <ul className="space-y-2">
                      {sujet.reponses.map(rep => (
                        <li key={rep.idReponse} className="bg-gray-50 p-3 rounded text-sm">
                          <p>
                            <strong>{rep.auteur}</strong> : {rep.message}
                          </p>
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
