import React from 'react';
import SuiviHumeur from '../components/utilisateur/SuiviHumeur';
import FormulaireProfil from '../components/utilisateur/FormulaireProfil';
import PiedPage from '../components/commun/PiedPage';
import Header from '../components/header';


const TableauUtilisateur = () => {
  return (
    <>
      <Header /> 
      <main style={{ padding: '20px' }}>
        <h1>Tableau de bord Utilisateur</h1>
        <SuiviHumeur />
        <FormulaireProfil />
      </main>
      <PiedPage />
    </>
  );
};

export default TableauUtilisateur;
