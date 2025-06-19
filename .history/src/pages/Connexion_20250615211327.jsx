// src/pages/Ressources.jsx
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import api from '../services/api';
import Layout from '../components/commun/Layout';
import { useRessource } from './RessourceContext.jsx';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Quote, FileText, BookOpenCheck, PencilLine, FileEdit, Video, Mic, Hammer, Sparkles,
} from 'lucide-react';

const Ressources = () => {
  const [fonctionnalites, setFonctionnalites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUserPremium, setIsUserPremium] = useState(false);
  const navigate = useNavigate();
  const { selectedCategory, categoriesOrder } = useRessource();

  const iconMap = {
    citation: <Quote className="w-6 h-6 text-indigo-600" />,
    article: <FileText className="w-6 h-6 text-indigo-600" />,
    guide_pratique: <BookOpenCheck className="w-6 h-6 text-indigo-600" />,
    journaling_prompt: <PencilLine className="w-6 h-6 text-indigo-600" />,
    exercice_texte: <FileEdit className="w-6 h-6 text-indigo-600" />,
    video: <Video className="w-6 h-6 text-indigo-600" />,
    podcast: <Mic className="w-6 h-6 text-indigo-600" />,
    outil: <Hammer className="w-6 h-6 text-indigo-600" />,
    challenge: <Sparkles className="w-6 h-6 text-indigo-600" />,
    Autres: <Sparkles className="w-6 h-6 text-indigo-600" />,
  };

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
          setError("La ressource demandée n'a pas été trouvée.");
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
        console.warn("Impossible de récupérer les infos utilisateur:", err);
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
      if (!groups[typeKey]) groups[typeKey] = [];
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

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 py-12 px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-indigo-800 mb-10 text-center flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-indigo-500" />
          Explorez Nos Ressources Bien-être
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        {!isUserPremium && fonctionnalites.some(f => f.premium) && (
          <div className="bg-blue-50 border border-blue-300 text-blue-800 px-4 py-3 rounded-md mb-6 text-center">
            Certaines ressources sont réservées aux membres Premium.
            <a href="/devenir-premium" className="font-semibold underline ml-1">Découvrez nos offres !</a>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.keys(filteredAndGroupedFonctionnalites).map(typeKey => (
              <motion.section
                key={typeKey}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  {iconMap[typeKey]}
                  <h2 className="text-2xl font-bold text-gray-800">
                    {getCategoryTitle(typeKey)}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndGroupedFonctionnalites[typeKey].map(f => (
                    <motion.div
                      key={f.id}
                      className="bg-white border border-indigo-100 rounded-2xl shadow-lg p-5 flex flex-col hover:shadow-xl hover:border-indigo-300 transition duration-300"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold text-indigo-800">{f.nom}</h3>
                        {f.premium && (
                          <span className="text-xs px-2 py-1 rounded-full bg-yellow-200 text-yellow-800 font-medium">
                            Premium
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 flex-grow">
                        {f.premium && !isUserPremium ? `${f.description?.substring(0, 100)}...` : f.description}
                      </p>
                      <div className="mt-3">
                        <a
                          href={f.lienFichier}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-3 text-indigo-600 hover:text-white hover:bg-indigo-600 transition px-4 py-1 rounded-lg font-semibold border border-indigo-600"
                        >
                          Voir la ressource →
                        </a>
                      </div>
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
