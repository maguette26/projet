import React, { useEffect, useState } from 'react';
import Layout from '../components/commun/Layout';
import Hero from '../components/commun/Hero';
import Fonctionnalites from '../components/commun/Fonctionnalites';
import Statistiques from '../components/commun/Statistiques';
import PourquoiNous from '../components/commun/PourquoiNous';
import Loader from '../components/commun/Loader';

const Accueil = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200); // Simulation de chargement
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      {loading ? (
        <Loader />
      ) : (
        <div className="py-12 px-4 sm:px-6 lg:px-8 space-y-20">
          <Hero />
          <Fonctionnalites />
           
          <PourquoiNous />
        </div>
      )}
    </Layout>
  );
};

export default Accueil;
