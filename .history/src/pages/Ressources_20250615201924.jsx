// src/pages/Ressources.jsx
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import api from '../services/api';
import Layout from '../components/commun/Layout';
import { useRessource } from './RessourceContext.jsx';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Play, Music2, Quote, BookOpenText, LayoutList, Wand2 } from 'lucide-react';

const iconByType = {
  citation: <Quote className="w-5 h-5 inline-block mr-1" />,
  video: <Play className="w-5 h-5 inline-block mr-1" />,
  podcast: <Music2 className="w-5 h-5 inline-block mr-1" />,
  article: <BookOpenText className="w-5 h-5 inline-block mr-1" />,
  guide_pratique: <LayoutList className="w-5 h-5 inline-block mr-1" />,
  journaling_prompt: <Wand2 className="w-5 h-5 inline-block mr-1" />,
  exercice_texte: <Sparkles className="w-5 h-5 inline-block mr-1" />,
  challenge: <Sparkles className="w-5 h-5 inline-block mr-1" />,
  outil: <Wand2 className="w-5 h-5 inline-block mr-1" />,
};

const Ressources = () => {
  const [fonctionnalites, setFonctionnalites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUserPremium, setIsUserPremium] = useState(false);

  const { selectedCategory, categoriesOrder, setSelectedCategory } = useRessource();
  const navigate = useNavigate();

  const fetchFonctionnalites = useCallback(async () => {
    try {
      const res = await api.get('/fonctionnalites');
      setFonctionnalites(res.data.filter(f => f.statut === true));
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des ressources.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/me');
        setIsUserPremium(res.data.role === 'PREMIUM' || res.data.role === 'ADMIN');
      } catch {
        setIsUserPremium(false);
      } finally {
        fetchFonctionnalites();
      }
    };

    fetchUser();
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

    return Object.keys(groups).sort((a, b) => {
      const indexA = categoriesOrder.findIndex(cat => cat.key === a);
      const indexB = categoriesOrder.findIndex(cat => cat.key === b);
      return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
    }).reduce((acc, key) => {
      acc[key] = groups[key];
      return acc;
    }, {});
  }, [fonctionnalites, selectedCategory, categoriesOrder]);

  const getCategoryTitle = key => categoriesOrder.find(cat => cat.key === key)?.title || key;

  const renderResourceContent = f => {
    const { type, description, premium, lienFichier } = f;
    if (premium && !isUserPremium) {
      return (
        <div className="text-center mt-4">
          <p className="text-indigo-600 font-semibold mb-2">Contenu Premium</p>
          <button
            onClick={() => navigate('/devenir-premium')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-4 rounded-full text-sm shadow-md"
          >
            Devenir Premium
          </button>
        </div>
      );
    }

    if (type === 'citation') {
      return <blockquote className="italic text-gray-600">"{description}"</blockquote>;
    }

    if (type === 'video' && lienFichier.includes('youtube')) {
      const youtubeId = lienFichier.split('v=')[1] || lienFichier.split('/').pop();
      return (
        <iframe
          className="w-full rounded-md mt-2"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          allowFullScreen
        ></iframe>
      );
    }

    if (type === 'podcast') {
      return (
        <audio controls className="w-full mt-2">
          <source src={lienFichier} type="audio/mpeg" />
          Votre navigateur ne supporte pas l'audio.
        </audio>
      );
    }

    return (
      <div className="mt-2">
        <p className="text-sm text-gray-700">{description}</p>
        {lienFichier && (
          <a href={lienFichier} target="_blank" rel="noopener noreferrer" className="text-indigo-500 underline block mt-1">
            Accéder
          </a>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-4xl font-bold text-center text-indigo-800 mb-6">🎧 Bibliothèque de Bien-Être</h1>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {categoriesOrder.map(cat => (
            <button
              key={cat.key}
              className={`px-4 py-2 text-sm rounded-full shadow transition ${
                selectedCategory === cat.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-indigo-100'
              }`}
              onClick={() => setSelectedCategory(cat.key)}
            >
              {iconByType[cat.key] || '📂'} {cat.title}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 text-center p-4 mb-4 rounded-md">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center">Chargement...</p>
        ) : (
          <div className="space-y-8">
            {Object.entries(filteredAndGroupedFonctionnalites).map(([typeKey, group]) => (
              <motion.section
                key={typeKey}
                className="bg-white p-6 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">{getCategoryTitle(typeKey)}</h2>
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {group.map(f => (
                    <motion.div
                      key={f.id}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition bg-white flex flex-col justify-between"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          {iconByType[f.type] || '📘'} {f.nom}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {f.description.length > 100 ? `${f.description.substring(0, 100)}...` : f.description}
                        </p>
                      </div>
                      <div className="mt-4">{renderResourceContent(f)}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Ressources;
