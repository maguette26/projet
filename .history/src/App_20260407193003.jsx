// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Chatbot from './components/Chatbot';
import Header from './components/commun/header'; // ✅ ton Header réel

import Accueil from './pages/Accueil';
import Inscription from './pages/Inscription';
import InscriptionUser from './pages/InscriptionUser';
import InscriptionProfessionnel from './pages/InscriptionProfessionnel';
import Connexion from './pages/Connexion';
import Ressources from './pages/Ressources';
import Forum from './pages/Forum';
import TableauUtilisateur from './pages/TableauUtilisateur';
import TableauAdmin from './pages/TableauAdmin';
import TableauProfessionnel from './pages/TableauProfessionnel';
import DevenirPremium from './pages/DevenirPremium';
import APropos from './pages/APropos';
import ListeProfessionnels from './components/ListeProfessionnels';
import MiniDefiGratuite from './pages/MiniDefiGratuite';
import MiniDefiDecouverte from './pages/MiniDefiDecouverte';
import GuideFixateurLimites from './pages/GuideFixateurLimites';
import AutoEvaluationBasique from './pages/AutoEvaluationBasique';
import EmotionAnalyzer from './pages/EmotionAnalyzer';
import ListeControleBienEtre from './pages/ListeControleBienEtre';
import Page404 from './pages/Page404';
import ScrollToTop from './ScrollToTop';
import { RessourceProvider } from './pages/RessourceContext';
import ChatConsultation from './pages/ChatConsultation';

function AppWrapper() {
 // const location = useLocation();

  // ✅ état pour contrôler l'ouverture du Chatbot
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <RessourceProvider>
      {/* ✅ Header avec bouton PsyBot */}
      <Header onOpenChat={() => setChatOpen(true)} />

      

      <Routes>
        <Route path="/chat-consultation/:consultationId" element={<ChatConsultation />} />
        <Route path="/chatbot" element={<Chatbot  />} />
        <Route path="/" element={<Accueil />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/inscription/utilisateur" element={<InscriptionUser />} />
        <Route path="/inscription/professionnel" element={<InscriptionProfessionnel />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/ressources" element={<Ressources />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/devenir-premium" element={<DevenirPremium />} />
        <Route path="/tableauAdmin" element={<TableauAdmin />} />
        <Route path="/tableauUtilisateur" element={<TableauUtilisateur />} />
        <Route path="/tableauProfessionnel" element={<TableauProfessionnel />} />
        <Route path="/apropos" element={<APropos />} />
        <Route path="/reservation" element={<ListeProfessionnels />} />
        <Route path="/mini-defi-gratuite" element={<MiniDefiGratuite />} />
        <Route path="/mini-defi-decouverte" element={<MiniDefiDecouverte />} />
        <Route path="/guide-fixateur-limites" element={<GuideFixateurLimites />} />
        <Route path="/auto-evaluation-basique" element={<AutoEvaluationBasique />} />
        <Route path="/analyse-emotionnelle" element={<EmotionAnalyzer />} />
        <Route path="/liste-controle-bien-etre" element={<ListeControleBienEtre />} />
        <Route path="/payment-cancel" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </RessourceProvider>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppWrapper />
    </Router>
  );
}

export default App;
