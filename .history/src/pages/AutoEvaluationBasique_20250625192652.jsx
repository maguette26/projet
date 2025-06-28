// 📄 src/pages/AutoEvaluationBasique.jsx
import React, { useState } from 'react';
import Layout from '../components/commun/Layout';
import { Smile, Frown, Moon, CheckCircle, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const AutoEvaluationBasique = () => {
  const [scores, setScores] = useState({ humeur: 3, stress: 3, sommeil: 3 });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScores(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const moyenne = ((scores.humeur + scores.stress + scores.sommeil) / 3).toFixed(2);

  const getEmoji = (value) => {
    if (value <= 2) return <Frown className="inline w-5 h-5 text-red-400" />;
    if (value === 3) return <Moon className="inline w-5 h-5 text-yellow-400" />;
    return <Smile className="inline w-5 h-5 text-green-500" />;
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 bg-white/80 shadow-xl rounded-2xl mt-10">
        <h1 className="text-4xl font-bold mb-6 text-indigo-700">📝 Auto-Évaluation Basique</h1>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {['humeur', 'stress', 'sommeil'].map((champ) => (
              <div key={champ}>
                <label htmlFor={champ} className="block font-semibold mb-1 capitalize text-gray-700">
                  {champ} (1 à 5)
                </label>
                <input
                  type="range"
                  id={champ}
                  name={champ}
                  min="1"
                  max="5"
                  value={scores[champ]}
                  onChange={handleChange}
                  className="w-full accent-indigo-600"
                />
                <p className="text-sm text-gray-600 mt-1">État : {getEmoji(scores[champ])}</p>
              </div>
            ))}
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
            >
              <CheckCircle className="w-5 h-5" />
              Valider
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <p className="text-lg mb-4">Merci d'avoir complété cette auto-évaluation.</p>
            <p className="text-xl font-semibold text-indigo-700">Score moyen : {moyenne} / 5</p>
            <div className="mt-4 w-full h-3 bg-indigo-100 rounded-full">
              <div
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${(moyenne / 5) * 100}%` }}
              ></div>
            </div>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
            >
              <RefreshCcw className="w-5 h-5" />
              Réinitialiser
            </button>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default AutoEvaluationBasique;
