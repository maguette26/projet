import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

import axios from 'axios';

const stripePromise = loadStripe('pk_test_51RXnftAc9vHWOsmYRgXSBdNEne7MxfObedkDBDRtA7l5G2zZM0sfMPfhHmCtWqeNIM81YSEyREpIPVDg76hE201t002UNapsv0');

const CheckoutForm = ({ clientSecret, onSuccess, onError, reservationId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const cardElement = elements.getElement(CardElement);

    console.log('Client secret utilisé avant Stripe :', clientSecret); // 🔍 Log clientSecret utilisé

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        console.error('Erreur de paiement:', error);
        onError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        await axios.post(`/api/reservations/payer/${reservationId}`, {}, { withCredentials: true });
        onSuccess('Paiement Stripe réussi et réservation validée');
      } else {
        onError('Le paiement n’a pas abouti, statut: ' + paymentIntent.status);
      }
    } catch (e) {
      console.error('Exception lors du paiement:', e);
      onError('Erreur lors du paiement Stripe');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#32325d',
              '::placeholder': { color: '#a0aec0' },
            },
            invalid: { color: '#fa755a' },
          },
        }}
      />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Paiement en cours...' : 'Payer avec Stripe'}
      </button>
    </form>
  );
};

const PaymentForm = ({ reservationId, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [clientSecret, setClientSecret] = useState(null);
  const [message, setMessage] = useState(null);

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
      console.log("✅ Réponse backend de /api/payments/create :", res.data); // 🧪
      return res.data;
    } catch (error) {
      console.error("❌ Erreur Axios lors de la création du paiement :", error);
      throw error;
    }
  };

  useEffect(() => {
    setMessage(null);
    setClientSecret(null);

    if (paymentMethod === 'stripe') {
      createPayment()
        .then((data) => {
          if (data.clientSecret) {
            console.log("🎯 clientSecret reçu du backend :", data.clientSecret); // 🧪
            setClientSecret(data.clientSecret);
          } else {
            setMessage({ type: 'error', text: "Le clientSecret n'a pas été reçu." });
          }
        })
        .catch(() => {
          setMessage({ type: 'error', text: 'Erreur lors de la création du paiement Stripe' });
        });
    }
  }, [paymentMethod, reservationId]);

  const handlePayPalPayment = async () => {
    setMessage(null);
    try {
      const data = await createPayment();
      if (data.approvalUrl) {
        window.location.href = data.approvalUrl;
      } else {
        setMessage({ type: 'error', text: "URL d'approbation PayPal introuvable" });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erreur lors de la création du paiement PayPal' });
    }
  };

  useEffect(() => {
    if (message?.type === 'success') {
      setTimeout(() => onClose(), 2000);
    }
  }, [message, onClose]);

  return (
    <div className="bg-white rounded p-6 w-full max-w-md shadow-lg relative" role="dialog" aria-modal="true">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        aria-label="Fermer le formulaire de paiement"
      >
        ✕
      </button>

      <h2 className="text-xl font-bold mb-4 text-center">Paiement de la réservation #{reservationId}</h2>

      <div className="mb-4 flex justify-center gap-4">
        <button
          onClick={() => setPaymentMethod('stripe')}
          className={`px-4 py-2 rounded ${paymentMethod === 'stripe' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Stripe
        </button>
        <button
          onClick={() => setPaymentMethod('paypal')}
          className={`px-4 py-2 rounded ${paymentMethod === 'paypal' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          PayPal
        </button>
      </div>

      {message && (
        <p className={`mb-4 text-center ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.text}
        </p>
      )}

      {paymentMethod === 'stripe' && clientSecret && (
        <Elements stripe={stripePromise}>
          <CheckoutForm
            clientSecret={clientSecret}
            reservationId={reservationId}
            onSuccess={(msg) => setMessage({ type: 'success', text: msg })}
            onError={(msg) => setMessage({ type: 'error', text: msg })}
          />
        </Elements>
      )}

      {paymentMethod === 'paypal' && (
        <button
          onClick={handlePayPalPayment}
          className="px-4 py-2 bg-yellow-500 text-white rounded w-full"
        >
          Payer avec PayPal
        </button>
      )}
    </div>
  );
};

PaymentForm.propTypes = {
  reservationId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PaymentForm;
