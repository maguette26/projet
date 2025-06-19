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
  citation: '📝',
  article: '📚',
  guide_pratique: '📖',
  journaling_prompt: '✍️',
  exercice_texte: '🧘',
  video: '🎥',
  podcast: '🎧',
  outil: '🧩',
  challenge: '🏆',
  Autres: '✨',
  all: '📂',
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

  // Filtrer selon catégorie et status premium
  const filteredFonctionnalites = useMemo(() => {
    return fonctionnalites.filter(f =>
      (selectedCategory === 'all' || (selectedCategory === 'Autres' && !categoriesOrder.some(cat => cat.key === f.type)) || f.type === selectedCategory)
    );
  }, [fonctionnalites, selectedCategory, categoriesOrder]);

  // Séparer en gratuit et premium
  const gratuits = filteredFonctionnalites.filter(f => !f.premium);
  const premiums = filteredFonctionnalites.filter(f => f.premium);

  const getCategoryEmoji = (key) => iconMap[key] || '❓';

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">📚 Bibliothèque de Ressources</h1>

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
              <span className="mr-2">{getCategoryEmoji(key)}</span> {title}
            </button>
          ))}
        </div>

        {error && <div className="bg-red-100 border px-4 py-3 rounded text-red-700 mb-4">{error}</div>}

        {loading ? (
          <p className="text-center text-gray-600">Chargement...</p>
        ) : (
          <>
            {/* Section Gratuit */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-green-700 mb-4">✅ Ressources Gratuites</h2>
              {gratuits.length === 0 ? (
                <p className="text-gray-600 italic">Aucune ressource gratuite disponible pour cette catégorie.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gratuits.map(f => (
                    <div key={f.id} className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition cursor-pointer border border-green-300">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-2">{getCategoryEmoji(f.type)}</span>
                        <h3 className="text-lg font-semibold flex-1">{f.nom}</h3>
                        <span className="text-green-600 font-semibold">✅ Gratuit</span>
                      </div>
                      <p className="text-gray-700 mb-3">{f.description}</p>
                      {f.lienFichier && (
                        <a href={f.lienFichier} target="_blank" rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline font-semibold"
                        >
                          Accéder
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Section Premium */}
            <section>
              <h2 className="text-2xl font-bold text-yellow-700 mb-4">⭐ Ressources Premium</h2>
              {premiums.length === 0 ? (
                <p className="text-gray-600 italic">Aucune ressource premium disponible pour cette catégorie.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {premiums.map(f => (
                    <div key={f.id} className="bg-yellow-50 p-5 rounded-lg shadow border border-yellow-300">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-2">{getCategoryEmoji(f.type)}</span>
                        <h3 className="text-lg font-semibold flex-1">{f.nom}</h3>
                        <span className="text-yellow-700 font-semibold">⭐ Premium</span>
                      </div>
                      <p className="text-gray-700 mb-3">{f.description}</p>
                      {isUserPremium ? (
                        f.lienFichier ? (
                          <a href={f.lienFichier} target="_blank" rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline font-semibold"
                          >
                            Accéder
                          </a>
                        ) : <span className="text-gray-500 italic">Pas de lien disponible</span>
                      ) : (
                        <button
                          onClick={() => navigate('/devenir-premium')}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded"
                        >
                          Devenir Premium ⭐
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Ressources;
