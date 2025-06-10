// src/components/commun/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../services/serviceAuth';
import { useRessource } from '../../pages/RessourceContext.jsx'; 

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    
    const { selectedCategory, setSelectedCategory, categoriesOrder } = useRessource();

    const [currentRole, setCurrentRole] = useState(localStorage.getItem('role'));

    useEffect(() => {
        const handleStorageChange = () => {
            const updatedRole = localStorage.getItem('role');
            setCurrentRole(updatedRole);

            if (!updatedRole) {
                console.log("Rôle non trouvé dans localStorage, redirection vers /connexion.");
                navigate('/connexion');
            }
        };

        window.addEventListener('storage', handleStorageChange);
        setCurrentRole(localStorage.getItem('role'));

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [navigate]);

    const handleDeconnexion = async () => {
        console.log("handleDeconnexion: Tentative de déconnexion...");
        try {
            await logout(); 
            console.log("handleDeconnexion: Appel à logout terminé.");
        } catch (error) {
            console.error("handleDeconnexion: Erreur lors de la déconnexion:", error);
        }
    };

    const isProfessional = (userRole) => {
        return userRole === 'PSYCHIATRE' || userRole === 'PSYCHOLOGUE';
    };

    // Fonction pour vérifier si l'utilisateur a un rôle premium (incluant ADMIN)
    const isPremiumUser = (userRole) => {
        return userRole === 'PREMIUM' || userRole === 'ADMIN'; 
    };

    const handleCategoryChange = (e) => {
        const newCategory = e.target.value;
        setSelectedCategory(newCategory); 
        
        // Si l'utilisateur n'est pas déjà sur la page /ressources, le rediriger
        if (location.pathname !== '/ressources') {
            navigate('/ressources');
        }
    };

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-indigo-600 tracking-tight mb-2 md:mb-0">
                    PsyConnect
                </Link>

                {/* Navigation principale */}
                <nav className="flex flex-wrap justify-center md:flex-nowrap items-center space-x-4 md:space-x-6 text-gray-700 text-sm font-medium">
                    <Link to="/" className="hover:text-indigo-600 transition">Accueil</Link>
                    
                    {/* Menu déroulant des Ressources - VISIBLE SEULEMENT POUR LES UTILISATEURS DU RÔLE 'UTILISATEUR' */}
                    {currentRole === 'UTILISATEUR' && ( 
                         <div className="relative">
                            <label htmlFor="resource-category-select" className="sr-only">Filtrer les ressources</label>
                            <select
                                id="resource-category-select"
                                className="bg-white text-gray-700 py-1 px-3 rounded-md border border-gray-300 hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                            >
                                {categoriesOrder.map(cat => (
                                    <option key={cat.key} value={cat.key}>
                                        {cat.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                   
                    <Link to="/forum" className="hover:text-indigo-600 transition">Forum</Link>

                    {/* Liens conditionnels en fonction du rôle */}
                    {currentRole ? (
                        <>
                            {currentRole === 'UTILISATEUR' && (
                                <Link to="/tableauUtilisateur" className="hover:text-indigo-600 transition">Espace Utilisateur</Link>
                            )}
                            {isProfessional(currentRole) && (
                                <Link to="/tableauProfessionnel" className="hover:text-indigo-600 transition">Espace Pro</Link>
                            )}
                            {currentRole === 'ADMIN' && (
                                <Link to="/admin/dashboard" className="hover:text-indigo-600 transition">Admin</Link>
                            )}

                            {/* Lien "Devenir Premium" - visible si connecté et non premium (ni pro, ni admin) */}
                            {currentRole === 'UTILISATEUR' && !isPremiumUser(currentRole) && (
                                <Link 
                                    to="/devenir-premium" 
                                    className="bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600 transition ml-2"
                                >
                                    Devenir Premium ✨
                                </Link>
                            )}

                            <button
                                onClick={handleDeconnexion}
                                className="ml-4 text-red-600 hover:underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                            >
                                Déconnexion
                            </button>
                        </>
                    ) : (
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
