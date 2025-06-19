import React from 'react';
import Header from '../components/commun/header';
import PiedPage from '../components/commun/PiedPage';
import { motion } from 'framer-motion';

const APropos = () => {
  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto p-10 bg-gradient-to-b from-white to-indigo-50 rounded-2xl shadow-xl mt-16 mb-28 font-serif">
        <motion.h1 
          className="text-5xl font-extrabold text-indigo-700 mb-10 text-center"
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
          Dans notre société moderne, la santé mentale est encore trop souvent négligée, mal comprise ou stigmatisée. De nombreuses personnes souffrent en silence, sans savoir vers qui se tourner, par peur du jugement ou faute de moyens adaptés. C'est à partir de ce constat que <strong>PsyConnect</strong> est né.
        </motion.p>

        <motion.p 
          className="text-gray-800 mb-6 leading-relaxed text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <strong>PsyConnect</strong> est bien plus qu'une simple plateforme. C'est un espace sécurisé, confidentiel et bienveillant, conçu pour connecter les utilisateurs avec des professionnels de santé mentale qualifiés (psychologues, psychiatres). Notre objectif : rendre l'accompagnement psychologique accessible à tous, peu importe l’endroit où l’on se trouve ou la situation dans laquelle on est.
        </motion.p>

        <motion.p 
          className="text-gray-800 mb-6 leading-relaxed text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Nous offrons également une zone d’expression personnelle et libre. Un forum confidentiel est mis à disposition pour permettre aux utilisateurs d’échanger, de raconter ce qu’ils ressentent, ou simplement d’écrire ce qu’ils n’osent pas dire ailleurs. C’est un endroit où les mots peuvent enfin sortir, sans peur, sans jugement.
        </motion.p>

        <motion.p 
          className="text-gray-800 mb-6 leading-relaxed text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <strong>Pour les professionnels de santé mentale</strong>, PsyConnect est une opportunité d’élargir leur portée, de gérer leurs disponibilités facilement et d’entrer en contact avec des patients dans un cadre sécurisé et fluide. Toutes les réservations de consultations se font en quelques clics, avec un système de notifications et de suivi en temps réel.
        </motion.p>

        <motion.p 
          className="text-gray-800 mb-6 leading-relaxed text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          La santé mentale n’est pas un luxe, elle est essentielle. Chez PsyConnect, nous croyons fermement que chaque individu mérite d’être écouté, soutenu et accompagné. Qu’il s’agisse d’un simple moment de stress, d’un mal-être plus profond ou d’un trouble nécessitant un suivi, notre plateforme est là pour vous.
        </motion.p>

        <motion.p 
          className="text-gray-800 leading-relaxed text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Rejoignez-nous dans cette mission humaine. Ensemble, brisons les tabous, construisons un monde plus à l’écoute, et faisons de la santé mentale une priorité pour tous.
        </motion.p>
      </main>
      <PiedPage />
    </>
  );
};

export default APropos;
