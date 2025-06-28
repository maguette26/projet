// src/pages/DevenirPremium.jsx
import React from 'react';
import Layout from '../components/commun/Layout';
import { Smile } from 'lucide-react';
import { motion } from 'framer-motion';

const DevenirPremium = () => {
  const plans = {
    monthly: { label: 'Mensuel', price: 3, duration: 'mois', description: 'Accès flexible, annulez à tout moment.' },
    quarterly: { label: 'Trimestriel', price: 10, duration: '3 mois', description: 'Économisez 15% par rapport au plan mensuel.' },
    annually: { label: 'Annuel', price: 30, duration: 'an', description: 'La meilleure offre : économisez 25% !' },
  };

  return (
    <Layout>
      <main
        className="flex flex-col items-center justify-start min-h-screen pt-0 bg-gradient-to-tr from-indigo-50 via-white to-indigo-50"
        style={{ marginTop: '-10px' }}
      >
        <motion.div
          initial={{ opacity: 0, y: -1 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.05 }}
          className="mb-0.25 flex items-center gap-0.25"
        >
          <Smile className="w-2 h-2 text-indigo-600 animate-pulse" style={{ filter: 'drop-shadow(0 0 1px #6366f1)' }} />
          <h1 className="text-[7px] font-extrabold text-indigo-900 leading-none tracking-tight select-none">
            Devenez Membre <span className="text-indigo-700">Premium</span> !
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.02, duration: 0.05 }}
          className="text-center text-gray-700 max-w-xs mb-0.25 px-0.5 text-[5px] font-semibold select-none"
        >
          Débloquez l'accès illimité à toutes nos ressources exclusives : exercices avancés, vidéos guidées, podcasts experts, et plus.
        </motion.p>

        <section className="bg-white rounded border border-indigo-300 p-0.5 max-w-xs w-full flex flex-col items-center">
          {Object.entries(plans).map(([key, plan]) => (
            <div key={key} className="mb-0.5 w-full px-1 border-b border-indigo-100 last:border-none">
              <p className="text-[6px] font-extrabold text-gray-900 leading-none tracking-tight select-none">
                {plan.label} : {plan.price.toFixed(2)} € / <span className="text-[3.5px] text-gray-500">{plan.duration}</span>
              </p>
              <p className="text-[4px] text-gray-600 font-semibold select-none">{plan.description}</p>
            </div>
          ))}
        </section>
      </main>
    </Layout>
  );
};

export default DevenirPremium;
