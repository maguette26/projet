// 📄 src/pages/AutoEvaluationBasique.jsx — version enrichie avec journal et progression
import React, { useState, useEffect } from 'react';
import Layout from '../components/commun/Layout';
import { CheckCircle, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const questions = [
  {
    id: 'humeur',
    label: 'Comment évalueriez-vous votre humeur aujourd’hui ?',
  },
  {
    id: 'stress',
    label: 'Niveau de stress ressenti ?',
  },
  {
    id: 'sommeil',
    label: 'Qualité de votre sommeil ?',
  },
];

const AutoEvaluationBasique = () => {
  const [etape, setEtape] = useState(0);
  const [scores, setScores] = useState({ humeur: 3, stress: 3, sommeil: 3 });
  const [reflexion, setReflexion] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('autoEvaluationTerminee');
    if (saved === 'true') setSubmitted(true);
  }, []);

  const handleNext = () => {
    if (etape < questions.length - 1) {
      setEtape(etape + 1);
    } else {
      setSubmitted(true);
      localStorage.setItem('autoEvaluationTerminee', 'true');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScores(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleReset = () => {
    setScores({ humeur: 3, stress: 3, sommeil: 3 });
    setReflexion('');
    setEtape(0);
    setSubmitted(false);
    localStorage.removeItem('autoEvaluationTerminee');
  };

  const moyenne = ((scores.humeur + scores.stress + scores.sommeil) / 3).toFixed(2);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 bg-white/80 shadow-xl rounded-2xl mt-10">
        <h1 className="text-4xl font-bold mb-6 text-indigo-700">🧠 Auto-Évaluation Basique</h1>
        {!submitted ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-lg text-gray-700 mb-4">{questions[etape].label}</p>
            <input
              type="range"
              name={questions[etape].id}
              min="1"
              max="5"
              value={scores[questions[etape].id]}
              onChange={handleChange}
              className="w-full mb-2"
            />
            <div className="text-sm text-gray-600 mb-4">Valeur : {scores[questions[etape].id]}</div>

            {etape === questions.length - 1 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">📝 Une réflexion à partager ?</label>
                <textarea
                  value={reflexion}
                  onChange={(e) => setReflexion(e.target.value)}
                  className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  rows={3}
                ></textarea>
              </div>
            )}

            <button
              onClick={handleNext}
              className="mt-6 flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
            >
              <CheckCircle className="w-5 h-5" />
              {etape === questions.length - 1 ? 'Terminer' : 'Suivant'}
            </button>
          </motion.div>
        ) : (
          <motion.div
            className="text-green-700 text-lg font-semibold animate-pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Merci pour votre évaluation 🌟
            <p className="mt-2">Score moyen : <span className="font-bold">{moyenne} / 5</span></p>
            {reflexion && (
              <p className="mt-2 text-sm text-gray-700 italic">“{reflexion}”</p>
            )}
            <button
              onClick={handleReset}
              className="mt-6 flex items-center gap-2 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-full hover:bg-indigo-100"
            >
              <RefreshCcw className="w-4 h-4" /> Réinitialiser
            </button>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default AutoEvaluationBasique;