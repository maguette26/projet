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
      className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-500" /> PsyConnect
        </Link>

        <nav className="flex items-center space-x-4 text-gray-700 text-sm font-medium">
          <Link to="/" className="hover:text-indigo-600 transition">Accueil</Link>
          {currentRole === 'UTILISATEUR' && (
            <select
              className="bg-white text-gray-700 py-1 px-2 rounded-md border border-gray-300 hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              {categoriesOrder.map(cat => (
                <option key={cat.key} value={cat.key}>{cat.title}</option>
              ))}
            </select>
          )}
          <Link to="/forum" className="hover:text-indigo-600 transition">Forum</Link>

          {currentRole && (
            <>
              {currentRole === 'UTILISATEUR' && (
                <Link to="/tableauUtilisateur" className="flex items-center gap-1 hover:text-indigo-600 transition">
                  <User className="w-4 h-4" /> Espace Utilisateur
                </Link>
              )}
              {isProfessional(currentRole) && (
                <Link to="/tableauProfessionnel" className="hover:text-indigo-600 transition">Espace Pro</Link>
              )}
              {currentRole === 'ADMIN' && (
                <Link to="/admin/dashboard" className="hover:text-indigo-600 transition">Admin</Link>
              )}
              {currentRole === 'UTILISATEUR' && !isPremiumUser(currentRole) && (
                <Link to="/devenir-premium" className="bg-yellow-400 text-white px-3 py-1.5 rounded-full hover:bg-yellow-500 transition">
                  ✨ Devenir Premium
                </Link>
              )}
              <button
                onClick={handleDeconnexion}
                className="flex items-center gap-1 text-red-500 hover:underline focus:outline-none"
              >
                <LogOut className="w-4 h-4" /> Déconnexion
              </button>
            </>
          )}

          {!currentRole && (
            <>
              <Link to="/connexion" className="hover:text-indigo-600 transition">Connexion</Link>
              <Link to="/inscription" className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition">
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
