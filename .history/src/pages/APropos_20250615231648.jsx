import React from 'react';
import Header from '../components/commun/header';
import PiedPage from '../components/commun/PiedPage';
import { motion } from 'framer-motion';

const APropos = () => {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto p-8 bg-gradient-to-b from-white to-indigo-50 rounded-xl shadow-lg mt-16 mb-24 font-serif">
        <motion.h1 
          className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          À propos de PsyConnect
        </motion.h1>

        <motion.p 
          className="text-gray-800 mb-6 leading-relaxed text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Dans un monde où la santé mentale est souvent mise de côté, <strong>PsyConnect</strong> est né de la volonté de proposer un accompagnement bienveillant, professionnel et accessible à tous.
        </motion.p>

        <motion.p 
          className="text-gray-800 mb-6 leading-relaxed text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Nous mettons en relation des utilisateurs en quête de soutien avec des psychologues et psychiatres certifiés, dans un environnement 100% confidentiel et sécurisé.
        </motion.p>

        <motion.p 
          className="text-gray-800 mb-6 leading-relaxed text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          L'application inclut également un espace d'expression libre, pensé pour celles et ceux qui n’osent pas toujours parler directement. Ici, vos mots comptent, même les plus silencieux.
        </motion.p>

        <motion.p 
          className="text-gray-800 leading-relaxed text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Que vous soyez un professionnel de santé mentale ou une personne en quête de mieux-être, <strong>PsyConnect</strong> vous accompagne, pas à pas, vers une meilleure santé mentale.
        </motion.p>
      </main>
      <PiedPage />
    </>
  );
};

export default APropos;
