// src/pages/Forum.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/commun/Layout'; 
import { 
    getForumSujets, 
    creerForumSujet, 
    getProfil, 
    getForumReponses, 
    envoyerForumReponse,
    modifierForumSujet,    
    supprimerForumSujet,   
    modifierForumReponse,  
    supprimerForumReponse  
} from '../services/serviceUtilisateur';

// Fonction utilitaire pour obtenir l'initiale de l'auteur pour l'avatar
const getAuthorInitial = (author, isAnonymous) => {
    if (isAnonymous) {
        return 'A'; // Anonyme
    }
    if (author?.nom) {
        return author.nom.charAt(0).toUpperCase();
    }
    if (author?.prenom) {
        return author.prenom.charAt(0).toUpperCase();
    }
    if (author?.email) {
        return author.email.charAt(0).toUpperCase();
    }
    return '?'; // Inconnu
};

// Fonction utilitaire pour formater le temps de manière relative (à la YouTube)
const formatRelativeTime = (dateTimeString) => {
    if (!dateTimeString) return 'Date inconnue';
    const date = new Date(dateTimeString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return `${seconds} seconde${seconds > 1 ? 's' : ''} ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `il y a ${days} jour${days > 1 ? 's' : ''}`;
    const months = Math.floor(days / 30);
    if (months < 12) return `il y a ${months} mois`;
    const years = Math.floor(months / 12);
    return `il y a ${years} an${years > 1 ? 's' : ''}`;
};


const Forum = () => {
    const [sujets, setSujets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 
    const [successMessage, setSuccessMessage] = useState(null);

    // États pour la création de nouveau sujet
    const [nouveauTitre, setNouveauTitre] = useState('');
    const [nouveauContenu, setNouveauContenu] = useState('');
    const [isSujetAnonyme, setIsSujetAnonyme] = useState(false); 

    // État pour l'utilisateur connecté
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUserEmail, setCurrentUserEmail] = useState(null);
    const [currentUserRole, setCurrentUserRole] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null); 

    // État pour le sujet actuellement sélectionné pour la vue détaillée
    const [selectedTopic, setSelectedTopic] = useState(null);

    // États pour la vue détaillée du sujet et les réponses
    const [reponses, setReponses] = useState([]);
    const [nouveauMessageReponse, setNouveauMessageReponse] = useState(''); 
    const [isReponseAnonyme, setIsReponseAnonyme] = useState(false); 
    const [loadingReponses, setLoadingReponses] = useState(false);
    const [errorReponses, setErrorReponses] = useState(null);
    const [successMessageReponse, setSuccessMessageReponse] = useState(null);

    // États pour l'édition de sujet
    const [editingSujetId, setEditingSujetId] = useState(null);
    const [editingSujetTitre, setEditingSujetTitre] = useState('');
    const [editingSujetContenu, setEditingSujetContenu] = useState('');

    // États pour l'édition de réponse
    const [editingReponseId, setEditingReponseId] = useState(null);
    const [editingReponseMessage, setEditingReponseMessage] = useState('');


    // Effet pour récupérer l'état d'authentification et l'email/rôle/ID au chargement
    useEffect(() => {
        const fetchAuthStatus = async () => {
            try {
                const profilData = await getProfil(); 
                console.log("DEBUG Forum page: Réponse de /api/auth/me (pour l'auth):", profilData); 

                if (profilData && profilData.authenticated) {
                    setIsAuthenticated(true);
                    setCurrentUserEmail(profilData.email);
                    setCurrentUserRole(profilData.role);
                    setCurrentUserId(profilData.id); 
                    setError(null); 
                } else {
                    setIsAuthenticated(false);
                    setCurrentUserEmail(null);
                    setCurrentUserRole(null);
                    setCurrentUserId(null);
                    setError("Vous devez être connecté pour participer au forum.");
                }
            } catch (err) {
                console.error("DEBUG Forum page: Erreur lors de la récupération du statut d'authentification:", err);
                setIsAuthenticated(false);
                setCurrentUserEmail(null);
                setCurrentUserRole(null);
                setCurrentUserId(null);
                setError("Erreur de connexion. Veuillez vous reconnecter pour participer au forum.");
            }
        };
        fetchAuthStatus();
    }, []);

    // Fonction pour charger les sujets du forum
    const fetchSujets = useCallback(async () => {
        setLoading(true);
        setError(null); 
        try {
            const data = await getForumSujets();
            console.log("DEBUG Forum page: Sujets reçus du backend:", data); 
            // Assurez-vous que chaque sujet a une propriété reponsesCount
            const formattedSujets = data.map(sujet => ({
                ...sujet,
                // Force reponsesCount à être un nombre (0 si non valide)
                reponsesCount: parseInt(sujet.reponsesCount, 10) || 0 
            }));
            setSujets(formattedSujets);
        } catch (err) {
            console.error("DEBUG Forum page: Erreur lors du chargement des sujets:", err);
            setError("Impossible de charger les sujets du forum. Veuillez réessayer plus tard.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Effet pour charger les sujets du forum au montage et si l'auth change
    useEffect(() => {
        fetchSujets();
    }, [fetchSujets]); 


    // Effet pour charger les réponses d'un sujet spécifique (lorsque selectedTopic change)
    useEffect(() => {
        const fetchReponses = async () => {
            if (!selectedTopic || !selectedTopic.id) {
                setReponses([]); 
                setLoadingReponses(false);
                return;
            }
            setLoadingReponses(true);
            setErrorReponses(null);
            try {
                const data = await getForumReponses(selectedTopic.id);
                console.log(`DEBUG Forum page: Réponses reçues pour le sujet ${selectedTopic.id}:`, data); 
                setReponses(data);
            } catch (err) {
                console.error("DEBUG Forum page: Erreur lors du chargement des réponses:", err);
                setErrorReponses("Impossible de charger les réponses du sujet.");
            } finally {
                setLoadingReponses(false);
            }
        };
        fetchReponses();
    }, [selectedTopic]);


    // Gère la soumission du formulaire de création de sujet
    const handleSubmitSujet = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!nouveauTitre.trim() || !nouveauContenu.trim()) {
            setError("Le titre et le contenu du sujet ne peuvent pas être vides.");
            return;
        }
        if (!isAuthenticated) { 
            setError("Vous devez être connecté pour créer un sujet.");
            return;
        }

        try {
            const nouveauSujet = await creerForumSujet(nouveauTitre, nouveauContenu, isSujetAnonyme); 
            console.log("DEBUG Forum page: Nouveau sujet créé:", nouveauSujet); 
            // Ajoute le nouveau sujet en haut de la liste, et initialise reponsesCount à 0 s'il n'existe pas
            setSujets(prev => [{ ...nouveauSujet, reponsesCount: parseInt(nouveauSujet.reponsesCount, 10) || 0 }, ...prev]); 
            setNouveauTitre('');
            setNouveauContenu('');
            setIsSujetAnonyme(false); 
            setSuccessMessage("Sujet créé avec succès !");
            setTimeout(() => setSuccessMessage(null), 3000); 
        } catch (err) {
            console.error("DEBUG Forum page: Erreur lors de la création du sujet:", err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(`Erreur: ${err.response.data.message}`);
            } else {
                setError("Erreur lors de la création du sujet.");
            }
        }
    };

    // Gère la soumission d'une nouvelle réponse
    const handleSubmitReponse = async (e) => {
        e.preventDefault();
        setErrorReponses(null);
        setSuccessMessageReponse(null);

        if (!nouveauMessageReponse.trim()) {
            setErrorReponses("Votre message ne peut pas être vide.");
            return;
        }
        if (!isAuthenticated) { 
            setErrorReponses("Vous devez être connecté pour répondre.");
            return;
        }
        if (!selectedTopic || !selectedTopic.id) {
            setErrorReponses("Aucun sujet sélectionné pour la réponse.");
            return;
        }

        try {
            const nouvelleReponse = await envoyerForumReponse(selectedTopic.id, nouveauMessageReponse, isReponseAnonyme); 
            console.log("DEBUG Forum page: Nouvelle réponse créée:", nouvelleReponse); 
            setReponses(prev => [...prev, nouvelleReponse]); 
            setNouveauMessageReponse('');
            setIsReponseAnonyme(false); 
            setSuccessMessageReponse("Réponse envoyée avec succès !");
            setTimeout(() => setSuccessMessageReponse(null), 3000); 
            
            // Recharger les sujets pour s'assurer que le reponsesCount est à jour depuis le backend
            // Cela gère le cas où le backend ne mettrait pas à jour le count immédiatement
            // ou s'il y a un décalage de synchronisation.
            fetchSujets();

            // Mettre à jour le selectedTopic pour refléter le nouveau count immédiatement dans la vue détaillée
            // C'est un complément à fetchSujets, pour une mise à jour instantanée si on reste sur la page du sujet
            setSelectedTopic(prevTopic => ({
                ...prevTopic,
                reponsesCount: (parseInt(prevTopic.reponsesCount, 10) || 0) + 1 
            }));

        } catch (err) {
            console.error("DEBUG Forum page: Erreur lors de l'envoi de la réponse:", err);
            if (err.response) {
                console.error("DEBUG Détails de l'erreur de réponse (réponse forum):", err.response);
                if (err.response.data && err.response.data.message) {
                    setErrorReponses(`Erreur: ${err.response.data.message}`);
                } else {
                    setErrorReponses(`Erreur HTTP ${err.response.status}. Veuillez vous reconnecter.`);
                }
            } else if (err.request) {
                setErrorReponses("Aucune réponse du serveur lors de l'envoi de la réponse. Vérifiez votre connexion.");
            } else {
                setErrorReponses("Erreur inattendue lors de l'envoi de la réponse.");
            }
        }
    };

    // --- Fonctions de modification et suppression ---

    const handleEditSujetClick = (sujet) => {
        setEditingSujetId(sujet.id);
        setEditingSujetTitre(sujet.titre);
        setEditingSujetContenu(sujet.contenu);
        setError(null);
        setSuccessMessage(null);
    };

    const handleUpdateSujet = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!editingSujetTitre.trim() || !editingSujetContenu.trim()) {
            setError("Le titre et le contenu du sujet ne peuvent pas être vides.");
            return;
        }

        try {
            await modifierForumSujet(editingSujetId, editingSujetTitre, editingSujetContenu);
            setSuccessMessage("Sujet modifié avec succès !");
            // Mettre à jour le sujet dans la liste des sujets
            setSujets(prevSujets => prevSujets.map(s => 
                s.id === editingSujetId ? { ...s, titre: editingSujetTitre, contenu: editingSujetContenu } : s
            ));
            // Réinitialiser l'état d'édition
            setEditingSujetId(null);
            setEditingSujetTitre('');
            setEditingSujetContenu('');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error("Erreur lors de la modification du sujet:", err);
            setError(err.response?.data?.message || "Erreur lors de la modification du sujet.");
        }
    };

    const handleDeleteSujet = async (sujetId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce sujet ?")) {
            try {
                await supprimerForumSujet(sujetId);
                setSuccessMessage("Sujet supprimé avec succès !");
                // Filtrer le sujet de la liste
                setSujets(prevSujets => prevSujets.filter(s => s.id !== sujetId));
                // Si le sujet supprimé était celui sélectionné, le désélectionner
                if (selectedTopic && selectedTopic.id === sujetId) {
                    setSelectedTopic(null);
                    setReponses([]);
                }
                setTimeout(() => setSuccessMessage(null), 3000);
            } catch (err) {
                console.error("Erreur lors de la suppression du sujet:", err);
                setError(err.response?.data?.message || "Erreur lors de la suppression du sujet.");
            }
        }
    };

    const handleEditReponseClick = (reponse) => {
        setEditingReponseId(reponse.id);
        setEditingReponseMessage(reponse.message);
        setErrorReponses(null);
        setSuccessMessageReponse(null);
    };

    const handleUpdateReponse = async (e) => {
        e.preventDefault();
        setErrorReponses(null);
        setSuccessMessageReponse(null);

        if (!editingReponseMessage.trim()) {
            setErrorReponses("Le message de la réponse ne peut pas être vide.");
            return;
        }

        try {
            await modifierForumReponse(editingReponseId, editingReponseMessage);
            setSuccessMessageReponse("Réponse modifiée avec succès !");
            // Mettre à jour la réponse dans la liste des réponses
            setReponses(prevReponses => prevReponses.map(r => 
                r.id === editingReponseId ? { ...r, message: editingReponseMessage } : r
            ));
            // Réinitialiser l'état d'édition
            setEditingReponseId(null);
            setEditingReponseMessage('');
            setTimeout(() => setSuccessMessageReponse(null), 3000);
        } catch (err) {
            console.error("Erreur lors de la modification de la réponse:", err);
            setErrorReponses(err.response?.data?.message || "Erreur lors de la modification de la réponse.");
        }
    };

    const handleDeleteReponse = async (reponseId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette réponse ?")) {
            try {
                await supprimerForumReponse(reponseId);
                setSuccessMessageReponse("Réponse supprimée avec succès !");
                // Filtrer la réponse de la liste
                setReponses(prevReponses => prevReponses.filter(r => r.id !== reponseId));
                // Décrémenter le compteur de réponses du sujet parent
                setSujets(prevSujets => prevSujets.map(sujet =>
                    sujet.id === selectedTopic.id
                        ? { ...sujet, reponsesCount: Math.max(0, (parseInt(sujet.reponsesCount, 10) || 0) - 1) }
                        : sujet
                ));
                setTimeout(() => setSuccessMessageReponse(null), 3000);
            } catch (err) {
                console.error("Erreur lors de la suppression de la réponse:", err);
                setErrorReponses(err.response?.data?.message || "Erreur lors de la suppression de la réponse.");
            }
        }
    };


    // Fonction pour obtenir le nom d'affichage de l'auteur (avec gestion de l'anonymat)
    const getAuthorDisplayName = (author, isAnonymous) => {
        if (isAnonymous) {
            return 'Anonyme';
        }
        if (author?.nom && author?.prenom) {
            return `${author.nom} ${author.prenom}`;
        } else if (author?.email) {
            return author.email; 
        }
        return 'Auteur inconnu';
    };

    // Vérifie si l'utilisateur connecté est l'auteur (pour édition/suppression)
    const isAuthor = (authorEmail) => {
        return isAuthenticated && currentUserEmail && currentUserEmail === authorEmail;
    };
    
    // Vérifie si l'utilisateur est admin (pour édition/suppression)
    const isAdmin = () => {
        return isAuthenticated && currentUserRole === 'ADMIN';
    };

    // Fonction pour gérer le retour à la liste des sujets
    const handleBackToList = () => {
        setSelectedTopic(null);
        setReponses([]); 
        setNouveauMessageReponse('');
        setIsReponseAnonyme(false); 
        setErrorReponses(null);
        setSuccessMessageReponse(null);
        fetchSujets(); // Recharger les sujets quand on revient à la liste
    };

    return (
        <Layout>
            <div className="py-8 px-4 max-w-4xl mx-auto font-sans text-gray-900 bg-gray-100"> {/* Fond clair et texte sombre */}
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Forum de Discussion</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4 shadow-md">
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4 shadow-md">
                        {successMessage}
                    </div>
                )}

                {selectedTopic ? (
                    // Section de détail du sujet
                    <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200"> {/* Card plus claire */}
                        <button
                            onClick={handleBackToList}
                            className="mb-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white"
                        >
                            &larr; Retour à la liste des sujets
                        </button>

                        {editingSujetId === selectedTopic.id ? (
                            <form onSubmit={handleUpdateSujet} className="space-y-4 mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Modifier le sujet</h2>
                                <div>
                                    <label htmlFor="editTitre" className="block text-sm font-medium text-gray-700">Titre :</label>
                                    <input
                                        type="text"
                                        id="editTitre"
                                        value={editingSujetTitre}
                                        onChange={(e) => setEditingSujetTitre(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="editContenu" className="block text-sm font-medium text-gray-700">Contenu :</label>
                                    <textarea
                                        id="editContenu"
                                        rows="6"
                                        value={editingSujetContenu}
                                        onChange={(e) => setEditingSujetContenu(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    ></textarea>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditingSujetId(null)}
                                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700"
                                    >
                                        Enregistrer les modifications
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div className="flex items-start mb-4">
                                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                                        {getAuthorInitial(selectedTopic.auteur, selectedTopic.anonyme)}
                                    </div>
                                    <div className="ml-3 flex-grow">
                                        <div className="flex items-center text-sm mb-1">
                                            <span className="font-semibold text-gray-800">{getAuthorDisplayName(selectedTopic.auteur, selectedTopic.anonyme)}</span>
                                            <span className="text-gray-500 ml-2">{formatRelativeTime(selectedTopic.dateCreation)}</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedTopic.titre}</h2>
                                        <p className="text-gray-700 mb-4">{selectedTopic.contenu}</p>
                                    </div>
                                </div>
                                
                                <div className="text-sm text-gray-500 mb-6 flex justify-end items-center">
                                    {(selectedTopic.auteur && (isAuthor(selectedTopic.auteur.email) || isAdmin())) && (
                                        <div className="space-x-4">
                                            <button
                                                onClick={() => handleEditSujetClick(selectedTopic)}
                                                className="text-indigo-600 hover:text-indigo-900 text-sm"
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSujet(selectedTopic.id)}
                                                className="text-red-600 hover:text-red-900 text-sm"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {errorReponses && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4 shadow-md">
                                {errorReponses}
                            </div>
                        )}
                        {successMessageReponse && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4 shadow-md">
                                {successMessageReponse}
                            </div>
                        )}

                        <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b border-gray-200 pb-2">Réponses ({reponses.length})</h3>
                        {loadingReponses ? (
                            <p className="text-gray-600">Chargement des réponses...</p>
                        ) : reponses.length === 0 ? (
                            <p className="text-gray-600">Aucune réponse pour ce sujet pour le moment.</p>
                        ) : (
                            <div className="space-y-4">
                                {reponses.map(reponse => (
                                    <div key={reponse.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200"> {/* Card de réponse */}
                                        {editingReponseId === reponse.id ? (
                                            <form onSubmit={handleUpdateReponse} className="space-y-2">
                                                <textarea
                                                    rows="3"
                                                    value={editingReponseMessage}
                                                    onChange={(e) => setEditingReponseMessage(e.target.value)}
                                                    className="w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 border-gray-300"
                                                    required
                                                ></textarea>
                                                <div className="flex justify-end space-x-2 text-sm">
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditingReponseId(null)}
                                                        className="px-3 py-1 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                                                    >
                                                        Annuler
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="px-3 py-1 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700"
                                                    >
                                                        Enregistrer
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <>
                                                <div className="flex items-start">
                                                    <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white text-md font-bold flex-shrink-0">
                                                        {getAuthorInitial(reponse.auteur, reponse.anonyme)}
                                                    </div>
                                                    <div className="ml-3 flex-grow">
                                                        <div className="flex items-center text-sm mb-1">
                                                            <span className="font-semibold text-gray-800">{getAuthorDisplayName(reponse.auteur, reponse.anonyme)}</span>
                                                            <span className="text-gray-500 ml-2">{formatRelativeTime(reponse.dateReponse)}</span>
                                                        </div>
                                                        <p className="text-gray-700">{reponse.message}</p>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-500 mt-2 flex justify-end items-center">
                                                    {(reponse.auteur && (isAuthor(reponse.auteur.email) || isAdmin())) && (
                                                        <div className="space-x-4">
                                                            <button
                                                                onClick={() => handleEditReponseClick(reponse)}
                                                                className="text-indigo-600 hover:text-indigo-900 text-sm"
                                                            >
                                                                Modifier
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteReponse(reponse.id)}
                                                                className="text-red-600 hover:text-red-900 text-sm"
                                                            >
                                                                Supprimer
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Formulaire de réponse */}
                        <form onSubmit={handleSubmitReponse} className="mt-8 p-4 border border-gray-300 rounded-lg shadow-inner bg-gray-50"> {/* Formulaire de réponse */}
                            <h4 className="text-lg font-semibold text-gray-700 mb-3">Ajouter une réponse</h4>
                            {!isAuthenticated ? (
                                <p className="text-gray-600 mb-3">Connectez-vous pour ajouter une réponse.</p>
                            ) : (
                                <>
                                    <textarea
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mb-3 bg-white text-gray-900"
                                        rows="4"
                                        placeholder="Écrivez votre réponse ici..."
                                        value={nouveauMessageReponse}
                                        onChange={(e) => setNouveauMessageReponse(e.target.value)}
                                        required
                                    ></textarea>
                                    <div className="mb-3">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 bg-white border-gray-300"
                                                checked={isReponseAnonyme}
                                                onChange={(e) => setIsReponseAnonyme(e.target.checked)}
                                            />
                                            <span className="ml-2 text-gray-700">Publier de manière anonyme</span>
                                        </label>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white"
                                    >
                                        Envoyer la réponse
                                    </button>
                                </>
                            )}
                        </form>
                    </div>
                ) : (
                    // Section de la liste des sujets
                    <>
                        {/* Section Créer un nouveau sujet */}
                        <div className="bg-white p-6 rounded-lg shadow-xl mb-8 border border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Créer un nouveau sujet</h2>
                            {!isAuthenticated ? (
                                <p className="text-gray-600">Connectez-vous pour créer un nouveau sujet.</p>
                            ) : (
                                <form onSubmit={handleSubmitSujet} className="space-y-4">
                                    <div>
                                        <label htmlFor="nouveauTitre" className="block text-sm font-medium text-gray-700">Titre du sujet :</label>
                                        <input
                                            type="text"
                                            id="nouveauTitre"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white text-gray-900"
                                            value={nouveauTitre}
                                            onChange={(e) => setNouveauTitre(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="nouveauContenu" className="block text-sm font-medium text-gray-700">Contenu :</label>
                                        <textarea
                                            id="nouveauContenu"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white text-gray-900"
                                            rows="4"
                                            placeholder="Écrivez votre sujet ici..."
                                            value={nouveauContenu}
                                            onChange={(e) => setNouveauContenu(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 bg-white border-gray-300"
                                                checked={isSujetAnonyme}
                                                onChange={(e) => setIsSujetAnonyme(e.target.checked)}
                                            />
                                            <span className="ml-2 text-gray-700">Publier de manière anonyme</span>
                                        </label>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white"
                                    >
                                        Créer le sujet
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Liste des sujets du forum */}
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Tous les sujets</h2>
                        {loading ? (
                            <p className="text-gray-600">Chargement des sujets...</p>
                        ) : sujets.length === 0 ? (
                            <p className="text-gray-600">Aucun sujet n'a été créé pour le moment. Soyez le premier !</p>
                        ) : (
                            <div className="space-y-4">
                                {sujets.map(sujet => (
                                    <div key={sujet.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                                        <div className="flex items-start">
                                            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                                                {getAuthorInitial(sujet.auteur, sujet.anonyme)}
                                            </div>
                                            <div className="ml-3 flex-grow">
                                                <div className="flex items-center text-sm mb-1">
                                                    <span className="font-semibold text-gray-800">{getAuthorDisplayName(sujet.auteur, sujet.anonyme)}</span>
                                                    <span className="text-gray-500 ml-2">{formatRelativeTime(sujet.dateCreation)}</span>
                                                </div>
                                                <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                                                    <button onClick={() => setSelectedTopic(sujet)} className="hover:underline text-left">
                                                        {sujet.titre}
                                                    </button>
                                                </h3>
                                                <p className="text-gray-700 text-sm mb-2 line-clamp-2">{sujet.contenu}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="text-sm text-gray-500 flex justify-between items-center mt-3">
                                            {/* Affichage plus proéminent du nombre de réponses */}
                                           
                                            {(sujet.auteur && (isAuthor(sujet.auteur.email) || isAdmin())) && (
                                                <div className="space-x-4">
                                                    <button
                                                        onClick={() => handleEditSujetClick(sujet)}
                                                        className="text-indigo-600 hover:text-indigo-900 text-sm"
                                                    >
                                                        Modifier
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteSujet(sujet.id)}
                                                        className="text-red-600 hover:text-red-900 text-sm"
                                                    >
                                                        Supprimer
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
};

export default Forum;
