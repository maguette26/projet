// src/pages/DevenirPremium.jsx
import React, { useState } from 'react';
import Layout from '../components/commun/Layout';
import { Smile, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import PaymentForm from '../components/utilisateur/PaymentForm'; // ton modal universel

const DevenirPremium = () => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const plans = {
    monthly: { label: 'Mensuel', price: 3, duration: 'mois', description: 'Accès flexible, annulez à tout moment.' },
    quarterly: { label: 'Trimestriel', price: 10, duration: '3 mois', description: 'Économisez 15% par rapport au plan mensuel.' },
    annually: { label: 'Annuel', price: 30, duration: 'an', description: 'La meilleure offre : économisez 25% !' },
  };

  const currentPlan = plans[selectedPlan];

  return (
    <Layout>
      <main className="flex flex-col items-center justify-start min-h-screen w-full pt-8 pb-8 bg-gradient-to-tr from-indigo-50 via-white to-indigo-50">
        
        {/* Header du premium */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-6 flex items-center gap-2">
          <Smile className="w-10 h-10 text-indigo-600 animate-bounce" style={{ filter: 'drop-shadow(0 0 5px #6366f1)' }} />
          <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-900 tracking-tight">
            Devenez Membre <span className="text-indigo-700">Premium</span> !
          </h1>
        </motion.div>

        {/* Section des plans */}
        <motion.section initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5, duration: 0.7 }} className="bg-white rounded-2xl shadow-2xl border border-indigo-300 p-8 max-w-3xl w-full flex flex-col items-center">

          <h2 className="text-lg md:text-xl font-semibold text-indigo-700 mb-4 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-indigo-700 animate-pulse" /> Choisissez votre plan
          </h2>

          {/* Choix du plan */}
          <div className="flex justify-center space-x-3 mb-6">
            {Object.keys(plans).map((planKey) => (
              <button
                key={planKey}
                onClick={() => setSelectedPlan(planKey)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition duration-300 focus:outline-none focus:ring-0 ${
                  selectedPlan === planKey
                    ? 'bg-indigo-700 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {plans[planKey].label}
              </button>
            ))}
          </div>

          {/* Affichage du prix */}
          <div className="mb-6 text-center">
            <p className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 tracking-tight">
              {currentPlan.price.toFixed(2)} € <span className="text-lg md:text-xl text-gray-500">/ {currentPlan.duration}</span>
            </p>
            <p className="text-sm text-gray-600 max-w-lg mx-auto font-medium">{currentPlan.description}</p>
          </div>

          {/* Bouton pour ouvrir le modal de paiement */}
          <button
            onClick={() => setShowPaymentModal(true)}
            className="w-full max-w-sm bg-indigo-700 text-white px-4 py-3 rounded-xl shadow-lg hover:bg-indigo-800 transition"
          >
            Devenir Premium
          </button>

        </motion.section>

        {/* Modal universel de paiement */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <PaymentForm
              paymentFor="premium"          // indique que c'est pour Premium
              itemId={selectedPlan}         // plan sélectionné
              onClose={() => setShowPaymentModal(false)}
            />
          </div>
        )}

      </main>
    </Layout>
  );
};

export default DevenirPremium;