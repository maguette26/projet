import React, { useEffect, useState } from 'react';
import {
  Smile, Meh, Frown, Zap, AlertCircle, Activity,
  Star, Coffee, TrendingUp, Trash2, Edit2
} from 'lucide-react';
import {
  getSuiviHumeur,
  ajouterHumeur,
  modifierHumeur,
  supprimerHumeur
} from '../../services/serviceUtilisateur';
import { motion } from 'framer-motion';

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
  const [afficherHistorique, setAfficherHistorique] = useState(false);

  const isUserAuthenticated = !!currentUser?.id;

  useEffect(() => {
    if (messageFlash) {
      const timer = setTimeout(() => setMessageFlash(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [messageFlash]);

  useEffect(() => {
    const chargerHumeurs = async () => {
      if (!isUserAuthenticated) return;
      try {
        const data = await getSuiviHumeur();
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setHumeurs(sorted);
        const today = new Date().toISOString().split('T')[0];
        const humeurToday = sorted.find(h => h.date === today);
        if (humeurToday) {
          setHumeurDuJour(humeurToday);
          setEditionNotes(humeurToday.noteJournal || '');
        }
      } catch {
        setMessageFlash({ type: 'error', text: "Impossible de charger l'historique des humeurs." });
      }
    };
    chargerHumeurs();
  }, [isUserAuthenticated]);

  const handleEnregistrer = async (e) => {
    e.preventDefault();
    if (!selectedMood) return setMessageFlash({ type: 'error', text: "Veuillez sélectionner une humeur." });
    try {
      const added = await ajouterHumeur({
        date: new Date().toISOString().split('T')[0],
        etat: selectedMood,
        noteJournal: notes.trim(),
      });
      const newHumeurs = [added, ...humeurs].sort((a, b) => new Date(b.date) - new Date(a.date));
      setHumeurs(newHumeurs);
      setHumeurDuJour(added);
      setSelectedMood('');
      setNotes('');
      setMessageFlash({ type: 'success', text: "Humeur ajoutée avec succès !" });
    } catch {
      setMessageFlash({ type: 'error', text: "Erreur lors de l'enregistrement." });
    }
  };

  const handleModifier = async () => {
    try {
      const updated = await modifierHumeur(humeurDuJour.id, {
        etat: humeurDuJour.etat,
        noteJournal: editionNotes.trim(),
        date: humeurDuJour.date,
      });
      const newHumeurs = humeurs.map(h => (h.id === humeurDuJour.id ? updated : h)).sort((a, b) => new Date(b.date) - new Date(a.date));
      setHumeurs(newHumeurs);
      setHumeurDuJour(updated);
      setModeEdition(false);
      setMessageFlash({ type: 'success', text: "Journal mis à jour." });
    } catch {
      setMessageFlash({ type: 'error', text: "Erreur lors de la modification." });
    }
  };

  const handleSupprimer = async () => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    try {
      await supprimerHumeur(humeurDuJour.id);
      setHumeurs(prev => prev.filter(h => h.id !== humeurDuJour.id));
      setHumeurDuJour(null);
      setEditionNotes('');
      setMessageFlash({ type: 'success', text: "Humeur supprimée." });
    } catch {
      setMessageFlash({ type: 'error', text: "Erreur lors de la suppression." });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50 py-12 px-6 sm:px-12 lg:px-20 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-10 flex flex-col gap-10">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-5xl font-extrabold text-indigo-900 drop-shadow-md mb-2 select-none">
            Suivi de votre humeur
          </h1>
          <p className="text-indigo-600 font-light text-lg max-w-xl mx-auto">
            Enregistrez et suivez votre humeur quotidienne. Prenez soin de votre bien-être mental avec régularité.
          </p>
        </header>

        {/* Flash message */}
        {messageFlash && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`rounded-lg p-4 text-center font-semibold text-sm max-w-md mx-auto
              ${
                messageFlash.type === 'success'
                  ? 'bg-green-100 border border-green-400 text-green-700'
                  : 'bg-red-100 border border-red-400 text-red-700'
              }`}
          >
            {messageFlash.text}
          </motion.div>
        )}

        {/* Humeur du jour / Formulaire */}
        {!humeurDuJour ? (
          <motion.form
            onSubmit={handleEnregistrer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-indigo-50 rounded-2xl p-8 shadow-inner flex flex-col gap-6"
          >
            <h2 className="text-2xl font-semibold text-indigo-800 select-none">
              Comment vous sentez-vous aujourd’hui ?
            </h2>

            <div className="flex flex-wrap justify-center gap-5">
              {moodsList.map(({ label, Icon, color }) => {
                const isSelected = selectedMood === label;
                return (
                  <motion.button
                    key={label}
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    layout
                    aria-label={`Choisir humeur ${label}`}
                    className={`flex items-center gap-3 px-5 py-3 rounded-full border-2 font-semibold
                      transition-all duration-300 select-none
                      ${isSelected
                        ? `bg-indigo-700 text-white border-indigo-700 shadow-lg shadow-indigo-300`
                        : `bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-100`
                      }
                    `}
                    onClick={() => setSelectedMood(label)}
                    disabled={!isUserAuthenticated}
                  >
                    <Icon size={24} className={isSelected ? 'text-white' : color} />
                    {label}
                  </motion.button>
                );
              })}
            </div>

            <textarea
              placeholder="Parlez-nous un peu de votre journée..."
              className="resize-y w-full rounded-xl border border-indigo-300 p-4 focus:outline-none focus:ring-4 focus:ring-indigo-400 shadow-sm text-indigo-900 font-medium"
              rows={5}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={!isUserAuthenticated || !selectedMood}
              className="self-center bg-indigo-700 disabled:opacity-60 text-white font-extrabold px-16 py-3 rounded-full shadow-lg hover:bg-indigo-800 transition"
            >
              Enregistrer
            </button>

            {!isUserAuthenticated && (
              <p className="text-center text-red-600 font-medium mt-2 select-none">
                Vous devez être connecté pour enregistrer une humeur.
              </p>
            )}
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-indigo-50 rounded-3xl p-8 shadow-inner flex flex-col gap-6"
          >
            <div className="flex items-center gap-6 select-none">
              {React.createElement(
                moodsList.find(m => m.label === humeurDuJour.etat)?.Icon || Smile,
                { size: 40, className: moodsList.find(m => m.label === humeurDuJour.etat)?.color }
              )}
              <h2 className="text-4xl font-extrabold text-indigo-900">{humeurDuJour.etat}</h2>
            </div>

            {!modeEdition ? (
              <>
                <p className="whitespace-pre-line text-indigo-800 text-lg font-semibold tracking-wide">
                  {humeurDuJour.noteJournal || 'Aucune note pour aujourd’hui.'}
                </p>

                <div className="flex justify-end gap-5">
                  <button
                    onClick={() => {
                      setModeEdition(true);
                      setEditionNotes(humeurDuJour.noteJournal || '');
                      setMessageFlash(null);
                    }}
                    className="flex items-center gap-2 px-6 py-2 rounded-full bg-indigo-100 text-indigo-700 font-semibold hover:bg-indigo-200 shadow-md transition select-none"
                  >
                    <Edit2 size={20} /> Modifier
                  </button>

                  <button
                    onClick={handleSupprimer}
                    className="flex items-center gap-2 px-6 py-2 rounded-full bg-red-100 text-red-700 font-semibold hover:bg-red-200 shadow-md transition select-none"
                  >
                    <Trash2 size={20} /> Supprimer
                  </button>
                </div>
              </>
            ) : (
              <>
                <textarea
                  rows={6}
                  className="w-full p-4 border border-indigo-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-400 resize-y shadow-inner text-indigo-900 font-semibold"
                  value={editionNotes}
                  onChange={(e) => setEditionNotes(e.target.value)}
                />
                <div className="flex justify-end gap-5">
                  <button
                    onClick={handleModifier}
                    className="bg-indigo-700 text-white px-8 py-3 rounded-full font-extrabold shadow-lg hover:bg-indigo-800 transition"
                  >
                    Enregistrer
                  </button>
                  <button
                    onClick={() => {
                      setModeEdition(false);
                      setEditionNotes(humeurDuJour.noteJournal || '');
                      setMessageFlash(null);
                    }}
                    className="bg-gray-300 text-indigo-700 px-8 py-3 rounded-full font-extrabold hover:bg-gray-400 transition"
                  >
                    Annuler
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Bouton bascule historique */}
        <div className="text-center">
          <button
            onClick={() => setAfficherHistorique(!afficherHistorique)}
            className="inline-block px-8 py-3 bg-indigo-700 text-white rounded-full font-bold shadow-md hover:bg-indigo-800 transition select-none"
          >
            {afficherHistorique ? 'Masquer mon historique' : 'Voir mon historique'}
          </button>
        </div>

        {/* Historique */}
        {afficherHistorique && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-h-96 overflow-y-auto bg-white rounded-3xl p-6 shadow-inner"
          >
            <h3 className="text-3xl font-bold text-indigo-900 mb-6 text-center select-none">Historique des humeurs</h3>
            <ul className="flex flex-col gap-4">
              {humeurs.map(h => {
                const MoodIcon = moodsList.find(m => m.label === h.etat)?.Icon;
                const color = moodsList.find(m => m.label === h.etat)?.color || 'text-gray-600';
                return (
                  <li
                    key={h.id}
                    className="flex items-start gap-6 p-4 hover:bg-indigo-50 rounded-2xl transition select-text cursor-default"
                  >
                    <div className={`flex-shrink-0 rounded-full p-3 bg-indigo-100 ${color}`}>
                      {MoodIcon && <MoodIcon size={28} />}
                    </div>
                    <div className="flex flex-col flex-grow">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-indigo-800 text-xl">{h.etat}</span>
                        <time
                          dateTime={h.date}
                          className="text-indigo-500 font-mono bg-indigo-200 rounded-full px-3 py-1 select-text"
                        >
                          {new Date(h.date).toLocaleDateString('fr-FR')}
                        </time>
                      </div>
                      <p className="text-indigo-700 italic text-base whitespace-pre-line">
                        {h.noteJournal || 'Aucune note.'}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default SuiviHumeur;
