import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../services/serviceAuth';
import { BookOpen, LogOut, HeartPulse, Home, Info, MessageCircle, Bot } from 'lucide-react';

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
    await logout();
    localStorage.removeItem('role');
    setCurrentRole(null);
    navigate('/');
  };

  const baseLinkClass = "flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition";

  const handleSelectChange = (e) => {
    const value = e.target.value;
    if (value === "connexion") navigate('/connexion');
    else if (value === "inscription") navigate('/inscription');
  };

  return (
    <>
      <header className="bg-white/90 backdrop-blur-md fixed top-0 w-full z-50 shadow-md h-[70px]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center h-full">
          <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-indigo-600">
            <HeartPulse className="w-7 h-7" /> PsyConnect
          </Link>
          <nav className="flex items-center gap-6 text-sm font-semibold">
            <Link to="/" className={baseLinkClass}><Home className="w-4 h-4" /> Accueil</Link>
            <Link to="/apropos" className={baseLinkClass}><Info className="w-4 h-4" /> À propos</Link>
            <Link to="/ressources" className={baseLinkClass}><BookOpen className="w-4 h-4" /> Ressources</Link>
            <Link to="/forum" className={baseLinkClass}><MessageCircle className="w-4 h-4" /> Forum</Link>

            {/* Bouton PsyBot redirige vers page dédiée */}
<button
  onClick={() => navigate("/chatbot")}
  className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-2 rounded-xl hover:bg-indigo-700 transition shadow"
>
  <Bot className="w-4 h-4" /> PsyBotAI
</button>


            {currentRole ? (
              <span onClick={handleDeconnexion} className="cursor-pointer flex items-center gap-1 text-indigo-600 hover:text-indigo-800">
                <LogOut className="w-4 h-4" /> Déconnexion
              </span>
            ) : (
              <select onChange={handleSelectChange} defaultValue="" className="text-indigo-600 border border-indigo-600 rounded px-2 py-1 cursor-pointer bg-white">
                <option value="" disabled>👤 Connex/Inscription</option>
                <option value="connexion">Connexion</option>
                <option value="inscription">Inscription</option>
              </select>
            )}
          </nav>
        </div>
      </header>
      <div className="pt-[70px]" />
    </>
  );
};

export default Header;
