// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Inscription from './pages/Inscription';
import InscriptionUser from './pages/InscriptionUser';
import InscriptionProfessionnel from './pages/InscriptionProfessionnel';
import Connexion from './pages/Connexion';
import Ressources from './pages/Ressources';
import Forum from './pages/Forum';
import TableauUtilisateur from './pages/TableauUtilisateur';
import TableauAdmin from './pages/TableauAdmin';
import TableauProfessionnel from './pages/TableauProfessionnel';
import Accueil from './pages/Accueil';
import DevenirPremium from './pages/DevenirPremium'; // <-- Importez la nouvelle page

import { RessourceProvider } from './pages/RessourceContext.jsx'; // Assurez-vous que le chemin et l'extension sont corrects
import APropos from './pages/APropos.jsx';
import ListeProfessionnels from './components/ListeProfessionnels.jsx';
import Page404 from './pages/Page404.jsx';
import ScrollToTop from './ScrollToTop.jsx';
import ListeControleBienEtre from './pages/ListeControleBienEtre.jsx';
import MiniDefiDecouverte from './pages/MiniDefiDecouverte.jsx';

function App() {
    return (
        <Router>
            <ScrollToTop />
            <RessourceProvider>
                <Routes>
                    <Route path="/" element={<Accueil />} />
                    <Route path="/inscription" element={<Inscription />} />
                    <Route path="/inscription/utilisateur" element={<InscriptionUser />} />
                    <Route path="/inscription/professionnel" element={<InscriptionProfessionnel />} />
                    <Route path="/connexion" element={<Connexion />} />
                    <Route path="/ressources" element={<Ressources />} />
                    <Route path="/forum" element={<Forum />} />
                    <Route path="/devenir-premium" element={<DevenirPremium />} /> {/* <-- Nouvelle route */}

                    {/* Routes des tableaux de bord */}
                    <Route path="/tableauAdmin" element={<TableauAdmin />} /> 
                     
                    <Route path="/tableauUtilisateur" element={<TableauUtilisateur />} />
                    <Route path="/tableauProfessionnel" element={<TableauProfessionnel />} />
                    {/* Ajoutez d'autres routes si nécessaire */}
                    <Route path="/apropos" element={<APropos />} />
                    <Route path="/reservation" element={<ListeProfessionnels/>} />
                      <Route path="/payment-cancel" element={<Navigate to="/" replace />} />
                      <Route path="*" element={<Page404/>} />
                       <Route path="/mini-defi-gratuite" element={<MiniDefiGratuite />} />
          <Route path="/liste-controle-bien-etre" element={<ListeControleBienEtre />} />
          <Route path="/mini-defi-decouverte" element={<MiniDefiDecouverte />} />
          <Route path="/guide-fixateur-limites" element={<GuideFixateurLimites />} />
          <Route path="/auto-evaluation-basique" element={<AutoEvaluationBasique />} />
                </Routes>
            </RessourceProvider>
        </Router>
    );
}

export default App;
