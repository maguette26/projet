// src/pages/Accueil.jsx
import React from 'react';
import Hero from '../components/commun/Hero';
import Layout from '../components/commun/Layout';

const Accueil = () => {
  return (
    <Layout>
      <div className="py-16 px-4 max-w-5xl mx-auto">
        <Hero />
        <div className="mt-12 text-center text-gray-600 text-sm">
          <p>
            En quête de bien-être mental ? <strong>PsyConnect</strong> vous accompagne à chaque étape.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Accueil;
