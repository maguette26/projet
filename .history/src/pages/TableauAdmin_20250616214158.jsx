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

  const menuItems = [
    {
      label: 'Tableau de bord',
      icon: <Home className="w-5 h-5" />,
      path: '/admin',
    },
    {
      label: 'Gestion Fonctionnalités',
      icon: <Settings className="w-5 h-5" />,
      path: '/admin/fonctionnalites',
    },
    {
      label: 'Gestion Utilisateurs',
      icon: <Users className="w-5 h-5" />,
      path: '/admin/utilisateurs',
    },
    {
      label: 'Gestion Professionnels',
      icon: <UserPlus className="w-5 h-5" />,
      path: '/admin/professionnels',
    },
    {
      label: 'Gestion Messages',
      icon: <MessageSquare className="w-5 h-5" />,
      path: '/admin/messages',
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white flex flex-col h-full shadow-lg">
        <div className="p-6 text-center text-2xl font-bold border-b border-blue-700">
          <span className="text-blue-200">PsyConnect</span>
          <span className="text-white">Admin</span>
        </div>

        <nav className="flex-grow mt-6">
          <ul>
            {menuItems.map(({ label, icon, path }) => (
              <li key={label} className="mb-2">
                <button
                  onClick={() => navigate(path)}
                  className="w-full text-left px-6 py-3 flex items-center gap-3 transition-colors duration-200 hover:bg-blue-700"
                >
                  {icon}
                  {label}
                </button>
              </li>
            ))}
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

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Bienvenue dans votre tableau d'administration de PsyConnect</h2>
          <p className="text-gray-600 mb-6">Depuis cet espace, vous pouvez accéder aux différents outils de gestion :</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {menuItems.slice(1).map(({ label, icon, path }) => (
              <div
                key={label}
                onClick={() => navigate(path)}
                className="cursor-pointer p-4 bg-blue-100 hover:bg-blue-200 rounded-lg shadow flex items-center justify-between"
              >
                <div className="flex items-center gap-2 text-blue-800 font-semibold">
                  {icon}
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TableauAdmin;
