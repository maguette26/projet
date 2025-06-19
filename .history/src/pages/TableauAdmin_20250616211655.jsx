import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Settings,
  Users,
  UserCheck,
  MessageCircle,
  LogOut,
  ViewGrid,
} from 'lucide-react';

import GestionUtilisateurs from '../components/admin/GestionUtilisateurs';
import GestionProfessionnels from '../components/admin/GestionProfessionnels';
import ModerationDiscussions from '../components/admin/ModerationDiscussions';
import AdminFonctionnalites from '../components/admin/AdminFonctionnalites';

const sections = {
  tableauDeBord: {
    label: 'Tableau de bord',
    icon: ViewGrid,
    content: () => (
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Aperçu du Tableau de Bord</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded-md text-blue-800">Total Utilisateurs: 500</div>
          <div className="bg-green-100 p-4 rounded-md text-green-800">Ressources Publiées: 120</div>
          <div className="bg-yellow-100 p-4 rounded-md text-yellow-800">Discussions Actives: 45</div>
        </div>
      </div>
    ),
  },
  fonctionnalites: {
    label: 'Gestion Fonctionnalités',
    icon: Settings,
    content: () => (
      <section className="bg-white shadow-lg rounded-lg p-6">
        <AdminFonctionnalites />
      </section>
    ),
  },
  utilisateurs: {
    label: 'Gestion Utilisateurs',
    icon: Users,
    content: () => (
      <section className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4 pb-3 border-b border-gray-200">
          Gestion des Utilisateurs Standards
        </h2>
        <GestionUtilisateurs />
      </section>
    ),
  },
  professionnels: {
    label: 'Gestion Professionnels',
    icon: UserCheck,
    content: () => (
      <section className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4 pb-3 border-b border-gray-200">
          Gestion des Professionnels de Santé Mentale
        </h2>
        <GestionProfessionnels />
      </section>
    ),
  },
  messages: {
    label: 'Gestion Messages',
    icon: MessageCircle,
    content: () => (
      <section className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Modération des Discussions</h2>
        <ModerationDiscussions />
      </section>
    ),
  },
};

const TableauAdmin = () => {
  const [activeSection, setActiveSection] = useState('tableauDeBord');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('role');
    navigate('/connexion');
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
            {Object.entries(sections).map(([key, { label, icon: Icon }]) => (
              <li key={key} className="mb-2">
                <button
                  onClick={() => setActiveSection(key)}
                  className={`w-full text-left px-6 py-3 flex items-center gap-3 transition-colors duration-200 ${
                    activeSection === key ? 'bg-blue-600 text-white' : 'hover:bg-blue-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
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
            <LogOut className="w-5 h-5" />
            Se Déconnecter
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
        {sections[activeSection] ? sections[activeSection].content() : (
          <div className="p-6 text-center text-gray-600">
            Sélectionnez une option dans le menu latéral.
          </div>
        )}
      </main>
    </div>
  );
};

export default TableauAdmin;
