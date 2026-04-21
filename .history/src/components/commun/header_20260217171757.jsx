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
      const updatedRole = localStorage.getItem('role');
      setCurrentRole(updatedRole);
      if (!updatedRole) navigate('/connexion');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate]);

  const handleDeconnexion = async () => {
    try {
      await logout();
      localStorage.removeItem('role');  
      setCurrentRole(null);              
      navigate('/');                    
    } catch (error) {
      console.error("Erreur de déconnexion :", error);
    }
  };

  const isProfessional = (role) => ['PSYCHOLOGUE', 'PSYCHIATRE'].includes(role);
  const isPremiumUser = (role) => ['PREMIUM', 'ADMIN'].includes(role);

  const baseLinkClass =
    "flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition font-medium";

  const handleSelectChange = (e) => {
    const value = e.target.value;
    if (value === "connexion") navigate('/connexion');
    else if (value === "inscription") navigate('/inscription');
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md fixed top-0 w-full z-50 shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center h-[70px]">
          
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-extrabold text-indigo-600 hover:text-indigo-700 transition"
          >
            <HeartPulse className="w-7 h-7" />
            PsyConnect
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4 md:gap-6">
            {/* Liens principaux */}
            <Link to="/" className={baseLinkClass}><Home className="w-4 h-4" /> Accueil</Link>
            <Link to="/apropos" className={baseLinkClass}><Info className="w-4 h-4" /> À propos</Link>
            <Link to="/ressources" className={baseLinkClass}><BookOpen className="w-4 h-4" /> Ressources</Link>
            <Link to="/forum" className={baseLinkClass}><MessageCircle className="w-4 h-4" /> Forum</Link>

            {/* PsyBot toujours visible */}
            <button
              onClick={() => navigate("/chatbot")}
              className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-2 rounded-xl hover:bg-indigo-700 transition shadow-md"
            >
              <Bot className="w-4 h-4" /> PsyBotAI
            </button>

            {/* Espaces selon rôle */}
            {currentRole === "UTILISATEUR" && (
              <>
                <Link to="/tableauUtilisateur" className={baseLinkClass}><User className="w-4 h-4" /> Espace Utilisateur</Link>
                <Link to="/reservation" className={baseLinkClass}><CalendarCheck className="w-4 h-4" /> Nos Professionnels</Link>
                {!isPremiumUser(currentRole) && (
                  <Link to="/devenir-premium" className="flex items-center gap-1 text-yellow-600 hover:text-yellow-700 transition">
                    <Crown className="w-4 h-4" /> Premium
                  </Link>
                )}
                <span
                  onClick={handleDeconnexion}
                  className="flex items-center gap-1 text-red-500 hover:text-red-600 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Déconnexion
                </span>
              </>
            )}

            {isProfessional(currentRole) && (
              <>
                <Link to="/tableauProfessionnel" className={baseLinkClass}><User className="w-4 h-4" /> Espace Pro</Link>
                {!isPremiumUser(currentRole) && (
                  <Link to="/devenir-premium" className="flex items-center gap-1 text-yellow-600 hover:text-yellow-700 transition">
                    <Crown className="w-4 h-4" /> Premium
                  </Link>
                )}
                <span
                  onClick={handleDeconnexion}
                  className="flex items-center gap-1 text-red-500 hover:text-red-600 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Déconnexion
                </span>
              </>
            )}

            {currentRole === "ADMIN" && (
              <>
                <Link to="/tableauAdmin" className={baseLinkClass}><User className="w-4 h-4" /> Admin</Link>
                <button
                  onClick={handleDeconnexion}
                  className="flex items-center gap-1 text-red-500 hover:text-red-600 transition"
                >
                  <LogOut className="w-4 h-4" /> Déconnexion
                </button>
              </>
            )}

            {/* Sélecteur Connexion/Inscription si non connecté */}
            {!currentRole && (
              <select
                onChange={handleSelectChange}
                defaultValue=""
                className="text-indigo-600 border border-indigo-600 rounded px-2 py-1 cursor-pointer bg-white"
              >
                <option value="" disabled>👤 Connexion / Inscription</option>
                <option value="connexion">Connexion</option>
                <option value="inscription">Inscription</option>
              </select>
            )}
          </nav>
        </div>
      </header>

      {/* Pour compenser le header fixe */}
      <div className="pt-[70px]" />
    </>
  );
};

export default Header;