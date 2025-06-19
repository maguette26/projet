import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Settings,
  Users,
  UserPlus,
  MessageSquare,
  LogOut,
} from 'lucide-react';

const TableauAdmin = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('role');
    navigate('/connexion');
  };

  const handleRedirect = (path) => {
    navigate(path);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-blue-800 text-white flex flex-col h-full shadow-lg">
        <div className="p-6 text-center text-2xl font-bold border-b border-blue-700">
          <span className="text-blue-200">PsyConnect</span>
          <span className="text-white">Admin</span>
        </div>
        <nav className="flex-grow mt-6">
          <ul>
            <li className="mb-2">
              <button
                onClick={() => handleRedirect('/admin')}
                className="w-full text-left px-6 py-3 flex items-center gap-3 transition-colors duration-200 hover:bg-blue-700"
              >
                <Home className="w-5 h-5" />
                Tableau de bord
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => handleRedirect('/admin/fonctionnalites')}
                className="w-full text-left px-6 py-3 flex items-center gap-3 transition-colors duration-200 hover:bg-blue-700"
              >
                <Settings className="w-5 h-5" />
                Gestion Fonctionnalités
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => handleRedirect('/admin/utilisateurs')}
                className="w-full text-left px-6 py-3 flex items-center gap-3 transition-colors duration-200 hover:bg-blue-700"
              >
                <Users className="w-5 h-5" />
                Gestion Utilisateurs
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => handleRedirect('/admin/professionnels')}
                className="w-full text-left px-6 py-3 flex items-center gap-3 transition-colors duration-200 hover:bg-blue-700"
              >
                <UserPlus className="w-5 h-5" />
                Gestion Professionnels
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => handleRedirect('/admin/messages')}
                className="w-full text-left px-6 py-3 flex items-center gap-3 transition-colors duration-200 hover:bg-blue-700"
              >
                <MessageSquare className="w-5 h-5" />
                Gestion Messages
              </button>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-blue-700 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full bg-blue-700 hover:bg-blue-900 text-white py-2 rounded-md transition duration-200 flex items-center justify-center gap-2"
          >
            <LogOut className="h-5 w-5" />
            Se Déconnecter
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Bienvenue dans votre tableau d'administration de PsyConnect</h2>
          <p className="text-gray-600 mb-6">Depuis cet espace, vous pouvez accéder aux différents outils de gestion :</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className="cursor-pointer bg-blue-100 hover:bg-blue-200 p-4 rounded-lg shadow flex items-center justify-between"
              onClick={() => handleRedirect('/admin/fonctionnalites')}
            >
              <div className="flex items-center gap-2 text-blue-800 font-semibold">
                <Settings className="w-5 h-5" />
                Fonctionnalités
              </div>
            </div>
            <div
              className="cursor-pointer bg-green-100 hover:bg-green-200 p-4 rounded-lg shadow flex items-center justify-between"
              onClick={() => handleRedirect('/admin/professionnels')}
            >
              <div className="flex items-center gap-2 text-green-800 font-semibold">
                <UserPlus className="w-5 h-5" />
                Professionnels
              </div>
            </div>
            <div
              className="cursor-pointer bg-purple-100 hover:bg-purple-200 p-4 rounded-lg shadow flex items-center justify-between"
              onClick={() => handleRedirect('/admin/utilisateurs')}
            >
              <div className="flex items-center gap-2 text-purple-800 font-semibold">
                <Users className="w-5 h-5" />
                Utilisateurs
              </div>
            </div>
            <div
              className="cursor-pointer bg-yellow-100 hover:bg-yellow-200 p-4 rounded-lg shadow flex items-center justify-between"
              onClick={() => handleRedirect('/admin/messages')}
            >
              <div className="flex items-center gap-2 text-yellow-800 font-semibold">
                <MessageSquare className="w-5 h-5" />
                Discussions
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TableauAdmin;
