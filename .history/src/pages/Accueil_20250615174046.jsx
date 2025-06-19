import React from 'react';
import Hero from '../components/commun/Hero';
import Layout from '../components/commun/Layout';
import Fonctionnalites from '../components/commun/Fonctionnalites'; // 👈 nouveau composant

const Accueil = () => {
  return (
    <Layout>
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <Hero />
        <Fonctionnalites /> {/* 👈 ajout ici */}
      </div>
    </Layout>
  );
};

export default Accueil;
