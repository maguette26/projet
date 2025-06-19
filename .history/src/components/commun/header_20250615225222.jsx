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
      setCurrentRole(null);
      navigate('/connexion');
    } catch (error) {
      console.error("Erreur de déconnexion :", error);
    }
  };

  const isProfessional = (role) => ['PSYCHOLOGUE', 'PSYCHIATRE'].includes(role);
  const isPremiumUser = (role) => ['PREMIUM', 'ADMIN'].includes(role);

  const baseColor = 'text-indigo-700';
  const hoverColor = 'hover:text-indigo-900';

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'saturate(180%) blur(10px)',
        WebkitBackdropFilter: 'saturate(180%) blur(10px)',
        boxShadow: '0 1px 10px rgba(0, 0, 0, 0.05)',
        height: 80,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 select-none">
          <Brain className="w-7 h-7 text-indigo-600 drop-shadow-md" />
          <h1
            className="font-extrabold tracking-tight font-sans text-2xl text-indigo-700"
            style={{ letterSpacing: '-0.03em' }}
          >
            Psy<span className="text-indigo-500">Connect</span>
          </h1>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-5 font-medium text-base">
          <Link
            to="/"
            className={`${baseColor} ${hoverColor} flex items-center gap-1 no-underline`}
            style={{ textDecoration: 'none' }}
          >
            🏠 <span>Accueil</span>
          </Link>
          <Link
            to="/ressources"
            className={`${baseColor} ${hoverColor} flex items-center gap-1 no-underline`}
            style={{ textDecoration: 'none' }}
          >
            <BookOpen className="w-5 h-5" /> Ressources
          </Link>
          <Link
            to="/forum"
            className={`${baseColor} ${hoverColor} flex items-center gap-1 no-underline`}
            style={{ textDecoration: 'none' }}
          >
            💬 Forum
          </Link>

          {currentRole === 'UTILISATEUR' && (
            <Link
              to="/tableauUtilisateur"
              className={`${baseColor} ${hoverColor} flex items-center gap-1 no-underline`}
              style={{ textDecoration: 'none' }}
            >
              <User className="w-5 h-5" /> Espace Utilisateur
            </Link>
          )}
          {isProfessional(currentRole) && (
            <Link
              to="/tableauProfessionnel"
              className={`${baseColor} ${hoverColor} flex items-center gap-1 no-underline`}
              style={{ textDecoration: 'none' }}
            >
              👨‍⚕️ Espace Pro
            </Link>
          )}
          {currentRole === 'ADMIN' && (
            <Link
              to="/admin/dashboard"
              className={`${baseColor} ${hoverColor} no-underline`}
              style={{ textDecoration: 'none' }}
            >
              🛠 Admin
            </Link>
          )}
          {currentRole && !isPremiumUser(currentRole) && (
            <Link
              to="/devenir-premium"
              className="bg-yellow-400 text-yellow-900 px-4 py-1.5 rounded-full font-semibold hover:bg-yellow-500 hover:text-white transition-shadow shadow-sm"
              style={{ textDecoration: 'none' }}
            >
              ✨ Premium
            </Link>
          )}

          {currentRole ? (
            <button
              onClick={handleDeconnexion}
              className="flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors font-semibold no-underline"
              style={{ textDecoration: 'none' }}
              title="Déconnexion"
            >
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          ) : (
            <>
              <Link
                to="/connexion"
                className={`${baseColor} ${hoverColor} no-underline`}
                style={{ textDecoration: 'none' }}
              >
                Connexion
              </Link>
              <Link
                to="/inscription"
                className="bg-indigo-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-indigo-700 transition-shadow shadow-md no-underline"
                style={{ textDecoration: 'none' }}
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
