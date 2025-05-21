// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); // ADMIN, PROFESSIONNEL, UTILISATEUR

  const handleDeconnexion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/connexion');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-600 tracking-tight">
          PsyConnect
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-gray-700 text-sm font-medium">
          <Link to="/" className="hover:text-indigo-600 transition">Accueil</Link>
          <Link to="/ressources" className="hover:text-indigo-600 transition">Ressources</Link>
          <Link to="/forum" className="hover:text-indigo-600 transition">Forum</Link>

          {token ? (
            <>
              {role === 'ADMIN' && <Link to="/admin" className="hover:text-indigo-600 transition">Admin</Link>}
              {role === 'PROFESSIONNEL' && <Link to="/professionnel" className="hover:text-indigo-600 transition">Espace Pro</Link>}
              {role === 'UTILISATEUR' && <Link to="/utilisateur" className="hover:text-indigo-600 transition">Mon espace</Link>}
              <button onClick={handleDeconnexion} className="ml-4 text-red-600 hover:underline">Déconnexion</button>
            </>
          ) : (
            <>
              <Link to="/connexion" className="hover:text-indigo-600 transition">Connexion</Link>
              <Link to="/inscription" className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition ml-2"> Inscription </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
