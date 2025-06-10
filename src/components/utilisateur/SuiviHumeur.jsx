import React, { useEffect, useState } from 'react';
import { getSuiviHumeur, ajouterHumeur } from '../../services/serviceUtilisateur';

const moodsEmojis = [
  { emoji: '😊', description: 'Heureux' },
  { emoji: '😐', description: 'Neutre' },
  { emoji: '😔', description: 'Triste' },
  { emoji: '😠', description: 'En colère' },
  { emoji: '😟', description: 'Anxieux' },
  { emoji: '😅', description: 'Stressé' },
  { emoji: '🤩', description: 'Enthousiaste' },
  { emoji: '😴', description: 'Fatigué' },
  { emoji: '💪', description: 'Motivé' },
];

const SuiviHumeur = ({ isAuthenticated }) => {
  const [humeurs, setHumeurs] = useState([]);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const chargerHumeurs = async () => {
      setError('');
      if (!isAuthenticated) {
        setError("Connectez-vous pour utiliser le suivi d'humeur.");
        setHumeurs([]);
        return;
      }

      try {
        const data = await getSuiviHumeur(); // APPEL SANS userId !
        setHumeurs(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
      } catch (err) {
        console.error("Erreur lors du chargement des humeurs :", err);
        setError("Impossible de charger l'historique des humeurs.");
      }
    };

    chargerHumeurs();
  }, [isAuthenticated]);

  const handleAjout = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!selectedEmoji) {
      setError("Veuillez sélectionner une humeur (un émoji).");
      return;
    }

    if (!isAuthenticated) {
      setError("Vous devez être connecté pour enregistrer votre humeur.");
      return;
    }

    const humeurDataToSend = {
      date: new Date().toISOString().split('T')[0],
      etat: selectedEmoji,
      noteJournal: notes.trim(),
    };

    try {
      const data = await ajouterHumeur(humeurDataToSend);
      setHumeurs((prev) => [data, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)));
      setMessage("Humeur ajoutée avec succès !");
      setSelectedEmoji(null);
      setNotes('');
    } catch (err) {
      console.error("Erreur lors de l’ajout de l'humeur :", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Erreur inattendue lors de l’ajout de l’humeur.");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Suivi de votre Humeur</h2>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4">
          <strong className="font-bold">Succès!</strong>
          <span className="block sm:inline"> {message}</span>
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
          <strong className="font-bold">Erreur!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-6">
        <h5 className="text-xl font-semibold text-gray-700 mb-4">Enregistrer votre humeur du jour</h5>
        <form onSubmit={handleAjout}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment vous sentez-vous aujourd'hui ?
            </label>
            <div className="flex flex-wrap gap-3 justify-center">
              {moodsEmojis.map((mood) => (
                <button
                  key={mood.emoji}
                  type="button"
                  className={`p-3 rounded-full text-3xl transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    ${selectedEmoji === mood.emoji
                      ? 'bg-blue-500 text-white shadow-lg transform scale-110'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  onClick={() => setSelectedEmoji(mood.emoji)}
                  title={mood.description}
                >
                  {mood.emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="moodNotes" className="block text-sm font-medium text-gray-700">
              Notes supplémentaires (optionnel) :
            </label>
            <textarea
              id="moodNotes"
              rows="3"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Ex: J'ai passé une bonne journée, mais un peu fatigué..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={!isAuthenticated}
            >
              Enregistrer mon humeur
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h5 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Votre historique d'humeurs</h5>
        {humeurs.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {humeurs.map((humeurEntry, index) => (
              <li key={humeurEntry.id || index} className="py-3">
                <span className="text-gray-800">
                  {humeurEntry.date
                    ? new Date(humeurEntry.date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Date inconnue'}{' '}
                  : <strong className="text-lg"> {humeurEntry.etat}</strong>
                  {humeurEntry.noteJournal && <span className="text-gray-600"> - {humeurEntry.noteJournal}</span>}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="bg-blue-50 text-blue-800 px-4 py-3 rounded-md text-center">
            Aucune humeur enregistrée pour le moment. Suivez votre humeur pour voir votre historique ici !
          </div>
        )}
      </div>
    </div>
  );
};

export default SuiviHumeur;
