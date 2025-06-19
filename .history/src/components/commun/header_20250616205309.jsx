import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../services/serviceAuth';
import {
  BookOpen,
  LogOut,
  User,
  Brain,
  Crown,
  Home,
  Info,
  MessageCircle,
  UserCircle,
  Sun,
  Moon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState(localStorage.getItem('role'));
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedRole = localStorage.getItem('role');
      setCurrentRole(updatedRole);
      if (!updatedRole) navigate('/connexion');
    };
    window.addEventListener('storage', handleStorageChange);

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('mousedown', handleClickOutside);
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
  const baseLinkClass = "flex items-center gap-1 text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-100 transition";

  return (
    <>
      <header className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-md fixed top-0 w-full z-50 shadow-md h-[70px]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-indigo-600 dark:text-indigo-300">
            <Brain className="w-7 h-7" />
            PsyConnect
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6 text-sm font-semibold relative">
            <Link to="/" className={baseLinkClass}>
              <Home className="w-4 h-4" /> Accueil
            </Link>
            <Link to="/apropos" className={baseLinkClass}>
              <Info className="w-4 h-4" /> À propos
            </Link>
            <Link to="/ressources" className={baseLinkClass}>
              <BookOpen className="w-4 h-4" /> Ressources
            </Link>
            <Link to="/forum" className={baseLinkClass}>
              <MessageCircle className="w-4 h-4" /> Forum
            </Link>

            {/* Espace utilisateur */}
            {currentRole === 'UTILISATEUR' && (
              <>
                <Link to="/tableauUtilisateur" className={baseLinkClass}>
                  <User className="w-4 h-4" /> Espace Utilisateur
                </Link>
                <button
                  onClick={handleDeconnexion}
                  className="flex items-center gap-1 text-red-500 hover:underline"
                >
                  <LogOut className="w-4 h-4" /> Déconnexion
                </button>
              </>
            )}

            {/* Espace pro */}
            {isProfessional(currentRole) && (
              <>
                <Link to="/tableauProfessionnel" className={baseLinkClass}>
                  <User className="w-4 h-4" /> Espace Pro
                </Link>
                <button
                  onClick={handleDeconnexion}
                  className="flex items-center gap-1 text-red-500 hover:underline"
                >
                  <LogOut className="w-4 h-4" /> Déconnexion
                </button>
              </>
            )}

            {/* Espace admin */}
            {currentRole === 'ADMIN' && (
              <>
                <Link to="/admin/dashboard" className={baseLinkClass}>
                  <User className="w-4 h-4" /> Admin
                </Link>
                <button
                  onClick={handleDeconnexion}
                  className="flex items-center gap-1 text-red-500 hover:underline"
                >
                  <LogOut className="w-4 h-4" /> Déconnexion
                </button>
              </>
            )}

            {/* Premium */}
            {currentRole && !isPremiumUser(currentRole) && (
              <Link to="/devenir-premium" className="flex items-center gap-1 text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300">
                <Crown className="w-4 h-4" /> Premium
              </Link>
            )}

            {/* Switch thème */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-100 transition"
              title="Mode clair / sombre"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Sélecteur 👤 pour non-connecté */}
            {!currentRole && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-100 text-xl"
                >
                  <UserCircle className="w-6 h-6" />
                </button>
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50"
                    >
                      <button
                        onClick={() => { navigate('/connexion'); setMenuOpen(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-indigo-700 dark:text-indigo-200 hover:bg-indigo-100 dark:hover:bg-gray-700"
                      >
                        Connexion
                      </button>
                      <button
                        onClick={() => { navigate('/inscription'); setMenuOpen(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-indigo-700 dark:text-indigo-200 hover:bg-indigo-100 dark:hover:bg-gray-700"
                      >
                        Inscription
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Padding pour compenser le header fixe */}
      <div className="pt-[70px]" />
    </>
  );
};

export default Header;
