import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../services/serviceAuth';
import { useRessource } from '../../pages/RessourceContext.jsx'; 
import { User, LogOut, Sparkles } from 'lucide-react';

const HeaderUniforme = () => {
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

  const handleDeconnexion = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
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
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center gap-2 text-indigo-600 font-extrabold text-2xl select-none hover:text-indigo-700 transition"
        >
          <Sparkles className="w-7 h-7" />
          PsyConnect
        </Link>

        <nav className="flex items-center space-x-8 text-indigo-600 font-semibold text-base">
          <Link to="/" className="hover:text-indigo-700 transition">
            Accueil
          </Link>

          {currentRole === 'UTILISATEUR' && (
            <select
              className="border border-indigo-300 rounded-md px-3 py-1 text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              {categoriesOrder.map(cat => (
                <option key={cat.key} value={cat.key}>
                  {cat.title}
                </option>
              ))}
            </select>
          )}

          <Link to="/forum" className="hover:text-indigo-700 transition">
            Forum
          </Link>

          {currentRole && (
            <>
              {currentRole === 'UTILISATEUR' && (
                <Link
                  to="/tableauUtilisateur"
                  className="flex items-center gap-1 hover:text-indigo-700 transition"
                >
                  <User className="w-5 h-5" />
                  Espace Utilisateur
                </Link>
              )}

              {isProfessional(currentRole) && (
                <Link to="/tableauProfessionnel" className="hover:text-indigo-700 transition">
                  Espace Pro
                </Link>
              )}

              {currentRole === 'ADMIN' && (
                <Link to="/admin/dashboard" className="hover:text-indigo-700 transition">
                  Admin
                </Link>
              )}

              {currentRole === 'UTILISATEUR' && !isPremiumUser(currentRole) && (
                <Link
                  to="/devenir-premium"
                  className="bg-indigo-600 text-white px-4 py-1.5 rounded-md hover:bg-indigo-700 transition select-none"
                >
                  ✨ Devenir Premium
                </Link>
              )}

              <button
                onClick={handleDeconnexion}
                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold focus:outline-none select-none"
              >
                <LogOut className="w-5 h-5" />
                Déconnexion
              </button>
            </>
          )}

          {!currentRole && (
            <>
              <Link to="/connexion" className="hover:text-indigo-700 transition">
                Connexion
              </Link>
              <Link
                to="/inscription"
                className="bg-indigo-600 text-white px-4 py-1.5 rounded-md hover:bg-indigo-700 transition select-none"
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

export default HeaderUniforme;
