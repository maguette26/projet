import React from 'react';
import FormulaireDisponibilite from '../components/professionel/FormulaireDisponibilite';
import Messagerie from '../components/professionel/Messagerie';
import PiedPage from '../components/commun/PiedPage';
import Header from '../components/header';


const TableauProfessionnel = () => {
  return (
    <>
       <Header /> 
      <main style={{ padding: '20px' }}>
        <h1>Tableau de bord Professionnel</h1>
        <FormulaireDisponibilite />
        <Messagerie />
      </main>
      <PiedPage />
    </>
  );
};

export default TableauProfessionnel;
