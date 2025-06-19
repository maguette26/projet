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
  const [editionMood, setEditionMood] = useState('');

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
          setEditionMood(humeurToday.etat);
        } else {
          setHumeurDuJour(null);
          setEditionNotes('');
          setEditionMood('');
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
    if (!editionMood) {
      setMessageFlash({ type: 'error', text: "Veuillez sélectionner une humeur." });
      return;
    }
    try {
      const updated = await modifierHumeur(humeurDuJour.id, {
        etat: editionMood,
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
      setEditionMood('');
      setMessageFlash({ type: 'success', text: "Humeur du jour supprimée." });
    } catch (err) {
      setMessageFlash({ type: 'error', text: "Erreur lors de la suppression." });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-tr from-indigo-100 via-indigo-50 to-white rounded-3xl shadow-lg">
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

      {humeurDuJour && (
        <section className="mb-12 bg-white p-8 rounded-2xl shadow-md relative">
          <h3 className="text-2xl font-semibold mb-6 text-indigo-700 border-b border-indigo-300 pb-3">
            Votre humeur du {new Date(humeurDuJour.date).toLocaleDateString('fr-FR')}
          </h3>

          {!modeEdition && (
            <>
              <div className="flex items-center gap-4 mb-6">
                {moodsList.find((m) => m.label === humeurDuJour.etat)?.Icon &&
                  React.createElement(moodsList.find((m) => m.label === humeurDuJour.etat).Icon, {
                    size: 32,
                    className: moodsList.find((m) => m.label === humeurDuJour.etat).color,
                  })}
                <p className="text-3xl font-bold text-indigo-700">{humeurDuJour.etat}</p>
              </div>

              <p className="whitespace-pre-wrap text-indigo-800 font-semibold mb-6">
                {humeurDuJour.noteJournal || "Aucune note pour aujourd'hui."}
              </p>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setModeEdition(true);
                    setEditionNotes(humeurDuJour.noteJournal || '');
                    setEditionMood(humeurDuJour.etat);
                    setMessageFlash(null);
                  }}
                  title="Modifier journal intime"
                  className="flex items-center gap-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold py-2 px-5 rounded-full shadow-md transition-transform hover:scale-105 active:scale-95 select-none"
                >
                  <Edit2 size={20} /> Modifier
                </button>
                <button
                  onClick={handleSupprimer}
                  title="Supprimer humeur du jour"
                  className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-5 rounded-full shadow-md transition-transform hover:scale-105 active:scale-95 select-none"
                >
                  <Trash2 size={20} /> Supprimer
                </button>
              </div>
            </>
          )}

          {modeEdition && (
            <div className="space-y-6">
              <div>
                <label className="block mb-2 font-medium text-indigo-800">Modifier votre humeur :</label>
                <div className="flex flex-wrap justify-center gap-4">
                  {moodsList.map(({ label, Icon, color }) => (
                    <button
                      key={label}
                      type="button"
                      className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold border-2
                        ${
                          editionMood === label
                            ? `${color} bg-indigo-700 text-white border-indigo-700`
                            : 'border-indigo-300 text-indigo-700 hover:bg-indigo-100'
                        }
                        transition-colors duration-300`}
                      onClick={() => setEditionMood(label)}
                      aria-label={`Sélectionner humeur ${label}`}
                    >
                      <Icon size={24} className={`${editionMood === label ? 'text-white' : color}`} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="edit-notes" className="block mb-2 font-medium text-indigo-800">
                  Modifier votre journal intime :
                </label>
                <textarea
                  id="edit-notes"
                  rows="6"
                  className="w-full p-4 border border-indigo-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-400 resize-y placeholder-indigo-400"
                  value={editionNotes}
                  onChange={(e) => setEditionNotes(e.target.value)}
                  placeholder="Modifiez votre journal intime ici..."
                />
              </div>

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
                    setEditionMood(humeurDuJour.etat);
                    setMessageFlash(null);
                  }}
                  className="bg-gray-300 text-indigo-700 py-3 px-8 rounded-full font-bold hover:bg-gray-400 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {humeurs.length > 0 && (
        <section className="mb-12 bg-white p-8 rounded-2xl shadow-md">
          <h3 className="text-2xl font-semibold mb-6 text-indigo-700 border-b border-indigo-300 pb-3">
            Historique des humeurs
          </h3>
          <ul className="divide-y divide-indigo-200 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-indigo-100">
            {humeurs.map((humeur) => (
              <li
                key={humeur.id}
                className={`py-3 flex items-start gap-4 cursor-pointer hover:bg-indigo-50 rounded-md px-4
                  ${humeurDuJour && humeur.id === humeurDuJour.id ? 'bg-indigo-100 font-semibold' : ''}`}
                title={humeur.noteJournal || 'Pas de note'}
              >
                {moodsList.find((m) => m.label === humeur.etat)?.Icon &&
                  React.createElement(moodsList.find((m) => m.label === humeur.etat).Icon, {
                    size: 28,
                    className: moodsList.find((m) => m.label === humeur.etat).color + ' flex-shrink-0 mt-1',
                  })}
                <div className="flex-1">
                  <p className="text-indigo-700 text-lg">{humeur.etat}</p>
                  <p className="text-indigo-500 text-sm mb-1">{new Date(humeur.date).toLocaleDateString('fr-FR')}</p>
                  <p className="text-indigo-800 text-sm line-clamp-2">
                    {humeur.noteJournal || <em>Aucune note</em>}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default SuiviHumeur;
