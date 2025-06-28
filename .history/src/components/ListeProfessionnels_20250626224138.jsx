// src/pages/DevenirPremium.jsx
import React, { useEffect, useState } from 'react';
import Layout from '../components/commun/Layout';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Smile, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const DevenirPremium = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const navigate = useNavigate();

  const plans = {
    monthly: {
      label: 'Mensuel',
      price: 3,
      duration: 'mois',
      description: 'Accès flexible, annulez à tout moment.',
    },
    quarterly: {
      label: 'Trimestriel',
      price: 10,
      duration: '3 mois',
      description: 'Économisez 15% par rapport au plan mensuel.',
    },
    annually: {
      label: 'Annuel',
      price: 30,
      duration: 'an',
      description: 'La meilleure offre : économisez 25% !',
    },
  };

  useEffect(() => {
    const loadPayPalScript = () => {
      const paypalClientId = "YOUR_PAYPAL_CLIENT_ID_GOES_HERE";
      if (!paypalClientId || paypalClientId === "YOUR_PAYPAL_CLIENT_ID_GOES_HERE") {
        setLoading(false);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=USD`;
      script.onload = () => {
        setLoading(false);
        renderPayPalButton();
      };
      script.onerror = () => {
        setError("Impossible de charger le script PayPal.");
        setLoading(false);
      };
      document.body.appendChild(script);
    };

    loadPayPalScript();

    return () => {
      const script = document.querySelector(`script[src^="https://www.paypal.com/sdk/js"]`);
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    const container = document.getElementById('paypal-button-container');
    if (container) {
      container.innerHTML = '';
    }
    if (!loading && window.paypal) {
      renderPayPalButton();
    }
  }, [selectedPlan, loading]);

  const renderPayPalButton = () => {
    if (window.paypal) {
      window.paypal.Buttons({
        createOrder: async () => {
          setError(null);
          try {
            const response = await api.post('/paypal/create-order', { plan: selectedPlan });
            const orderData = JSON.parse(response.data);
            return orderData.id;
          } catch (err) {
            setError(`Erreur lors de l'initialisation du paiement pour le plan ${plans[selectedPlan].label}.`);
            return Promise.reject(err);
          }
        },
        onApprove: async (data) => {
          setError(null);
          try {
            const response = await api.post(`/paypal/capture-order/${data.orderID}`);
            const captureData = JSON.parse(response.data);

            if (captureData.status === 'COMPLETED') {
              setSuccess(true);
              localStorage.setItem('role', 'PREMIUM');
              setTimeout(() => {
                navigate('/tableauUtilisateur');
              }, 3000);
            } else {
              setError(`Paiement non complété. Statut: ${captureData.status}`);
            }
          } catch (err) {
            setError("Erreur lors de la validation du paiement.");
          }
        },
        onCancel: () => setError("Le paiement a été annulé."),
        onError: () => setError("Une erreur est survenue avec PayPal."),
      }).render('#paypal-button-container');
    }
  };

  const currentPlan = plans[selectedPlan];

  return (
    <Layout>
      <main className="flex flex-col items-center justify-start min-h-[150vh] min-w-full pt-10 pb-10 bg-gradient-to-tr from-indigo-50 via-white to-indigo-50">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center gap-2"
        >
          <Smile 
            className="w-8 h-8 text-indigo-600 animate-bounce"
            style={{ filter: 'drop-shadow(0 0 4px #6366f1)' }}
          />
          <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-900 tracking-tight leading-tight">
            Devenez Membre <span className="text-indigo-700">Premium</span> !
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center text-gray-700 max-w-3xl mb-8 px-4 text-sm md:text-base font-medium"
        >
          Débloquez l'accès illimité à toutes nos ressources exclusives : exercices avancés, vidéos guidées,
          podcasts experts, et plus.
        </motion.p>

        <motion.section
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-white rounded-xl shadow-xl border border-indigo-300 p-8 max-w-2xl w-full flex flex-col items-center"
        >
          <h2 className="text-lg md:text-xl font-semibold text-indigo-700 mb-5 flex items-center gap-1.5">
            <CreditCard 
              className="w-5 h-5 text-indigo-700 animate-pulse" 
              style={{ filter: 'drop-shadow(0 0 3px #4338ca)' }}
            />{" "}
            Choisissez votre plan d'abonnement
          </h2>

          <div className="flex justify-center space-x-4 mb-8">
            {Object.keys(plans).map((planKey) => (
              <button
                key={planKey}
                onClick={() => setSelectedPlan(planKey)}
                className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold transition duration-300 focus:outline-none focus:ring-3 focus:ring-indigo-500 ${
                  selectedPlan === planKey
                    ? 'bg-indigo-700 text-white shadow-md transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {plans[planKey].label}
              </button>
            ))}
          </div>

          <div className="mb-6 text-center">
            <p className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 tracking-tight">
              {currentPlan.price.toFixed(2)} € <span className="text-lg md:text-xl text-gray-500">/ {currentPlan.duration}</span>
            </p>
            <p className="text-sm text-gray-600 max-w-lg mx-auto font-medium">{currentPlan.description}</p>
          </div>

          {loading ? (
            <p className="text-indigo-600 font-semibold text-sm animate-pulse">Chargement du bouton de paiement...</p>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-5 text-sm max-w-md mx-auto">
              {error}
            </div>
          ) : success ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-5 text-sm max-w-md mx-auto">
              Paiement réussi ! Vous êtes maintenant membre Premium. Redirection...
            </div>
          ) : (
            <div
              id="paypal-button-container"
              className="w-full max-w-xs mx-auto"
            />
          )}
        </motion.section>
      </main>
    </Layout>
  );
};

export default DevenirPremium;
