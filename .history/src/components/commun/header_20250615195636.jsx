import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../services/serviceAuth';
import { Home, BookOpen, MessageCircle, UserCheck, Star, LogOut } from 'lucide-react';

const NavbarAero = () => {
  const navigate = useNavigate();
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
      setCurrentRole(null);
      navigate('/connexion');
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const isProfessional = (role) => ['PSYCHOLOGUE', 'PSYCHIATRE'].includes(role);
  const isPremiumUser = (role) => ['PREMIUM', 'ADMIN'].includes(role);

  return (
    <nav className="bg-white bg-opacity-70 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 select-none">
          <Star className="w-7 h-7 text-indigo-500" />
          <span className="text-indigo-600 font-extrabold text-xl tracking-wide">
            PsyConnect
          </span>
        </Link>

        {/* Menu */}
        <ul className="flex items-center gap-8 text-indigo-700 font-semibold text-sm">
          <li>
            <Link to="/" className="flex items-center gap-1 hover:text-indigo-500 transition">
              <Home className="w-5 h-5" />
              Accueil
            </Link>
          </li>
          <li>
            <Link to="/ressources" className="flex items-center gap-1 hover:text-indigo-500 transition">
              <BookOpen className="w-5 h-5" />
              Ressources
            </Link>
          </li>
          <li>
            <Link to="/forum" className="flex items-center gap-1 hover:text-indigo-500 transition">
              <MessageCircle className="w-5 h-5" />
              Forum
            </Link>
          </li>
          {(currentRole === 'UTILISATEUR' || isPremiumUser(currentRole)) && (
            <li>
              <Link to="/tableauUtilisateur" className="flex items-center gap-1 hover:text-indigo-500 transition">
                <UserCheck className="w-5 h-5" />
                Mon Espace
              </Link>
            </li>
          )}
          {isProfessional(currentRole) && (
            <li>
              <Link to="/tableauProfessionnel" className="flex items-center gap-1 hover:text-indigo-500 transition">
                <UserCheck className="w-5 h-5" />
                Espace Pro
              </Link>
            </li>
          )}
          {currentRole === 'ADMIN' && (
            <li>
              <Link to="/admin/dashboard" className="flex items-center gap-1 hover:text-indigo-500 transition">
                <UserCheck className="w-5 h-5" />
                Admin
              </Link>
            </li>
          )}
        </ul>

        {/* Bouton déconnexion */}
        {currentRole ? (
          <button
            onClick={handleDeconnexion}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-400 font-semibold text-sm transition"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        ) : (
          <Link
            to="/connexion"
            className="text-indigo-600 hover:text-indigo-400 font-semibold text-sm transition"
          >
            Connexion
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavbarAero;
