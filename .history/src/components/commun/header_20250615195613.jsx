import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../services/serviceAuth';
import { useRessource } from '../../pages/RessourceContext.jsx';
import {
  Home,
  MessageCircle,
  User,
  Briefcase,
  Key,
  Star,
  DoorOpen,
  LogIn,
  Edit3,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';

const HeaderLucideResponsive = () => {
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
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      setMenuOpen(false);
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    }
  };

  const isProfessional = (role) => ['PSYCHOLOGUE', 'PSYCHIATRE'].includes(role);
  const isPremiumUser = (role) => ['PREMIUM', 'ADMIN'].includes(role);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    if (location.pathname !== '/ressources') navigate('/ressources');
    setMenuOpen(false);
  };

  const iconProps = {
    size: 20,
    className: 'text-purple-600 transition-transform duration-300 group-hover:scale-110',
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo with simple bounce animation */}
        <Link
          to="/"
          className="flex items-center gap-3 text-purple-600 text-3xl font-extrabold tracking-wider select-none hover:text-purple-800 transition duration-300 animate-bounce"
          aria-label="Accueil PsyConnect"
          onClick={() => setMenuOpen(false)}
        >
          <Sparkles size={28} className="text-purple-500" />
          <span>PsyConnect</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-purple-700 font-medium tracking-wide text-lg">
          <Link to="/" className="group flex items-center gap-2 hover:text-purple-900 transition duration-300">
            <Home {...iconProps} />
            Accueil
          </Link>

          {currentRole === 'UTILISATEUR' && (
            <select
              className="border border-purple-300 rounded-md px-3 py-1 text-purple-700 font-semibold hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              value={selectedCategory}
              onChange={handleCategoryChange}
              aria-label="Choisir catégorie de ressources"
            >
              {categoriesOrder.map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {cat.title}
                </option>
              ))}
            </select>
          )}

          <Link to="/forum" className="group flex items-center gap-2 hover:text-purple-900 transition duration-300">
            <MessageCircle {...iconProps} />
            Forum
          </Link>

          {currentRole && (
            <>
              {currentRole === 'UTILISATEUR' && (
                <Link
                  to="/tableauUtilisateur"
                  className="group flex items-center gap-2 hover:text-purple-900 transition duration-300"
                >
                  <User {...iconProps} />
                  Espace Utilisateur
                </Link>
              )}
              {isProfessional(currentRole) && (
                <Link
                  to="/tableauProfessionnel"
                  className="group flex items-center gap-2 hover:text-purple-900 transition duration-300"
                >
                  <Briefcase {...iconProps} />
                  Espace Pro
                </Link>
              )}
              {currentRole === 'ADMIN' && (
                <Link
                  to="/admin/dashboard"
                  className="group flex items-center gap-2 hover:text-purple-900 transition duration-300"
                >
                  <Key {...iconProps} />
                  Admin
                </Link>
              )}
              {currentRole === 'UTILISATEUR' && !isPremiumUser(currentRole) && (
                <Link
                  to="/devenir-premium"
                  className="bg-purple-600 text-white px-4 py-1.5 rounded-md shadow-md hover:bg-purple-700 transition duration-300 select-none flex items-center gap-2"
                >
                  <Star size={18} />
                  Devenir Premium
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="group flex items-center gap-2 text-purple-600 hover:text-purple-900 font-semibold focus:outline-none select-none"
                aria-label="Se déconnecter"
              >
                <DoorOpen {...iconProps} />
                Déconnexion
              </button>
            </>
          )}

          {!currentRole && (
            <>
              <Link
                to="/connexion"
                className="group flex items-center gap-2 hover:text-purple-900 transition duration-300"
              >
                <LogIn {...iconProps} />
                Connexion
              </Link>
              <Link
                to="/inscription"
                className="bg-purple-600 text-white px-4 py-1.5 rounded-md shadow-md hover:bg-purple-700 transition duration-300 select-none flex items-center gap-2"
              >
                <Edit3 size={18} />
                Inscription
              </Link>
            </>
          )}
        </nav>

        {/* Mobile hamburger button */}
        <button
          className="md:hidden p-2 rounded-md text-purple-700 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden bg-white shadow-inner border-t border-purple-200 px-6 py-4 flex flex-col gap-4 text-purple-700 font-medium tracking-wide">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 hover:text-purple-900 transition duration-300"
          >
            <Home size={20} />
            Accueil
          </Link>

          {currentRole === 'UTILISATEUR' && (
            <select
              className="border border-purple-300 rounded-md px-3 py-1 text-purple-700 font-semibold hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              value={selectedCategory}
              onChange={handleCategoryChange}
              aria-label="Choisir catégorie de ressources"
            >
              {categoriesOrder.map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {cat.title}
                </option>
              ))}
            </select>
          )}

          <Link
            to="/forum"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 hover:text-purple-900 transition duration-300"
          >
            <MessageCircle size={20} />
            Forum
          </Link>

          {currentRole && (
            <>
              {currentRole === 'UTILISATEUR' && (
                <Link
                  to="/tableauUtilisateur"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 hover:text-purple-900 transition duration-300"
                >
                  <User size={20} />
                  Espace Utilisateur
                </Link>
              )}
              {isProfessional(currentRole) && (
                <Link
                  to="/tableauProfessionnel"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 hover:text-purple-900 transition duration-300"
                >
                  <Briefcase size={20} />
                  Espace Pro
                </Link>
              )}
              {currentRole === 'ADMIN' && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 hover:text-purple-900 transition duration-300"
                >
                  <Key size={20} />
                  Admin
                </Link>
              )}

              {currentRole === 'UTILISATEUR' && !isPremiumUser(currentRole) && (
                <Link
                  to="/devenir-premium"
                  onClick={() => setMenuOpen(false)}
                  className="bg-purple-600 text-white px-4 py-1.5 rounded-md shadow-md hover:bg-purple-700 transition duration-300 select-none flex items-center gap-2"
                >
                  <Star size={18} />
                  Devenir Premium
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-900 font-semibold focus:outline-none select-none"
                aria-label="Se déconnecter"
              >
                <DoorOpen size={20} />
                Déconnexion
              </button>
            </>
          )}

          {!currentRole && (
            <>
              <Link
                to="/connexion"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 hover:text-purple-900 transition duration-300"
              >
                <LogIn size={20} />
                Connexion
              </Link>
              <Link
                to="/inscription"
                onClick={() => setMenuOpen(false)}
                className="bg-purple-600 text-white px-4 py-1.5 rounded-md shadow-md hover:bg-purple-700 transition duration-300 select-none flex items-center gap-2"
              >
                <Edit3 size={18} />
                Inscription
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default HeaderLucideResponsive;
