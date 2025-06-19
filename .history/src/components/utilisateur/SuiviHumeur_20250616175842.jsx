import React, { useEffect, useState } from 'react';
import {
  Smile,
  Meh,
  Frown,
  Zap,
  AlertCircle,
  Activity,
  Star,
  Coffee,
  TrendingUp,
  Trash2,
  Edit2,
} from 'lucide-react';
import {
  getSuiviHumeur,
  ajouterHumeur,
  modifierHumeur,
  supprimerHumeur,
} from '../../services/serviceUtilisateur';

const moodsList = [
  { label: 'Heureux', Icon: Smile, color: 'text-yellow-400' },
  { label: 'Neutre', Icon: Meh, color: 'text-gray-400' },
  { label: 'Triste', Icon: Frown, color: 'text-blue-400' },
  { label: 'En colère', Icon: Zap, color: 'text-red-400' },
  { label: 'Anxieux', Icon: AlertCircle, color: 'text-purple-400' },
  { label: 'Stressé', Icon: Activity, color: 'text-pink-400' },
  { label: 'Enthousiaste', Icon: Star, color: 'text-yellow-600' },
  { label: 'Fatigué', Icon: Coffee, color: 'text-indigo-400' },
  { label: 'Motivé', Icon: TrendingUp, color: 'text-green-400' },
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
        const sorted = data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setHumeurs(sorted);

        const today = new Date().toISOString().split('T')[0];
        const humeurToday = sorted.find((h) => h.date === today);
        if (humeurToday) {
          setHumeurDuJour(humeurToday);
          setEditionNotes(humeurToday.noteJournal || '');
        } else {
          setHumeurDuJour(null);
          setEditionNotes('');
        }
      } catch (err) {
        setMessageFlash({
          type: 'error',
          text: "Impossible de charger l'historique des humeurs.",
        });
      }
    };
    chargerHumeurs();
  }, [isUserAuthenticated]);

  const handleEnregistrer = async (e) => {
    e.preventDefault();
    setMessageFlash(null);

    if (!selectedMood) {
      setMessageFlash({ type: 'error', text: 'Veuillez sélectionner une humeur.' });
      return;
    }
    if (!isUserAuthenticated) {
      setMessageFlash({
        type: 'error',
        text: "Vous devez être connecté pour enregistrer votre humeur.",
      });
      return;
    }

    const humeurDataToSend = {
      date: new Date().toISOString().split('T')[0],
      etat: selectedMood,
      noteJournal: notes.trim(),
    };

    try {
      const added = await ajouterHumeur(humeurDataToSend);
      setHumeurs((prev) =>
        [added, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date))
      );
      setHumeurDuJour(added);
      setSelectedMood('');
      setNotes('');
      setMessageFlash({
        type: 'success',
        text: 'Humeur ajoutée avec succès !',
      });
    } catch (err) {
      setMessageFlash({ type: 'error', text: "Erreur lors de l'enregistrement." });
    }
  };

  const handleModifier = async () => {
    if (!editionNotes.trim()) {
      setMessageFlash({
        type: 'error',
        text: "Le journal intime ne peut pas être vide.",
      });
      return;
    }
    if (!selectedMood) {
      setMessageFlash({ type: 'error', text: 'Veuillez sélectionner une humeur.' });
      return;
    }
    try {
      const updated = await modifierHumeur(humeurDuJour.id, {
        etat: selectedMood,
        noteJournal: editionNotes.trim(),
        date: humeurDuJour.date,
      });
      setHumeurs((prev) =>
        prev
          .map((h) => (h.id === humeurDuJour.id ? updated : h))
          .sort((a, b) => new Date(b.date) - new Date(a.date))
      );
      setHumeurDuJour(updated);
      setModeEdition(false);
      setMessageFlash({
        type: 'success',
        text: 'Votre journal intime a été mis à jour avec succès !',
      });
    } catch (err) {
      setMessageFlash({ type: 'error', text: 'Erreur lors de la modification.' });
    }
  };

  const handleSupprimer = async () => {
    if (!window.confirm('Voulez-vous vraiment supprimer l\'humeur du jour ?'))
      return;
    try {
      await supprimerHumeur(humeurDuJour.id);
      setHumeurs((prev) => prev.filter((h) => h.id !== humeurDuJour.id));
      setHumeurDuJour(null);
      setModeEdition(false);
      setEditionNotes('');
      setMessageFlash({
        type: 'success',
        text: "Humeur du jour supprimée.",
      });
    } catch (err) {
      setMessageFlash({ type: 'error', text: 'Erreur lors de la suppression.' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gradient-to-tr from-green-50 via-blue-50 to-purple-50 rounded-3xl shadow-md">
      <h2 className="text-4xl font-extrabold text-center text-indigo-900 mb-8 drop-shadow-sm">
        Suivi de votre humeur
      </h2>

      {messageFlash && (
        <div
          className={`px-6 py-3 rounded-md mb-6 text-center font-semibold ${
            messageFlash.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}
        >
          {messageFlash.type === 'success' ? '✔️ Succès : ' : '❌ Erreur : '}
          {messageFlash.text}
        </div>
      )}

      {!humeurDuJour && !modeEdition && (
        <form
          onSubmit={handleEnregistrer}
          className="bg-white p-6 rounded-lg shadow-sm space-y-6"
        >
          <div className="flex justify-center gap-6 flex-wrap">
            {moodsList.map(({ label, Icon, color }) => (
              <button
                key={label}
                type="button"
                onClick={() => setSelectedMood(label)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-transform ${
                  selectedMood === label
                    ? `scale-110 bg-indigo-200 shadow-md ${color}`
                    : 'hover:bg-indigo-100'
                }`}
                aria-label={`Sélectionner humeur ${label}`}
              >
                <Icon size={32} className={selectedMood === label ? 'text-indigo-900' : color} />
                <span
                  className={`text-sm font-medium ${
                    selectedMood === label ? 'text-indigo-900' : 'text-gray-700'
                  }`}
                >
                  {label}
                </span>
              </button>
            ))}
          </div>

          <textarea
            rows={4}
            placeholder="Décris ce que tu ressens aujourd'hui..."
            className="w-full p-3 border border-indigo-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 text-indigo-900"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="text-center">
            <button
              type="submit"
              disabled={!selectedMood}
              className={`px-8 py-2 rounded-full font-semibold text-white transition-colors ${
                selectedMood
                  ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                  : 'bg-indigo-300 cursor-not-allowed'
              }`}
            >
              Enregistrer
            </button>
          </div>
        </form>
      )}

      {humeurDuJour && !modeEdition && (
        <section className="bg-white p-6 rounded-lg shadow-sm space-y-5">
          <h3 className="text-2xl font-semibold text-indigo-800 border-b border-indigo-300 pb-2">
            Votre humeur du {new Date(humeurDuJour.date).toLocaleDateString('fr-FR')}
          </h3>

          <div className="flex items-center gap-4">
            {moodsList.find((m) => m.label === humeurDuJour.etat)?.Icon &&
              React.createElement(
                moodsList.find((m) => m.label === humeurDuJour.etat).Icon,
                {
                  size: 36,
                  className: moodsList.find((m) => m.label === humeurDuJour.etat).color,
                }
              )}
            <p className="text-3xl font-bold text-indigo-900">{humeurDuJour.etat}</p>
          </div>

          <p className="whitespace-pre-wrap text-indigo-900 font-medium">
            {humeurDuJour.noteJournal || "Aucune note pour aujourd'hui."}
          </p>

          <div className="flex justify-end gap-4">
            <button
              onClick={() => {
                setModeEdition(true);
                setEditionNotes(humeurDuJour.noteJournal || '');
                setSelectedMood(humeurDuJour.etat);
                setMessageFlash(null);
              }}
              className="flex items-center gap-2 bg-indigo-200 hover:bg-indigo-300 text-indigo-900 font-semibold py-2 px-6 rounded-full transition-transform hover:scale-105"
            >
              <Edit2 size={18} /> Modifier
            </button>
            <button
              onClick={handleSupprimer}
              className="flex items-center gap-2 bg-red-200 hover:bg-red-300 text-red-900 font-semibold py-2 px-6 rounded-full transition-transform hover:scale-105"
            >
              <Trash2 size={18} /> Supprimer
            </button>
          </div>
        </section>
      )}

      {modeEdition && (
        <form className="bg-white p-6 rounded-lg shadow-sm space-y-6" onSubmit={(e) => {
          e.preventDefault();
          handleModifier();
        }}>
          <div className="flex justify-center gap-6 flex-wrap">
            {moodsList.map(({ label, Icon, color }) => (
              <button
                key={label}
                type="button"
                onClick={() => setSelectedMood(label)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-transform ${
                  selectedMood === label
                    ? `scale-110 bg-indigo-200 shadow-md ${color}`
                    : 'hover:bg-indigo-100'
                }`}
                aria-label={`Sélectionner humeur ${label}`}
              >
                <Icon size={32} className={selectedMood === label ? 'text-indigo-900' : color} />
                <span
                  className={`text-sm font-medium ${
                    selectedMood === label ? 'text-indigo-900' : 'text-gray-700'
                  }`}
                >
                  {label}
                </span>
              </button>
            ))}
          </div>

          <textarea
            rows={4}
            placeholder="Modifie ta note..."
            className="w-full p-3 border border-indigo-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 text-indigo-900"
            value={editionNotes}
            onChange={(e) => setEditionNotes(e.target.value)}
          />

          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-full transition-colors"
            >
              Sauvegarder
            </button>
            <button
              type="button"
              onClick={() => {
                setModeEdition(false);
                setMessageFlash(null);
                setSelectedMood(humeurDuJour.etat);
                setEditionNotes(humeurDuJour.noteJournal || '');
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold px-6 py-2 rounded-full transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Historique simplifié - optionnel à afficher */}
      {humeurs.length > 0 && (
        <section className="mt-10 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-indigo-800 mb-4 border-b border-indigo-300 pb-2">
            Historique des humeurs
          </h3>
          <ul className="space-y-3 max-h-64 overflow-auto">
            {humeurs.map(({ id, date, etat, noteJournal }) => {
              const mood = moodsList.find((m) => m.label === etat);
              return (
                <li
                  key={id}
                  className="flex items-center gap-3 border border-indigo-100 rounded-lg p-3 hover:bg-indigo-50 cursor-default"
                >
                  {mood && <mood.Icon size={24} className={mood.color} />}
                  <div>
                    <div className="font-semibold text-indigo-900">
                      {etat}
                    </div>
                    <div className="text-xs text-indigo-700">
                      {new Date(date).toLocaleDateString('fr-FR')}
                    </div>
                    {noteJournal && (
                      <p className="text-sm text-indigo-800 truncate max-w-xs" title={noteJournal}>
                        {noteJournal}
                      </p>
                    )}
                  </div>
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
