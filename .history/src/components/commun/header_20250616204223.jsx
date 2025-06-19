import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../services/serviceAuth';
import {
  BookOpen,
  LogOut,
  User,
  Brain,
  Info,
  MessageCircle,
  UserCog,
  Crown,
} from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState(localStorage.getItem('role'));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const itemRefs = useRef([]);

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
    try {
      await logout();
    } catch (error) {
      console.error('Erreur de déconnexion :', error);
    }
  };

  const isProfessional = (role) => ['PSYCHOLOGUE', 'PSYCHIATRE'].includes(role);
  const isPremiumUser = (role) => ['PREMIUM', 'ADMIN'].includes(role);

  // Gestion clavier dans menu
  const handleKeyDown = (e) => {
    if (!dropdownOpen) return;

    const focusIndex = itemRefs.current.findIndex((el) => el === document.activeElement);

    if (e.key === 'Escape') {
      setDropdownOpen(false);
      buttonRef.current.focus();
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (focusIndex + 1) % itemRefs.current.length;
      itemRefs.current[nextIndex]?.focus();
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (focusIndex - 1 + itemRefs.current.length) % itemRefs.current.length;
      itemRefs.current[prevIndex]?.focus();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dropdownOpen]);

  const baseLinkClass = 'text-indigo-600 no-underline hover:text-indigo-700 transition';

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-md h-[70px]">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center h-full">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-indigo-600">
          <Brain className="w-7 h-7" />
          PsyConnect
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm font-semibold">
          <Link to="/" className={baseLinkClass}>
            <UserCog className="w-4 h-4 inline-block mr-1" />
            Accueil
          </Link>
          <Link to="/apropos" className={baseLinkClass}>
            <Info className="w-4 h-4 inline-block mr-1" />
            À propos
          </Link>
          <Link to="/ressources" className={`${baseLinkClass} flex items-center gap-1`}>
            <BookOpen className="w-4 h-4" /> Ressources
          </Link>
          <Link to="/forum" className={baseLinkClass}>
            <MessageCircle className="w-4 h-4 inline-block mr-1" />
            Forum
          </Link>

          {currentRole === 'UTILISATEUR' && (
            <>
              <Link to="/tableauUtilisateur" className={`${baseLinkClass} flex items-center gap-1`}>
                <User className="w-4 h-4" /> Espace Utilisateur
              </Link>
              <button
                onClick={handleDeconnexion}
                className="flex items-center gap-1 text-red-500 hover:underline"
              >
                <LogOut className="w-4 h-4" /> Déconnexion
              </button>
            </>
          )}

          {isProfessional(currentRole) && (
            <>
              <Link to="/tableauProfessionnel" className={baseLinkClass}>
                <UserCog className="w-4 h-4 inline-block mr-1" />
                Espace Pro
              </Link>
              <button
                onClick={handleDeconnexion}
                className="flex items-center gap-1 text-red-500 hover:underline"
              >
                <LogOut className="w-4 h-4" /> Déconnexion
              </button>
            </>
          )}

          {currentRole === 'ADMIN' && (
            <>
              <Link to="/admin/dashboard" className={baseLinkClass}>
                <UserCog className="w-4 h-4 inline-block mr-1" />
                Admin
              </Link>
              <button
                onClick={handleDeconnexion}
                className="flex items-center gap-1 text-red-500 hover:underline"
              >
                <LogOut className="w-4 h-4" /> Déconnexion
              </button>
            </>
          )}

          {currentRole && !isPremiumUser(currentRole) && (
            <Link
              to="/devenir-premium"
              className="text-yellow-500 hover:underline flex items-center gap-1"
            >
              <Crown className="w-4 h-4" />
              Premium
            </Link>
          )}

          {/* Dropdown pour utilisateurs non connectés */}
          {!currentRole && (
            <div className="relative" ref={dropdownRef}>
              <button
                ref={buttonRef}
                onClick={() => setDropdownOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                className="text-indigo-600 hover:text-indigo-700 p-1 focus:outline-none"
              >
                <User className="w-5 h-5" />
              </button>
              {dropdownOpen && (
                <ul
                  className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50"
                  role="menu"
                >
                  <li role="none">
                    <button
                      ref={(el) => (itemRefs.current[0] = el)}
                      role="menuitem"
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate('/connexion');
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-indigo-100 focus:bg-indigo-100"
                    >
                      Connexion
                    </button>
                  </li>
                  <li role="none">
                    <button
                      ref={(el) => (itemRefs.current[1] = el)}
                      role="menuitem"
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate('/inscription');
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-indigo-100 focus:bg-indigo-100"
                    >
                      Inscription
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
