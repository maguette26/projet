// src/pages/Ressources.jsx
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import api from '../services/api';
import Layout from '../components/commun/Layout';
import { useRessource } from './RessourceContext.jsx';
import { useNavigate } from 'react-router-dom';
import {
  Quote, BookOpenCheck, BookMarked, PenTool, BrainCircuit,
  Video, Mic2, Puzzle, MountainSnow, LucideSparkles
} from 'lucide-react';

const iconMap = {
  citation: <Quote className="w-4 h-4 mr-2" />,
  article: <BookOpenCheck className="w-4 h-4 mr-2" />,
  guide_pratique: <BookMarked className="w-4 h-4 mr-2" />,
  journaling_prompt: <PenTool className="w-4 h-4 mr-2" />,
  exercice_texte: <BrainCircuit className="w-4 h-4 mr-2" />,
  video: <Video className="w-4 h-4 mr-2" />,
  podcast: <Mic2 className="w-4 h-4 mr-2" />,
  outil: <Puzzle className="w-4 h-4 mr-2" />,
  challenge: <MountainSnow className="w-4 h-4 mr-2" />,
  Autres: <LucideSparkles className="w-4 h-4 mr-2" />,
  all: <LucideSparkles className="w-4 h-4 mr-2" />
};

const Ressources = () => {
  const [fonctionnalites, setFonctionnalites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUserPremium, setIsUserPremium] = useState(false);

  const navigate = useNavigate();
  const { selectedCategory, setSelectedCategory, categoriesOrder } = useRessource();

  const handleApiError = (err, defaultMessage) => {
    console.error("Erreur API:", err);
    if (err.response) {
      switch (err.response.status) {
        case 403:
          setError("Accès refusé : permissions insuffisantes.");
          break;
        case 401:
          setError("Session expirée, veuillez vous reconnecter.");
          break;
        case 404:
          setError("Ressource non trouvée.");
          break;
        default:
          setError(err.response.data?.message || defaultMessage);
      }
    } else {
      setError("Erreur réseau ou serveur injoignable.");
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await api.get('/auth/me');
        setIsUserPremium(res.data.role === 'PREMIUM' || res.data.role === 'ADMIN');
      } catch {
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
        throw new Error("Format de données invalide.");
      }
    } catch (err) {
      handleApiError(err, "Erreur de chargement des fonctionnalités.");
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
      if (!groups[typeKey]) groups[typeKey] = [];
      groups[typeKey].push(f);
    });

    return Object.keys(groups).sort((a, b) => {
      const indexA = categoriesOrder.findIndex(cat => cat.key === a);
      const indexB = categoriesOrder.findIndex(cat => cat.key === b);
      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    }).reduce((acc, key) => {
      acc[key] = groups[key];
      return acc;
    }, {});
  }, [fonctionnalites, selectedCategory, categoriesOrder]);

  const getCategoryTitle = (typeKey) => {
    const category = categoriesOrder.find(cat => cat.key === typeKey);
    return category ? category.title : typeKey;
  };

  const renderResourceContent = (f) => {
    const { type, description, premium, lienFichier } = f;

    if (premium && !isUserPremium) {
      return (
        <div className="text-center mt-4 bg-indigo-50 p-4 rounded-md text-indigo-800">
          <p className="font-semibold mb-2">Contenu Premium</p>
          <button
            onClick={() => navigate('/devenir-premium')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
          >
            Devenir Premium
          </button>
        </div>
      );
    }

    switch (type) {
      case 'citation':
        return <blockquote className="mt-4 border-l-4 pl-4 italic text-gray-600">"{description}"</blockquote>;
      case 'video':
        if (lienFichier && (lienFichier.includes('youtube.com') || lienFichier.includes('youtu.be'))) {
          const youtubeId = lienFichier.split('v=')[1]?.split('&')[0] || lienFichier.split('/').pop();
          return (
            <div className="mt-4 aspect-w-16 aspect-h-9">
              <iframe className="w-full rounded-md" src={`https://www.youtube.com/embed/${youtubeId}`} allowFullScreen />
            </div>
          );
        }
        return <a href={lienFichier} className="text-indigo-600 hover:underline">Voir la vidéo</a>;
      case 'podcast':
        return (
          <div className="mt-2">
            <audio controls className="w-full rounded">
              <source src={lienFichier} type="audio/mpeg" />
            </audio>
            <a href={lienFichier} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
              Écouter sur SoundCloud
            </a>
          </div>
        );
      default:
        return (
          <div className="mt-2">
            <p className="text-gray-700">{description}</p>
            {lienFichier && (
              <a href={lienFichier} target="_blank" className="text-indigo-600 hover:underline inline-block mt-2">
                Consulter
              </a>
            )}
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Bibliothèque de Ressources</h1>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {categoriesOrder.map(({ key, title }) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`flex items-center px-4 py-2 rounded-full border text-sm font-semibold transition-all
                ${selectedCategory === key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-indigo-50'}`}
            >
              {iconMap[key]} {title}
            </button>
          ))}
        </div>

        {error && <div className="bg-red-100 border px-4 py-3 rounded text-red-700">{error}</div>}

        {loading ? (
          <p className="text-center">Chargement...</p>
        ) : (
          <div className="space-y-8">
            {Object.keys(filteredAndGroupedFonctionnalites).map(typeKey => (
              <section key={typeKey}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{getCategoryTitle(typeKey)}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndGroupedFonctionnalites[typeKey].map((f) => (
                    <div key={f.id} className="bg-white p-4 rounded shadow border">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">{f.nom}</h3>
                        {f.premium && (
                          <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">Premium</span>
                        )}
                      </div>
                      {renderResourceContent(f)}
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
