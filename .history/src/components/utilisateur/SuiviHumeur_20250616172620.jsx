import React, { useEffect, useState } from 'react';
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
      setMessage("Humeur ajoutée avec succès !");
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
      setMessage("Votre journal intime a été mis à jour avec succès !");
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
      setMessage("Humeur du jour supprimée.");
      setModeEdition(false);
      setEditionNotes('');
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-tr from-indigo-100 via-indigo-50 to-white rounded-3xl shadow-lg">
      <h2 className="text-4xl font-extrabold text-center text-indigo-800 mb-10 drop-shadow-md">Suivi de votre humeur</h2>

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

      {!humeurDuJour && (
        <section className="mb-12 bg-white p-8 rounded-2xl shadow-md">
          <h3 className="text-2xl font-semibold mb-6 text-indigo-700 border-b border-indigo-300 pb-3">Ajouter votre humeur du jour</h3>
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
                    onClick={() => setModeEdition(true)}
                    title="Modifier journal intime"
                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-900 font-semibold transition-colors"
                  >
                    <Edit2 size={20} /> Modifier
                  </button>
                  <button
                    onClick={handleSupprimer}
                    title="Supprimer humeur du jour"
                    className="flex items-center gap-1 text-red-600 hover:text-red-900 font-semibold transition-colors"
                  >
                    <Trash2 size={20} /> Supprimer
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            {moodsList.find(m => m.label === humeurDuJour.etat)?.Icon && React.createElement(
              moodsList.find(m => m.label === humeurDuJour.etat).Icon,
              { size: 32, className: moodsList.find(m => m.label === humeurDuJour.etat).color }
            )}
            <p className="text-3xl font-bold text-indigo-700">{humeurDuJour.etat}</p>
          </div>

          {!modeEdition && (
            <p className="whitespace-pre-wrap text-indigo-800 text-lg border-l-4 border-indigo-400 pl-5 italic">
              {humeurDuJour.noteJournal || <span className="text-indigo-400 italic">Pas de note journalière.</span>}
            </p>
          )}

          {modeEdition && (
            <>
              <textarea
                rows="5"
                className="w-full p-4 border border-indigo-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-400 resize-y mb-6"
                value={editionNotes}
                onChange={(e) => setEditionNotes(e.target.value)}
                placeholder="Modifiez votre journal intime ici..."
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setModeEdition(false);
                    setEditionNotes(humeurDuJour.noteJournal || '');
                  }}
                  className="px-5 py-2 rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors font-semibold"
                >
                  Annuler
                </button>
                <button
                  onClick={handleModifier}
                  className="px-5 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-semibold"
                >
                  Sauvegarder
                </button>
              </div>
            </>
          )}
        </section>
      )}

      <section>
        <h3 className="text-2xl font-semibold text-indigo-700 mb-6 border-b border-indigo-300 pb-3">Historique des humeurs</h3>
        {humeurs.length === 0 && <p className="text-indigo-500 italic">Aucune humeur enregistrée.</p>}

        <ul className="space-y-5 max-h-[400px] overflow-y-auto pr-3">
          {humeurs
            .filter(h => h.date !== (humeurDuJour ? humeurDuJour.date : ''))
            .map(humeur => (
              <li
                key={humeur.id}
                className="bg-indigo-50 p-5 rounded-xl shadow-sm border border-indigo-200 hover:shadow-md transition-shadow cursor-default"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-indigo-700 text-lg">
                    {new Date(humeur.date).toLocaleDateString('fr-FR')}
                  </h4>
                  {moodsList.find(m => m.label === humeur.etat)?.Icon && React.createElement(
                    moodsList.find(m => m.label === humeur.etat).Icon,
                    { size: 20, className: moodsList.find(m => m.label === humeur.etat).color }
                  )}
                </div>
                <p className="font-medium text-indigo-700">{humeur.etat}</p>
                {humeur.noteJournal ? (
                  <p className="mt-1 text-indigo-600 italic whitespace-pre-wrap border-l-4 border-indigo-300 pl-3">
                    {humeur.noteJournal}
                  </p>
                ) : (
                  <p className="mt-1 text-indigo-500 italic">Pas de note journalière</p>
                )}
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
};

export default SuiviHumeur;
