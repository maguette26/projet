// src/pages/AutoEvaluationBasique.jsx
import React, { useState } from 'react';
import Layout from '../components/commun/Layout';

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

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Auto-Évaluation Basique</h1>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {['humeur', 'stress', 'sommeil'].map((champ) => (
              <div key={champ}>
                <label htmlFor={champ} className="block font-semibold mb-1 capitalize">
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
                  className="w-full"
                />
              </div>
            ))}
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Valider
            </button>
          </form>
        ) : (
          <div>
            <p className="text-lg mb-4">Merci d'avoir complété cette auto-évaluation.</p>
            <p className="font-semibold">Score moyen : {moyenne} / 5</p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Réinitialiser
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AutoEvaluationBasique;
