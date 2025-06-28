// src/pages/DevenirPremium.jsx
import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../components/commun/Layout';
import { Smile, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
 

const plans = {
  monthly: { label: 'Mensuel', price: 3, duration: 'mois', description: 'Accès flexible, annulez à tout moment.' },
  quarterly: { label: 'Trimestriel', price: 10, duration: '3 mois', description: 'Économisez 15% par rapport au plan mensuel.' },
  annually: { label: 'Annuel', price: 30, duration: 'an', description: 'La meilleure offre : économisez 25% !' },
};

const DevenirPremium = () => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [reservationId, setReservationId] = useState(null); // Ici, pour simplifier, on simule un id de réservation/commande

  // Simuler création réservation ou commande sur sélection + bouton "Procéder au paiement"
  const handleStartPayment = () => {
    // Ici, normalement tu ferais un appel API pour créer une commande liée à l'abonnement sélectionné
    // et récupérer un reservationId / orderId que tu passes ensuite au PaymentForm.
    // Pour l'exemple, on simule un id :
    const fakeReservationId = Date.now(); // juste un id temporaire
    setReservationId(fakeReservationId);
    setShowPaymentForm(true);
  };

  const currentPlan = plans[selectedPlan];

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center min-h-[150vh] min-w-full p-8 bg-gradient-to-tr from-indigo-50 via-white to-indigo-50">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8 flex items-center gap-3">
          <Smile className="w-10 h-10 text-indigo-600" />
          <h1 className="text-3xl font-extrabold text-indigo-900">
            Devenez Membre <span className="text-indigo-700">Premium</span> !
          </h1>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }} className="text-center text-gray-700 max-w-xl mb-8 px-4">
          Débloquez l'accès illimité à toutes nos ressources exclusives : exercices avancés, vidéos guidées,
          podcasts experts, et plus.
        </motion.p>

        <motion.section initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }} className="bg-white rounded-xl shadow-lg border border-indigo-200 p-8 max-w-lg w-full flex flex-col items-center">
          <h2 className="text-xl font-semibold text-indigo-700 mb-6 flex items-center gap-2">
            <CreditCard className="w-6 h-6" /> Choisissez votre plan d'abonnement
          </h2>

          <div className="flex justify-center space-x-3 mb-8">
            {Object.keys(plans).map((planKey) => (
              <button
                key={planKey}
                onClick={() => setSelectedPlan(planKey)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  selectedPlan === planKey
                    ? 'bg-indigo-600 text-white shadow-lg transform scale-110'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                disabled={showPaymentForm}
              >
                {plans[planKey].label}
              </button>
            ))}
          </div>

          <div className="mb-8 text-center">
            <p className="text-5xl font-extrabold text-gray-900 mb-2">
              {currentPlan.price.toFixed(2)} € <span className="text-lg text-gray-500">/ {currentPlan.duration}</span>
            </p>
            <p className="text-sm text-gray-600 max-w-xs mx-auto">{currentPlan.description}</p>
          </div>

          {!showPaymentForm ? (
            <button
              onClick={handleStartPayment}
              className="px-8 py-3 bg-indigo-600 text-white rounded-full font-semibold shadow-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              Procéder au paiement
            </button>
          ) : (
            reservationId && (
              <div className="w-full mt-4">
                <PaymentForm
                  reservationId={reservationId}
                  onClose={() => setShowPaymentForm(false)}
                />
              </div>
            )
          )}
        </motion.section>
      </main>
    </Layout>
  );
};

export default DevenirPremium;
