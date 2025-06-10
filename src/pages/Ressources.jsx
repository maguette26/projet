// src/pages/Ressources.jsx
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import api from '../services/api'; 
import Layout from '../components/commun/Layout'; 
import { useRessource } from './RessourceContext.jsx'; // Assurez-vous du chemin correct
import { useNavigate } from 'react-router-dom'; // Importez useNavigate

const Ressources = () => {
    const [fonctionnalites, setFonctionnalites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isUserPremium, setIsUserPremium] = useState(false); 
    const navigate = useNavigate(); // Initialisez useNavigate

    const { selectedCategory, categoriesOrder } = useRessource();

    const handleApiError = (err, defaultMessage) => {
        console.error("Erreur API:", err);
        if (err.response) {
            switch (err.response.status) {
                case 403:
                    setError("Accès refusé : Vous n'avez pas les permissions nécessaires.");
                    break;
                case 401:
                    setError("Session expirée, veuillez vous reconnecter.");
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

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await api.get('/auth/me'); 
                setIsUserPremium(res.data.role === 'PREMIUM' || res.data.role === 'ADMIN'); 
            } catch (err) {
                console.warn("Impossible de récupérer les informations utilisateur (peut-être non connecté ou erreur API):", err);
                setIsUserPremium(false); 
            } finally {
                fetchFonctionnalites();
            }
        };

        fetchUserInfo();
    }, []); 

    const fetchFonctionnalites = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/fonctionnalites'); 
            if (Array.isArray(res.data)) {
                setFonctionnalites(res.data.filter(f => f.statut === true));
            } else {
                throw new Error("Format de données inattendu de l'API.");
            }
        } catch (err) {
            handleApiError(err, "Erreur lors du chargement des ressources.");
        } finally {
            setLoading(false);
        }
    }, []); 

    const filteredAndGroupedFonctionnalites = useMemo(() => {
        const filtered = fonctionnalites.filter(f => 
            selectedCategory === 'all' || 
            (selectedCategory === 'Autres' && !categoriesOrder.some(cat => cat.key === f.type)) ||
            f.type === selectedCategory
        );

        const groups = {};
        filtered.forEach(f => {
            const typeKey = f.type || 'Autres'; 
            if (!groups[typeKey]) {
                groups[typeKey] = [];
            }
            groups[typeKey].push(f);
        });

        return Object.keys(groups).sort((a, b) => {
            const indexA = categoriesOrder.findIndex(cat => cat.key === a);
            const indexB = categoriesOrder.findIndex(cat => cat.key === b);
            return (indexA === -1 ? categoriesOrder.length : indexA) - (indexB === -1 ? categoriesOrder.length : indexB);
        }).reduce((acc, key) => {
            acc[key] = groups[key];
            return acc;
        }, {});
    }, [fonctionnalites, selectedCategory, categoriesOrder]);

    const getCategoryTitle = (typeKey) => {
        const category = categoriesOrder.find(cat => cat.key === typeKey);
        return category ? category.title : typeKey;
    };


    const renderResourceContent = (fonctionnalite) => {
        const { type, description, premium, lienFichier } = fonctionnalite;

        if (premium && !isUserPremium) {
            return (
                <div className="mt-4 text-center p-4 bg-indigo-50 rounded-md text-indigo-800">
                    <p className="font-semibold mb-2">Contenu Premium</p>
                    <p>Ce contenu est réservé aux membres Premium.</p>
                    <button
                        onClick={() => navigate('/devenir-premium')} // <-- Redirection vers la page Premium
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md mt-3 shadow-md"
                    >
                        Devenir Membre Premium
                    </button>
                </div>
            );
        }

        switch (type) {
            case 'citation':
                return (
                    <blockquote className="mt-4 border-l-4 border-indigo-200 pl-4 italic text-gray-600">
                        "{description}"
                    </blockquote>
                );
            case 'video':
                if (lienFichier && (lienFichier.includes('youtube.com') || lienFichier.includes('youtu.be'))) {
                    const youtubeId = lienFichier.split('v=')[1] || lienFichier.split('/').pop();
                    const embedUrl = `https://www.youtube.com/embed/${youtubeId}`;
                    return (
                        <div className="mt-4 aspect-w-16 aspect-h-9 w-full"> 
                            <iframe
                                className="w-full h-auto rounded-md"
                                src={embedUrl}
                                title={fonctionnalite.nom}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    );
                }
                return (
                    <div className="mt-4">
                        <p className="text-gray-700 whitespace-pre-wrap">{description}</p>
                        {lienFichier && (
                            <a href={lienFichier} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline mt-2 inline-block">
                                Regarder la vidéo
                            </a>
                        )}
                    </div>
                );
            case 'podcast':
                if (lienFichier && lienFichier.includes('soundcloud.com/')) {
                    return (
                        <div className="mt-4">
                            <p className="text-gray-700 whitespace-pre-wrap">{description}</p>
                            <audio controls className="w-full mt-2 rounded-md">
                                <source src={lienFichier} type="audio/mpeg" />
                                Votre navigateur ne supporte pas l'élément audio.
                            </audio>
                            <a href={lienFichier} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline mt-2 inline-block">
                                Écouter sur SoundCloud
                            </a>
                        </div>
                    );
                }
                return (
                    <div className="mt-4">
                        <p className="text-gray-700 whitespace-pre-wrap">{description}</p>
                        {lienFichier && (
                            <a href={lienFichier} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline mt-2 inline-block">
                                Écouter le podcast
                            </a>
                        )}
                    </div>
                );
            case 'article':
            case 'guide_pratique':
            case 'journaling_prompt':
            case 'exercice_texte':
            case 'challenge':
            case 'outil':
                return (
                    <div className="mt-4">
                        <p className="text-gray-700 whitespace-pre-wrap">{description}</p>
                        {lienFichier && (
                            <a href={lienFichier} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline mt-2 inline-block">
                                {type === 'outil' ? 'Accéder à l\'outil' : 'En savoir plus'}
                                <svg className="inline-block w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                            </a>
                        )}
                    </div>
                );
            default:
                return <p className="text-gray-700 mt-4 whitespace-pre-wrap">{description}</p>;
        }
    };

    return (
        <Layout>
            <div className="py-8 px-4 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Bibliothèque de Ressources</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        {error}
                    </div>
                )}

                {/* Message pour l'utilisateur non premium s'il y a des ressources premium */}
                {!isUserPremium && fonctionnalites.some(f => f.premium) && (
                    <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4 text-center">
                        Certaines ressources sont réservées aux membres Premium. <a href="/devenir-premium" className="font-semibold underline">Découvrez nos offres !</a>
                    </div>
                )}

                {loading ? (
                    <div className="py-8 px-4 max-w-7xl mx-auto text-center">
                        Chargement des ressources...
                    </div>
                ) : Object.keys(fonctionnalites).length === 0 ? ( 
                    <div className="bg-gray-100 border border-gray-400 text-gray-700 px-4 py-3 rounded relative text-center">
                        Aucune ressource disponible pour le moment.
                    </div>
                ) : (
                    <div className="space-y-8"> 
                        {Object.keys(filteredAndGroupedFonctionnalites).map(typeKey => (
                            <section key={typeKey} className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                                    {getCategoryTitle(typeKey)}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredAndGroupedFonctionnalites[typeKey].map((f) => (
                                        <div key={f.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-semibold text-gray-900 leading-tight pr-2">{f.nom}</h3>
                                                {f.premium && (
                                                    <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                                                        Premium
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <p className="text-gray-700 mb-4 flex-grow">
                                                {f.premium && !isUserPremium 
                                                    ? `${f.description ? f.description.substring(0, Math.min(f.description.length, 120)) : ''}...`
                                                    : f.description
                                                }
                                            </p>
                                            
                                            <div className="mt-auto"> 
                                                {renderResourceContent(f)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Ressources;
