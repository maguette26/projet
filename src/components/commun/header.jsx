// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    // Le rôle peut être 'ADMIN', 'UTILISATEUR', 'PSYCHIATRE', ou 'PSYCHOLOGUE'
    const role = localStorage.getItem('role'); 

    const handleDeconnexion = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/connexion');
    };

    // Fonction utilitaire pour vérifier si le rôle est un professionnel (Psychiatre ou Psychologue)
    const isProfessional = (userRole) => {
        return userRole === 'PSYCHIATRE' || userRole === 'PSYCHOLOGUE';
    };

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-indigo-600 tracking-tight">
                    PsyConnect
                </Link>

                {/* Navigation principale */}
                <nav className="hidden md:flex items-center space-x-6 text-gray-700 text-sm font-medium">
                    <Link to="/" className="hover:text-indigo-600 transition">Accueil</Link>
                    <Link to="/ressources" className="hover:text-indigo-600 transition">Ressources</Link>
                    <Link to="/forum" className="hover:text-indigo-600 transition">Forum</Link>

                    {token ? (
                        // L'utilisateur est connecté : Afficher les liens spécifiques au rôle et le bouton de déconnexion
                        <>
                            {role === 'UTILISATEUR' && (
                                // Pour un utilisateur simple, lien vers son tableau de bord
                                <Link to="/tableauUtilisateur" className="hover:text-indigo-600 transition">Espace Utilisateur</Link>
                            )}
                            {isProfessional(role) && ( 
                                // Pour un professionnel (Psychiatre ou Psychologue), lien vers l'espace Pro
                                <Link to="/tableauProfessionnel" className="hover:text-indigo-600 transition">Espace Pro</Link>
                            )}
                    
                            
                            {/* Le bouton de déconnexion est toujours présent si connecté */}
                            <button onClick={handleDeconnexion} className="ml-4 text-red-600 hover:underline">Déconnexion</button>
                        </>
                    ) : (
                        // L'utilisateur n'est PAS connecté : Afficher les liens de connexion et d'inscription
                        <>
                            <Link to="/connexion" className="hover:text-indigo-600 transition">Connexion</Link>
                            <Link to="/inscription" className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition ml-2"> Inscription </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;