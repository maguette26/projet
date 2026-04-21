import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../services/serviceAuth';
import {
  BookOpen,
  LogOut,
  User,
  HeartPulse,
  Crown,
  Home,
  Info,
  MessageCircle,
  CalendarCheck,
  Bot
} from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentRole(localStorage.getItem('role'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleDeconnexion = async () => {
    try {
      await logout();
      localStorage.removeItem('role');
      setCurrentRole(null);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  const isProfessional = (role) => ['PSYCHOLOGUE', 'PSYCHIATRE'].includes(role);
  const isPremiumUser = (role) => ['PREMIUM', 'ADMIN'].includes(role);

  const baseLinkClass = "flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition";

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md fixed top-0 w-full z-50 shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center h-[70px]">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-indigo-600 hover:text-indigo-700">
            <HeartPulse className="w-6 h-6" /> PsyConnect
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-6">
            <Link to="/" className={baseLinkClass}><Home className="w-4 h-4" /> Accueil</Link>
            <Link to="/apropos" className={baseLinkClass}><Info className="w-4 h-4" /> À propos</Link>
            <Link to="/ressources" className={baseLinkClass}><BookOpen className="w-4 h-4" /> Ressources</Link>
            <Link to="/forum" className={baseLinkClass}><MessageCircle className="w-4 h-4" /> Forum</Link>
            <Link to="/chatbot" className={baseLinkClass}><Bot className="w-4 h-4" /> PsyBotAI</Link>

            {currentRole && currentRole === "UTILISATEUR" && (
              <>
                <Link to="/tableauUtilisateur" className={baseLinkClass}><User className="w-4 h-4" /> Espace Utilisateur</Link>
                <Link to="/reservation" className={baseLinkClass}><CalendarCheck className="w-4 h-4" /> Nos Professionnels</Link>
                {!isPremiumUser(currentRole) && (
                  <Link to="/devenir-premium" className="flex items-center gap-1 text-yellow-600 hover:text-yellow-700">
                    <Crown className="w-4 h-4" /> Premium
                  </Link>
                )}
                <span onClick={handleDeconnexion} className="flex items-center gap-1 text-red-500 hover:text-red-600 cursor-pointer">
                  <LogOut className="w-4 h-4" /> Déconnexion
                </span>
              </>
            )}

            {currentRole && isProfessional(currentRole) && (
              <>
                <Link to="/tableauProfessionnel" className={baseLinkClass}><User className="w-4 h-4" /> Espace Pro</Link>
                {!isPremiumUser(currentRole) && (
                  <Link to="/devenir-premium" className="flex items-center gap-1 text-yellow-600 hover:text-yellow-700">
                    <Crown className="w-4 h-4" /> Premium
                  </Link>
                )}
                <span onClick={handleDeconnexion} className="flex items-center gap-1 text-red-500 hover:text-red-600 cursor-pointer">
                  <LogOut className="w-4 h-4" /> Déconnexion
                </span>
              </>
            )}

            {currentRole && currentRole === "ADMIN" && (
              <>
                <Link to="/tableauAdmin" className={baseLinkClass}><User className="w-4 h-4" /> Admin</Link>
                <span onClick={handleDeconnexion} className="flex items-center gap-1 text-red-500 hover:text-red-600 cursor-pointer">
                  <LogOut className="w-4 h-4" /> Déconnexion
                </span>
              </>
            )}

            {!currentRole && (
              <select
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'connexion') navigate('/connexion');
                  else if (val === 'inscription') navigate('/inscription');
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