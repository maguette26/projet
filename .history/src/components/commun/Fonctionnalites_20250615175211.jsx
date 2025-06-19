import React from 'react';
import { Stethoscope, BookOpen, Users } from 'lucide-react';

const fonctionnalites = [
  {
    titre: 'Consulter un professionnel',
    description: 'Prenez rendez-vous avec un psychologue ou un psychiatre qualifié en toute confidentialité.',
    icon: <Stethoscope className="h-8 w-8 text-indigo-600" />,
  },
  {
    titre: 'Accéder à des ressources',
    description: 'Lisez des articles fiables, des conseils et des exercices pour prendre soin de votre santé mentale.',
    icon: <BookOpen className="h-8 w-8 text-indigo-600" />,
  },
  {
    titre: 'Partager dans la communauté',
    description: 'Exprimez-vous librement dans un espace bienveillant et anonyme grâce au forum public.',
    icon: <Users className="h-8 w-8 text-indigo-600" />,
  },
];

const Fonctionnalites = () => {
  return (
    <section className="mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Nos fonctionnalités principales</h2>
      <div className="grid gap-8 md:grid-cols-3">
        {fonctionnalites.map((fct, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="flex items-center justify-center mb-4">
              {fct.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">{fct.titre}</h3>
            <p className="text-gray-600 text-sm text-center">{fct.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Fonctionnalites;
