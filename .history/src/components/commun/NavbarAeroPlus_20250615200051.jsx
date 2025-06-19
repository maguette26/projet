import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../services/serviceAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartPulse, Home, BookOpen, MessageCircle, UserCheck, Star, LogOut, Menu, X } from 'lucide-react';

// Ce composant reçoit les props nécessaires pour la catégorie
const NavbarAeroPlus = ({ selectedCategory, setSelectedCategory, categoriesOrder }) => {
  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState(localStorage.getItem('role'));
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedRole = localStorage.getItem('role');
      setCurrentRole(updatedRole);
      if (!updatedRole) navigate('/connexion');
    };

    window.addEventListener('storage', handleStorageChange);
    setCurrentRole(localStorage.getItem('role'));

    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate]);

  const handleDeconnexion = async () => {
    try {
      await logout();
      setCurrentRole(null);
      navigate('/connexion');
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const isProfessional = (role) => ['PSYCHOLOGUE', 'PSYCHIATRE'].includes(role);
  const isPremiumUser = (role) => ['PREMIUM', 'ADMIN'].includes(role);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    if (window.location.pathname !== '/ressources') navigate('/ressources');
  };

  // Animation variants pour le menu mobile
  const menuVariants = {
    hidden: { opacity: 0, x: '100%' },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: '100%', transition: { duration: 0.2 } },
  };

  return (
    <nav className="bg-white bg-opacity-80 backdrop-blur-md sticky top-0 z-50 shadow-md border-b border-indigo-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 select-none">
          <HeartPulse className="w-7 h-7 text-indigo-600 animate-pulse" />
          <span className="text-indigo-700 font-extrabold text-2xl tracking-wide">
            PsyConnect
          </span>
        </Link>

        {/* Menu desktop */}
        <ul className="hidden md:flex items-center gap-8 text-indigo-700 font-semibold text-sm">
          <li>
            <Link to="/" className="flex items-center gap-1 hover:text-indigo-500 transition">
              <Home className="w-5 h-5" />
              Accueil
            </Link>
          </li>
          <li>
            <Link to="/forum" className="flex items-center gap-1 hover:text-indigo-500 transition">
              <MessageCircle className="w-5 h-5" />
              Forum
            </Link>
          </li>

          {/* Filtre catégorie uniquement utilisateur */}
          {currentRole === 'UTILISATEUR' && (
            <li>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="bg-white border border-indigo-300 text-indigo-700 py-1 px-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                aria-label="Filtrer les ressources par catégorie"
              >
                {categoriesOrder.map((cat) => (
                  <option key={cat.key} value={cat.key}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </li>
          )}

          {isProfessional(currentRole) && (
            <li>
              <Link to="/tableauProfessionnel" className="flex items-center gap-1 hover:text-indigo-500 transition">
                <UserCheck className="w-5 h-5" />
                Espace Pro
              </Link>
            </li>
          )}

          {(currentRole === 'UTILISATEUR' || isPremiumUser(currentRole)) && (
            <li>
              <Link to="/tableauUtilisateur" className="flex items-center gap-1 hover:text-indigo-500 transition">
                <UserCheck className="w-5 h-5" />
                Mon Espace
              </Link>
            </li>
          )}

          {currentRole === 'ADMIN' && (
            <li>
              <Link to="/admin/dashboard" className="flex items-center gap-1 hover:text-indigo-500 transition">
                <Star className="w-5 h-5" />
                Admin
              </Link>
            </li>
          )}
        </ul>

        {/* Bouton déconnexion desktop */}
        <div className="hidden md:flex items-center gap-4">
          {currentRole ? (
            <button
              onClick={handleDeconnexion}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-400 font-semibold text-sm transition"
            >
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          ) : (
            <Link
              to="/connexion"
              className="text-indigo-600 hover:text-indigo-400 font-semibold text-sm transition"
            >
              Connexion
            </Link>
          )}
        </div>

        {/* Hamburger mobile */}
        <button
          aria-label="Menu"
          className="md:hidden text-indigo-700 hover:text-indigo-500 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menu mobile animé */}
      <AnimatePresence>
        {menuOpen && (
          <motion.ul
            key="mobileMenu"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
            className="md:hidden fixed top-16 right-0 w-56 bg-white shadow-lg border border-indigo-200 rounded-l-lg py-4 flex flex-col gap-3 px-6 z-50"
          >
            <li>
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-indigo-700 font-semibold hover:text-indigo-500 transition"
              >
                <Home className="w-5 h-5" />
                Accueil
              </Link>
            </li>

            <li>
              <Link
                to="/forum"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-indigo-700 font-semibold hover:text-indigo-500 transition"
              >
                <MessageCircle className="w-5 h-5" />
                Forum
              </Link>
            </li>

            {currentRole === 'UTILISATEUR' && (
              <li>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    handleCategoryChange(e);
                    setMenuOpen(false);
                  }}
                  className="w-full bg-white border border-indigo-300 text-indigo-700 py-1 px-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  aria-label="Filtrer les ressources par catégorie"
                >
                  {categoriesOrder.map((cat) => (
                    <option key={cat.key} value={cat.key}>
                      {cat.title}
                    </option>
                  ))}
                </select>
              </li>
            )}

            {isProfessional(currentRole) && (
              <li>
                <Link
                  to="/tableauProfessionnel"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-indigo-700 font-semibold hover:text-indigo-500 transition"
                >
                  <UserCheck className="w-5 h-5" />
                  Espace Pro
                </Link>
              </li>
            )}

            {(currentRole === 'UTILISATEUR' || isPremiumUser(currentRole)) && (
              <li>
                <Link
                  to="/tableauUtilisateur"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-indigo-700 font-semibold hover:text-indigo-500 transition"
                >
                  <UserCheck className="w-5 h-5" />
                  Mon Espace
                </Link>
              </li>
            )}

            {currentRole === 'ADMIN' && (
              <li>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-indigo-700 font-semibold hover:text-indigo-500 transition"
                >
                  <Star className="w-5 h-5" />
                  Admin
                </Link>
              </li>
            )}

            <li>
              {currentRole ? (
                <button
                  onClick={() => {
                    handleDeconnexion();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-400 font-semibold text-sm transition w-full justify-center"
                >
                  <LogOut className="w-5 h-5" />
                  Déconnexion
                </button>
              ) : (
                <Link
                  to="/connexion"
                  onClick={() => setMenuOpen(false)}
                  className="text-indigo-600 hover:text-indigo-400 font-semibold text-sm transition block text-center"
                >
                  Connexion
                </Link>
              )}
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavbarAeroPlus;
