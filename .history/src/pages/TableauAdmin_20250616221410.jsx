import { Smile, Users, Settings, UserCheck, MessageSquare } from 'lucide-react';

// À mettre dans ton composant TableauAdmin
const adminName = `${localStorage.getItem('prenom') || ''} ${localStorage.getItem('nom') || ''}`.trim();

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
  // ... les autres cases restent inchangées
}
