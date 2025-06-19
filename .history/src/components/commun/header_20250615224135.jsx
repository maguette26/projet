import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../services/serviceAuth';
import { BookOpen, LogOut, User, Brain } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentRole, setCurrentRole] = useState(localStorage.getItem('role'));
  const controls = useAnimation();
  const [scrolled, setScrolled] = useState(false);

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

  // Animation au scroll : on réduit la hauteur et change l'opacité du fond
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        if (!scrolled) {
          setScrolled(true);
          controls.start({ backgroundColor: 'rgba(99, 102, 241, 0.95)', height: 56, boxShadow: '0 2px 12px rgba(0,0,0,0.1)' });
        }
      } else {
        if (scrolled) {
          setScrolled(false);
          controls.start({ backgroundColor: 'rgba(255, 255, 255, 0.6)', height: 80, boxShadow: 'none' });
        }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [controls, scrolled]);

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
      animate={controls}
      initial={{ backgroundColor: 'rgba(255, 255, 255, 0.6)', height: 80 }}
      transition={{ type: 'spring', stiffness: 120, damping: 15 }}
      className="sticky top-0 z-50 backdrop-blur-md dark:backdrop-blur-sm"
      style={{
        backdropFilter: 'saturate(180%) blur(10px)',
        WebkitBackdropFilter: 'saturate(180%) blur(10px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 select-none">
          <Brain className={`w-8 h-8 text-indigo-600 dark:text-indigo-400 drop-shadow-md transition-transform ${scrolled ? 'scale-90' : 'scale-100'}`} />
          <h1
            className={`text-indigo-700 dark:text-indigo-300 font-extrabold tracking-tight font-sans transition-all duration-300 ${
              scrolled ? 'text-2xl' : 'text-3xl'
            }`}
            style={{ letterSpacing: '-0.03em' }}
          >
            Psy<span className="text-indigo-500 dark:text-indigo-600">Connect</span>
          </h1>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8 text-gray-700 dark:text-gray-300 font-medium text-base">
          <Link to="/" className="hover:text-indigo-300 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
            🏠 <span>Accueil</span>
          </Link>
          <Link to="/ressources" className="hover:text-indigo-300 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
            <BookOpen className="w-5 h-5" /> Ressources
          </Link>
          <Link to="/forum" className="hover:text-indigo-300 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
            💬 Forum
          </Link>

          {currentRole === 'UTILISATEUR' && (
            <Link to="/tableauUtilisateur" className="hover:text-indigo-300 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
              <User className="w-5 h-5" /> Espace Utilisateur
            </Link>
          )}
          {isProfessional(currentRole) && (
            <Link to="/tableauProfessionnel" className="hover:text-indigo-300 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
              👨‍⚕️ Espace Pro
            </Link>
          )}
          {currentRole === 'ADMIN' && (
            <Link to="/admin/dashboard" className="hover:text-indigo-300 dark:hover:text-indigo-400 transition-colors">
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
                className="hover:text-indigo-300 dark:hover:text-indigo-400 transition-colors"
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
