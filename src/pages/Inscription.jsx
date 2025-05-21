import React from 'react';
import FormulaireInscription from '../components/auth/formulaireInscription';
import Header from '../components/header';

const Inscription = () => {
  return (
    <>
        <Header /> 
      <main>
        <FormulaireInscription />
      </main>
    </>
  );
};

export default Inscription;
