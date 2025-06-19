import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../services/serviceAuth';
import { useRessource } from '../../pages/RessourceContext.jsx';
import { motion } from 'framer-motion';

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

    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate]);

  const handleDeconnexion = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erreur de déconnexion :", error);
    }
  };

  const isProfessional = (r) => r === 'PSYCHOLOGUE' || r === 'PSYCHIATRE';
  const isPremiumUser = (r) => r === 'PREMIUM' || r === 'ADMIN';

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    if (location.pathname !== '/ressources') navigate('/ressources');
  };

  return (
    <motion.header
      className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold text-indigo-600 tracking-tight hover:scale-105 transition">
          PsyConnect
        </Link>

        {/* Navigation */}
        <nav className="mt-2 md:mt-0 flex flex-wrap justify-center md:flex-nowrap items-center gap-4 text-gray-700 text-sm font-medium">
          <NavLink to="/" label="Accueil" />
          <NavLink to="/forum" label="Forum" />

          {currentRole === 'UTILISATEUR' && (
            <div className="relative">
              <label htmlFor="category" className="sr-only">Filtrer</label>
              <select
                id="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="text-sm py-1 px-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                {categoriesOrder.map((cat) => (
                  <option key={cat.key} value={cat.key}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {currentRole === 'UTILISATEUR' && (
            <NavLink to="/tableauUtilisateur" label="Espace Utilisateur" />
          )}
          {isProfessional(currentRole) && (
            <NavLink to="/tableauProfessionnel" label="Espace Pro" />
          )}
          {currentRole === 'ADMIN' && (
            <NavLink to="/admin/dashboard" label="Admin" />
          )}

          {currentRole === 'UTILISATEUR' && !isPremiumUser(currentRole) && (
            <Link
              to="/devenir-premium"
              className="bg-yellow-500 text-white text-sm px-3 py-1 rounded-full hover:bg-yellow-600 transition"
            >
              Devenir Premium ✨
            </Link>
          )}

          {currentRole ? (
            <button
              onClick={handleDeconnexion}
              className="text-red-600 text-sm hover:underline focus:outline-none"
            >
              Déconnexion
            </button>
          ) : (
            <>
              <NavLink to="/connexion" label="Connexion" />
              <Link
                to="/inscription"
                className="bg-indigo-600 text-white text-sm px-4 py-1.5 rounded-full hover:bg-indigo-700 transition"
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

// Composant lien animé
const NavLink = ({ to, label }) => (
  <Link
    to={to}
    className="relative inline-block px-1 after:block after:h-[2px] after:w-0 after:bg-indigo-600 after:transition-all hover:after:w-full"
  >
    {label}
  </Link>
);

export default Header;
