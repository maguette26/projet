import React, { useState, useEffect } from 'react';
import Layout from '../components/commun/Layout';

const MiniDefiGratuite = () => {
  const [termine, setTermine] = useState(false);

  // Charge l'état du localStorage au montage
  useEffect(() => {
    const done = localStorage.getItem('miniDefiGratuiteTermine');
    if (done === 'true') setTermine(true);
  }, []);

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
            <p>Voici un mini défi pour améliorer votre bien-être : chaque jour, prenez 5 minutes pour méditer ou respirer profondément.</p>
            <button
              onClick={handleTerminer}
              className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              J'ai terminé ce défi !
            </button>
          </>
        ) : (
          <>
            <p className="text-green-600 font-semibold animate-pulse">Bravo pour avoir terminé le mini défi ! 🎉</p>
            <button
              onClick={() => setTermine(false)}
              className="mt-4 px-4 py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-100"
            >
              Refaire le défi
            </button>
          </>
        )}
      </div>
    </Layout>
  );
};

export default MiniDefiGratuite;
