import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../services/serviceAuth';
import { useRessource } from '../../pages/RessourceContext.jsx'; 
import { User, LogOut, Sparkles, Menu, X } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedCategory, setSelectedCategory, categoriesOrder } = useRessource();
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

  // Fermer menu quand on clique sur un lien (mobile)
  const handleLinkClick = () => {
    if (menuOpen) setMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-indigo-600 text-xl hover:text-indigo-700 transition"
          onClick={handleLinkClick}
        >
          <Sparkles className="w-6 h-6" />
          PsyConnect
        </Link>

        {/* Hamburger menu (mobile) */}
        <button
          className="md:hidden text-gray-700 hover:text-indigo-600 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Menu (desktop + mobile) */}
        <ul
          className={`flex-col md:flex-row md:flex items-center md:space-x-6 md:static absolute top-full left-0 right-0 bg-white md:bg-transparent border-t md:border-0 border-gray-200 md:shadow-none shadow-md md:max-h-full max-h-0 overflow-hidden transition-[max-height] duration-300 ease-in-out ${
            menuOpen ? 'max-h-96' : 'max-h-0'
          }`}
        >
          <li>
            <Link
              to="/"
              className="block px-4 py-2 hover:text-indigo-600 transition"
              onClick={handleLinkClick}
            >
              Accueil
            </Link>
          </li>

          {currentRole === 'UTILISATEUR' && (
            <li className="px-4 py-2">
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="bg-white border border-gray-300 rounded px-2 py-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {categoriesOrder.map(cat => (
                  <option key={cat.key} value={cat.key}>{cat.title}</option>
                ))}
              </select>
            </li>
          )}

          <li>
            <Link
              to="/forum"
              className="block px-4 py-2 hover:text-indigo-600 transition"
              onClick={handleLinkClick}
            >
              Forum
            </Link>
          </li>

          {currentRole && (
            <>
              {currentRole === 'UTILISATEUR' && (
                <li>
                  <Link
                    to="/tableauUtilisateur"
                    className="flex items-center gap-1 px-4 py-2 hover:text-indigo-600 transition"
                    onClick={handleLinkClick}
                  >
                    <User className="w-4 h-4" /> Espace Utilisateur
                  </Link>
                </li>
              )}

              {isProfessional(currentRole) && (
                <li>
                  <Link
                    to="/tableauProfessionnel"
                    className="block px-4 py-2 hover:text-indigo-600 transition"
                    onClick={handleLinkClick}
                  >
                    Espace Pro
                  </Link>
                </li>
              )}

              {currentRole === 'ADMIN' && (
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2 hover:text-indigo-600 transition"
                    onClick={handleLinkClick}
                  >
                    Admin
                  </Link>
                </li>
              )}

              {currentRole === 'UTILISATEUR' && !isPremiumUser(currentRole) && (
                <li>
                  <Link
                    to="/devenir-premium"
                    className="block bg-yellow-400 text-yellow-900 px-4 py-2 rounded hover:bg-yellow-300 transition m-2 md:m-0"
                    onClick={handleLinkClick}
                  >
                    ✨ Devenir Premium
                  </Link>
                </li>
              )}

              <li>
                <button
                  onClick={() => {
                    handleDeconnexion();
                    handleLinkClick();
                  }}
                  className="flex items-center gap-1 text-red-500 hover:text-red-600 font-semibold px-4 py-2 focus:outline-none w-full text-left"
                >
                  <LogOut className="w-4 h-4" /> Déconnexion
                </button>
              </li>
            </>
          )}

          {!currentRole && (
            <>
              <li>
                <Link
                  to="/connexion"
                  className="block px-4 py-2 hover:text-indigo-600 transition"
                  onClick={handleLinkClick}
                >
                  Connexion
                </Link>
              </li>
              <li>
                <Link
                  to="/inscription"
                  className="block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition m-2 md:m-0"
                  onClick={handleLinkClick}
                >
                  Inscription
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
