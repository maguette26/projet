// src/pages/MiniDefiDecouverte.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/commun/Layout';

const MiniDefiDecouverte = () => {
  const [etape, setEtape] = useState(1);
  const [termine, setTermine] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (termine) {
      const timer = setTimeout(() => {
        navigate('/ressources');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [termine, navigate]);

  const nextStep = () => {
    if (etape === 3) setTermine(true);
    else setEtape(prev => prev + 1);
  };

  const prevStep = () => {
    setEtape(prev => Math.max(prev - 1, 1));
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Mini Défi Découverte</h1>
        {!termine ? (
          <>
            {etape === 1 && (
              <div>
                <p>Bienvenue dans ce mini défi découverte. Première étape : Respirez profondément pendant 2 minutes.</p>
                <button
                  onClick={nextStep}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Suivant
                </button>
              </div>
            )}
            {etape === 2 && (
              <div>
                <p>Deuxième étape : Écrivez trois choses pour lesquelles vous êtes reconnaissant aujourd'hui.</p>
                <div className="mt-4">
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
                    Suivant
                  </button>
                </div>
              </div>
            )}
            {etape === 3 && (
              <div>
                <p>Troisième étape : Faites une courte marche de 5 minutes à l’extérieur.</p>
                <div className="mt-4">
                  <button
                    onClick={prevStep}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Précédent
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-green-600 font-semibold animate-pulse">
            🎉 Félicitations ! Vous avez complété le mini défi. Redirection vers les ressources...
          </p>
        )}
      </div>
    </Layout>
  );
};

export default MiniDefiDecouverte;