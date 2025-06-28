import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/commun/Layout';
import { ArrowRight, ArrowLeft, CheckCircle, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const etapes = [
  {
    titre: 'Étape 1',
    texte: 'Respirez profondément pendant 2 minutes.',
  },
  {
    titre: 'Étape 2',
    texte: 'Écrivez trois choses pour lesquelles vous êtes reconnaissant aujourd’hui.',
  },
  {
    titre: 'Étape 3',
    texte: 'Faites une marche de 5 minutes à l’extérieur.',
  },
];

const MiniDefiDecouverte = () => {
  const [etape, setEtape] = useState(0);
  const [termine, setTermine] = useState(false);
  const [reflexion, setReflexion] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedEtape = localStorage.getItem('miniDefiDecouverteEtape');
    const savedTermine = localStorage.getItem('miniDefiDecouverteTermine');
    if (savedEtape) setEtape(Number(savedEtape));
    if (savedTermine === 'true') setTermine(true);
  }, []);

  useEffect(() => {
    if (termine) {
      const timer = setTimeout(() => {
        navigate('/ressources');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [termine, navigate]);

  const suivant = () => {
    if (etape + 1 < etapes.length) {
      setEtape(prev => prev + 1);
      localStorage.setItem('miniDefiDecouverteEtape', etape + 1);
      setReflexion('');
    } else {
      setTermine(true);
      localStorage.setItem('miniDefiDecouverteTermine', 'true');
    }
  };

  const precedent = () => {
    setEtape(prev => Math.max(prev - 1, 0));
  };

  const reset = () => {
    setEtape(0);
    setReflexion('');
    setTermine(false);
    localStorage.removeItem('miniDefiDecouverteEtape');
    localStorage.removeItem('miniDefiDecouverteTermine');
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 bg-white/80 shadow-xl rounded-2xl mt-10">
        <h1 className="text-4xl font-bold mb-6 text-indigo-700">🔍 Mini Défi Découverte - {etapes[etape].titre}</h1>
        {!termine ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-gray-700 text-lg mb-4">{etapes[etape].texte}</p>

            <label className="block text-sm font-medium text-gray-700 mb-1">📝 Votre ressenti :</label>
            <textarea
              className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4"
              value={reflexion}
              onChange={(e) => setReflexion(e.target.value)}
              rows={3}
            />

            <div className="flex gap-3">
              {etape > 0 && (
                <button
                  onClick={precedent}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400"
                >
                  <ArrowLeft className="w-4 h-4" /> Précédent
                </button>
              )}
              <button
                onClick={suivant}
                className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
              >
                <CheckCircle className="w-5 h-5" />
                {etape === etapes.length - 1 ? 'Terminer' : 'Suivant'}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="text-green-600 font-semibold text-lg animate-pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            🎉 Vous avez complété le défi découverte ! Redirection en cours...
            <button
              onClick={reset}
              className="mt-4 flex items-center gap-2 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-full hover:bg-indigo-100"
            >
              <RefreshCcw className="w-4 h-4" /> Refaire le défi
            </button>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default MiniDefiDecouverte;
