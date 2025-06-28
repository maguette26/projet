// src/pages/DevenirPremium.jsx
import React, { useEffect, useState } from 'react';
import Layout from '../components/commun/Layout';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Coffee, Calendar, Gift, Star, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
      icon: <Coffee className="w-6 h-6 inline-block mr-2 text-yellow-500" />,
    },
    quarterly: {
      label: 'Trimestriel',
      price: 10,
      duration: '3 mois',
      description: 'Économisez 15% par rapport au plan mensuel.',
      icon: <Calendar className="w-6 h-6 inline-block mr-2 text-blue-500" />,
    },
    annually: {
      label: 'Annuel',
      price: 30,
      duration: 'an',
      description: 'La meilleure offre : économisez 25% !',
      icon: <Gift className="w-6 h-6 inline-block mr-2 text-pink-500" />,
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
      <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-tr from-indigo-50 via-white to-indigo-50">
        <motion.div 
          className="w-full max-w-md bg-white rounded-xl shadow-xl p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          layout
        >
          <h1 className="text-3xl font-extrabold text-indigo-800 mb-4 flex items-center justify-center gap-2">
            <Star className="w-8 h-8 text-yellow-400 animate-pulse" />
            Devenez Membre Premium
            <Star className="w-8 h-8 text-yellow-400 animate-pulse" />
          </h1>
          <p className="text-center text-gray-600 mb-8 px-4">
            Accédez à toutes les ressources exclusives : exercices avancés, vidéos guidées, podcasts experts, et bien plus.
          </p>

          <div className="flex justify-center gap-4 mb-8">
            {Object.entries(plans).map(([planKey, plan]) => (
              <motion.button
                key={planKey}
                onClick={() => setSelectedPlan(planKey)}
                className={`flex items-center px-4 py-2 rounded-full font-semibold transition-all duration-300
                  ${selectedPlan === planKey ? 'bg-indigo-700 text-white shadow-lg scale-105' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}
                `}
                whileHover={{ scale: 1.1 }}
                layout
              >
                {plan.icon}
                {plan.label}
              </motion.button>
            ))}
          </div>

          <motion.div
            className="text-center mb-8"
            key={selectedPlan}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            layout
          >
            <p className="text-5xl font-extrabold text-indigo-900 mb-1">
              {currentPlan.price.toFixed(2)} €
              <span className="text-base font-normal text-indigo-600"> / {currentPlan.duration}</span>
            </p>
            <p className="text-sm text-indigo-600 max-w-xs mx-auto">{currentPlan.description}</p>
          </motion.div>

          <AnimatePresence>
            {loading && (
              <motion.div
                key="loading"
                className="text-center text-indigo-600 font-semibold animate-pulse mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Chargement du bouton PayPal...
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error"
                className="flex items-center justify-center gap-2 mb-4 text-red-600 font-semibold bg-red-100 p-3 rounded"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <AlertTriangle className="w-5 h-5" />
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                key="success"
                className="flex items-center justify-center gap-2 mb-4 text-green-700 font-semibold bg-green-100 p-3 rounded"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <CheckCircle className="w-5 h-5" />
                Paiement réussi ! Vous êtes maintenant membre Premium. Redirection en cours...
              </motion.div>
            )}
          </AnimatePresence>

          <div id="paypal-button-container" className="w-full max-w-xs mx-auto" />
        </motion.div>
      </main>
    </Layout>
  );
};

export default DevenirPremium;
