// src/pages/MiniDefiDecouverte.jsx
import React, { useState } from 'react';
import Layout from '../components/commun/Layout';

const MiniDefiDecouverte = () => {
  const [etape, setEtape] = useState(1);

  const nextStep = () => {
    setEtape(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setEtape(prev => Math.max(prev - 1, 1));
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Mini Défi Découverte</h1>
        {etape === 1 && (
          <div>
            <p>Bienvenue dans ce mini défi découverte. Première étape : Respirez profondément pendant 2 minutes.</p>
            <button
              onClick={nextStep}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Étape suivante
            </button>
          </div>
        )}
        {etape === 2 && (
          <div>
            <p>Deuxième étape : Écrivez trois choses pour lesquelles vous êtes reconnaissant aujourd'hui.</p>
            <button
              onClick={prevStep}
              className="mr-3 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Précédent
            </button>
            <button
              onClick={nextStep}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Étape suivante
            </button>
          </div>
        )}
        {etape === 3 && (
          <div>
            <p>Dernière étape : Faites une courte marche de 5 minutes à l’extérieur.</p>
            <button
              onClick={prevStep}
              className="mr-3 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Précédent
            </button>
            <p className="mt-4 font-semibold text-green-600">Bravo pour avoir complété ce mini défi ! 🎉</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MiniDefiDecouverte;
