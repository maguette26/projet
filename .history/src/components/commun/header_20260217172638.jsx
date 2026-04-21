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
  Bot,
  Menu,
  X
} from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState(localStorage.getItem('role'));
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedRole = localStorage.getItem('role');
      setCurrentRole(updatedRole);
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
      console.error("Erreur de déconnexion :", error);
    }
  };

  const isProfessional = (role) => ['PSYCHOLOGUE', 'PSYCHIATRE'].includes(role);
  const isPremiumUser = (role) => ['PREMIUM', 'ADMIN'].includes(role);

  const baseLinkClass = "flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition font-medium";

  const handleSelectChange = (e) => {
    const value = e.target.value;
    if (value === "connexion") navigate('/connexion');
    else if (value === "inscription") navigate('/inscription');
  };

  const renderRoleLinks = () => {
    if (!currentRole) return null;

    if (currentRole === "UTILISATEUR") {
      return (
        <>
          <Link to="/tableauUtilisateur" className={baseLinkClass}><User className="w-4 h-4" /> Espace Utilisateur</Link>
          <Link to="/reservation" className={baseLinkClass}><CalendarCheck className="w-4 h-4" /> Nos Professionnels</Link>
          {!isPremiumUser(currentRole) && (
            <Link to="/devenir-premium" className="flex items-center gap-1 text-yellow-600 hover:text-yellow-700 transition">
              <Crown className="w-4 h-4" /> Premium
            </Link>
          )}
          <span onClick={handleDeconnexion} className="flex items-center gap-1 text-red-500 hover:text-red-600 transition cursor-pointer">
            <LogOut className="w-4 h-4" /> Déconnexion
          </span>
        </>
      );
    }

    if (isProfessional(currentRole)) {
      return (
        <>
          <Link to="/tableauProfessionnel" className={baseLinkClass}><User className="w-4 h-4" /> Espace Pro</Link>
          {!isPremiumUser(currentRole) && (
            <Link to="/devenir-premium" className="flex items-center gap-1 text-yellow-600 hover:text-yellow-700 transition">
              <Crown className="w-4 h-4" /> Premium
            </Link>
          )}
          <span onClick={handleDeconnexion} className="flex items-center gap-1 text-red-500 hover:text-red-600 transition cursor-pointer">
            <LogOut className="w-4 h-4" /> Déconnexion
          </span>
        </>
      );
    }

    if (currentRole === "ADMIN") {
      return (
        <>
          <Link to="/tableauAdmin" className={baseLinkClass}><User className="w-4 h-4" /> Admin</Link>
          <span onClick={handleDeconnexion} className="flex items-center gap-1 text-red-500 hover:text-red-600 transition cursor-pointer">
            <LogOut className="w-4 h-4" /> Déconnexion
          </span>
        </>
      );
    }
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md fixed top-0 w-full z-50 shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center h-[70px]">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-indigo-600 hover:text-indigo-700 transition">
            <HeartPulse className="w-7 h-7" /> PsyConnect
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-4 md:gap-6">
            <Link to="/" className={baseLinkClass}><Home className="w-4 h-4" /> Accueil</Link>
            <Link to="/apropos" className={baseLinkClass}><Info className="w-4 h-4" /> À propos</Link>
            <Link to="/ressources" className={baseLinkClass}><BookOpen className="w-4 h-4" /> Ressources</Link>
            <Link to="/forum" className={baseLinkClass}><MessageCircle className="w-4 h-4" /> Forum</Link>

            {/* PsyBot */}
            <button onClick={() => navigate("/chatbot")} className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-2 rounded-xl hover:bg-indigo-700 transition shadow-md">
              <Bot className="w-4 h-4" /> PsyBotAI
            </button>

            {/* Role-specific links */}
            {currentRole ? renderRoleLinks() : (
              <select onChange={handleSelectChange} defaultValue="" className="text-indigo-600 border border-indigo-600 rounded px-2 py-1 cursor-pointer bg-white">
                <option value="" disabled>👤 Connexion / Inscription</option>
                <option value="connexion">Connexion</option>
                <option value="inscription">Inscription</option>
              </select>
            )}
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-md border border-gray-300" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-md px-6 py-4 flex flex-col gap-3">
            <Link to="/" className={baseLinkClass}><Home className="w-4 h-4" /> Accueil</Link>
            <Link to="/apropos" className={baseLinkClass}><Info className="w-4 h-4" /> À propos</Link>
            <Link to="/ressources" className={baseLinkClass}><BookOpen className="w-4 h-4" /> Ressources</Link>
            <Link to="/forum" className={baseLinkClass}><MessageCircle className="w-4 h-4" /> Forum</Link>
            <button onClick={() => navigate("/chatbot")} className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-2 rounded-xl hover:bg-indigo-700 transition shadow-md">
              <Bot className="w-4 h-4" /> PsyBotAI
            </button>
            {currentRole ? renderRoleLinks() : (
              <select onChange={handleSelectChange} defaultValue="" className="text-indigo-600 border border-indigo-600 rounded px-2 py-1 cursor-pointer bg-white">
                <option value="" disabled>👤 Connexion / Inscription</option>
                <option value="connexion">Connexion</option>
                <option value="inscription">Inscription</option>
              </select>
            )}
          </div>
        )}
      </header>

      {/* Spacer for fixed header */}
      <div className="pt-[70px]" />
    </>
  );
};

export default Header;