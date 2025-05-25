import React, { useEffect, useState } from 'react';
import { getSuiviHumeur, ajouterHumeur } from '../../services/serviceUtilisateur';

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
    const [selectedEmoji, setSelectedEmoji] = useState(null); // Pour l'emoji sélectionné
    const [notes, setNotes] = useState(''); // Pour les notes textuelles
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const chargerHumeurs = async () => {
            try {
                const data = await getSuiviHumeur();
                const sortedHumeurs = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setHumeurs(sortedHumeurs);
            } catch (error) {
                console.error("Erreur lors du chargement des humeurs :", error);
                setError("Erreur lors du chargement des humeurs.");
            }
        };
        chargerHumeurs();
    }, []);

    const handleAjout = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!selectedEmoji) {
            setError("Veuillez sélectionner une humeur (un émoji).");
            return;
        }

        // Concaténer l'emoji et les notes pour l'envoi
        const humeurComplete = `${selectedEmoji} ${notes.trim()}`;

        try {
            // Assurez-vous que votre API backend peut accepter un string comme "humeur"
            const data = await ajouterHumeur(humeurComplete); 
            setHumeurs((prev) => [data, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)));
            setMessage('Humeur ajoutée avec succès !');
            setSelectedEmoji(null); // Réinitialiser l'emoji sélectionné
            setNotes(''); // Réinitialiser les notes
        } catch (error) {
            console.error("Erreur lors de l’ajout :", error);
            setError('Erreur lors de l’ajout de l’humeur.');
        }
    };

    return (
        <div>
            {message && <div className="alert alert-success fade show mb-3" role="alert">{message}</div>}
            {error && <div className="alert alert-danger fade show mb-3" role="alert">{error}</div>}

            <form onSubmit={handleAjout} className="mb-4">
                <div className="mb-3">
                    <label className="form-label d-block mb-2">Comment vous sentez-vous aujourd'hui ?</label>
                    <div className="d-flex flex-wrap gap-2"> {/* flex-wrap pour les boutons d'émojis */}
                        {moodsEmojis.map((mood) => (
                            <button
                                key={mood.emoji}
                                type="button" // Important pour ne pas soumettre le formulaire
                                className={`btn btn-outline-primary btn-lg p-2 ${selectedEmoji === mood.emoji ? 'active' : ''}`}
                                onClick={() => setSelectedEmoji(mood.emoji)}
                                title={mood.description} // Texte d'aide au survol
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

                <button type="submit" className="btn btn-primary">Enregistrer mon humeur</button>
            </form>

            <h3 className="mt-4 mb-3">Votre historique d'humeurs</h3>
            {humeurs.length > 0 ? (
                <ul className="list-group list-group-flush"> {/* list-group-flush pour retirer les bordures extérieures */}
                    {humeurs.map((humeurEntry, index) => (
                        <li key={humeurEntry.id || index} className="list-group-item d-flex justify-content-between align-items-center">
                            <span>
                                {/* Vérifiez si humeurEntry.date existe et est valide */}
                                {humeurEntry.date ? 
                                    new Date(humeurEntry.date).toLocaleDateString('fr-FR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) : 'Date inconnue'} : <strong>{humeurEntry.humeur}</strong>
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="alert alert-info text-center mt-3">Aucune humeur enregistrée pour le moment. Suivez votre humeur pour voir votre historique ici !</div>
            )}
        </div>
    );
};

export default SuiviHumeur;