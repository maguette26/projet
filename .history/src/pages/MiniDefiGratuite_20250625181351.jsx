// src/pages/MiniDefiGratuite.jsx
import React, { useState } from 'react';
import Layout from '../components/commun/Layout';

const MiniDefiGratuite = () => {
  const [termine, setTermine] = useState(false);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Mini Défi Gratuit</h1>
        {!termine ? (
          <>
            <p>Voici un mini défi pour améliorer votre bien-être : chaque jour, prenez 5 minutes pour méditer ou respirer profondément.</p>
            <button
              onClick={() => setTermine(true)}
              className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              J'ai terminé ce défi !
            </button>
          </>
        ) : (
          <p className="text-green-600 font-semibold">Bravo pour avoir terminé le mini défi ! 🎉</p>
        )}
      </div>
    </Layout>
  );
};

export default MiniDefiGratuite;
