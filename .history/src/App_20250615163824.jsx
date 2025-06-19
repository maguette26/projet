// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import AdminDashboard from './components/admin/AdminDashboard';
import DevenirPremium from './pages/DevenirPremium'; // <-- Importez la nouvelle page

import { RessourceProvider } from './pages/RessourceContext.jsx'; // Assurez-vous que le chemin et l'extension sont corrects
import ChatContainer from './components/ChatContainer.js';

function App() {
    return (
        
        <Router>
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
                    {/*<Route path="/admin/dashboard" element={<AdminDashboard />} />*/}

                    <Route path="/tableauUtilisateur" element={<TableauUtilisateur />} />
                    <Route path="/tableauProfessionnel" element={<TableauProfessionnel />} />
                    {/* Ajoutez d'autres routes si nécessaire */}
                     <Route path="/consultation/:consultationId/chat" element={<ChatContainer />} />
                </Routes>
            </RessourceProvider>
        </Router>
    );
}

export default App;
