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
import TableauAdmin  from './pages/TableauAdmin';
import TableauProfessionnel from './pages/TableauProfessionnel';
import Accueil from './pages/Accueil';
import  AdminDashboard from './components/admin/AdminDashboard';

// IMPORTANT : Importez votre composant du tableau de bord de l'administrateur
function App() {
    return (
        <Router>
         
                <Routes>
                    <Route path="/" element={<Accueil />} />
                    <Route path="/inscription" element={<Inscription />} />
                    <Route path="/inscription/utilisateur" element={<InscriptionUser />} />
                    <Route path="/inscription/professionnel" element={<InscriptionProfessionnel />} />
                    <Route path="/connexion" element={<Connexion />} />
                    <Route path="/ressources" element={<Ressources />} />
                    <Route path="/forum" element={<Forum />} />

                    {/* Routes des tableaux de bord */}
                    {/* Ancien TableauAdmin, peut être remplacé si AdminDashboard est la nouvelle route */}
                     <Route path="/tableauAdmin" element={<TableauAdmin />} /> 

                    {/* Nouvelle route pour le tableau de bord de l'ADMIN */}
                    <Route path="/admin/dashboard" element={<AdminDashboard/>} />

                    <Route path="/tableauUtilisateur" element={<TableauUtilisateur />} />
                    <Route path="/tableauProfessionnel" element={<TableauProfessionnel />} />
                    {/* Ajoutez d'autres routes si nécessaire */}
                </Routes>
           
        </Router>
    );
}

export default App;