import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../services/serviceAuth';
import { HeartPulse, Home, Info, BookOpen, MessageCircle, Bot, LogOut } from 'lucide-react';

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
    await logout();
    localStorage.removeItem('role');
    setCurrentRole(null);
    navigate('/');
  };

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
            <Link to="/" className={baseLinkClass}><Home className="w-4 h-4" /> Accueil</Link>
            <Link to="/apropos" className={baseLinkClass}><Info className="w-4 h-4" /> À propos</Link>
            <Link to="/ressources" className={baseLinkClass}><BookOpen className="w-4 h-4" /> Ressources</Link>
            <Link to="/forum" className={baseLinkClass}><MessageCircle className="w-4 h-4" /> Forum</Link>
            <Link to="/chatbot" className={baseLinkClass}><Bot className="w-4 h-4" /> PsyBotAI</Link>

            {currentRole ? (
              <span onClick={handleDeconnexion} className="flex items-center gap-1 text-red-500 hover:text-red-600 cursor-pointer">
                <LogOut className="w-4 h-4" /> Déconnexion
              </span>
            ) : (
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