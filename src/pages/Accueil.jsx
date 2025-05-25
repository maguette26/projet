import React from 'react';

import Hero from '../components/commun/Hero'; 
import Layout from '../components/commun/Layout'; 

const Accueil = () => {
  return (
    <Layout>
      <div className="py-8 px-4 max-w-7xl mx-auto">
        <Hero />
      </div>
    </Layout>
  );
};

export default Accueil;