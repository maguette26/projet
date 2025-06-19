import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smile } from 'lucide-react'; // icône emoji via lucide

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
  const [adminName, setAdminName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Par exemple on récupère le prénom stocké dans localStorage (à adapter selon ton contexte)
    const storedName = localStorage.getItem('prenom'); // Ou adapte la clé selon ton stockage
    if (storedName) {
      setAdminName(storedName);
    } else {
      setAdminName(''); // vide si rien trouvé
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('prenom'); // si tu stockes aussi le prénom
    navigate('/connexion');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'tableauDeBord':
        return (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Bonjour {adminName} <Smile className="inline-block w-6 h-6 text-yellow-400 ml-2" />
            </h2>

            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {menuItems.map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key)}
                  className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition"
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>

            <section className="bg-gray-100 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-2">Notifications récentes</h3>
              <ul className="list-disc list-inside text-gray-700">
                <li>Nouvel utilisateur inscrit</li>
                <li>Discussion signalée en attente de modération</li>
                <li>Mise à jour disponible pour les fonctionnalités</li>
              </ul>
            </section>
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
                  className={`w-full text-left px-6 py-3 flex items-center gap-3 hover:bg-blue-600 transition rounded
                    ${activeSection === key ? 'bg-blue-600' : 'bg-blue-800'}`}
                >
                  {icon}
                  <span>{label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <button
          onClick={handleLogout}
          className="mb-6 mx-6 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold transition"
        >
          Déconnexion
        </button>
      </aside>

      <main className="flex-grow p-8 overflow-auto">{renderContent()}</main>
    </div>
  );
};

export default TableauAdmin;
