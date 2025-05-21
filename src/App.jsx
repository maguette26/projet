// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Accueil from './pages/Accueil.jsx';
import Connexion from './pages/Connexion.jsx';
import TableauAdmin from './pages/TableauAdmin.jsx';
import TableauUtilisateur from './pages/TableauUtilisateur.jsx';
import TableauProfessionnel from './pages/TableauProfessionnel.jsx';
import Forum from './pages/Forum.jsx';
import Ressources from './pages/Ressources.jsx';
import Inscription from './pages/Inscription.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/admin" element={<TableauAdmin />} />
        <Route path="/utilisateur" element={<TableauUtilisateur />} />
        <Route path="/professionnel" element={<TableauProfessionnel />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/ressources" element={<Ressources />} />
        <Route path="/inscription" element={<Inscription />} />


        {/* Redirection pour toute route non reconnue */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
