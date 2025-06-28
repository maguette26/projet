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
      <main className="flex flex-col items-center justify-start min-h-screen min-w-full pt-1 pb-1 bg-gradient-to-tr from-indigo-50 via-white to-indigo-50">
        <motion.div
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.1 }}
          className="mb-0.5 flex items-center gap-0.5"
        >
          <Smile className="w-2.5 h-2.5 text-indigo-600 animate-pulse" style={{ filter: 'drop-shadow(0 0 1px #6366f1)' }} />
          <h1 className="text-[9px] font-extrabold text-indigo-900 leading-none tracking-tight">
            Devenez Membre <span className="text-indigo-700">Premium</span> !
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05, duration: 0.1 }}
          className="text-center text-gray-700 max-w-3xl mb-0.5 px-1 text-[6px] font-semibold"
        >
          Débloquez l'accès illimité à toutes nos ressources exclusives : exercices avancés, vidéos guidées, podcasts experts, et plus.
        </motion.p>

        <section className="bg-white rounded-sm shadow-sm border border-indigo-300 p-1 max-w-xs w-full flex flex-col items-center">
          {Object.entries(plans).map(([key, plan]) => (
            <div key={key} className="mb-1 w-full px-1 border-b border-indigo-100 last:border-none">
              <p className="text-[8px] font-extrabold text-gray-900 leading-none tracking-tight">
                {plan.label} : {plan.price.toFixed(2)} € / <span className="text-[6px] text-gray-500">{plan.duration}</span>
              </p>
              <p className="text-[5.5px] text-gray-600 font-semibold">{plan.description}</p>
            </div>
          ))}
        </section>
      </main>
    </Layout>
  );
};

export default DevenirPremium;
