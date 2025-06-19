import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Tes composants importés
import GestionUtilisateurs from '../components/admin/GestionUtilisateurs';
import GestionProfessionnels from '../components/admin/GestionProfessionnels';
import ModerationDiscussions from '../components/admin/ModerationDiscussions';
import AdminFonctionnalites from '../components/admin/AdminFonctionnalites';

// Import des icônes Lucide React pour emojis
import { Smile, Settings, Users, UserCheck, MessageSquare } from 'lucide-react';

const menuItems = [
  {
    key: 'tableauDeBord',
    label: 'Tableau de bord',
    icon: <Smile className="w-5 h-5 mr-3" />,
  },
  {
    key: 'fonctionnalites',
    label: 'Gestion Fonctionnalités',
    icon: <Settings className="w-5 h-5 mr-3" />,
  },
  {
    key: 'utilisateurs',
    label: 'Gestion Utilisateurs',
    icon: <Users className="w-5 h-5 mr-3" />,
  },
  {
    key: 'professionnels',
    label: 'Gestion Professionnels',
    icon: <UserCheck className="w-5 h-5 mr-3" />,
  },
  {
    key: 'messages',
    label: 'Gestion Messages',
    icon: <MessageSquare className="w-5 h-5 mr-3" />,
  },
];

const TableauAdmin = () => {
  const [activeSection, setActiveSection] = useState('tableauDeBord');
  const [adminName, setAdminName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const nameFromStorage = localStorage.getItem('adminName');
    if (nameFromStorage) setAdminName(nameFromStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('adminName');
    navigate('/connexion');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'tableauDeBord':
        return (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Bonjour {adminName ? adminName : 'Admin'} <Smile className="inline-block w-6 h-6 text-yellow-400 ml-2" />
            </h2>
            <p className="mb-6 text-gray-700 text-lg">
              Bienvenue dans votre tableau de bord. Ici, vous pouvez gérer les utilisateurs, les professionnels, modérer les discussions, et configurer les fonctionnalités de la plateforme.
            </p>
             
          </div>
        );
      case 'fonctionnalites':
        return (
          <section className="bg-white shadow-lg rounded-lg p-6">
            <AdminFonctionnalites />
          </section>
        );
      case 'utilisateurs':
        return (
          <section className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4 pb-3 border-b border-gray-200">
              Gestion des Utilisateurs Standards
            </h2>
            <GestionUtilisateurs />
          </section>
        );
      case 'professionnels':
        return (
          <section className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4 pb-3 border-b border-gray-200">
              Gestion des Professionnels de Santé Mentale
            </h2>
            <GestionProfessionnels />
          </section>
        );
      case 'messages':
        return (
          <section className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Modération des Discussions</h2>
            <ModerationDiscussions />
          </section>
        );
      default:
        return <div className="p-6 text-center text-gray-600">Sélectionnez une option dans le menu latéral.</div>;
    }
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
            {menuItems.map(({ key, label, icon }) => (
              <li key={key} className="mb-2">
                <button
                  onClick={() => setActiveSection(key)}
                  className={`w-full text-left px-6 py-3 flex items-center transition-colors duration-200 ${
                    activeSection === key ? 'bg-blue-600 text-white' : 'hover:bg-blue-700'
                  }`}
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 8v8" />
            </svg>
            Se Déconnecter
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">{renderContent()}</main>
    </div>
  );
};

export default TableauAdmin;
