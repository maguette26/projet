// src/pages/DevenirPremium.jsx
import React, { useEffect, useState } from 'react';
import Layout from '../components/commun/Layout';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

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
      script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=EUR`;
      script.async = true;
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
      if (script) document.body.removeChild(script);
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
    if (!window.paypal) return;
    window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'blue',
        shape: 'pill',
        label: 'pay',
      },
      createOrder: async () => {
        setError(null);
        try {
          const response = await api.post('/paypal/create-order', { plan: selectedPlan });
          const orderData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
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
          const captureData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

          if (captureData.status === 'COMPLETED') {
            setSuccess(true);
            localStorage.setItem('role', 'PREMIUM');
            setTimeout(() => navigate('/tableauUtilisateur'), 3000);
          } else {
            setError(`Paiement non complété. Statut: ${captureData.status}`);
          }
        } catch {
          setError("Erreur lors de la validation du paiement.");
        }
      },
      onCancel: () => setError("Le paiement a été annulé."),
      onError: () => setError("Une erreur est survenue avec PayPal."),
    }).render('#paypal-button-container');
  };

  const currentPlan = plans[selectedPlan];

  return (
    <Layout>
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-tr from-indigo-50 via-white to-indigo-50 px-4 py-12">
        <div className="max-w-xl w-full bg-white rounded-xl shadow-xl p-8 md:p-12 border border-indigo-200">
          <h1 className="text-3xl font-extrabold text-indigo-800 mb-4 text-center">Devenez Membre Premium !</h1>
          <p className="text-center text-gray-700 mb-8 leading-relaxed">
            Débloquez un accès illimité à toutes nos ressources exclusives : exercices avancés, vidéos guidées, podcasts experts, et plus encore.
          </p>

          {/* Choix des plans */}
          <div className="flex justify-center space-x-3 mb-8 flex-wrap">
            {Object.keys(plans).map((planKey) => (
              <button
                key={planKey}
                onClick={() => setSelectedPlan(planKey)}
                className={`px-5 py-2 rounded-full font-semibold transition-transform duration-300 focus:outline-none ${
                  selectedPlan === planKey
                    ? 'bg-indigo-700 text-white shadow-lg scale-105'
                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                }`}
              >
                {plans[planKey].label}
              </button>
            ))}
          </div>

          {/* Détails du plan sélectionné */}
          <div className="text-center mb-8">
            <p className="text-5xl font-extrabold text-indigo-900 mb-2">
              {currentPlan.price.toFixed(2)} € <span className="text-lg text-gray-500 font-normal">/ {currentPlan.duration}</span>
            </p>
            <p className="text-sm text-gray-600 max-w-md mx-auto">{currentPlan.description}</p>
          </div>

          {/* Affichage du paiement */}
          <div className="flex flex-col items-center">
            {loading ? (
              <div className="flex items-center space-x-2 text-indigo-600 font-semibold text-sm animate-pulse">
                <svg
                  className="w-5 h-5 text-indigo-500 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Chargement du bouton de paiement...
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 max-w-md text-center">
                {error}
              </div>
            ) : success ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 max-w-md text-center font-semibold">
                Paiement réussi ! Vous êtes maintenant membre Premium. Redirection en cours...
              </div>
            ) : (
              <div id="paypal-button-container" className="w-full max-w-xs" />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DevenirPremium;
