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
        layout: 'horizontal',
        color: 'gold',
        shape: 'rect',
        label: 'paypal',
        tagline: false,
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
      <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-white">
        <div className="w-full max-w-md border border-gray-300 rounded-lg p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">Devenez Membre Premium</h1>
          <p className="text-center text-gray-700 mb-8">
            Accédez à toutes les ressources exclusives : exercices avancés, vidéos guidées, podcasts experts et plus encore.
          </p>

          <div className="flex justify-between mb-6 space-x-3">
            {Object.keys(plans).map((planKey) => (
              <button
                key={planKey}
                onClick={() => setSelectedPlan(planKey)}
                className={`flex-1 py-3 rounded-md font-semibold transition-colors duration-200 focus:outline-none ${
                  selectedPlan === planKey
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {plans[planKey].label}
              </button>
            ))}
          </div>

          <div className="text-center mb-8">
            <p className="text-4xl font-extrabold text-gray-900 mb-1">
              {currentPlan.price.toFixed(2)} €
              <span className="text-base font-normal text-gray-600"> / {currentPlan.duration}</span>
            </p>
            <p className="text-sm text-gray-500">{currentPlan.description}</p>
          </div>

          {loading ? (
            <div className="text-center text-blue-600 font-medium animate-pulse">
              Chargement du bouton PayPal...
            </div>
          ) : error ? (
            <div className="mb-4 text-center text-red-600 font-medium">{error}</div>
          ) : success ? (
            <div className="mb-4 text-center text-green-600 font-semibold">
              Paiement réussi ! Vous êtes maintenant membre Premium. Redirection en cours...
            </div>
          ) : (
            <div id="paypal-button-container" className="w-full" />
          )}
        </div>
      </main>
    </Layout>
  );
};

export default DevenirPremium;
