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
  const [messageFlash, setMessageFlash] = useState(null);
  const [humeurDuJour, setHumeurDuJour] = useState(null);
  const [modeEdition, setModeEdition] = useState(false);
  const [editionNotes, setEditionNotes] = useState('');

  const isUserAuthenticated = !!currentUser && !!currentUser.id;

  useEffect(() => {
    if (messageFlash) {
      const timer = setTimeout(() => setMessageFlash(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [messageFlash]);

  useEffect(() => {
    const chargerHumeurs = async () => {
      if (!isUserAuthenticated) {
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
        setMessageFlash({ type: 'error', text: "Impossible de charger l'historique des humeurs." });
      }
    };
    chargerHumeurs();
  }, [isUserAuthenticated]);

  const handleEnregistrer = async (e) => {
    e.preventDefault();
    setMessageFlash(null);

    if (!selectedMood) {
      setMessageFlash({ type: 'error', text: "Veuillez sélectionner une humeur." });
      return;
    }
    if (!isUserAuthenticated) {
      setMessageFlash({ type: 'error', text: "Vous devez être connecté pour enregistrer votre humeur." });
      return;
    }

    const humeurDataToSend = {
      date: new Date().toISOString().split('T')[0],
      etat: selectedMood,
      noteJournal: notes.trim(),
    };

    try {
      const added = await ajouterHumeur(humeurDataToSend);
      setHumeurs(prev => [added, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)));
      setHumeurDuJour(added);
      setSelectedMood('');
      setNotes('');
      setMessageFlash({ type: 'success', text: "Humeur ajoutée avec succès !" });
    } catch (err) {
      setMessageFlash({ type: 'error', text: "Erreur lors de l'enregistrement." });
    }
  };

  const handleModifier = async () => {
    if (!editionNotes.trim()) {
      setMessageFlash({ type: 'error', text: "Le journal intime ne peut pas être vide." });
      return;
    }
    try {
      const updated = await modifierHumeur(humeurDuJour.id, {
        etat: humeurDuJour.etat,
        noteJournal: editionNotes.trim(),
        date: humeurDuJour.date,
      });
      setHumeurs(prev =>
        prev.map(h => (h.id === humeurDuJour.id ? updated : h)).sort((a, b) => new Date(b.date) - new Date(a.date))
      );
      setHumeurDuJour(updated);
      setModeEdition(false);
      setMessageFlash({ type: 'success', text: "Votre journal intime a été mis à jour avec succès !" });
    } catch (err) {
      setMessageFlash({ type: 'error', text: "Erreur lors de la modification." });
    }
  };

  const handleSupprimer = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer l'humeur du jour ?")) return;
    try {
      await supprimerHumeur(humeurDuJour.id);
      setHumeurs(prev => prev.filter(h => h.id !== humeurDuJour.id));
      setHumeurDuJour(null);
      setModeEdition(false);
      setEditionNotes('');
      setMessageFlash({ type: 'success', text: "Humeur du jour supprimée." });
    } catch (err) {
      setMessageFlash({ type: 'error', text: "Erreur lors de la suppression." });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-tr from-indigo-100 via-indigo-50 to-white rounded-3xl shadow-lg">
      <h2 className="text-4xl font-extrabold text-center text-indigo-800 mb-10 drop-shadow-md">
        Suivi de votre humeur
      </h2>

      {messageFlash && (
        <div
          className={`px-6 py-3 rounded-lg mb-6 shadow-md transition-all ${
            messageFlash.type === 'success'
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}
        >
          {messageFlash.type === 'success' ? '✔️ Succès :' : '❌ Erreur :'} {messageFlash.text}
        </div>
      )}

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
                    ${
                      selectedMood === label
                        ? `${color} bg-indigo-700 text-white border-indigo-700`
                        : 'border-indigo-300 text-indigo-700 hover:bg-indigo-100'
                    }
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

      {humeurDuJour && !modeEdition && (
        <section className="mb-12 bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold text-indigo-700 mb-4 border-b border-indigo-300 pb-2">
            Humeur du {new Date(humeurDuJour.date).toLocaleDateString('fr-FR')}
          </h3>
          <div className="flex items-center gap-6">
            {/* Icône humeur */}
            {(() => {
              const MoodIcon = moodsList.find(m => m.label === humeurDuJour.etat)?.Icon;
              const moodColor = moodsList.find(m => m.label === humeurDuJour.etat)?.color || 'text-gray-600';
              return MoodIcon ? <MoodIcon size={40} className={moodColor} /> : null;
            })()}

            {/* Texte humeur */}
            <div className="flex flex-col flex-1">
              <span className="text-2xl font-bold text-indigo-800">{humeurDuJour.etat}</span>
              <p className="mt-2 text-indigo-700 italic max-h-28 overflow-auto whitespace-pre-wrap scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-indigo-100">
                {humeurDuJour.noteJournal || "Pas de note aujourd'hui."}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setModeEdition(true);
                  setEditionNotes(humeurDuJour.noteJournal || '');
                  setMessageFlash(null);
                }}
                title="Modifier"
                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <Edit2 size={18} /> Modifier
              </button>
              <button
                onClick={handleSupprimer}
                title="Supprimer"
                className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors"
              >
                <Trash2 size={18} /> Supprimer
              </button>
            </div>
          </div>
        </section>
      )}

      {humeurDuJour && modeEdition && (
        <section className="mb-12 bg-white p-8 rounded-2xl shadow-md">
          <h3 className="text-2xl font-semibold mb-6 text-indigo-700 border-b border-indigo-300 pb-3">
            Modifier votre journal intime du {new Date(humeurDuJour.date).toLocaleDateString('fr-FR')}
          </h3>
          <textarea
            rows="8"
            className="w-full p-4 border border-indigo-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-400 resize-y placeholder-indigo-400 mb-6"
            value={editionNotes}
            onChange={(e) => setEditionNotes(e.target.value)}
            placeholder="Modifiez votre journal intime ici..."
          />
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleModifier}
              className="bg-indigo-700 text-white py-3 px-8 rounded-full font-bold hover:bg-indigo-800 transition-colors"
            >
              Enregistrer les modifications
            </button>
            <button
              onClick={() => {
                setModeEdition(false);
                setEditionNotes(humeurDuJour.noteJournal || '');
                setMessageFlash(null);
              }}
              className="bg-gray-300 text-indigo-700 py-3 px-8 rounded-full font-bold hover:bg-gray-400 transition-colors"
            >
              Annuler
            </button>
          </div>
        </section>
      )}

      {humeurs.length > 0 && (
        <section className="mb-12">
          <h3 className="text-2xl font-semibold mb-4 text-indigo-700 border-b border-indigo-300 pb-2">
            Historique des humeurs
          </h3>
          <ul className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-indigo-100">
            {humeurs.map((humeur) => {
              const MoodIcon = moodsList.find(m => m.label === humeur.etat)?.Icon;
              const moodColor = moodsList.find(m => m.label === humeur.etat)?.color || 'text-gray-600';
              return (
                <li key={humeur.id} className="flex items-center gap-4 text-indigo-800">
                  {MoodIcon && <MoodIcon size={24} className={moodColor} />}
                  <span className="font-semibold w-24">{new Date(humeur.date).toLocaleDateString('fr-FR')}</span>
                  <span className="w-28">{humeur.etat}</span>
                  <span className="flex-1 text-sm text-indigo-600 italic truncate">{humeur.noteJournal || '—'}</span>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
};

export default SuiviHumeur;
