import React, { useEffect, useState } from 'react';
import { Smile, Users, Settings, UserCheck, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TableauAdmin = () => {
  const [adminName, setAdminName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const prenom = localStorage.getItem('prenom');
    const nom = localStorage.getItem('nom');
    if (prenom && nom) {
      setAdminName(`${prenom} ${nom}`);
    } else if (prenom) {
      setAdminName(prenom);
    } else {
      setAdminName('');
    }
  }, []);

  const sections = [
    { key: 'utilisateurs', label: 'Gestion Utilisateurs', icon: <Users className="w-6 h-6" />, path: '/gestion-utilisateurs' },
    { key: 'fonctionnalites', label: 'Fonctionnalités', icon: <Settings className="w-6 h-6" />, path: '/gestion-fonctionnalites' },
    { key: 'professionnels', label: 'Professionnels', icon: <UserCheck className="w-6 h-6" />, path: '/gestion-professionnels' },
    { key: 'messages', label: 'Messages', icon: <MessageSquare className="w-6 h-6" />, path: '/gestion-messages' },
  ];

  return (
    <div className="min-h-[70vh] bg-gradient-to-r from-indigo-100 via-white to-indigo-100 p-10 rounded-xl shadow-lg max-w-4xl mx-auto flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-indigo-700 mb-6 flex items-center gap-3">
        Bonjour, <span className="text-indigo-900">{adminName || 'Admin'}</span>
        <Smile className="w-10 h-10 text-yellow-400" />
      </h1>
      <p className="text-lg text-gray-700 text-center max-w-xl mb-8 leading-relaxed">
        Bienvenue sur votre espace administrateur PsyConnect. Utilisez les sections ci-dessous pour gérer les utilisateurs, les professionnels, modérer les discussions, et configurer les fonctionnalités de la plateforme.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-3xl">
        {sections.map(({ key, label, icon, path }) => (
          <button
            key={key}
            onClick={() => navigate(path)}
            className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer text-indigo-700 font-semibold select-none"
          >
            <div className="mb-3">{icon}</div>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TableauAdmin;
