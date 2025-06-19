import React, { useEffect, useState } from 'react';
import { Smile, Meh, Frown, Zap, AlertCircle, Activity, Star, Coffee, TrendingUp } from 'lucide-react';
import { getSuiviHumeur, ajouterHumeur, modifierHumeur, supprimerHumeur } from '../../services/serviceUtilisateur';

const moodsList = [
  { label: 'Heureux', Icon: Smile },
  { label: 'Neutre', Icon: Meh },
  { label: 'Triste', Icon: Frown },
  { label: 'En colère', Icon: Zap },
  { label: 'Anxieux', Icon: AlertCircle },
  { label: 'Stressé', Icon: Activity },
  { label: 'Enthousiaste', Icon: Star },
  { label: 'Fatigué', Icon: Coffee },
  { label: 'Motivé', Icon: TrendingUp },
];

const SuiviHumeur = ({ currentUser }) => {
  const [humeurs, setHumeurs] = useState([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [humeurDuJour, setHumeurDuJour] = useState(null);
  const [modeEditionId, setModeEditionId] = useState(null);
  const [editionMood, setEditionMood] = useState('');
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

        const aujourdHui = new Date().toISOString().split('T')[0];
        const humeurToday = sorted.find(h => h.date === aujourdHui);
        if (humeurToday) {
          setHumeurDuJour(humeurToday);
        } else {
          setHumeurDuJour(null);
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

  const handleSupprimer = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette humeur ?")) return;
    try {
      await supprimerHumeur(id);
      setHumeurs((prev) => prev.filter(h => h.id !== id));
      if (humeurDuJour?.id === id) {
        setHumeurDuJour(null);
      }
      setMessage("Humeur supprimée.");
      if (modeEditionId === id) setModeEditionId(null);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression.");
    }
  };

  const activerEdition = (humeur) => {
    setModeEditionId(humeur.id);
    setEditionMood(humeur.etat);
    setEditionNotes(humeur.noteJournal || '');
  };

  const handleModifier = async (id) => {
    if (!editionMood) {
      setError("Veuillez sélectionner une humeur.");
      return;
    }
    try {
      const dataToSend = {
        etat: editionMood,
        noteJournal: editionNotes.trim(),
        date: humeurs.find(h => h.id === id)?.date || new Date().toISOString().split('T')[0],
      };
      const updated = await modifierHumeur(id, dataToSend);
      setHumeurs((prev) =>
        prev.map(h => (h.id === id ? updated : h)).sort((a, b) => new Date(b.date) - new Date(a.date))
      );
      if (humeurDuJour?.id === id) {
        setHumeurDuJour(updated);
      }
      setMessage("Humeur modifiée avec succès.");
      setModeEditionId(null);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la modification.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-extrabold text-center mb-8 text-indigo-700">Suivi de votre Humeur</h2>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-5 py-3 rounded-md mb-5">
          <strong>Succès :</strong> {message}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-5 py-3 rounded-md mb-5">
          <strong>Erreur :</strong> {error}
        </div>
      )}

      {!humeurDuJour && (
        <section className="mb-10 bg-indigo-50 p-6 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold mb-4 text-indigo-900">Ajouter votre humeur du jour</h3>
          <form onSubmit={handleEnregistrer} className="space-y-6">
            <div className="flex flex-wrap justify-center gap-3">
              {moodsList.map(({ label, Icon }) => (
                <button
                  key={label}
                  type="button"
                  className={`px-4 py-2 rounded-full font-medium text-indigo-700 border border-indigo-400
                  ${selectedMood === label ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-300'}`}
                  onClick={() => setSelectedMood(label)}
                  disabled={!isUserAuthenticated}
                  aria-label={`Sélectionner humeur ${label}`}
                >
                  <Icon className="inline-block mr-2" size={20} /> {label}
                </button>
              ))}
            </div>

            <div>
              <label htmlFor="notes" className="block mb-2 font-medium text-indigo-900">
                Journal intime (décrivez votre journée) :
              </label>
              <textarea
                id="notes"
                rows="5"
                className="w-full p-3 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-y"
                placeholder="Ce que vous avez ressenti aujourd'hui..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={!isUserAuthenticated}
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="px-8 py-3 rounded-full bg-indigo-700 text-white font-semibold hover:bg-indigo-800 transition-colors disabled:opacity-50"
                disabled={!isUserAuthenticated || !selectedMood}
              >
                Enregistrer
              </button>
            </div>
          </form>
        </section>
      )}

      {humeurDuJour && (
        <section className="mb-10 p-4 bg-indigo-100 rounded-lg shadow-inner text-center">
          <h3 className="text-xl font-semibold text-indigo-900 mb-2">Votre humeur du jour</h3>
          <p className="text-2xl font-bold text-indigo-700">
            {moodsList.find(m => m.label === humeurDuJour.etat)?.Icon && React.createElement(moodsList.find(m => m.label === humeurDuJour.etat).Icon, { size: 28, className: 'inline-block mr-2' })}
            {humeurDuJour.etat}
          </p>
          {humeurDuJour.noteJournal ? (
            <p className="mt-3 text-indigo-900 whitespace-pre-wrap border-l-4 border-indigo-400 pl-4 italic">
              {humeurDuJour.noteJournal}
            </p>
          ) : (
            <p className="mt-3 text-indigo-500 italic">Pas de note journalière</p>
          )}
        </section>
      )}

      <section>
        <h3 className="text-2xl font-semibold mb-6 text-indigo-900 text-center">Historique de vos humeurs</h3>
        {humeurs.length === 0 ? (
          <p className="text-center text-indigo-600 italic">
            Aucun historique d'humeur disponible.
          </p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {humeurs.map((humeur) => (
              <li
                key={humeur.id}
                className="bg-white border border-indigo-100 rounded-lg shadow-md p-5 relative flex flex-col"
              >
                {modeEditionId === humeur.id ? (
                  <>
                    <div className="flex flex-wrap gap-3 mb-3 justify-center">
                      {moodsList.map(({ label, Icon }) => (
                        <button
                          key={label}
                          type="button"
                          className={`px-3 py-1 rounded-full font-medium text-indigo-700 border border-indigo-400
                          ${editionMood === label ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-300'}`}
                          onClick={() => setEditionMood(label)}
                          aria-label={`Sélectionner humeur ${label}`}
                        >
                          <Icon className="inline-block mr-1" size={18} /> {label}
                        </button>
                      ))}
                    </div>
                    <textarea
                      rows="4"
                      className="w-full p-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-y mb-4"
                      value={editionNotes}
                      onChange={(e) => setEditionNotes(e.target.value)}
                    />

                    <div className="flex justify-between">
                      <button
                        onClick={() => setModeEditionId(null)}
                        className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={() => handleModifier(humeur.id)}
                        className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                      >
                        Sauvegarder
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-lg font-semibold text-indigo-800">
                        {new Date(humeur.date).toLocaleDateString('fr-FR')}
                      </h4>
                      <div className="flex items-center gap-2 text-indigo-700">
                        {moodsList.find(m => m.label === humeur.etat)?.Icon && React.createElement(moodsList.find(m => m.label === humeur.etat).Icon, { size: 22 })}
                      </div>
                    </div>
                    <p className="font-medium text-indigo-700">{humeur.etat}</p>
                    {humeur.noteJournal ? (
                      <p className="mt-2 text-indigo-600 italic whitespace-pre-wrap border-l-4 border-indigo-300 pl-3">
                        {humeur.noteJournal}
                      </p>
                    ) : (
                      <p className="mt-2 text-indigo-500 italic">Pas de note journalière</p>
                    )}
                    <div className="mt-4 flex justify-end gap-3">
                      <button
                        onClick={() => activerEdition(humeur)}
                        className="text-indigo-600 hover:text-indigo-900 font-semibold"
                        aria-label={`Modifier humeur du ${new Date(humeur.date).toLocaleDateString('fr-FR')}`}
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleSupprimer(humeur.id)}
                        className="text-red-600 hover:text-red-900 font-semibold"
                        aria-label={`Supprimer humeur du ${new Date(humeur.date).toLocaleDateString('fr-FR')}`}
                      >
                        Supprimer
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default SuiviHumeur;
