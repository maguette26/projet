import React, { useEffect, useState } from 'react';
import {
  getDiscussions,
  getReponsesSujet,
  supprimerDiscussion,
  supprimerReponse
} from '../../services/serviceAdmin'; // Assure-toi que ce chemin est correct

const motsInterdits = ['haine', 'suicide', 'viol'];

function contientMotInterdit(texte) {
  if (!texte) return false;
  const texteMinuscule = texte.toLowerCase();
  return motsInterdits.some(mot => texteMinuscule.includes(mot.toLowerCase()));
}

const ModerationDiscussions = () => {
  const [forumMessages, setForumMessages] = useState([]);
  const [reponses, setReponses] = useState({}); // { sujetId: [reponse1, reponse2] }

  useEffect(() => {
    fetchForumMessages();
  }, []);

  const fetchForumMessages = async () => {
    try {
      const sujets = await getDiscussions();
      setForumMessages(sujets);

      // Charger toutes les réponses pour chaque sujet
      const allReponses = {};
      for (const sujet of sujets) {
        try {
          const rep = await getReponsesSujet(sujet.id);
          allReponses[sujet.id] = rep;
        } catch (err) {
          console.error(`Erreur de chargement des réponses pour le sujet ${sujet.id}`, err);
        }
      }
      setReponses(allReponses);
    } catch (error) {
      console.error('Erreur lors de la récupération des sujets du forum:', error);
    }
  };

  const handleSupprimerSujet = async (id) => {
    if (window.confirm("Confirmer la suppression de ce sujet ?")) {
      try {
        await supprimerDiscussion(id);
        fetchForumMessages();
      } catch (error) {
        console.error("Erreur suppression sujet :", error);
      }
    }
  };

  const handleSupprimerReponse = async (id) => {
    if (window.confirm("Confirmer la suppression de cette réponse ?")) {
      try {
        await supprimerReponse(id);
        fetchForumMessages();
      } catch (error) {
        console.error("Erreur suppression réponse :", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-700">Modération Forum</h2>
      {forumMessages.length === 0 ? (
        <p className="text-center text-gray-500">Aucun sujet disponible.</p>
      ) : (
        forumMessages.map(sujet => {
          const sujetInapproprie = contientMotInterdit(sujet.contenu);
          return (
            <div key={sujet.id} className="border border-gray-200 rounded-md p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">{sujet.titre}</h4>
                  <p className="text-gray-700">
                    <strong>{sujet.auteur?.nom}</strong> :{' '}
                    {sujetInapproprie ? (
                      <span className="text-red-600 font-semibold">[Contenu inapproprié]</span>
                    ) : (
                      sujet.contenu
                    )}
                  </p>
                  <span className="text-sm text-gray-500">
                    {new Date(sujet.dateCreation).toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => handleSupprimerSujet(sujet.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                >
                  Supprimer Sujet
                </button>
              </div>

              {/* Réponses */}
              {reponses[sujet.id] && reponses[sujet.id].length > 0 && (
                <div className="pl-4 border-l-2 border-gray-300 space-y-2 mt-2">
                  <h5 className="text-sm font-medium text-gray-600">Réponses :</h5>
                  {reponses[sujet.id].map(rep => {
                    const repInapproprie = contientMotInterdit(rep.message);
                    return (
                      <div key={rep.id} className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-700">
                            <strong>{rep.auteur?.nom}</strong> :{' '}
                            {repInapproprie ? (
                              <span className="text-red-600 font-semibold">[Contenu inapproprié]</span>
                            ) : (
                              rep.message
                            )}
                          </p>
                          <span className="text-xs text-gray-500">
                            {new Date(rep.dateReponse).toLocaleString()}
                          </span>
                        </div>
                        <button
                          onClick={() => handleSupprimerReponse(rep.id)}
                          className="bg-red-400 text-white px-2 py-1 rounded-md text-xs hover:bg-red-500"
                        >
                          Supprimer
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default ModerationDiscussions;
