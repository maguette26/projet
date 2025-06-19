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
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-indigo-600 font-semibold text-xl flex items-center gap-1 select-none hover:text-indigo-700 transition">
          <Sparkles className="w-6 h-6" />
          PsyConnect
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-6 text-indigo-600 text-sm font-medium">
          <Link to="/" className="hover:text-indigo-700 transition">Accueil</Link>

          {currentRole === 'UTILISATEUR' && (
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="bg-white border border-indigo-300 text-indigo-600 px-2 py-1 rounded-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-400"
            >
              {categoriesOrder.map(cat => (
                <option key={cat.key} value={cat.key}>{cat.title}</option>
              ))}
            </select>
          )}

          <Link to="/forum" className="hover:text-indigo-700 transition">Forum</Link>

          {currentRole && (
            <>
              {currentRole === 'UTILISATEUR' && (
                <Link to="/tableauUtilisateur" className="flex items-center gap-1 hover:text-indigo-700 transition" title="Espace Utilisateur">
                  <User className="w-4 h-4" /> Espace Utilisateur
                </Link>
              )}

              {isProfessional(currentRole) && (
                <Link to="/tableauProfessionnel" className="hover:text-indigo-700 transition">Espace Pro</Link>
              )}

              {currentRole === 'ADMIN' && (
                <Link to="/admin/dashboard" className="hover:text-indigo-700 transition">Admin</Link>
              )}

              {currentRole === 'UTILISATEUR' && !isPremiumUser(currentRole) && (
                <Link
                  to="/devenir-premium"
                  className="text-yellow-600 border border-yellow-600 px-3 py-1 rounded hover:bg-yellow-600 hover:text-white transition"
                >
                  ✨ Devenir Premium
                </Link>
              )}

              <button
                onClick={handleDeconnexion}
                className="text-red-600 hover:text-red-700 font-semibold focus:outline-none flex items-center gap-1"
                title="Déconnexion"
              >
                <LogOut className="w-4 h-4" /> Déconnexion
              </button>
            </>
          )}

          {!currentRole && (
            <>
              <Link to="/connexion" className="hover:text-indigo-700 transition">Connexion</Link>
              <Link
                to="/inscription"
                className="text-white bg-indigo-600 px-4 py-1.5 rounded hover:bg-indigo-700 transition"
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
