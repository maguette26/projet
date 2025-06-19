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
      className="bg-white shadow sticky top-0 z-50 border-b"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
          <Brain className="w-6 h-6 text-indigo-500" />
          PsyConnect
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link to="/" className="hover:text-indigo-600">🏠 Accueil</Link>
          <Link to="/ressources" className="flex items-center gap-1 hover:text-indigo-600">
            <BookOpen className="w-4 h-4" /> Ressources
          </Link>
          <Link to="/forum" className="hover:text-indigo-600">💬 Forum</Link>

          {currentRole === 'UTILISATEUR' && (
            <Link to="/tableauUtilisateur" className="flex items-center gap-1 hover:text-indigo-600">
              <User className="w-4 h-4" /> Espace Utilisateur
            </Link>
          )}
          {isProfessional(currentRole) && (
            <Link to="/tableauProfessionnel" className="hover:text-indigo-600">👨‍⚕️ Espace Pro</Link>
          )}
          {currentRole === 'ADMIN' && (
            <Link to="/admin/dashboard" className="hover:text-indigo-600">🛠 Admin</Link>
          )}
          {currentRole && !isPremiumUser(currentRole) && (
            <Link to="/devenir-premium" className="bg-yellow-400 text-white px-3 py-1.5 rounded-full hover:bg-yellow-500 transition">
              ✨ Premium
            </Link>
          )}

          {currentRole ? (
            <button
              onClick={handleDeconnexion}
              className="flex items-center gap-1 text-red-500 hover:underline"
            >
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          ) : (
            <>
              <Link to="/connexion" className="hover:text-indigo-600">Connexion</Link>
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
