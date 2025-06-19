import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../services/serviceAuth';
import { BookOpen, LogOut, User, Brain } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentRole, setCurrentRole] = useState(localStorage.getItem('role'));

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
      console.error("Erreur de déconnexion :", error);
    }
  };

  const isProfessional = (role) => ['PSYCHOLOGUE', 'PSYCHIATRE'].includes(role);
  const isPremiumUser = (role) => ['PREMIUM', 'ADMIN'].includes(role);

  const baseLinkClass = "text-indigo-700 no-underline hover:text-indigo-800 transition";

  return (
    <header className="bg-white/70 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold text-indigo-700 flex items-center gap-2">
          <Brain className="w-6 h-6 text-indigo-600" />
          PsyConnect
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm font-semibold">
          <Link to="/" className={baseLinkClass}>🏠 Accueil</Link>
          <Link to="/ressources" className={`${baseLinkClass} flex items-center gap-1`}>
          <Link to="/apropos" className={baseLinkClass}>À propos</Link>
            <BookOpen className="w-4 h-4" /> Ressources
          </Link>
          <Link to="/forum" className={baseLinkClass}>💬 Forum</Link>

          {currentRole === 'UTILISATEUR' && (
            <Link to="/tableauUtilisateur" className={`${baseLinkClass} flex items-center gap-1`}>
              <User className="w-4 h-4" /> Espace Utilisateur
            </Link>
          )}
          {isProfessional(currentRole) && (
            <Link to="/tableauProfessionnel" className={baseLinkClass}>👨‍⚕️ Espace Pro</Link>
          )}
          {currentRole === 'ADMIN' && (
            <Link to="/admin/dashboard" className={baseLinkClass}>🛠 Admin</Link>
          )}
          {currentRole && !isPremiumUser(currentRole) && (
            <Link to="/devenir-premium" className="bg-yellow-400 text-white px-3 py-1.5 rounded-full hover:bg-yellow-500 transition no-underline">
              ✨ Premium
            </Link>
          )}

          {currentRole ? (
            <button
              onClick={handleDeconnexion}
              className="flex items-center gap-1 text-red-500 hover:underline"
            >
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          ) : (
            <>
              <Link to="/connexion" className={baseLinkClass}>Connexion</Link>
              <Link to="/inscription" className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition no-underline">
                Inscription
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
