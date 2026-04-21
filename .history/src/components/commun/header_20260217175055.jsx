import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../services/serviceAuth';
import {
  HeartPulse,
  Home,
  Info,
  BookOpen,
  MessageCircle,
  Bot,
  User,
  CalendarCheck,
  Crown,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { CSSTransition } from 'react-transition-group';
 

const Header = () => {
  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState(localStorage.getItem('role'));
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentRole(localStorage.getItem('role'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fermer le menu si clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDeconnexion = async () => {
    await logout();
    localStorage.removeItem('role');
    setCurrentRole(null);
    navigate('/');
  };

  const isPremiumUser = (role) => ['PREMIUM', 'ADMIN'].includes(role);

  const baseLinkClass = "flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition font-medium";

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md fixed top-0 w-full z-50 shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center h-[70px]">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-indigo-600 hover:text-indigo-700">
            <HeartPulse className="w-6 h-6" /> PsyConnect
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-6">

            {/* Liens publics */}
            <Link to="/" className={baseLinkClass}><Home className="w-4 h-4" /> Accueil</Link>
            <Link to="/apropos" className={baseLinkClass}><Info className="w-4 h-4" /> À propos</Link>
            <Link to="/ressources" className={baseLinkClass}><BookOpen className="w-4 h-4" /> Ressources</Link>
            <Link to="/forum" className={baseLinkClass}><MessageCircle className="w-4 h-4" /> Forum</Link>
            <Link to="/chatbot" className={baseLinkClass}><Bot className="w-4 h-4" /> PsyBotAI</Link>

            {/* UTILISATEUR : lien direct pour Nos Professionnels */}
            {currentRole === "UTILISATEUR" && (
              <Link to="/reservation" className={baseLinkClass}><CalendarCheck className="w-4 h-4" /> Nos Professionnels</Link>
            )}

            {/* Menu déroulant pour Espace Utilisateur, Premium, Déconnexion */}
            {currentRole === "UTILISATEUR" && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition font-medium"
                >
                  <User className="w-4 h-4" /> Mon Espace <ChevronDown className={`w-3 h-3 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <CSSTransition
                  in={userMenuOpen}
                  timeout={200}
                  classNames="menu"
                  unmountOnExit
                >
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-md rounded-md flex flex-col z-50">
                    <Link
                      to="/tableauUtilisateur"
                      className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4" /> Espace Utilisateur
                    </Link>
                    {!isPremiumUser(currentRole) && (
                      <Link
                        to="/devenir-premium"
                        className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-yellow-600"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Crown className="w-4 h-4" /> Devenir Premium
                      </Link>
                    )}
                    <span
                      onClick={() => { handleDeconnexion(); setUserMenuOpen(false); }}
                      className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-500 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Déconnexion
                    </span>
                  </div>
                </CSSTransition>
              </div>
            )}

            {/* Autres rôles connectés : Déconnexion */}
            {currentRole && currentRole !== "UTILISATEUR" && (
              <span
                onClick={handleDeconnexion}
                className="flex items-center gap-1 text-red-500 hover:text-red-600 cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Déconnexion
              </span>
            )}

            {/* Non connecté */}
            {!currentRole && (
              <select
                onChange={(e) => {
                  if (e.target.value === 'connexion') navigate('/connexion');
                  else if (e.target.value === 'inscription') navigate('/inscription');
                }}
                defaultValue=""
                className="text-indigo-600 border border-indigo-600 rounded px-2 py-1 cursor-pointer bg-white"
              >
                <option value="" disabled>👤 Connexion / Inscription</option>
                <option value="connexion">Connexion</option>
                <option value="inscription">Inscription</option>
              </select>
            )}

          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="pt-[70px]" />
    </>
  );
};

export default Header;