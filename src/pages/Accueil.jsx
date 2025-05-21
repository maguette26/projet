import React from 'react';

import Hero from '../components/Hero';
import Citations from '../components/Citations';
import Header from '../components/header';

const Accueil = () => {
  return (
    <>
      <Header /> 
      <main style={{ padding: '2rem' }}>
        <Hero />
        <Citations />
        
      </main>
    </>
  );
};

export default Accueil;
