import React from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, BookOpen, Users } from 'lucide-react';

const fonctionnalites = [
  {
    titre: 'Consulter un professionnel',
    description: 'Prenez rendez-vous avec un psychologue ou un psychiatre qualifié en toute confidentialité.',
    icon: <Stethoscope className="h-10 w-10 text-indigo-600" />, 
  },
  {
    titre: 'Accéder à des ressources',
    description: 'Lisez des articles fiables, des conseils et des exercices pour prendre soin de votre santé mentale.',
    icon: <BookOpen className="h-10 w-10 text-indigo-600" />, 
  },
  {
    titre: 'Partager dans la communauté',
    description: 'Exprimez-vous librement dans un espace bienveillant et anonyme grâce au forum public.',
    icon: <Users className="h-10 w-10 text-indigo-600" />, 
  },
];

const Fonctionnalites = () => {
  return (
    <section className="mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.h2 
        initial={{ opacity: 0, y: -30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-center text-gray-800 mb-12"
      >
        Nos fonctionnalités principales
      </motion.h2>

      <div className="grid gap-10 md:grid-cols-3">
        {fonctionnalites.map((fct, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            whileHover={{ y: -8, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
            className="bg-white p-6 rounded-xl shadow-md transition-transform duration-300"
          >
            <div className="flex items-center justify-center mb-4">
              {fct.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">{fct.titre}</h3>
            <p className="text-gray-600 text-sm text-center">{fct.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Fonctionnalites;
