// src/pages/Forum.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/commun/Layout';
import { 
    getForumSujets, 
    creerForumSujet, 
    getProfil, 
    getForumReponses, 
    envoyerForumReponse 
} from '../services/serviceUtilisateur';

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

    // État pour le sujet actuellement sélectionné pour la vue détaillée
    const [selectedTopic, setSelectedTopic] = useState(null);

    // États pour la vue détaillée du sujet
    const [reponses, setReponses] = useState([]);
    const [nouveauMessageReponse, setNouveauMessageReponse] = useState(''); 
    const [isReponseAnonyme, setIsReponseAnonyme] = useState(false); 
    const [loadingReponses, setLoadingReponses] = useState(false);
    const [errorReponses, setErrorReponses] = useState(null);
    const [successMessageReponse, setSuccessMessageReponse] = useState(null);


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
                    setError(null); 
                } else {
                    setIsAuthenticated(false);
                    setCurrentUserEmail(null);
                    setCurrentUserRole(null);
                    setError("Vous devez être connecté pour participer au forum.");
                }
            } catch (err) {
                console.error("DEBUG Forum page: Erreur lors de la récupération du statut d'authentification:", err);
                setIsAuthenticated(false);
                setCurrentUserEmail(null);
                setCurrentUserRole(null);
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
            console.log("DEBUG Forum page: Sujets reçus du backend:", data); // <-- LOG IMPORTANT ICI
            setSujets(data);
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
                console.log(`DEBUG Forum page: Réponses reçues pour le sujet ${selectedTopic.id}:`, data); // <-- LOG IMPORTANT ICI
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
            console.log("DEBUG Forum page: Nouveau sujet créé:", nouveauSujet); // <-- LOG IMPORTANT ICI
            setSujets(prev => [nouveauSujet, ...prev]); 
            setNouveauTitre('');
            setNouveauContenu('');
            setIsSujetAnonyme(false); 
            setSuccessMessage("Sujet créé avec succès !");
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
            console.log("DEBUG Forum page: Nouvelle réponse créée:", nouvelleReponse); // <-- LOG IMPORTANT ICI
            setReponses(prev => [...prev, nouvelleReponse]); 
            setNouveauMessageReponse('');
            setIsReponseAnonyme(false); 
            setSuccessMessageReponse("Réponse envoyée avec succès !");
            // Mise à jour du nombre de réponses dans le sujet parent (liste)
            setSujets(prevSujets => prevSujets.map(sujet =>
                sujet.id === selectedTopic.id
                    ? { ...sujet, reponses: (sujet.reponses || []).concat([nouvelleReponse]) } 
                    : sujet
            ));
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

    // Formate la date et l'heure
    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return 'Date inconnue';
        try {
            const date = new Date(dateTimeString);
            return date.toLocaleString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        } catch (e) {
            console.error("Erreur de formatage de la date:", e);
            return dateTimeString;
        }
    };

    // Fonction pour obtenir le nom d'affichage de l'auteur (avec gestion de l'anonymat)
    const getAuthorDisplayName = (author, isAnonymous) => {
        if (isAnonymous) {
            return 'Anonyme';
        }
        // DEBUG: Log l'objet auteur avant de tenter d'accéder à ses propriétés
        console.log("DEBUG getAuthorDisplayName: Objet auteur reçu:", author); // <-- LOG IMPORTANT ICI

        // Tente d'abord nom + prénom, puis email, puis 'Auteur inconnu'
        if (author?.nom && author?.prenom) {
            return `${author.nom} ${author.prenom}`;
        } else if (author?.nom) {
            return author.nom;
        } else if (author?.email) {
            return author.email;
        }
        return 'Auteur inconnu';
    };

    // Fonction pour gérer le retour à la liste des sujets
    const handleBackToList = () => {
        setSelectedTopic(null);
        setReponses([]); 
        setNouveauMessageReponse('');
        setIsReponseAnonyme(false); 
        setErrorReponses(null);
        setSuccessMessageReponse(null);
        fetchSujets(); 
    };

    return (
        <Layout>
            <div className="py-8 px-4 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Forum de Discussion</h1>

                {/* Messages d'erreur et succès pour la page principale */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                        {successMessage}
                    </div>
                )}

                {/* Affichage détaillé d'un sujet ou liste des sujets */}
                {selectedTopic ? (
                    // Section de détail du sujet
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        {/* Bouton retour */}
                        <button
                            onClick={handleBackToList}
                            className="mb-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            &larr; Retour à la liste des sujets
                        </button>

                        {/* Détails du sujet */}
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedTopic.titre}</h2>
                        <p className="text-gray-700 mb-4">{selectedTopic.contenu}</p>
                        <div className="text-sm text-gray-500 mb-6">
                            Par <span className="font-semibold">
                                {/* Utilise la nouvelle fonction pour l'affichage de l'auteur */}
                                {getAuthorDisplayName(selectedTopic.auteur, selectedTopic.anonyme)} 
                                {/* Supprime le prénom ici, car il est géré dans getAuthorDisplayName pour les non-anonymes */}
                            </span> le {formatDateTime(selectedTopic.dateCreation)}
                        </div>

                        {/* Messages d'erreur et succès pour les réponses */}
                        {errorReponses && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                                {errorReponses}
                            </div>
                        )}
                        {successMessageReponse && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                                {successMessageReponse}
                            </div>
                        )}

                        {/* Liste des réponses */}
                        <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Réponses ({reponses.length})</h3>
                        {loadingReponses ? (
                            <p className="text-gray-600">Chargement des réponses...</p>
                        ) : reponses.length === 0 ? (
                            <p className="text-gray-600">Aucune réponse pour ce sujet pour le moment.</p>
                        ) : (
                            <div className="space-y-4">
                                {reponses.map(reponse => (
                                    <div key={reponse.id} className="bg-gray-50 p-4 rounded-md shadow-sm">
                                        <p className="text-gray-800">{reponse.message}</p>
                                        <div className="text-sm text-gray-500 mt-2">
                                            Par <span className="font-semibold">
                                                {/* Utilise la nouvelle fonction pour l'affichage de l'auteur */}
                                                {getAuthorDisplayName(reponse.auteur, reponse.anonyme)} 
                                                {/* Supprime le prénom ici, car il est géré dans getAuthorDisplayName pour les non-anonymes */}
                                            </span> le {formatDateTime(reponse.dateReponse)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Formulaire de réponse */}
                        <form onSubmit={handleSubmitReponse} className="mt-8 p-4 border rounded-lg shadow-inner bg-gray-50">
                            <h4 className="text-lg font-semibold text-gray-700 mb-3">Ajouter une réponse</h4>
                            {!isAuthenticated ? (
                                <p className="text-gray-600 mb-3">Connectez-vous pour ajouter une réponse.</p>
                            ) : (
                                <>
                                    <textarea
                                        className="w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 mb-3"
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
                                                className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                                                checked={isReponseAnonyme}
                                                onChange={(e) => setIsReponseAnonyme(e.target.checked)}
                                            />
                                            <span className="ml-2 text-gray-700">Publier de manière anonyme</span>
                                        </label>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
                        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
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
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            value={nouveauTitre}
                                            onChange={(e) => setNouveauTitre(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="nouveauContenu" className="block text-sm font-medium text-gray-700">Contenu :</label>
                                        <textarea
                                            id="nouveauContenu"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                                                className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                                                checked={isSujetAnonyme}
                                                onChange={(e) => setIsSujetAnonyme(e.target.checked)}
                                            />
                                            <span className="ml-2 text-gray-700">Publier de manière anonyme</span>
                                        </label>
                                    </div>
                                    <button
                                        type="submit"
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Publier le sujet
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Liste des sujets existants */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Sujets du Forum</h2>
                            {loading ? (
                                <p className="text-gray-600">Chargement des sujets...</p>
                            ) : sujets.length === 0 ? (
                                <p className="text-gray-600">Aucun sujet de discussion pour le moment. Soyez le premier à en créer un !</p>
                            ) : (
                                <div className="space-y-4">
                                    {sujets.map(sujet => (
                                        <div
                                            key={sujet.id}
                                            className="p-4 border rounded-md shadow-sm bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                                            onClick={() => setSelectedTopic(sujet)}
                                        >
                                            <h3 className="text-lg font-bold text-indigo-700">{sujet.titre}</h3>
                                            <p className="text-gray-700 text-sm mt-1 line-clamp-2">{sujet.contenu}</p>
                                            <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                                                <span>Par <span className="font-semibold">
                                                    {/* Utilise la nouvelle fonction pour l'affichage de l'auteur */}
                                                    {getAuthorDisplayName(sujet.auteur, sujet.anonyme)} 
                                                    {/* Le prénom est maintenant géré à l'intérieur de getAuthorDisplayName pour les non-anonymes */}
                                                </span> le {formatDateTime(sujet.dateCreation)}</span>
                                                <span>Réponses: {sujet.reponses ? sujet.reponses.length : '0'}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
};

export default Forum;
