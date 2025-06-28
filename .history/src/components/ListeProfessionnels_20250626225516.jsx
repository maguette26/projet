// src/pages/DevenirPremium.jsx
import React from 'react';
import Layout from '../components/commun/Layout';
import { Smile } from 'lucide-react';
import { motion } from 'framer-motion';

const DevenirPremium = () => {
  const plans = {
    monthly: {
      label: 'Mensuel',
      price: 3,
      duration: 'mois',
      description: 'Flexible, annulez à tout moment.',
    },
    quarterly: {
      label: 'Trimestriel',
      price: 10,
      duration: '3 mois',
      description: 'Économisez 15%.',
    },
    annually: {
      label: 'Annuel',
      price: 30,
      duration: 'an',
      description: 'Économisez 25% !',
    },
  };

  return (
    <Layout>
      <main
        className="flex flex-col items-center justify-start min-h-screen pt-0 bg-gradient-to-tr from-indigo-50 via-white to-indigo-50"
        style={{ marginTop: '-12px' }}
      >
        <motion.div
          initial={{ opacity: 0, y: -1 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.05 }}
          className="mb-[1px] flex items-center gap-[1px]"
        >
          <Smile className="w-[9px] h-[9px] text-indigo-600 animate-pulse" style={{ filter: 'drop-shadow(0 0 1px #6366f1)' }} />
          <h1 className="text-[8px] font-bold text-indigo-900 tracking-tight leading-none select-none">
            Premium <span className="text-indigo-700">!</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.02, duration: 0.05 }}
          className="text-center text-gray-600 max-w-[140px] mb-[2px] px-[2px] text-[6px] font-medium select-none"
        >
          Accès illimité aux vidéos, podcasts et contenus avancés.
        </motion.p>

        <section className="bg-white rounded border border-indigo-300 p-[3px] max-w-[150px] w-full flex flex-col items-center">
          {Object.entries(plans).map(([key, plan]) => (
            <div
              key={key}
              className="mb-[2px] w-full px-[2px] border-b border-indigo-100 last:border-none"
            >
              <p className="text-[7px] font-bold text-gray-900 leading-none tracking-tight select-none">
                {plan.label} : {plan.price.toFixed(2)} € /
                <span className="text-[5px] text-gray-500"> {plan.duration}</span>
              </p>
              <p className="text-[4.5px] text-gray-500 font-medium select-none">{plan.description}</p>
            </div>
          ))}
        </section>
      </main>
    </Layout>
  );
};

export default DevenirPremium;
