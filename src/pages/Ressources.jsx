// src/pages/Ressources.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api'; // Importe l'instance 'api' centralisée
import Layout from '../components/commun/Layout'; // Assurez-vous que le chemin est correct

const Ressources = () => {
    const [fonctionnalites, setFonctionnalites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // État pour le statut premium de l'utilisateur
    const [isUserPremium, setIsUserPremium] = useState(false); 

    // État pour les informations de l'utilisateur connecté (pour récupérer le statut premium)
    const [userInfo, setUserInfo] = useState(null);

    // Gère les erreurs renvoyées par l'API
    const handleApiError = (err, defaultMessage) => {
        console.error("Erreur API:", err);
        if (err.response) {
            switch (err.response.status) {
                case 403:
                    setError("Accès refusé : Vous n'avez pas les permissions nécessaires.");
                    break;
                case 401:
                    setError("Session expirée, veuillez vous reconnecter.");
                    // L'intercepteur de api.js devrait gérer la redirection ici.
                    break;
                case 404:
                    setError("La ressource demandée n'a pas été trouvée. Assurez-vous que le backend est en cours d'exécution et que l'URL est correcte.");
                    break;
                default:
                    setError(err.response.data?.message || defaultMessage);
            }
        } else if (err.request) {
            setError("Aucune réponse du serveur. Vérifiez votre connexion internet.");
        } else {
            setError(err.message || defaultMessage);
        }
    };

    // Effet pour récupérer les informations de l'utilisateur (y compris le statut premium)
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                // Récupère les infos utilisateur. Assurez-vous que votre backend renvoie le statut premium ici.
                const res = await api.get('/auth/me'); 
                setUserInfo(res.data);
                // Si votre backend renvoie une propriété 'premium' pour l'utilisateur:
                // setIsUserPremium(res.data.premium || false); 
                // Pour l'exemple, nous allons simuler le statut premium pour les tests.
                // REMPLACEZ CECI PAR LA VRAIE LOGIQUE DE RÉCUPÉRATION DU STATUT PREMIUM DE L'UTILISATEUR
                setIsUserPremium(res.data.role === 'ADMIN'); // Exemple: ADMIN est premium
                // Ou si vous avez un champ 'isPremium' dans votre UserDetails ou Entité Utilisateur:
                // setIsUserPremium(res.data.isPremium || false); 

            } catch (err) {
                console.warn("Impossible de récupérer les informations utilisateur (peut-être non connecté ou erreur API):", err);
                // Si l'utilisateur n'est pas connecté, il ne sera pas premium.
                setIsUserPremium(false); 
            } finally {
                // Une fois les infos utilisateur (ou l'absence de celles-ci) traitées, on peut charger les fonctionnalités
                fetchFonctionnalites();
            }
        };

        fetchUserInfo();
    }, []); // S'exécute une seule fois au montage du composant

    // Effet pour récupérer les fonctionnalités
    const fetchFonctionnalites = async () => {
        setLoading(true);
        setError(null);
        try {
            // Utilise l'instance 'api' et l'URL sans slash final pour correspondre au backend
            const res = await api.get('/fonctionnalites'); 
            if (Array.isArray(res.data)) {
                // Filtrer pour n'afficher que les fonctionnalités "actives" (statut est un booléen)
                setFonctionnalites(res.data.filter(f => f.statut === true));
            } else {
                throw new Error("Format de données inattendu de l'API.");
            }
        } catch (err) {
            handleApiError(err, "Erreur lors du chargement des ressources.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="py-8 px-4 max-w-7xl mx-auto text-center">
                    Chargement des ressources...
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="py-8 px-4 max-w-7xl mx-auto text-center alert alert-danger">
                    {error}
                </div>
            </Layout>
        );
    }

    // Fonction pour rendre le contenu de la ressource ou un message d'accès
    const renderResourceContent = (fonctionnalite) => {
        const { type, description, premium } = fonctionnalite;

        // Si la ressource est premium et l'utilisateur n'est PAS premium
        if (premium && !isUserPremium) {
            return (
                <div className="mt-4 text-center text-red-500">
                    <p>Contenu réservé aux membres Premium.</p>
                    <button
                        onClick={() => console.warn("Rediriger vers la page d'abonnement ou de connexion premium")}
                        className="btn btn-warning mt-2"
                    >
                        Devenir Premium
                    </button>
                </div>
            );
        }

        // Si la ressource n'est pas premium, ou si l'utilisateur est premium
        switch (type) {
            case 'citation':
                return (
                    <blockquote className="mt-4 border-l-4 border-gray-200 pl-4 italic text-gray-600">
                        "{description}"
                    </blockquote>
                );
            case 'video':
            case 'article':
            case 'podcast':
            case 'outil':
                // Assurez-vous que 'description' contient l'URL ou un ID pour ces types.
                // Dans un cas réel, vous auriez probablement un champ 'url' ou 'content' dédié.
                const linkText = {
                    video: 'Regarder la vidéo',
                    article: 'Lire l\'article',
                    podcast: 'Écouter le podcast',
                    outil: 'Utiliser l\'outil interactif'
                }[type];

                return (
                    <div className="mt-4">
                        <p className="text-blue-500 hover:underline">
                            <a href={description} target="_blank" rel="noopener noreferrer">
                                {linkText}
                            </a>
                        </p>
                    </div>
                );
            default:
                return null; // Gérer les types inconnus ou sans rendu spécifique
        }
    };

    return (
        <Layout>
            <div className="py-8 px-4 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Ressources éducatives</h1>

                {/* Message pour l'utilisateur non premium s'il y a des ressources premium */}
                {!isUserPremium && fonctionnalites.some(f => f.premium) && (
                    <div className="alert alert-info mb-4">
                        Certaines ressources sont réservées aux membres Premium. <a href="#" className="alert-link">Découvrez nos offres !</a>
                    </div>
                )}

                {fonctionnalites.length === 0 ? (
                    <div className="alert alert-info text-center">
                        Aucune ressource disponible pour le moment.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {fonctionnalites.map((f) => (
                            <div key={f.id} className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">{f.nom}</h2>
                                <p className="text-gray-700 mb-4">{f.description.length > 100 && f.premium && !isUserPremium ? `${f.description.substring(0, 100)}...` : f.description}</p>
                                <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                                    <span>Type: <span className="font-medium">{f.type}</span></span>
                                    {f.premium && (
                                        <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                            Premium
                                        </span>
                                    )}
                                </div>
                                {renderResourceContent(f)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Ressources;
