import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../services/serviceAuth';
import { BookOpen, LogOut, User, Brain, Info, MessageCircle, UserCog, Crown, ChevronDown } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState(localStorage.getItem('role'));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedRole = localStorage.getItem('role');
      setCurrentRole(updatedRole);
      if (!updatedRole) navigate('/connexion');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate]);

  // Fermer le dropdown si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        <nav className="flex items-center gap-6 text-sm font-semibold">
          <Link to="/" className={baseLinkClass}>
            <UserCog className="w-4 h-4 inline-block mr-1" />
            Accueil
          </Link>
          <Link to="/apropos" className={baseLinkClass}>
            <Info className="w-4 h-4 inline-block mr-1" />
            À propos de nous
          </Link>
          <Link to="/ressources" className={`${baseLinkClass} flex items-center gap-1`}>
            <BookOpen className="w-4 h-4" /> Ressources
          </Link>
          <Link to="/forum" className={baseLinkClass}>
            <MessageCircle className="w-4 h-4 inline-block mr-1" />
            Forum
          </Link>

          {currentRole === 'UTILISATEUR' && (
            <>
              <Link to="/tableauUtilisateur" className={baseLinkClass + " flex items-center gap-1"}>
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
              <Link to="/tableauProfessionnel" className={baseLinkClass}>
                <UserCog className="w-4 h-4 inline-block mr-1" />
                Espace Pro
              </Link>
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
              <Link to="/admin/dashboard" className={baseLinkClass}>
                <UserCog className="w-4 h-4 inline-block mr-1" />
                Admin
              </Link>
              <button
                onClick={handleDeconnexion}
                className="flex items-center gap-1 text-red-500 hover:underline"
              >
                <LogOut className="w-4 h-4" /> Déconnexion
              </button>
            </>
          )}

          {currentRole && !isPremiumUser(currentRole) && (
            <Link to="/devenir-premium" className="text-yellow-500 hover:underline flex items-center gap-1">
              <Crown className="w-4 h-4" />
              Premium
            </Link>
          )}

          {/* Si pas connecté, menu déroulant custom */}
          {!currentRole && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 focus:outline-none"
              >
                Se connecter / S'inscrire
                <ChevronDown className="w-4 h-4" />
              </button>
              {dropdownOpen && (
                <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50">
                  <li>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/connexion");
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-indigo-100"
                    >
                      Connexion
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/inscription");
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-indigo-100"
                    >
                      Inscription
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
