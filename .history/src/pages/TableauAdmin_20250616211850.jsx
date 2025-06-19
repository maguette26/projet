import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Tes composants importés
import GestionUtilisateurs from '../components/admin/GestionUtilisateurs';
import GestionProfessionnels from '../components/admin/GestionProfessionnels';
import ModerationDiscussions from '../components/admin/ModerationDiscussions';
import AdminFonctionnalites from '../components/admin/AdminFonctionnalites';

const menuItems = [
  {
    key: 'tableauDeBord',
    label: 'Tableau de bord',
    icon: (
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6m-6 0h-2a1 1 0 00-1 1v2a1 1 0 001 1h2m-6-6h-2a1 1 0 00-1 1v2a1 1 0 001 1h2" />
      </svg>
    ),
  },
  {
    key: 'fonctionnalites',
    label: 'Gestion Fonctionnalités',
    icon: (
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    key: 'utilisateurs',
    label: 'Gestion Utilisateurs',
    icon: (
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h2a2 2 0 002-2V7.93a2 2 0 00-.882-1.664L18.428 4.21a2 2 0 00-2.614-.075L3.614 11.21a2 2 0 00-.075 2.614l.056.056A2 2 0 004 14.542V18a2 2 0 002 2h2m-4 0v-7.5l7-7 7 7V20" />
      </svg>
    ),
  },
  {
    key: 'professionnels',
    label: 'Gestion Professionnels',
    icon: (
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354c.337-.367.63-.685.89-.95A6 6 0 0118 6c2.21 0 4 1.79 4 4v10a2 2 0 01-2 2H4a2 2 0 01-2-2V10c0-2.21 1.79-4 4-4a6 6 0 014.11-.796c.26.265.553.583.89.95z" />
      </svg>
    ),
  },
  {
    key: 'messages',
    label: 'Gestion Messages',
    icon: (
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
];

const TableauAdmin = () => {
  const [activeSection, setActiveSection] = useState('tableauDeBord');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('role');
    navigate('/connexion');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'tableauDeBord':
        return (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Aperçu du Tableau de Bord</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-100 p-4 rounded-md text-blue-800">Total Utilisateurs: 500</div>
              <div className="bg-green-100 p-4 rounded-md text-green-800">Ressources Publiées: 120</div>
              <div className="bg-yellow-100 p-4 rounded-md text-yellow-800">Discussions Actives: 45</div>
            </div>
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
          <span className="text-blue-200">Psy</span>
          <span className="text-white">Connect</span> Admin
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
