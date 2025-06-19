import React, { useEffect, useState, useMemo } from 'react';
import api from '../services/api';
import Layout from '../components/commun/Layout';
import { useRessource } from './RessourceContext.jsx';
import { useNavigate } from 'react-router-dom';
import {
  Quote, BookOpenCheck, BookMarked, PenTool, BrainCircuit,
  Video, Mic2, Puzzle, MountainSnow, LucideSparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

// Map des icônes avec emoji dans les titres
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

  const { selectedCategory, setSelectedCategory, categoriesOrder } = useRessource();
  const navigate = useNavigate();

  useEffect(() => {
    // Exemple d’appel pour récupérer le statut premium
    api.get('/auth/me')
      .then(res => {
        const role = res.data.role;
        setIsUserPremium(role === 'PREMIUM' || role === 'ADMIN');
      })
      .catch(() => setIsUserPremium(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.get('/fonctionnalites')
      .then(res => {
        if (Array.isArray(res.data)) {
          setFonctionnalites(res.data.filter(f => f.statut === true));
        } else {
          setError("Format de données invalide.");
        }
      })
      .catch(() => setError("Erreur lors du chargement des ressources."))
      .finally(() => setLoading(false));
  }, []);

  // Filtrer selon la catégorie sélectionnée et distinguer premium / gratuit
  const filteredAndGroupedFonctionnalites = useMemo(() => {
    // Filtre les fonctionnalités selon la catégorie sélectionnée
    const filtered = fonctionnalites.filter(f => {
      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'Autres') {
        // Les types non listés explicitement dans categoriesOrder
        return !categoriesOrder.some(c => c.key === f.type);
      }
      return f.type === selectedCategory;
    });

    // Sépare gratuites / premium
    const gratuites = filtered.filter(f => !f.premium);
    const premium = isUserPremium ? filtered.filter(f => f.premium) : [];

    // Groupe par type
    const groups = {};

    gratuites.forEach(f => {
      const key = f.type || 'Autres';
      if (!groups[key]) groups[key] = [];
      groups[key].push(f);
    });

    if (premium.length > 0) {
      groups['premium'] = premium;
    }

    // Tri des groupes : ordre des catégories, premium en dernier
    const sortedKeys = Object.keys(groups).sort((a, b) => {
      if (a === 'premium') return 1;
      if (b === 'premium') return -1;
      const indexA = categoriesOrder.findIndex(c => c.key === a);
      const indexB = categoriesOrder.findIndex(c => c.key === b);
      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });

    // Reconstruction de l'objet trié
    return sortedKeys.reduce((acc, key) => {
      acc[key] = groups[key];
      return acc;
    }, {});
  }, [fonctionnalites, selectedCategory, categoriesOrder, isUserPremium]);

  // Titre avec emoji selon catégorie
  const getCategoryTitle = (key) => {
    if (key === 'premium') return '🌟 Ressources Premium';
    const cat = categoriesOrder.find(c => c.key === key);
    return cat ? cat.title : key;
  };

  // Contenu de la ressource selon type et premium
  const renderResourceContent = (f) => {
    if (f.premium && !isUserPremium) {
      return (
        <div className="mt-4 bg-indigo-50 text-indigo-800 p-3 rounded text-center font-semibold">
          🔒 Contenu Premium<br/>
          <button
            onClick={() => navigate('/devenir-premium')}
            className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-3 rounded"
          >
            Devenir Premium
          </button>
        </div>
      );
    }

    switch (f.type) {
      case 'citation':
        return <blockquote className="italic text-gray-600 mt-3">"{f.description}"</blockquote>;
      case 'video':
        if (f.lienFichier?.includes('youtube.com') || f.lienFichier?.includes('youtu.be')) {
          const videoId = f.lienFichier.split('v=')[1]?.split('&')[0] || f.lienFichier.split('/').pop();
          return (
            <div className="mt-3 aspect-w-16 aspect-h-9">
              <iframe
                className="rounded w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={f.nom}
                allowFullScreen
              />
            </div>
          );
        }
        return <a href={f.lienFichier} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline mt-2 inline-block">Voir la vidéo</a>;
      case 'podcast':
        return (
          <div className="mt-2">
            <audio controls className="w-full rounded">
              <source src={f.lienFichier} type="audio/mpeg" />
              Votre navigateur ne supporte pas la lecture audio.
            </audio>
            <a href={f.lienFichier} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline mt-1 block">Écouter sur SoundCloud</a>
          </div>
        );
      default:
        return (
          <div className="mt-2 text-gray-700">
            {f.description}
            {f.lienFichier && (
              <a href={f.lienFichier} target="_blank" rel="noopener noreferrer" className="block mt-2 text-indigo-600 underline">
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">📚 Bibliothèque de Ressources</h1>

        {/* Boutons de filtre */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categoriesOrder.map(({ key, title }) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`flex items-center gap-1 px-4 py-2 rounded-full border font-semibold text-sm transition
                ${selectedCategory === key
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-indigo-50'}
              `}
            >
              {iconMap[key]} {title}
            </button>
          ))}
        </div>

        {error && <div className="mb-6 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

        {loading ? (
          <p className="text-center">Chargement...</p>
        ) : (
          <>
            {Object.keys(filteredAndGroupedFonctionnalites).map((catKey) => (
              <section key={catKey} className="mb-12">
                <h2 className="text-2xl font-bold mb-5">{getCategoryTitle(catKey)}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndGroupedFonctionnalites[catKey].map(f => (
                    <motion.div
                      key={f.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: (f.id % 10) * 0.1 }}
                      whileHover={{ scale: 1.05, boxShadow: "0 8px 15px rgba(0,0,0,0.1)" }}
                      className="bg-white p-5 rounded shadow border cursor-pointer"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg">{f.nom}</h3>
                        {f.premium && <span className="bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded text-xs font-semibold">Premium</span>}
                      </div>
                      {renderResourceContent(f)}
                    </motion.div>
                  ))}
                </div>
              </section>
            ))}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Ressources;
