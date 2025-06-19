import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CheckoutForm from './CheckoutForm'; // Ton composant Stripe
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe("pk_test_..."); // ta clé publique Stripe

const PaymentForm = ({ reservationId, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [clientSecret, setClientSecret] = useState(null);
  const [message, setMessage] = useState(null);
  const [isWaitingBackend, setIsWaitingBackend] = useState(false);

  const createPayment = async () => {
    try {
      const res = await axios.post(
        '/api/payments/create',
        {
          reservationId,
          paymentMethod,
          successUrl: window.location.origin + '/payment-success',
          cancelUrl: window.location.origin + '/payment-cancel',
          currency: 'EUR',
        },
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      // On attrape ici l'erreur 400 spécifique de la validation pro
      if (error.response && error.response.status === 400) {
        // Affiche message spécifique utilisateur
        setMessage({ type: 'info', text: error.response.data });
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de la création du paiement.' });
      }
      throw error; // Optionnel : remonter l'erreur si besoin
    }
  };

  useEffect(() => {
    setMessage(null);
    setClientSecret(null);
    setIsWaitingBackend(false);

    if (paymentMethod === 'stripe') {
      createPayment()
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          } else {
            setMessage({ type: 'error', text: "Le clientSecret n'a pas été reçu." });
          }
        })
        .catch(() => {
          // L'erreur est déjà gérée dans createPayment()
        });
    }
  }, [paymentMethod, reservationId]);

  // Message qui invite l'utilisateur à patienter la confirmation backend webhook
  useEffect(() => {
    if (message?.type === 'success' && paymentMethod === 'stripe') {
      setIsWaitingBackend(true);
    } else {
      setIsWaitingBackend(false);
    }
  }, [message, paymentMethod]);

  return (
    <div className="payment-form-container">
      <h2>Paiement réservation #{reservationId}</h2>

      <div>
        <button onClick={() => setPaymentMethod('stripe')}>Stripe</button>
        <button onClick={() => setPaymentMethod('paypal')}>PayPal</button>
      </div>

      {message && (
        <p
          className={
            message.type === 'error'
              ? 'text-red-600'
              : message.type === 'info'
              ? 'text-blue-600'
              : 'text-green-600'
          }
          role="alert"
        >
          {message.text}
        </p>
      )}

      {isWaitingBackend && (
        <p className="text-blue-600">
          🔄 Paiement confirmé côté Stripe, validation de la réservation en cours côté serveur...
        </p>
      )}

      {paymentMethod === 'stripe' && clientSecret && (
        <Elements stripe={stripePromise}>
          <CheckoutForm
            clientSecret={clientSecret}
            onSuccess={(msg) => setMessage({ type: 'success', text: msg })}
            onError={(msg) => setMessage({ type: 'error', text: msg })}
          />
        </Elements>
      )}

      {paymentMethod === 'paypal' && (
        <button onClick={() => alert('Gestion PayPal non implémentée ici')}>
          Payer avec PayPal
        </button>
      )}
    </div>
  );
};

export default PaymentForm;
