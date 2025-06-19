import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../services/serviceAuth';
import { BookOpen, LogOut, User, Brain, Crown } from 'lucide-react';

const Header = () => {
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
  const baseLinkClass = "text-indigo-600 no-underline hover:text-indigo-700 transition";

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-md h-[70px]">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center h-full">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-indigo-600">
          <Brain className="w-7 h-7" />
          PsyConnect
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm font-semibold relative">
          <Link to="/" className={baseLinkClass}>🏠 Accueil</Link>
          <Link to="/apropos" className={baseLinkClass}>ℹ️ À propos</Link>
          <Link to="/ressources" className={`${baseLinkClass} flex items-center gap-1`}>
            <BookOpen className="w-4 h-4" /> Ressources
          </Link>
          <Link to="/forum" className={baseLinkClass}>💬 Forum</Link>

          {currentRole === 'UTILISATEUR' && (
            <>
              <Link to="/tableauUtilisateur" className={`${baseLinkClass} flex items-center gap-1`}>
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

          {isProfessional(currentRole) && (
            <>
              <Link to="/tableauProfessionnel" className={baseLinkClass}>👨‍⚕️ Espace Pro</Link>
              <button
                onClick={handleDeconnexion}
                className="flex items-center gap-1 text-red-500 hover:underline"
              >
                <LogOut className="w-4 h-4" /> Déconnexion
              </button>
            </>
          )}

          {currentRole === 'ADMIN' && (
            <>
              <Link to="/admin/dashboard" className={baseLinkClass}>🛠 Admin</Link>
              <button
                onClick={handleDeconnexion}
                className="flex items-center gap-1 text-red-500 hover:underline"
              >
                <LogOut className="w-4 h-4" /> Déconnexion
              </button>
            </>
          )}

          {currentRole && !isPremiumUser(currentRole) && (
            <Link to="/devenir-premium" className="text-yellow-600 hover:text-yellow-700 flex items-center gap-1">
              <Crown className="w-4 h-4" /> Premium
            </Link>
          )}

          {/* Menu personnalisé si non connecté */}
          {!currentRole && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-indigo-600 text-xl hover:text-indigo-800"
              >
                👤
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                  <button
                    onClick={() => { navigate('/connexion'); setMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-sm text-indigo-700 hover:bg-indigo-100"
                  >
                    Connexion
                  </button>
                  <button
                    onClick={() => { navigate('/inscription'); setMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-sm text-indigo-700 hover:bg-indigo-100"
                  >
                    Inscription
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
