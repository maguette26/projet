// src/pages/MiniDefiGratuite.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/commun/Layout';

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
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Mini Défi Gratuit</h1>
        {!termine ? (
          <>
            <p className="mb-4 text-gray-800">Voici un mini défi pour améliorer votre bien-être : chaque jour, prenez 5 minutes pour méditer ou respirer profondément.</p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Jour 1 : Respiration profonde 5 minutes</li>
              <li>Jour 2 : Se déconnecter des écrans 10 minutes</li>
              <li>Jour 3 : Boire un grand verre d'eau au réveil</li>
            </ul>
            <button
              onClick={handleTerminer}
              className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              ✅ J'ai terminé ce défi !
            </button>
          </>
        ) : (
          <>
            <p className="text-green-600 font-semibold animate-pulse">
              🎉 Bravo pour avoir terminé le mini défi ! Redirection vers les ressources...
            </p>
            <button
              onClick={() => {
                setTermine(false);
                localStorage.removeItem('miniDefiGratuiteTermine');
              }}
              className="mt-4 px-4 py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-100"
            >
              🔄 Refaire le défi
            </button>
          </>
        )}
      </div>
    </Layout>
  );
};

export default MiniDefiGratuite;