import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../services/serviceAuth';
import { useRessource } from '../../pages/RessourceContext.jsx'; 
import { User, LogOut, Sparkles } from 'lucide-react';

const Navbar = () => {
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
    <nav className="bg-indigo-600 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl hover:text-indigo-200 transition">
          <Sparkles className="w-6 h-6" />
          PsyConnect
        </Link>

        {/* Menu de navigation */}
        <ul className="flex items-center space-x-8 font-medium text-sm">
          <li>
            <Link to="/" className="hover:text-indigo-200 transition">Accueil</Link>
          </li>

          {currentRole === 'UTILISATEUR' && (
            <li>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="bg-indigo-500 text-white px-3 py-1 rounded focus:outline-none hover:bg-indigo-400 cursor-pointer"
              >
                {categoriesOrder.map(cat => (
                  <option key={cat.key} value={cat.key}>{cat.title}</option>
                ))}
              </select>
            </li>
          )}

          <li>
            <Link to="/forum" className="hover:text-indigo-200 transition">Forum</Link>
          </li>

          {currentRole && (
            <>
              {currentRole === 'UTILISATEUR' && (
                <li>
                  <Link to="/tableauUtilisateur" className="flex items-center gap-1 hover:text-indigo-200 transition">
                    <User className="w-4 h-4" /> Espace Utilisateur
                  </Link>
                </li>
              )}

              {isProfessional(currentRole) && (
                <li>
                  <Link to="/tableauProfessionnel" className="hover:text-indigo-200 transition">Espace Pro</Link>
                </li>
              )}

              {currentRole === 'ADMIN' && (
                <li>
                  <Link to="/admin/dashboard" className="hover:text-indigo-200 transition">Admin</Link>
                </li>
              )}

              {currentRole === 'UTILISATEUR' && !isPremiumUser(currentRole) && (
                <li>
                  <Link
                    to="/devenir-premium"
                    className="bg-yellow-400 text-indigo-900 px-3 py-1 rounded hover:bg-yellow-300 transition"
                  >
                    ✨ Devenir Premium
                  </Link>
                </li>
              )}

              <li>
                <button
                  onClick={handleDeconnexion}
                  className="flex items-center gap-1 text-yellow-200 hover:text-yellow-100 font-semibold focus:outline-none"
                >
                  <LogOut className="w-4 h-4" /> Déconnexion
                </button>
              </li>
            </>
          )}

          {!currentRole && (
            <>
              <li>
                <Link to="/connexion" className="hover:text-indigo-200 transition">Connexion</Link>
              </li>
              <li>
                <Link
                  to="/inscription"
                  className="bg-indigo-400 text-white px-4 py-1.5 rounded hover:bg-indigo-500 transition"
                >
                  Inscription
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
