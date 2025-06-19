import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../services/serviceAuth';
import { useRessource } from '../../pages/RessourceContext.jsx'; 
import { motion } from 'framer-motion';
import { User, LogOut, Sparkles } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedCategory, setSelectedCategory, categoriesOrder } = useRessource();
  const [currentRole, setCurrentRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedRole = localStorage.getItem('role');
      setCurrentRole(updatedRole);
      if (!updatedRole) navigate('/connexion');
    };

    window.addEventListener('storage', handleStorageChange);
    setCurrentRole(localStorage.getItem('role'));

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);

  const handleDeconnexion = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const isProfessional = (role) => ['PSYCHOLOGUE', 'PSYCHIATRE'].includes(role);
  const isPremiumUser = (role) => ['PREMIUM', 'ADMIN'].includes(role);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    if (location.pathname !== '/ressources') navigate('/ressources');
  };

  return (
    <motion.header 
      initial={{ y: -80, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      transition={{ duration: 0.6 }}
      className="sticky top-4 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 py-3 bg-white rounded-xl shadow-md flex justify-between items-center border border-indigo-100">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold text-indigo-600 flex items-center gap-2 select-none hover:opacity-90 transition-opacity">
          <Sparkles className="w-7 h-7 text-indigo-500" />
          PsyConnect
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-6 text-gray-700 font-medium text-sm">
          <Link 
            to="/" 
            className="hover:text-indigo-600 transition-colors duration-200"
          >
            Accueil
          </Link>

          {currentRole === 'UTILISATEUR' && (
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="
                bg-indigo-50
                border border-indigo-300
                rounded-md
                px-3 py-1.5
                text-indigo-700
                cursor-pointer
                focus:outline-none focus:ring-2 focus:ring-indigo-400
                transition
                hover:bg-indigo-100
              "
            >
              {categoriesOrder.map(cat => (
                <option key={cat.key} value={cat.key}>{cat.title}</option>
              ))}
            </select>
          )}

          <Link 
            to="/forum" 
            className="hover:text-indigo-600 transition-colors duration-200"
          >
            Forum
          </Link>

          {/* Espace Utilisateur / Pro / Admin */}
          {currentRole && (
            <>
              {currentRole === 'UTILISATEUR' && (
                <Link
                  to="/tableauUtilisateur"
                  className="flex items-center gap-1 hover:text-indigo-600 transition-colors duration-200"
                  title="Espace Utilisateur"
                >
                  <User className="w-4 h-4" />
                  Espace Utilisateur
                </Link>
              )}

              {isProfessional(currentRole) && (
                <Link
                  to="/tableauProfessionnel"
                  className="hover:text-indigo-600 transition-colors duration-200"
                >
                  Espace Pro
                </Link>
              )}

              {currentRole === 'ADMIN' && (
                <Link
                  to="/admin/dashboard"
                  className="hover:text-indigo-600 transition-colors duration-200"
                >
                  Admin
                </Link>
              )}

              {/* Bouton Devenir Premium si utilisateur simple */}
              {currentRole === 'UTILISATEUR' && !isPremiumUser(currentRole) && (
                <Link
                  to="/devenir-premium"
                  className="
                    bg-yellow-400
                    text-white
                    px-4 py-1.5
                    rounded-full
                    font-semibold
                    shadow-md
                    hover:bg-yellow-500
                    transition-colors duration-200
                    select-none
                  "
                >
                  ✨ Devenir Premium
                </Link>
              )}

              {/* Bouton Déconnexion */}
              <button
                onClick={handleDeconnexion}
                className="flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors duration-200 font-semibold focus:outline-none"
                title="Se déconnecter"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </>
          )}

          {/* Connexion / Inscription si pas connecté */}
          {!currentRole && (
            <>
              <Link
                to="/connexion"
                className="hover:text-indigo-600 transition-colors duration-200"
              >
                Connexion
              </Link>

              <Link
                to="/inscription"
                className="
                  bg-indigo-600
                  text-white
                  px-5 py-2
                  rounded-full
                  font-semibold
                  shadow-md
                  hover:bg-indigo-700
                  transition-colors duration-200
                  select-none
                "
              >
                Inscription
              </Link>
            </>
          )}
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
