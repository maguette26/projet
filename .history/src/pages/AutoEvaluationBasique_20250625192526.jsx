// 📄 src/pages/MiniDefiGratuite.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/commun/Layout';
import { CheckCircle, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const MiniDefiGratuite = () => {
  const [termine, setTermine] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const done = localStorage.getItem('miniDefiGratuiteTermine');
    if (done === 'true') setTermine(true);
  }, []);

  useEffect(() => {
    if (termine) {
      const timer = setTimeout(() => {
        navigate('/ressources');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [termine, navigate]);

  const handleTerminer = () => {
    setTermine(true);
    localStorage.setItem('miniDefiGratuiteTermine', 'true');
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 bg-white/80 shadow-2xl rounded-2xl mt-10">
        <h1 className="text-4xl font-bold mb-6 text-indigo-700">🧘‍♀️ Mini Défi Gratuit</h1>
        {!termine ? (
          <>
            <motion.p
              className="mb-4 text-lg text-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Chaque jour, prenez 5 minutes pour vous reconnecter à vous-même avec ces petits gestes de bien-être.
            </motion.p>
            <ul className="list-disc pl-6 text-indigo-900 space-y-2">
              <li>🌬️ Jour 1 : Respiration profonde 5 minutes</li>
              <li>📴 Jour 2 : Se déconnecter des écrans 10 minutes</li>
              <li>💧 Jour 3 : Boire un grand verre d'eau au réveil</li>
            </ul>
            <motion.button
              onClick={handleTerminer}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all"
            >
              <CheckCircle className="w-5 h-5" />
              J'ai terminé ce défi !
            </motion.button>
          </>
        ) : (
          <>
            <motion.p
              className="text-green-600 font-semibold text-lg animate-pulse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              🎉 Bravo pour avoir terminé le mini défi ! Redirection vers les ressources...
            </motion.p>
            <button
              onClick={() => {
                setTermine(false);
                localStorage.removeItem('miniDefiGratuiteTermine');
              }}
              className="mt-4 flex items-center gap-2 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-full hover:bg-indigo-100"
            >
              <RefreshCcw className="w-4 h-4" />
              Refaire le défi
            </button>
          </>
        )}
      </div>
    </Layout>
  );
};

export default MiniDefiGratuite;