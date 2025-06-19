import React, { useEffect, useState } from 'react';
import { getSuiviHumeur, ajouterHumeur, modifierHumeur, supprimerHumeur } from '../../services/serviceUtilisateur';

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

const SuiviHumeur = ({ currentUser }) => { 
    const [humeurs, setHumeurs] = useState([]);
    const [selectedEmoji, setSelectedEmoji] = useState(null);
    const [notes, setNotes] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [humeurDuJour, setHumeurDuJour] = useState(null); // humeur déjà enregistrée aujourd'hui

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

                // Chercher humeur du jour
                const aujourdHui = new Date().toISOString().split('T')[0];
                const humeurToday = sorted.find(h => h.date === aujourdHui);
                if (humeurToday) {
                    setHumeurDuJour(humeurToday);
                    setSelectedEmoji(humeurToday.etat);
                    setNotes(humeurToday.noteJournal || '');
                } else {
                    setHumeurDuJour(null);
                    setSelectedEmoji(null);
                    setNotes('');
                }
            } catch (err) {
                console.error("Erreur lors du chargement des humeurs :", err);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    setError("Votre session a expiré ou vous n'êtes pas autorisé. Veuillez vous reconnecter.");
                } else {
                    setError("Impossible de charger l'historique des humeurs.");
                }
            }
        };
        chargerHumeurs();
    }, [isUserAuthenticated]);

    const handleEnregistrer = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!selectedEmoji) {
            setError("Veuillez sélectionner une humeur (un émoji).");
            return;
        }

        if (!isUserAuthenticated) {
            setError("Vous devez être connecté pour enregistrer votre humeur.");
            return;
        }

        const humeurDataToSend = {
            date: new Date().toISOString().split('T')[0],
            etat: selectedEmoji,
            noteJournal: notes.trim(),
        };

        try {
            if (humeurDuJour) {
                // Modifier humeur existante
                const updated = await modifierHumeur(humeurDuJour.id, humeurDataToSend);
                setHumeurs((prev) =>
                    prev
                        .map(h => (h.id === updated.id ? updated : h))
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                );
                setHumeurDuJour(updated);
                setMessage("Votre humeur du jour a été mise à jour.");
            } else {
                // Ajouter nouvelle humeur
                const added = await ajouterHumeur(humeurDataToSend);
                setHumeurs((prev) => [added, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)));
                setHumeurDuJour(added);
                setMessage("Humeur ajoutée avec succès !");
            }
        } catch (err) {
            console.error("Erreur lors de l’enregistrement de l'humeur :", err);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Erreur inattendue lors de l’enregistrement de l’humeur.");
            }
        }
    };

    const handleSupprimer = async () => {
        if (!humeurDuJour) return;

        if (!window.confirm("Voulez-vous vraiment supprimer votre humeur du jour ?")) return;

        try {
            await supprimerHumeur(humeurDuJour.id);
            setHumeurs((prev) => prev.filter(h => h.id !== humeurDuJour.id));
            setHumeurDuJour(null);
            setSelectedEmoji(null);
            setNotes('');
            setMessage("Humeur du jour supprimée.");
        } catch (err) {
            console.error("Erreur lors de la suppression de l'humeur :", err);
            setError("Erreur inattendue lors de la suppression de l’humeur.");
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
                <form onSubmit={handleEnregistrer}>
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
                                    disabled={!isUserAuthenticated}
                                >
                                    {mood.emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="moodNotes" className="block text-sm font-medium text-gray-700">
                            Journal intime (racontez votre journée) :
                        </label>
                        <textarea
                            id="moodNotes"
                            rows="6"
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 resize-y"
                            placeholder="Par exemple : J'ai ressenti beaucoup de joie aujourd'hui car..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            disabled={!isUserAuthenticated}
                        ></textarea>
                    </div>

                    <div className="flex justify-center gap-4">
                        <button
                            type="submit"
                            className="px-6 py-3 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            disabled={!isUserAuthenticated || !selectedEmoji}
                        >
                            {humeurDuJour ? "Mettre à jour mon humeur" : "Enregistrer mon humeur"}
                        </button>

                        {humeurDuJour && (
                            <button
                                type="button"
                                onClick={handleSupprimer}
                                className="px-6 py-3 rounded-md text-base font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Supprimer mon humeur du jour
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h5 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Votre historique d'humeurs</h5>
                {humeurs.length > 0 ? (
                    <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
                        {humeurs.map((humeurEntry, index) => (
                            <li key={humeurEntry.id || index} className="py-3 flex flex-col">
                                <span className="text-gray-800 font-semibold">
                                    {humeurEntry.date
                                        ? new Date(humeurEntry.date).toLocaleDateString('fr-FR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })
                                        : 'Date inconnue'} : {humeurEntry.etat}
                                </span>
                                {humeurEntry.noteJournal && (
                                    <p className="text-gray-600 whitespace-pre-wrap mt-1">{humeurEntry.noteJournal}</p>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="bg-blue-50 text-blue-800 px-4 py-3 rounded-md text-center">
                        {isUserAuthenticated
                            ? "Aucune humeur enregistrée pour le moment. Suivez votre humeur pour voir votre historique ici !"
                            : "Veuillez vous connecter pour voir votre historique d'humeurs."
                        }
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuiviHumeur;
