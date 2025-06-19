import React from 'react';
import Hero from '../components/commun/Hero';
import Fonctionnalites from '../components/commun/Fonctionnalites';
import Statistiques from '../components/commun/Statistiques';
import PourquoiNous from '../components/commun/PourquoiNous';
import Layout from '../components/commun/Layout';

const Accueil = () => {
  return (
    <Layout>
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <Hero />
        <Fonctionnalites />
        <Statistiques />
        <PourquoiNous/>
      </div>
    </Layout>
  );
};

export default Accueil;
