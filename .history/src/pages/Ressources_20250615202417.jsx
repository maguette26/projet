// src/pages/Ressources.jsx
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import api from '../services/api'; 
import Layout from '../components/commun/Layout'; 
import { useRessource } from './RessourceContext.jsx';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Quote, FileText, BookOpen, PenLine, BrainCircuit, Video, Mic, Wrench, Flame
} from 'lucide-react';

const Ressources = () => {
  const [fonctionnalites, setFonctionnalites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUserPremium, setIsUserPremium] = useState(false); 
  const navigate = useNavigate();

  const { selectedCategory, categoriesOrder } = useRessource();

  const iconMap = {
    citation: <Quote className="w-5 h-5 mr-2 text-indigo-600" />,
    article: <FileText className="w-5 h-5 mr-2 text-blue-600" />,
    guide_pratique: <BookOpen className="w-5 h-5 mr-2 text-green-600" />,
    journaling_prompt: <PenLine className="w-5 h-5 mr-2 text-rose-500" />,
    exercice_texte: <BrainCircuit className="w-5 h-5 mr-2 text-yellow-600" />,
    video: <Video className="w-5 h-5 mr-2 text-red-500" />,
    podcast: <Mic className="w-5 h-5 mr-2 text-orange-500" />,
    outil: <Wrench className="w-5 h-5 mr-2 text-purple-600" />,
    challenge: <Flame className="w-5 h-5 mr-2 text-pink-500" />,
    default: <FileText className="w-5 h-5 mr-2 text-gray-400" />
  };

  const fetchFonctionnalites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/fonctionnalites');
      setFonctionnalites(res.data.filter(f => f.statut === true));
    } catch (err) {
      setError("Erreur lors du chargement des ressources.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await api.get('/auth/me'); 
        setIsUserPremium(res.data.role === 'PREMIUM' || res.data.role === 'ADMIN'); 
      } catch (err) {
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

  return (
    <Layout>
      <div className="py-8 px-4 max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">📚 Bibliothèque de Ressources</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!isUserPremium && fonctionnalites.some(f => f.premium) && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4 text-center">
            Certaines ressources sont réservées aux membres Premium. <a href="/devenir-premium" className="font-semibold underline">Découvrez nos offres !</a>
          </div>
        )}

        {loading ? (
          <div className="text-center">Chargement des ressources...</div>
        ) : (
          <div className="space-y-12">
            {Object.keys(filteredAndGroupedFonctionnalites).map(typeKey => (
              <section key={typeKey}>
                <div className="flex items-center mb-4">
                  {iconMap[typeKey] || iconMap.default}
                  <h2 className="text-2xl font-bold text-gray-700">{getCategoryTitle(typeKey)}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndGroupedFonctionnalites[typeKey].map(f => (
                    <motion.div
                      key={f.id}
                      className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{f.nom}</h3>
                        {f.premium && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded-full">
                            Premium
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-3 flex-grow">
                        {f.premium && !isUserPremium
                          ? (f.description || '').slice(0, 100) + '...'
                          : f.description}
                      </p>
                      {f.premium && !isUserPremium ? (
                        <button
                          onClick={() => navigate('/devenir-premium')}
                          className="mt-auto bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
                        >
                          Accès Premium
                        </button>
                      ) : (
                        f.lienFichier && (
                          <a
                            href={f.lienFichier}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 font-medium hover:underline mt-auto"
                          >
                            Consulter le contenu →
                          </a>
                        )
                      )}
                    </motion.div>
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
