import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../services/serviceAuth';
import { BookOpen, LogOut, Sparkles, User, Brain } from 'lucide-react';

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

  const baseColor = 'text-indigo-700 transition duration-200 ease-in-out';
  const hoverEffect = 'hover:brightness-110';

  return (
    <header className="bg-white bg-opacity-80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center gap-8">
        {/* Logo */}
        <Link
          to="/"
          className={`flex items-center gap-2 font-extrabold text-3xl tracking-tight ${baseColor} no-underline`}
          style={{ textDecoration: 'none' }}
        >
          <Brain className="w-7 h-7" />
          PsyConnect
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            to="/"
            className={`${baseColor} ${hoverEffect} no-underline`}
            style={{ textDecoration: 'none' }}
          >
            🏠 Accueil
          </Link>

          <Link
            to="/ressources"
            className={`flex items-center gap-1 ${baseColor} ${hoverEffect} no-underline`}
            style={{ textDecoration: 'none' }}
          >
            <BookOpen className="w-4 h-4" />
            Ressources
          </Link>

          <Link
            to="/forum"
            className={`${baseColor} ${hoverEffect} no-underline`}
            style={{ textDecoration: 'none' }}
          >
            💬 Forum
          </Link>

          {currentRole === 'UTILISATEUR' && (
            <Link
              to="/tableauUtilisateur"
              className={`flex items-center gap-1 ${baseColor} ${hoverEffect} no-underline`}
              style={{ textDecoration: 'none' }}
            >
              <User className="w-4 h-4" />
              Espace Utilisateur
            </Link>
          )}

          {isProfessional(currentRole) && (
            <Link
              to="/tableauProfessionnel"
              className={`${baseColor} ${hoverEffect} no-underline`}
              style={{ textDecoration: 'none' }}
            >
              👨‍⚕️ Espace Pro
            </Link>
          )}

          {currentRole === 'ADMIN' && (
            <Link
              to="/admin/dashboard"
              className={`${baseColor} ${hoverEffect} no-underline`}
              style={{ textDecoration: 'none' }}
            >
              🛠 Admin
            </Link>
          )}

          {currentRole && !isPremiumUser(currentRole) && (
            <Link
              to="/devenir-premium"
              className="bg-yellow-400 text-white px-3 py-1.5 rounded-full hover:bg-yellow-500 transition"
            >
              ✨ Premium
            </Link>
          )}

          {currentRole ? (
            <button
              onClick={handleDeconnexion}
              className="flex items-center gap-1 text-red-500 hover:underline"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          ) : (
            <>
              <Link
                to="/connexion"
                className={`${baseColor} ${hoverEffect} no-underline mr-4`}
                style={{ textDecoration: 'none' }}
              >
                Connexion
              </Link>
              <Link
                to="/inscription"
                className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition"
              >
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
