// src/pages/DevenirPremium.jsx
import React, { useState } from 'react';
import Layout from '../components/commun/Layout';
import PaymentForm from '../components/utilisateur/PaymentForm';

const DevenirPremium = () => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [showModal, setShowModal] = useState(false);

  const plans = {
    monthly: { label: 'Mensuel', price: 3, description: 'Accès flexible, annulez à tout moment.' },
    quarterly: { label: 'Trimestriel', price: 10, description: 'Économisez 15% par rapport au plan mensuel.' },
    annually: { label: 'Annuel', price: 30, description: 'Économisez 25% par rapport au plan mensuel.' },
  };

  const handleSubscribe = () => {
    setShowModal(true);
  };

  return (
    <Layout>
      <main className="flex flex-col items-center justify-start min-h-screen w-full pt-8 pb-8 bg-gradient-to-tr from-indigo-50 via-white to-indigo-50">
        <h1 className="text-3xl font-extrabold text-indigo-900 mb-4">
          Devenez membre <span className="text-indigo-700">Premium</span> !
        </h1>
        <p className="text-gray-700 max-w-xl text-center mb-6">
          Débloquez l'accès illimité à toutes nos ressources exclusives : exercices avancés, vidéos guidées, podcasts experts et plus.
        </p>

        <div className="flex space-x-3 mb-6">
          {Object.keys(plans).map((key) => (
            <button
              key={key}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                selectedPlan === key
                  ? 'bg-indigo-700 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedPlan(key)}
            >
              {plans[key].label}
            </button>
          ))}
        </div>

        <div className="text-center mb-6">
          <p className="text-4xl font-extrabold text-gray-900 mb-2">
            {plans[selectedPlan].price} € <span className="text-lg text-gray-500">/ {selectedPlan}</span>
          </p>
          <p className="text-gray-600">{plans[selectedPlan].description}</p>
        </div>

        <button
          onClick={handleSubscribe}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition"
        >
          S'abonner
        </button>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
            <PaymentForm
              planId={selectedPlan}
              onClose={() => setShowModal(false)}
              isPremium={true} // indique que c’est un paiement Premium
            />
          </div>
        )}
      </main>
    </Layout>
  );
};

export default DevenirPremium;