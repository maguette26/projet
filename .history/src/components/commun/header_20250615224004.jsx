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
      setCurrentRole(null);
      navigate('/connexion');
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
      className="sticky top-0 z-50 backdrop-blur-md bg-white/60 dark:bg-gray-900/60 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo stylé */}
        <Link to="/" className="flex items-center gap-2 select-none">
          <Brain className="w-8 h-8 text-indigo-600 dark:text-indigo-400 drop-shadow-md" />
          <h1 className="text-indigo-700 dark:text-indigo-300 text-3xl font-extrabold tracking-tight font-sans" style={{ letterSpacing: '-0.03em' }}>
            Psy<span className="text-indigo-500 dark:text-indigo-600">Connect</span>
          </h1>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8 text-gray-700 dark:text-gray-300 font-medium text-base">
          <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
            🏠 <span>Accueil</span>
          </Link>
          <Link to="/ressources" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
            <BookOpen className="w-5 h-5" /> Ressources
          </Link>
          <Link to="/forum" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
            💬 Forum
          </Link>

          {currentRole === 'UTILISATEUR' && (
            <Link to="/tableauUtilisateur" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
              <User className="w-5 h-5" /> Espace Utilisateur
            </Link>
          )}
          {isProfessional(currentRole) && (
            <Link to="/tableauProfessionnel" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
              👨‍⚕️ Espace Pro
            </Link>
          )}
          {currentRole === 'ADMIN' && (
            <Link to="/admin/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              🛠 Admin
            </Link>
          )}
          {currentRole && !isPremiumUser(currentRole) && (
            <Link
              to="/devenir-premium"
              className="bg-yellow-400 text-yellow-900 px-4 py-1.5 rounded-full font-semibold hover:bg-yellow-500 hover:text-white transition-shadow shadow-sm"
            >
              ✨ Premium
            </Link>
          )}

          {currentRole ? (
            <button
              onClick={handleDeconnexion}
              className="flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors font-semibold"
              title="Déconnexion"
            >
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          ) : (
            <>
              <Link
                to="/connexion"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Connexion
              </Link>
              <Link
                to="/inscription"
                className="bg-indigo-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-indigo-700 transition-shadow shadow-md"
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
