import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import Layout from '../components/commun/Layout';
import { useRessource } from './RessourceContext.jsx';
import { useNavigate } from 'react-router-dom';

const Ressources = () => {
  const navigate = useNavigate();
  const { selectedCategory, setSelectedCategory, categoriesOrder } = useRessource();

  const [fonctionnalites, setFonctionnalites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUserPremium, setIsUserPremium] = useState(false);

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
      setError("Erreur de chargement des fonctionnalités.");
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredFonctionnalites = useMemo(() => {
    return fonctionnalites.filter(f =>
      selectedCategory === 'all' ||
      (selectedCategory === 'Autres' && !categoriesOrder.some(cat => cat.key === f.type)) ||
      f.type === selectedCategory
    );
  }, [fonctionnalites, selectedCategory, categoriesOrder]);

  const gratuits = filteredFonctionnalites.filter(f => !f.premium);
  const premiums = filteredFonctionnalites.filter(f => f.premium);

  const renderResourceContent = (f) => {
    const { type, description, lienFichier } = f;

    switch (type) {
      case 'citation':
        return <blockquote className="mt-3 italic text-gray-700">💬 "{description}"</blockquote>;
      case 'video':
        if (lienFichier && (lienFichier.includes('youtube.com') || lienFichier.includes('youtu.be'))) {
          const youtubeId = lienFichier.split('v=')[1]?.split('&')[0] || lienFichier.split('/').pop();
          return (
            <div className="mt-3 aspect-w-16 aspect-h-9 rounded overflow-hidden shadow">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                allowFullScreen
                title={f.nom}
              />
            </div>
          );
        }
        return <a href={lienFichier} className="text-indigo-600 hover:underline mt-2 block">▶️ Voir la vidéo</a>;
      case 'podcast':
        return (
          <div className="mt-3">
            <audio controls className="w-full rounded-md shadow-sm">
              <source src={lienFichier} type="audio/mpeg" />
            </audio>
            <a href={lienFichier} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline mt-1 block">
              🎧 Écouter le podcast
            </a>
          </div>
        );
      default:
        return (
          <div className="mt-2 text-gray-800">
            <p>{description}</p>
            {lienFichier && (
              <a href={lienFichier} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline mt-1 inline-block">
                📄 Consulter
              </a>
            )}
          </div>
        );
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1
