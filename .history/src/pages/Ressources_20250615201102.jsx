// src/pages/Ressources.jsx
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import api from '../services/api'; 
import Layout from '../components/commun/Layout'; 
import { useRessource } from './RessourceContext.jsx';
import { useNavigate } from 'react-router-dom';

const Ressources = () => {
    const [fonctionnalites, setFonctionnalites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUserPremium, setIsUserPremium] = useState(false); 

    const navigate = useNavigate(); 
    const { selectedCategory, categoriesOrder } = useRessource();

    const handleApiError = (err, defaultMessage) => {
        console.error("Erreur API:", err);
        if (err.response) {
            const { status, data } = err.response;
            if (status === 403) setError("Accès refusé.");
            else if (status === 401) setError("Session expirée.");
            else if (status === 404) setError("Ressource introuvable.");
            else setError(data?.message || defaultMessage);
        } else if (err.request) {
            setError("Pas de réponse serveur.");
        } else {
            setError(err.message || defaultMessage);
        }
    };

    const fetchFonctionnalites = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/fonctionnalites');
            if (Array.isArray(res.data)) {
                setFonctionnalites(res.data.filter(f => f.statut === true));
            } else {
                throw new Error("Format de données inattendu.");
            }
        } catch (err) {
            handleApiError(err, "Erreur lors du chargement des ressources.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await api.get('/auth/me');
                const role = res.data.role;
                setIsUserPremium(role === 'PREMIUM' || role === 'ADMIN');
            } catch (err) {
                console.warn("Erreur lors de la récupération utilisateur.");
                setIsUserPremium(false);
            } finally {
                fetchFonctionnalites();
            }
        };
        fetchUserInfo();
    }, [fetchFonctionnalites]);

    const filteredAndGroupedFonctionnalites = useMemo(() => {
        const filtered = fonctionnalites.filter(f =>
            selectedCategory === 'all' ||
            (selectedCategory === 'Autres' && !categoriesOrder.some(cat => cat.key === f.type)) ||
            f.type === selectedCategory
        );

        const groups = {};
        filtered.forEach(f => {
            const typeKey = f.type || 'Autres';
            if (!groups[typeKey]) groups[typeKey] = [];
            groups[typeKey].push(f);
        });

        return Object.keys(groups)
            .sort((a, b) => {
                const indexA = categoriesOrder.findIndex(cat => cat.key === a);
                const indexB = categoriesOrder.findIndex(cat => cat.key === b);
                return (indexA === -1 ? categoriesOrder.length : indexA) -
                       (indexB === -1 ? categoriesOrder.length : indexB);
            })
            .reduce((acc, key) => {
                acc[key] = groups[key];
                return acc;
            }, {});
    }, [fonctionnalites, selectedCategory, categoriesOrder]);

    const getCategoryTitle = (key) => {
        const found = categoriesOrder.find(cat => cat.key === key);
        return found ? found.title : key;
    };

    const renderResourceContent = (f) => {
        const { type, description, premium, lienFichier } = f;

        if (premium && !isUserPremium) {
            return (
                <div className="mt-4 text-center p-4 bg-indigo-50 rounded-md text-indigo-800">
                    <p className="font-semibold mb-2">Contenu Premium</p>
                    <p>Ce contenu est réservé aux membres Premium.</p>
                    <button
                        onClick={() => navigate('/devenir-premium')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md mt-3 shadow-md"
                    >
                        Devenir Premium
                    </button>
                </div>
            );
        }

        switch (type) {
            case 'citation':
                return <blockquote className="mt-4 italic text-gray-600 border-l-4 border-indigo-200 pl-4">"{description}"</blockquote>;
            case 'video': {
                let youtubeId = null;
                if (lienFichier?.includes('youtube.com')) {
                    const match = lienFichier.match(/[?&]v=([^&]+)/);
                    youtubeId = match ? match[1] : null;
                } else if (lienFichier?.includes('youtu.be')) {
                    youtubeId = lienFichier.split('/').pop();
                }
                return youtubeId ? (
                    <div className="mt-4 aspect-w-16 aspect-h-9 w-full">
                        <iframe
                            className="w-full h-auto rounded-md"
                            src={`https://www.youtube.com/embed/${youtubeId}`}
                            title={f.nom}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                ) : (
                    <div className="mt-4">
                        <p>{description}</p>
                        {lienFichier && <a href={lienFichier} className="text-indigo-600 hover:underline">Voir la vidéo</a>}
                    </div>
                );
            }
            case 'podcast':
                return (
                    <div className="mt-4">
                        <p>{description}</p>
                        <audio controls className="w-full mt-2 rounded-md">
                            <source src={lienFichier} type="audio/mpeg" />
                        </audio>
                        {lienFichier && <a href={lienFichier} className="text-indigo-600 hover:underline">Écouter</a>}
                    </div>
                );
            default:
                return (
                    <div className="mt-4">
                        <p className="text-gray-700 whitespace-pre-wrap">{description}</p>
                        {lienFichier && (
                            <a href={lienFichier} className="text-indigo-600 hover:underline inline-block mt-2" target="_blank" rel="noreferrer">
                                Accéder au contenu
                            </a>
                        )}
                    </div>
                );
        }
    };

    return (
        <Layout>
            <div className="py-8 px-4 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Bibliothèque de Ressources</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {!isUserPremium && fonctionnalites.some(f => f.premium) && (
                    <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4 text-center">
                        Certaines ressources sont Premium. <a href="/devenir-premium" className="font-semibold underline">Découvrez nos offres.</a>
                    </div>
                )}

                {loading ? (
                    <div className="text-center text-gray-600">Chargement...</div>
                ) : Object.keys(filteredAndGroupedFonctionnalites).length === 0 ? (
                    <div className="text-center text-gray-600">Aucune ressource disponible.</div>
                ) : (
                    <div className="space-y-8">
                        {Object.keys(filteredAndGroupedFonctionnalites).map(typeKey => (
                            <section key={typeKey} className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">{getCategoryTitle(typeKey)}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredAndGroupedFonctionnalites[typeKey].map(f => (
                                        <div key={f.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-semibold text-gray-900">{f.nom}</h3>
                                                {f.premium && (
                                                    <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded-full">Premium</span>
                                                )}
                                            </div>
                                            <p className="text-gray-700 mb-4 flex-grow">
                                                {f.premium && !isUserPremium ? `${f.description.slice(0, 120)}...` : f.description}
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
