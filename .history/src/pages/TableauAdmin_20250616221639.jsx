// src/pages/TableauAdmin.jsx
import React, { useState } from 'react';
import { Smile, Users, Settings, UserCheck, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const TableauAdmin = () => {
  const [activeSection, setActiveSection] = useState('tableauDeBord');

  // Récupération du prénom + nom dans le localStorage
  const adminName = `${localStorage.getItem('prenom') || ''} ${localStorage.getItem('nom') || ''}`.trim();

  const renderContent = () => {
    switch (activeSection) {
      case 'tableauDeBord':
        return (
          <div className="p-8 bg-white rounded-lg shadow max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              Bonjour, <span className="text-indigo-700">{adminName || 'Admin'}</span> <Smile className="w-8 h-8 text-yellow-400" />
            </h2>
            <p className="mb-8 text-gray-600 text-lg leading-relaxed">
              Bienvenue sur votre tableau de bord. Utilisez les sections ci-dessous pour gérer les utilisateurs, les professionnels, modérer les discussions, et configurer les fonctionnalités de la plateforme.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <button
                onClick={() => setActiveSection('utilisateurs')}
                className="flex flex-col items-center p-5 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition cursor-pointer"
              >
                <Users className="w-7 h-7 text-indigo-600 mb-2" />
                <span className="text-indigo-700 font-semibold">Gestion Utilisateurs</span>
              </button>

              <button
                onClick={() => setActiveSection('professionnels')}
                className="flex flex-col items-center p-5 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition cursor-pointer"
              >
                <UserCheck className="w-7 h-7 text-indigo-600 mb-2" />
                <span className="text-indigo-700 font-semibold">Gestion Professionnels</span>
              </button>

              <button
                onClick={() => setActiveSection('fonctionnalites')}
                className="flex flex-col items-center p-5 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition cursor-pointer"
              >
                <Settings className="w-7 h-7 text-indigo-600 mb-2" />
                <span className="text-indigo-700 font-semibold">Gestion Fonctionnalités</span>
              </button>

              <button
                onClick={() => setActiveSection('messages')}
                className="flex flex-col items-center p-5 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition cursor-pointer"
              >
                <MessageSquare className="w-7 h-7 text-indigo-600 mb-2" />
                <span className="text-indigo-700 font-semibold">Modération Messages</span>
              </button>
            </div>
          </div>
        );

      case 'utilisateurs':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Gestion des Utilisateurs</h2>
            <p>Contenu de gestion des utilisateurs ici...</p>
            <button onClick={() => setActiveSection('tableauDeBord')} className="mt-4 text-indigo-600 hover:underline">
              ← Retour au tableau de bord
            </button>
          </div>
        );

      case 'professionnels':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Gestion des Professionnels</h2>
            <p>Contenu de gestion des professionnels ici...</p>
            <button onClick={() => setActiveSection('tableauDeBord')} className="mt-4 text-indigo-600 hover:underline">
              ← Retour au tableau de bord
            </button>
          </div>
        );

      case 'fonctionnalites':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Gestion des Fonctionnalités</h2>
            <p>Contenu de gestion des fonctionnalités ici...</p>
            <button onClick={() => setActiveSection('tableauDeBord')} className="mt-4 text-indigo-600 hover:underline">
              ← Retour au tableau de bord
            </button>
          </div>
        );

      case 'messages':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Modération des Messages</h2>
            <p>Contenu de modération des messages ici...</p>
            <button onClick={() => setActiveSection('tableauDeBord')} className="mt-4 text-indigo-600 hover:underline">
              ← Retour au tableau de bord
            </button>
          </div>
        );

      default:
        return <div>Sélectionnez une option dans le menu latéral.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar / Navbar */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col h-full shadow-lg">
        <div className="p-6 text-2xl font-bold border-b border-indigo-700">PsyConnect Admin</div>
        <nav className="flex flex-col flex-grow p-4 space-y-2">
          <button
            onClick={() => setActiveSection('tableauDeBord')}
            className={`text-left px-3 py-2 rounded hover:bg-indigo-700 transition ${
              activeSection === 'tableauDeBord' ? 'bg-indigo-700 font-semibold' : ''
            }`}
          >
            Tableau de bord
          </button>
          <button
            onClick={() => setActiveSection('utilisateurs')}
            className={`text-left px-3 py-2 rounded hover:bg-indigo-700 transition ${
              activeSection === 'utilisateurs' ? 'bg-indigo-700 font-semibold' : ''
            }`}
          >
            Gestion Utilisateurs
          </button>
          <button
            onClick={() => setActiveSection('professionnels')}
            className={`text-left px-3 py-2 rounded hover:bg-indigo-700 transition ${
              activeSection === 'professionnels' ? 'bg-indigo-700 font-semibold' : ''
            }`}
          >
            Gestion Professionnels
          </button>
          <button
            onClick={() => setActiveSection('fonctionnalites')}
            className={`text-left px-3 py-2 rounded hover:bg-indigo-700 transition ${
              activeSection === 'fonctionnalites' ? 'bg-indigo-700 font-semibold' : ''
            }`}
          >
            Gestion Fonctionnalités
          </button>
          <button
            onClick={() => setActiveSection('messages')}
            className={`text-left px-3 py-2 rounded hover:bg-indigo-700 transition ${
              activeSection === 'messages' ? 'bg-indigo-700 font-semibold' : ''
            }`}
          >
            Modération Messages
          </button>
        </nav>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 overflow-y-auto p-8">{renderContent()}</main>
    </div>
  );
};

export default TableauAdmin;
