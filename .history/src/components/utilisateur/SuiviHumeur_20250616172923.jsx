import React, { useEffect, useState } from 'react';
import {
  Smile, Meh, Frown, Zap, AlertCircle, Activity, Star, Coffee, TrendingUp, Trash2, Edit2
} from 'lucide-react';
import { getSuiviHumeur, ajouterHumeur, modifierHumeur, supprimerHumeur } from '../../services/serviceUtilisateur';

const moodsList = [
  { label: 'Heureux', Icon: Smile, color: 'bg-yellow-200 text-yellow-800', emoji: '😊' },
  { label: 'Neutre', Icon: Meh, color: 'bg-gray-200 text-gray-600', emoji: '😐' },
  { label: 'Triste', Icon: Frown, color: 'bg-blue-200 text-blue-700', emoji: '😢' },
  { label: 'En colère', Icon: Zap, color: 'bg-red-200 text-red-700', emoji: '😠' },
  { label: 'Anxieux', Icon: AlertCircle, color: 'bg-purple-200 text-purple-700', emoji: '😰' },
  { label: 'Stressé', Icon: Activity, color: 'bg-pink-200 text-pink-700', emoji: '😣' },
  { label: 'Enthousiaste', Icon: Star, color: 'bg-yellow-300 text-yellow-900', emoji: '🤩' },
  { label: 'Fatigué', Icon: Coffee, color: 'bg-indigo-200 text-indigo-800', emoji: '😴' },
  { label: 'Motivé', Icon: TrendingUp, color: 'bg-green-200 text-green-800', emoji: '💪' },
];

const SuiviHumeur = ({ currentUser }) => {
  const [humeurs, setHumeurs] = useState([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [humeurDuJour, setHumeurDuJour] = useState(null);
  const [modeEdition, setModeEdition] = useState(false);
  const [editionNotes, setEditionNotes] = useState('');

  const isUserAuthenticated = !!currentUser && !!currentUser.id;

  useEffect(() => {
    const chargerHumeurs = async () => {
      setError('');
      if (!isUserAuthenticated) {
        setError("Connectez-vous pour utiliser le suivi d'humeur.");
        setHumeurs([]);
        setHumeurDuJour(null);
        return;
      }
      try {
        const data = await getSuiviHumeur();
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setHumeurs(sorted);

        const today = new Date().toISOString().split('T')[0];
        const humeurToday = sorted.find(h => h.date === today);
        if (humeurToday) {
          setHumeurDuJour(humeurToday);
          setEditionNotes(humeurToday.noteJournal || '');
        } else {
          setHumeurDuJour(null);
          setEditionNotes('');
        }
      } catch (err) {
        console.error("Erreur lors du chargement des humeurs :", err);
        setError("Impossible de charger l'historique des humeurs.");
      }
    };
    chargerHumeurs();
  }, [isUserAuthenticated]);

  const handleEnregistrer = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!selectedMood) {
      setError("Veuillez sélectionner une humeur.");
      return;
    }
    if (!isUserAuthenticated) {
      setError("Vous devez être connecté pour enregistrer votre humeur.");
      return;
    }

    const humeurDataToSend = {
      date: new Date().toISOString().split('T')[0],
      etat: selectedMood,
      noteJournal: notes.trim(),
    };

    try {
      const added = await ajouterHumeur(humeurDataToSend);
      setHumeurs((prev) => [added, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)));
      setHumeurDuJour(added);
      setSelectedMood('');
      setNotes('');
      setMessage("Humeur ajoutée avec succès ! 🎉");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'enregistrement.");
    }
  };

  const handleModifier = async () => {
    setError('');
    if (!editionNotes.trim()) {
      setError("Le journal intime ne peut pas être vide.");
      return;
    }
    try {
      const updated = await modifierHumeur(humeurDuJour.id, {
        etat: humeurDuJour.etat,
        noteJournal: editionNotes.trim(),
        date: humeurDuJour.date,
      });
      setHumeurs((prev) =>
        prev.map(h => (h.id === humeurDuJour.id ? updated : h)).sort((a, b) => new Date(b.date) - new Date(a.date))
      );
      setHumeurDuJour(updated);
      setModeEdition(false);
      setMessage("Votre journal intime a été mis à jour avec succès ! ✍️");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la modification.");
    }
  };

  const handleSupprimer = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer l'humeur du jour ?")) return;
    try {
      await supprimerHumeur(humeurDuJour.id);
      setHumeurs((prev) => prev.filter(h => h.id !== humeurDuJour.id));
      setHumeurDuJour(null);
      setMessage("Humeur du jour supprimée. 🗑️");
      setModeEdition(false);
      setEditionNotes('');
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-tr from-purple-50 via-indigo-50 to-white rounded-3xl shadow-xl">
      <h2 className="text-5xl font-extrabold text-center text-indigo-900 mb-12 tracking-wide drop-shadow-md">Suivi de votre humeur</h2>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-800 px-7 py-4 rounded-2xl mb-8 shadow-md flex items-center justify-center font-semibold select-none animate-fadeIn">
          <span className="mr-3">✅</span>{message}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-800 px-7 py-4 rounded-2xl mb-8 shadow-md flex items-center justify-center font-semibold select-none animate-fadeIn">
          <span className="mr-3">❌</span>{error}
        </div>
      )}

      {!humeurDuJour && (
        <section className="mb-16 bg-white p-10 rounded-3xl shadow-lg border border-indigo-200">
          <h3 className="text-3xl font-semibold mb-8 text-indigo-800 border-b border-indigo-300 pb-4 tracking-wide">Ajouter votre humeur du jour</h3>
          <form onSubmit={handleEnregistrer} className="space-y-8">
            <div className="flex flex-wrap justify-center gap-6">
              {moodsList.map(({ label, Icon, color, emoji }) => (
                <button
                  key={label}
                  type="button"
                  className={`flex flex-col items-center justify-center w-24 h-24 rounded-full font-semibold border-2
                    transition-all duration-300
                    ${selectedMood === label ? `${color} bg-opacity-90 text-white border-transparent shadow-lg scale-110` : 'border-indigo-300 text-indigo-700 hover:bg-indigo-100 hover:scale-105'}
                    focus:outline-none focus:ring-4 focus:ring-indigo-400`}
                  onClick={() => setSelectedMood(label)}
                  disabled={!isUserAuthenticated}
                  aria-label={`Sélectionner humeur ${label}`}
                >
                  <div className={`text-4xl mb-1`}>{emoji}</div>
                  <span className="text-lg select-none">{label}</span>
                </button>
              ))}
            </div>

            <div>
              <label htmlFor="notes" className="block mb-3 font-medium text-indigo-800 text-lg select-none">
                Journal intime (décrivez votre journée) :
              </label>
              <textarea
                id="notes"
                rows="6"
                className="w-full p-5 border border-indigo-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-400 resize-y text-indigo-900 text-lg placeholder-indigo-400 shadow-sm"
                placeholder="Ce que vous avez ressenti aujourd'hui..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={!isUserAuthenticated}
                required
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="px-14 py-4 rounded-full bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-900 text-white font-extrabold text-xl tracking-wide shadow-lg hover:scale-105 hover:shadow-xl transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isUserAuthenticated || !selectedMood}
              >
                Enregistrer
              </button>
            </div>
          </form>
        </section>
      )}

      {humeurDuJour && (
        <section className="mb-16 bg-white p-10 rounded-3xl shadow-lg border border-indigo-300 relative">
          <div className="flex items-center justify-between border-b border-indigo-300 pb-4 mb-8">
            <h3 className="text-3xl font-semibold text-indigo-800 tracking-wide">
              Votre humeur du <span className="font-light">{new Date(humeurDuJour.date).toLocaleDateString('fr-FR')}</span>
            </h3>

            <div className="flex gap-6">
              {!modeEdition && (
                <>
                  <button
                    onClick={() => setModeEdition(true)}
                    title="Modifier journal intime"
                    className="flex items-center gap-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold py-2 px-5 rounded-full shadow-md transition-transform hover:scale-110 active:scale-95 select-none"
                  >
                    <Edit2 size={22} /> Modifier
                  </button>
                  <button
                    onClick={handleSupprimer}
                    title="Supprimer humeur du jour"
                    className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-5 rounded-full shadow-md transition-transform hover:scale-110 active:scale-95 select-none"
                  >
                    <Trash2 size={22} /> Supprimer
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 mb-8">
            <div className={`w-28 h-28 rounded-full flex items-center justify-center text-6xl select-none ${moodsList.find(m => m.label === humeurDuJour.etat)?.color || 'bg-gray-200 text-gray-600'}`}>
              {moodsList.find(m => m.label === humeurDuJour.etat)?.emoji || '❓'}
            </div>
            <div>
              <h4 className="text-4xl font-bold text-indigo-900 select-none">{humeurDuJour.etat}</h4>
              {humeurDuJour.noteJournal ? (
                <p className="mt-4 text-lg text-indigo-700 whitespace-pre-wrap leading-relaxed border-l-4 border-indigo-400 pl-4 italic">
                  {humeurDuJour.noteJournal}
                </p>
              ) : (
                <p className="mt-4 italic text-indigo-400 select-none">Pas de note pour aujourd'hui...</p>
              )}
            </div>
          </div>

          {modeEdition && (
            <>
              <textarea
                rows="6"
                className="w-full p-5 border border-indigo-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-400 resize-y text-indigo-900 text-lg placeholder-indigo-400 shadow-sm"
                value={editionNotes}
                onChange={(e) => setEditionNotes(e.target.value)}
                placeholder="Modifiez votre journal intime ici..."
              />
              <div className="flex justify-end gap-6 mt-6">
                <button
                  onClick={() => {
                    setModeEdition(false);
                    setEditionNotes(humeurDuJour.noteJournal || '');
                    setError('');
                    setMessage('');
                  }}
                  className="px-7 py-3 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors font-semibold shadow-md select-none"
                >
                  Annuler
                </button>
                <button
                  onClick={handleModifier}
                  className="px-7 py-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-semibold shadow-md select-none"
                >
                  Sauvegarder
                </button>
              </div>
            </>
          )}
        </section>
      )}

      <section>
        <h3 className="text-3xl font-semibold text-indigo-800 mb-6 border-b border-indigo-300 pb-3 tracking-wide select-none">Historique des humeurs</h3>
        {humeurs.length === 0 && <p className="text-indigo-500 italic select-none">Aucune humeur enregistrée.</p>}

        <ul className="space-y-6 max-h-[450px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-indigo-100">
          {humeurs
            .filter(h => h.date !== (humeurDuJour ? humeurDuJour.date : ''))
            .map(humeur => (
              <li
                key={humeur.id}
                className="bg-indigo-50 p-6 rounded-3xl shadow-md border border-indigo-200 cursor-default hover:shadow-lg transition-shadow select-none"
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-indigo-700 text-xl tracking-wide">
                    {new Date(humeur.date).toLocaleDateString('fr-FR')}
                  </h4>
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-3xl select-none ${
                      moodsList.find(m => m.label === humeur.etat)?.color || 'bg-gray-300 text-gray-600'
                    }`}
                    title={humeur.etat}
                    aria-label={`Humeur : ${humeur.etat}`}
                  >
                    {moodsList.find(m => m.label === humeur.etat)?.emoji || '❓'}
                  </div>
                </div>
                <p className="font-semibold text-indigo-800 text-lg">{humeur.etat}</p>
                {humeur.noteJournal ? (
                  <p className="mt-2 text-indigo-700 italic whitespace-pre-wrap border-l-4 border-indigo-300 pl-4 leading-relaxed">
                    {humeur.noteJournal}
                  </p>
                ) : (
                  <p className="mt-2 italic text-indigo-400 select-none">Pas de note journalière</p>
                )}
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
};

export default SuiviHumeur;
