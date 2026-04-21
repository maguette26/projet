import React from 'react';
import { Stethoscope, BookOpen, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const fonctionnalites = [
  {
    titre: 'Consulter un professionnel',
    description:
      'Prenez rendez-vous avec un psychologue ou un psychiatre qualifié en toute confidentialité.',
    icon: <Stethoscope className="h-8 w-8 text-indigo-600" />,
  },
  {
    titre: 'Accéder à des ressources',
    description:
      'Lisez des articles fiables, des conseils et des exercices pour prendre soin de votre santé mentale.',
    icon: <BookOpen className="h-8 w-8 text-indigo-600" />,
  },
  {
    titre: 'Partager dans la communauté',
    description:
      'Exprimez-vous librement dans un espace bienveillant et anonyme grâce au forum public.',
    icon: <Users className="h-8 w-8 text-indigo-600" />,
  },
];

// 🍏 CONTAINER ANIMATION (stagger global)
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.2,
    },
  },
};

// 🍏 ITEM ANIMATION (Apple-like smooth spring)
const itemVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.96,
    filter: "blur(6px)",
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1], // Apple-like easing
    },
  },
};

const Fonctionnalites = () => {
  return (
    <section className="mt-24 max-w-7xl mx-auto px-4 text-center">

      {/* 🍏 TITRE */}
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-gray-800 mb-14"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          ease: [0.16, 1, 0.3, 1],
        }}
        viewport={{ once: true }}
      >
        Nos fonctionnalités principales
      </motion.h2>

      {/* 🍏 GRID AVEC STAGGER */}
      <motion.div
        className="grid md:grid-cols-3 gap-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {fonctionnalites.map((fct, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-md border border-gray-100 cursor-pointer"
            whileHover={{
              scale: 1.05,
              y: -8,
              boxShadow: "0px 20px 40px rgba(0,0,0,0.12)",
            }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 14,
            }}
          >
            <div className="flex justify-center mb-5">
              {fct.icon}
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {fct.titre}
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed">
              {fct.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Fonctionnalites;