import React from 'react';
import PiedPage from '../components/commun/PiedPage';
import Header from '../components/header';


const Ressources = () => {
  return (
    <>
      <Header /> 
      <main style={{ padding: '20px' }}>
        <h1>Ressources éducatives</h1>
        <CarteRessourceEducative />
      </main>
      <PiedPage />
    </>
  );
};

export default Ressources;
