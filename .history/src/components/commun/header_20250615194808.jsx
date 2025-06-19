import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../services/serviceAuth';
import { useRessource } from '../../pages/RessourceContext.jsx';

const HeaderFun = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedCategory, setSelectedCategory, categoriesOrder } = useRessource();
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

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    }
  };

  const isProfessional = (role) => ['PSYCHOLOGUE', 'PSYCHIATRE'].includes(role);
  const isPremiumUser = (role) => ['PREMIUM', 'ADMIN'].includes(role);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    if (location.pathname !== '/ressources') navigate('/ressources');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 text-purple-600 text-3xl font-extrabold tracking-wider select-none hover:text-purple-800 transition duration-300"
          aria-label="Accueil PsyConnect"
        >
          <span role="img" aria-label="étincelle">✨</span>
          <span>PsyConnect</span>
        </Link>

        <nav className="flex items-center gap-10 text-purple-700 font-medium tracking-wide text-lg">
          <Link
            to="/"
            className="flex items-center gap-2 hover:text-purple-900 transition duration-300"
          >
            <span role="img" aria-label="maison">🏠</span> Accueil
          </Link>

          {currentRole === 'UTILISATEUR' && (
            <select
              className="border border-purple-300 rounded-md px-3 py-1 text-purple-700 font-semibold hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              value={selectedCategory}
              onChange={handleCategoryChange}
              aria-label="Choisir catégorie de ressources"
            >
              {categoriesOrder.map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {cat.title}
                </option>
              ))}
            </select>
          )}

          <Link
            to="/forum"
            className="flex items-center gap-2 hover:text-purple-900 transition duration-300"
          >
            <span role="img" aria-label="bulle de discussion">💬</span> Forum
          </Link>

          {currentRole && (
            <>
              {currentRole === 'UTILISATEUR' && (
                <Link
                  to="/tableauUtilisateur"
                  className="flex items-center gap-2 hover:text-purple-900 transition duration-300"
                >
                  <span role="img" aria-label="personne">🧑</span> Espace Utilisateur
                </Link>
              )}
              {isProfessional(currentRole) && (
                <Link
                  to="/tableauProfessionnel"
                  className="flex items-center gap-2 hover:text-purple-900 transition duration-300"
                >
                  <span role="img" aria-label="briefcase">💼</span> Espace Pro
                </Link>
              )}
              {currentRole === 'ADMIN' && (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-2 hover:text-purple-900 transition duration-300"
                >
                  <span role="img" aria-label="clés">🗝️</span> Admin
                </Link>
              )}

              {currentRole === 'UTILISATEUR' && !isPremiumUser(currentRole) && (
                <Link
                  to="/devenir-premium"
                  className="bg-purple-600 text-white px-4 py-1.5 rounded-md shadow-md hover:bg-purple-700 transition duration-300 select-none flex items-center gap-2"
                >
                  <span role="img" aria-label="étoile filante">🌠</span> Devenir Premium
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-900 font-semibold focus:outline-none select-none"
                aria-label="Se déconnecter"
              >
                <span role="img" aria-label="porte de sortie">🚪</span> Déconnexion
              </button>
            </>
          )}

          {!currentRole && (
            <>
              <Link
                to="/connexion"
                className="hover:text-purple-900 transition duration-300"
              >
                🔑 Connexion
              </Link>
              <Link
                to="/inscription"
                className="bg-purple-600 text-white px-4 py-1.5 rounded-md shadow-md hover:bg-purple-700 transition duration-300 select-none"
              >
                📝 Inscription
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default HeaderFun;
