import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../services/serviceAuth';
import { BookOpen, LogOut, Sparkles, User, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
      console.error("Erreur de déconnexion :", error);
    }
  };

  const isProfessional = (role) => ['PSYCHOLOGUE', 'PSYCHIATRE'].includes(role);
  const isPremiumUser = (role) => ['PREMIUM', 'ADMIN'].includes(role);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-900 shadow-md sticky top-0 z-50 border-b border-gray-700"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 select-none">
          <Brain className="w-7 h-7 text-indigo-400" />
          <h1
            className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-500 to-indigo-700 
            font-extrabold text-2xl tracking-tight"
          >
            PsyConnect
          </h1>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-300">
          <Link
            to="/"
            className="hover:text-indigo-400 transition-colors duration-200"
          >
            🏠 Accueil
          </Link>
          <Link
            to="/ressources"
            className="flex items-center gap-1 hover:text-indigo-400 transition-colors duration-200"
          >
            <BookOpen className="w-4 h-4" /> Ressources
          </Link>
          <Link
            to="/forum"
            className="hover:text-indigo-400 transition-colors duration-200"
          >
            💬 Forum
          </Link>

          {currentRole === 'UTILISATEUR' && (
            <Link
              to="/tableauUtilisateur"
              className="flex items-center gap-1 hover:text-indigo-400 transition-colors duration-200"
            >
              <User className="w-4 h-4" /> Espace Utilisateur
            </Link>
          )}
          {isProfessional(currentRole) && (
            <Link
              to="/tableauProfessionnel"
              className="hover:text-indigo-400 transition-colors duration-200"
            >
              👨‍⚕️ Espace Pro
            </Link>
          )}
          {currentRole === 'ADMIN' && (
            <Link
              to="/admin/dashboard"
              className="hover:text-indigo-400 transition-colors duration-200"
            >
              🛠 Admin
            </Link>
          )}
          {currentRole && !isPremiumUser(currentRole) && (
            <Link
              to="/devenir-premium"
              className="bg-yellow-500 text-yellow-900 px-3 py-1.5 rounded-full font-semibold shadow-md
              hover:bg-yellow-400 hover:text-yellow-950 transition duration-200"
            >
              ✨ Premium
            </Link>
          )}
          {currentRole ? (
            <button
              onClick={handleDeconnexion}
              className="flex items-center gap-1 text-red-500 hover:text-red-400 font-semibold transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          ) : (
            <>
              <Link
                to="/connexion"
                className="hover:text-indigo-400 transition-colors duration-200"
              >
                Connexion
              </Link>
              <Link
                to="/inscription"
                className="bg-indigo-600 text-white px-4 py-2 rounded-full font-semibold shadow-md
                hover:bg-indigo-700 transition duration-200"
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
