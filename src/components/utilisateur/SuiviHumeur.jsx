// src/components/utilisateur/SuiviHumeur.jsx
import React, { useEffect, useState } from 'react';
import { getSuiviHumeur, ajouterHumeur, getProfil } from '../../services/serviceUtilisateur';

// Définition des émojis et de leurs descriptions
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

const SuiviHumeur = () => {
    const [humeurs, setHumeurs] = useState([]);
    const [selectedEmoji, setSelectedEmoji] = useState(null);
    const [notes, setNotes] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [currentUserId, setCurrentUserId] = useState(null); // Pour stocker l'ID de l'utilisateur connecté

    useEffect(() => {
        // Fonction pour récupérer l'ID de l'utilisateur connecté
        const fetchUserId = async () => {
            try {
                // Tente de récupérer le profil de l'utilisateur connecté via /api/auth/me
                const profilData = await getProfil();
                if (profilData && profilData.id) { // Vérifie si l'ID est directement à la racine de l'objet
                    setCurrentUserId(profilData.id);
                } else if (profilData && profilData.userId) { // Si l'ID est nommé 'userId'
                    setCurrentUserId(profilData.userId);
                }
                // *** IMPORTANT : Ajoutez ici d'autres conditions si la structure est différente
                // par exemple, si l'ID est dans un objet imbriqué comme profilData.user.id
                else {
                    setError("Impossible de récupérer l'ID de l'utilisateur connecté. La structure de la réponse du profil est inattendue.");
                    console.error("Structure de la réponse de /api/auth/me inattendue:", profilData);
                }
            } catch (err) {
                console.error("Erreur lors de la récupération du profil utilisateur:", err);
                // Si getProfil échoue (ex: 401 si non connecté), affiche une erreur générique
                setError("Erreur lors du chargement des informations utilisateur. Assurez-vous d'être connecté.");
            }
        };

        fetchUserId();
    }, []); // S'exécute une seule fois au montage du composant

    useEffect(() => {
        const chargerHumeurs = async () => {
            if (!currentUserId) {
                // N'essaie pas de charger les humeurs tant que l'ID utilisateur n'est pas disponible
                console.log("Attente de l'ID utilisateur pour charger les humeurs...");
                return;
            }
            try {
                // Appelle getSuiviHumeur avec l'ID de l'utilisateur obtenu
                const data = await getSuiviHumeur(currentUserId);
                // Tri des humeurs par date décroissante
                const sortedHumeurs = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setHumeurs(sortedHumeurs);
            } catch (err) {
                console.error("Erreur lors du chargement des humeurs :", err);
                setError("Erreur lors du chargement des humeurs. Vérifiez la console pour plus de détails.");
            }
        };

        chargerHumeurs();
    }, [currentUserId]); // Déclenche le rechargement si l'ID utilisateur change (devient disponible)

    const handleAjout = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!selectedEmoji) {
            setError("Veuillez sélectionner une humeur (un émoji).");
            return;
        }
        if (!currentUserId) {
            setError("Impossible d'ajouter l'humeur : ID utilisateur non disponible. Veuillez recharger la page ou vous reconnecter.");
            return;
        }

        // Construction de l'objet Humeur tel qu'attendu par le backend (avec l'ID utilisateur)
        const humeurDataToSend = {
            date: new Date().toISOString().split('T')[0], // Date actuelle au format YYYY-MM-DD
            etat: selectedEmoji,
            noteJournal: notes.trim(),
            utilisateur: { id: currentUserId } // L'objet utilisateur avec son ID est crucial pour le backend
        };

        try {
            const data = await ajouterHumeur(humeurDataToSend);
            // Ajout de la nouvelle humeur et re-tri
            setHumeurs((prev) => [data, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)));
            setMessage('Humeur ajoutée avec succès !');
            setSelectedEmoji(null);
            setNotes('');
        } catch (err) {
            console.error("Erreur lors de l’ajout :", err);
            if (err.response && err.response.data && err.response.data.message && typeof err.response.data.message === 'string' && err.response.data.message.includes("existe déjà")) {
                setError(err.response.data.message);
            } else {
                setError('Erreur lors de l’ajout de l’humeur.');
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Suivi de votre Humeur</h2>

            {message && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Succès!</strong>
                    <span className="block sm:inline"> {message}</span>
                </div>
            )}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Erreur!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}

            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h5 className="card-title">Enregistrer votre humeur du jour</h5>
                    <form onSubmit={handleAjout}>
                        <div className="mb-3">
                            <label className="form-label d-block mb-2">Comment vous sentez-vous aujourd'hui ?</label>
                            <div className="d-flex flex-wrap gap-2 justify-content-center">
                                {moodsEmojis.map((mood) => (
                                    <button
                                        key={mood.emoji}
                                        type="button"
                                        className={`btn btn-outline-primary btn-lg p-2 ${selectedEmoji === mood.emoji ? 'active' : ''}`}
                                        onClick={() => setSelectedEmoji(mood.emoji)}
                                        title={mood.description}
                                    >
                                        {mood.emoji}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="moodNotes" className="form-label">Notes supplémentaires (optionnel) :</label>
                            <textarea
                                className="form-control"
                                id="moodNotes"
                                rows="3"
                                placeholder="Ex: J'ai passé une bonne journée, mais un peu fatigué..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary btn-lg">Enregistrer mon humeur</button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <h5 className="card-title mb-3">Votre historique d'humeurs</h5>
                    {humeurs.length > 0 ? (
                        <ul className="list-group list-group-flush">
                            {humeurs.map((humeurEntry, index) => (
                                <li key={humeurEntry.id || index} className="list-group-item d-flex justify-content-between align-items-center">
                                    <span>
                                        {humeurEntry.date ?
                                            new Date(humeurEntry.date).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : 'Date inconnue'} : <strong>{humeurEntry.etat}</strong> {humeurEntry.noteJournal && `- ${humeurEntry.noteJournal}`}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="alert alert-info text-center mt-3">Aucune humeur enregistrée pour le moment. Suivez votre humeur pour voir votre historique ici !</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SuiviHumeur;
