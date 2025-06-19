import React from 'react';
import { Home, BookOpen, MessageCircle, UserCheck, Star, LogOut } from 'lucide-react';

const NavbarAero = ({ currentRole = 'UTILISATEUR', onLogout }) => {
  // Exemple de roles: UTILISATEUR, PSYCHOLOGUE, ADMIN

  return (
    <nav className="bg-white bg-opacity-70 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Star className="w-7 h-7 text-indigo-500" />
          <span className="text-indigo-600 font-extrabold text-xl tracking-wide select-none">
            PsyConnect
          </span>
        </div>

        {/* Menu */}
        <ul className="flex items-center gap-8 text-indigo-700 font-semibold text-sm">
          <li className="flex items-center gap-1 hover:text-indigo-500 cursor-pointer transition">
            <Home className="w-5 h-5" />
            Accueil
          </li>
          <li className="flex items-center gap-1 hover:text-indigo-500 cursor-pointer transition">
            <BookOpen className="w-5 h-5" />
            Ressources
          </li>
          <li className="flex items-center gap-1 hover:text-indigo-500 cursor-pointer transition">
            <MessageCircle className="w-5 h-5" />
            Forum
          </li>
          {(currentRole === 'UTILISATEUR' || currentRole === 'PREMIUM') && (
            <li className="flex items-center gap-1 hover:text-indigo-500 cursor-pointer transition">
              <UserCheck className="w-5 h-5" />
              Mon Espace
            </li>
          )}
        </ul>

        {/* Bouton déconnexion */}
        {currentRole && (
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-400 font-semibold text-sm transition"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavbarAero;
