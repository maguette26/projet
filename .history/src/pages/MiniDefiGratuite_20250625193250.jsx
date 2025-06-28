// 📄 src/pages/MiniDefiGratuite.jsx (version avec progression sur 3 jours + journal)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/commun/Layout';
import { CheckCircle, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const defis = [
  {
    titre: 'Jour 1',
    texte: 'Faites 5 minutes de respiration profonde.',
  },
  {
    titre: 'Jour 2',
    texte: 'Déconnectez-vous des écrans pendant 10 minutes.',
  },
  {
    titre: 'Jour 3',
    texte: 'Buvez un grand verre d’eau au réveil.',
  },
];

const MiniDefiGratuite = () => {
  const [jourActuel, setJourActuel] = useState(0);
  const [termine, setTermine] = useState(false);
  const [reflexion, setReflexion] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedDay = localStorage.getItem('miniDefiJour');
    const savedTermine = localStorage.getItem('miniDefiGratuiteTermine');
    if (savedDay) setJourActuel(Number(savedDay));
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

  const handleSuivant = () => {
    if (jourActuel + 1 < defis.length) {
      setJourActuel((prev) => prev + 1);
      localStorage.setItem('miniDefiJour', jourActuel + 1);
      setReflexion('');
    } else {
      setTermine(true);
      localStorage.setItem('miniDefiGratuiteTermine', 'true');
    }
  };

  const handleReset = () => {
    setJourActuel(0);
    setReflexion('');
    setTermine(false);
    localStorage.removeItem('miniDefiJour');
    localStorage.removeItem('miniDefiGratuiteTermine');
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 bg-white/80 shadow-2xl rounded-2xl mt-10">
        <h1 className="text-4xl font-bold mb-6 text-indigo-700">📅 Mini Défi Gratuit - Jour {jourActuel + 1}</h1>
        {!termine ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <p className="text-lg text-gray-800">{defis[jourActuel].texte}</p>
            <div>
              <label htmlFor="reflexion" className="block text-sm font-medium text-gray-700 mb-1">
                📝 Qu’avez-vous ressenti après ce défi ?
              </label>
              <textarea
                id="reflexion"
                value={reflexion}
                onChange={(e) => setReflexion(e.target.value)}
                className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                rows={3}
              ></textarea>
            </div>
            <button
              onClick={handleSuivant}
              className="mt-4 flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
            >
              <CheckCircle className="w-5 h-5" />
              Valider et passer au jour suivant
            </button>
          </motion.div>
        ) : (
          <motion.div
            className="text-green-600 font-semibold text-lg animate-pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            🎉 Bravo ! Vous avez complété les 3 jours du défi. Redirection vers les ressources...
            <button
              onClick={handleReset}
              className="mt-4 flex items-center gap-2 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-full hover:bg-indigo-100"
            >
              <RefreshCcw className="w-4 h-4" />
              Recommencer le défi
            </button>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default MiniDefiGratuite;
