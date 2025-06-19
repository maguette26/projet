import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

import axios from 'axios';

const stripePromise = loadStripe('pk_test_51RXnftAc9vHWOsmYRgXSBdNEne7MxfObedkDBDRtA7l5G2zZM0sfMPfhHmCtWqeNIM81YSEyREpIPVDg76hE201t002UNapsv0');  

// Composant de paiement Stripe
const CheckoutForm = ({ reservationId, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const res = await axios.post(
          `/api/payment/stripe/create-payment-intent`,
          { reservationId },
          { withCredentials: true }
        );
        console.log('Stripe PaymentIntent response:', res.data);

        if (res.data && res.data.clientSecret) {
          setClientSecret(res.data.clientSecret);
        } else {
          onError('Aucun clientSecret reçu pour Stripe');
        }
      } catch (error) {
        console.error('Erreur création PaymentIntent Stripe:', error);
        onError('Erreur lors de la création du paiement Stripe');
      }
    };
    createPaymentIntent();
  }, [reservationId, onError]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        onError(error.message);
        setLoading(false);
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess('Paiement Stripe réussi');
        setLoading(false);
      }
    } catch (e) {
      console.error('Erreur lors du paiement Stripe:', e);
      onError('Erreur lors du paiement Stripe');
      setLoading(false);
    }
  };

  if (!clientSecret) return null; // Pas d'affichage tant qu'on n'a pas le clientSecret

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

// Composant principal PaymentForm
const PaymentForm = ({ reservationId, onClose }) => {
  const [message, setMessage] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('stripe'); // 'stripe' ou 'paypal'

  const handleSuccess = (msg) => {
    setMessage({ type: 'success', text: msg });
  };
  const handleError = (msg) => {
    setMessage({ type: 'error', text: msg });
  };

  return (
    <div
      className="bg-white rounded p-6 w-full max-w-md shadow-lg relative"
      role="dialog"
      aria-modal="true"
    >
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
          onClick={() => {
            setPaymentMethod('stripe');
            setMessage(null);
          }}
          className={`px-4 py-2 rounded ${
            paymentMethod === 'stripe' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Stripe
        </button>
        <button
          onClick={() => {
            setPaymentMethod('paypal');
            setMessage(null);
          }}
          className={`px-4 py-2 rounded ${
            paymentMethod === 'paypal' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          PayPal
        </button>
      </div>

      {message && (
        <p
          className={`mb-4 text-center ${
            message.type === 'success' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message.text}
        </p>
      )}

      {paymentMethod === 'stripe' && (
        <Elements stripe={stripePromise}>
          <CheckoutForm
            reservationId={reservationId}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </Elements>
      )}

      {paymentMethod === 'paypal' && (
        <PayPalScriptProvider
          options={{
            'client-id': 'sb', // Sandbox - remplacer par clé réelle en production
            currency: 'EUR',
          }}
        >
          <PayPalButtons
            createOrder={async (_, actions) => {
              try {
                const res = await axios.post(
                  `/api/payment/paypal/create-order`,
                  { reservationId },
                  { withCredentials: true }
                );
                console.log('PayPal create-order response:', res.data);

                if (res.data && res.data.orderID) {
                  return res.data.orderID;
                } else {
                  handleError('Aucun orderID reçu pour PayPal');
                }
              } catch (error) {
                console.error('Erreur création commande PayPal:', error);
                handleError('Erreur lors de la création de la commande PayPal');
              }
            }}
            onApprove={async (_, actions) => {
              try {
                await actions.order.capture();
                handleSuccess('Paiement PayPal réussi');
              } catch (error) {
                console.error('Erreur capture paiement PayPal:', error);
                handleError('Erreur lors de la capture du paiement PayPal');
              }
            }}
            onError={(err) => handleError(`Erreur PayPal : ${err.toString()}`)}
            style={{ layout: 'vertical', color: 'blue', shape: 'rect', label: 'paypal' }}
          />
        </PayPalScriptProvider>
      )}
    </div>
  );
};

PaymentForm.propTypes = {
  reservationId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PaymentForm;
