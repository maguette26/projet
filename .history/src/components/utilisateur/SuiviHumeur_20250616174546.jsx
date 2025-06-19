import React, { useEffect, useState, useRef } from 'react';
import { Smile, Meh, Frown, Zap, AlertCircle, Activity, Star, Coffee, TrendingUp, Trash2, Edit2 } from 'lucide-react';
import { getSuiviHumeur, ajouterHumeur, modifierHumeur, supprimerHumeur } from '../../services/serviceUtilisateur';

const moodsList = [
  { label: 'Heureux', Icon: Smile, color: 'text-yellow-500' },
  { label: 'Neutre', Icon: Meh, color: 'text-gray-400' },
  { label: 'Triste', Icon: Frown, color: 'text-blue-500' },
  { label: 'En colère', Icon: Zap, color: 'text-red-500' },
  { label: 'Anxieux', Icon: AlertCircle, color: 'text-purple-500' },
  { label: 'Stressé', Icon: Activity, color: 'text-pink-500' },
  { label: 'Enthousiaste', Icon: Star, color: 'text-yellow-600' },
  { label: 'Fatigué', Icon: Coffee, color: 'text-indigo-600' },
  { label: 'Motivé', Icon: TrendingUp, color: 'text-green-500' },
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
  const [editionMood, setEditionMood] = useState('');
  const messageTimeoutRef = useRef(null);

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
          setEditionMood(humeurToday.etat);
        } else {
          setHumeurDuJour(null);
          setEditionNotes('');
          setEditionMood('');
        }
      } catch (err) {
        console.error("Erreur lors du chargement des humeurs :", err);
        setError("Impossible de charger l'historique des humeurs.");
      }
    };
    chargerHumeurs();
  }, [isUserAuthenticated]);

  // Fonction utilitaire pour afficher messages flash
  const showMessage = (msg, isError = false) => {
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    if (isError) {
      setError(msg);
      setMessage('');
    } else {
      setMessage(msg);
      setError('');
    }
    messageTimeoutRef.current = setTimeout(() => {
      setMessage('');
      setError('');
    }, 3000);
  };

  const handleEnregistrer = async (e) => {
    e.preventDefault();

    if (!selectedMood) {
      showMessage("Veuillez sélectionner une humeur.", true);
      return;
    }
    if (!isUserAuthenticated) {
      showMessage("Vous devez être connecté pour enregistrer votre humeur.", true);
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
      showMessage("Humeur ajoutée avec succès !");
    } catch (err) {
      console.error(err);
      showMessage("Erreur lors de l'enregistrement.", true);
    }
  };

  const handleModifier = async () => {
    if (!editionNotes.trim()) {
      showMessage("Le journal intime ne peut pas être vide.", true);
      return;
    }
    if (!editionMood) {
      showMessage("Veuillez sélectionner une humeur.", true);
      return;
    }

    try {
      const updated = await modifierHumeur(humeurDuJour.id, {
        etat: editionMood,
        noteJournal: editionNotes.trim(),
        date: humeurDuJour.date,
      });
      setHumeurs((prev) =>
        prev.map(h => (h.id === humeurDuJour.id ? updated : h)).sort((a, b) => new Date(b.date) - new Date(a.date))
      );
      setHumeurDuJour(updated);
      setModeEdition(false);
      showMessage("Votre humeur et journal intime ont été mis à jour avec succès !");
    } catch (err) {
      console.error(err);
      showMessage("Erreur lors de la modification.", true);
    }
  };

  const handleSupprimer = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer l'humeur du jour ?")) return;
    try {
      await supprimerHumeur(humeurDuJour.id);
      setHumeurs((prev) => prev.filter(h => h.id !== humeurDuJour.id));
      setHumeurDuJour(null);
      setModeEdition(false);
      setEditionNotes('');
      setEditionMood('');
      showMessage("Humeur du jour supprimée.");
    } catch (err) {
      console.error(err);
      showMessage("Erreur lors de la suppression.", true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-tr from-indigo-100 via-indigo-50 to-white rounded-3xl shadow-lg">

      {/* Titre principal */}
      <h2 className="text-4xl font-extrabold text-center text-indigo-800 mb-10 drop-shadow-md">
        Suivi de votre humeur
      </h2>

      {/* Messages flash */}
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-lg mb-6 shadow-md transition-all">
          <strong>✔️ Succès :</strong> {message}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-lg mb-6 shadow-md transition-all">
          <strong>❌ Erreur :</strong> {error}
        </div>
      )}

      {/* Formulaire pour ajouter humeur du jour (si pas déjà présente) */}
      {!humeurDuJour && (
        <section className="mb-12 bg-white p-8 rounded-2xl shadow-md">
          <h3 className="text-2xl font-semibold mb-6 text-indigo-700 border-b border-indigo-300 pb-3">
            Ajouter votre humeur du jour
          </h3>
          <form onSubmit={handleEnregistrer} className="space-y-6">
            <div className="flex flex-wrap justify-center gap-4">
              {moodsList.map(({ label, Icon, color }) => (
                <button
                  key={label}
                  type="button"
                  className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold border-2
                    ${selectedMood === label ? `${color} bg-indigo-700 text-white border-indigo-700` : 'border-indigo-300 text-indigo-700 hover:bg-indigo-100'}
                    transition-colors duration-300`}
                  onClick={() => setSelectedMood(label)}
                  disabled={!isUserAuthenticated}
                  aria-label={`Sélectionner humeur ${label}`}
                >
                  <Icon size={24} className={`${selectedMood === label ? 'text-white' : color}`} />
                  {label}
                </button>
              ))}
            </div>

            <div>
              <label htmlFor="notes" className="block mb-2 font-medium text-indigo-800">
                Journal intime (décrivez votre journée) :
              </label>
              <textarea
                id="notes"
                rows="5"
                className="w-full p-4 border border-indigo-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-400 resize-y placeholder-indigo-400"
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
                className="px-10 py-3 rounded-full bg-indigo-700 text-white font-bold text-lg hover:bg-indigo-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isUserAuthenticated || !selectedMood}
              >
                Enregistrer
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Section humeur du jour (édition possible) */}
      {humeurDuJour && (
        <section className="mb-12 bg-white p-8 rounded-2xl shadow-md relative">
          <div className="flex items-center justify-between border-b border-indigo-300 pb-3 mb-6">
            <h3 className="text-2xl font-semibold text-indigo-700">
              Votre humeur du <span className="font-light">{new Date(humeurDuJour.date).toLocaleDateString('fr-FR')}</span>
            </h3>

            <div className="flex gap-3">
              {!modeEdition && (
                <>
                  <button
                    onClick={() => {
                      setModeEdition(true);
                      setEditionMood(humeurDuJour.etat);
                      setEditionNotes(humeurDuJour.noteJournal || '');
                    }}
                    title="Modifier humeur et journal intime"
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

          {!modeEdition && (
            <>
              <div className="flex items-center gap-4 mb-6">
                {moodsList.find(m => m.label === humeurDuJour.etat)?.Icon && React.createElement(
                  moodsList.find(m => m.label === humeurDuJour.etat).Icon,
                  { size: 32, className: moodsList.find(m => m.label === humeurDuJour.etat).color }
                )}
                <p className="text-3xl font-bold text-indigo-700">{humeurDuJour.etat}</p>
              </div>

              <p className="whitespace-pre-wrap text-indigo-800 text-lg border-l-4 border-indigo-400 pl-5 italic">
                {humeurDuJour.noteJournal || <span className="text-indigo-400 italic">Pas de note journalière.</span>}
              </p>
            </>
          )}

          {modeEdition && (
            <>
              <div className="mb-4">
                <label className="block mb-2 font-medium text-indigo-800">Modifier humeur :</label>
                <div className="flex flex-wrap gap-3">
                  {moodsList.map(({ label, Icon, color }) => (
                    <button
                      key={label}
                      type="button"
                      className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold border-2
                        ${editionMood === label ? `${color} bg-indigo-700 text-white border-indigo-700` : 'border-indigo-300 text-indigo-700 hover:bg-indigo-100'}
                        transition-colors duration-300`}
                      onClick={() => setEditionMood(label)}
                      aria-label={`Sélectionner humeur ${label}`}
                    >
                      <Icon size={20} className={`${editionMood === label ? 'text-white' : color}`} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="editNotes" className="block mb-2 font-medium text-indigo-800">
                  Modifier journal intime :
                </label>
                <textarea
                  id="editNotes"
                  rows="5"
                  className="w-full p-4 border border-indigo-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-400 resize-y placeholder-indigo-400"
                  placeholder="Modifiez votre journal intime..."
                  value={editionNotes}
                  onChange={(e) => setEditionNotes(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setModeEdition(false)}
                  className="px-6 py-2 rounded-full border border-indigo-300 text-indigo-700 font-semibold hover:bg-indigo-100 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={handleModifier}
                  className="px-6 py-2 rounded-full bg-indigo-700 text-white font-bold hover:bg-indigo-800 transition"
                >
                  Enregistrer
                </button>
              </div>
            </>
          )}
        </section>
      )}

      {/* Historique des humeurs */}
      <section className="mb-12">
        <h3 className="text-2xl font-semibold mb-6 text-indigo-700 border-b border-indigo-300 pb-3">
          Historique des humeurs
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-indigo-100">
          {humeurs.map((humeur) => {
            const MoodIcon = moodsList.find(m => m.label === humeur.etat)?.Icon;
            const moodColor = moodsList.find(m => m.label === humeur.etat)?.color || 'text-gray-600';
            return (
              <div
                key={humeur.id}
                className={`flex flex-col p-5 rounded-2xl shadow-md cursor-pointer
                  hover:shadow-lg transition-shadow bg-white
                  ${humeurDuJour && humeur.id === humeurDuJour.id ? 'border-4 border-indigo-400' : 'border border-indigo-100'}`}
                title={humeur.noteJournal || 'Pas de note'}
              >
                <div className="flex items-center gap-4 mb-3">
                  {MoodIcon && <MoodIcon size={40} className={`${moodColor}`} />}
                  <div>
                    <p className="text-indigo-800 font-bold text-lg">{humeur.etat}</p>
                    <p className="text-indigo-500 text-sm">{new Date(humeur.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}</p>
                  </div>
                </div>
                <p className="text-indigo-700 text-sm line-clamp-4">
                  {humeur.noteJournal || <em>Aucune note</em>}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default SuiviHumeur;
