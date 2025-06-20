import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe("pk_test_51RXnftAc9vHWOsmYRgXSBdNEne7MxfObedkDBDRtA7l5G2zZM0sfMPfhHmCtWqeNIM81YSEyREpIPVDg76hE201t002UNapsv0");

// Composant du formulaire Stripe
const CheckoutForm = ({ clientSecret, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      onError("Stripe n'est pas prêt.");
      return;
    }

    setLoading(true);
    const cardElement = elements.getElement(CardElement);

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (result.error) {
        onError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        onSuccess('✅ Paiement réussi. La réservation sera bientôt confirmée.');
      } else {
        onError('Le paiement a échoué. Statut : ' + result.paymentIntent.status);
      }
    } catch (err) {
      onError('Erreur lors du paiement : ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement
        options={{
          style: {
            base: { fontSize: '16px', color: '#32325d', '::placeholder': { color: '#a0aec0' } },
            invalid: { color: '#fa755a' },
          },
        }}
      />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="px-4 py-2 bg-blue-600 text-white rounded w-full flex justify-center items-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Paiement en cours...
          </>
        ) : (
          'Payer avec Stripe'
        )}
      </button>
    </form>
  );
};

CheckoutForm.propTypes = {
  clientSecret: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};

// Formulaire principal
const PaymentForm = ({ reservationId, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [clientSecret, setClientSecret] = useState(null);
  const [message, setMessage] = useState(null);
  const [isWaitingBackend, setIsWaitingBackend] = useState(false);

  // Options pour Elements
  const elementsOptions = useMemo(() => ({
    clientSecret,
    appearance: { theme: 'stripe' }
  }), [clientSecret]);

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
      throw new Error("Veuillez attendre que le professionnel valide votre réservation.");
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
            setMessage({ type: 'error', text: "Le clientSecret est manquant." });
          }
        })
        .catch((err) => {
          setMessage({ type: 'error', text: err.message });
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
        setMessage({ type: 'error', text: "URL PayPal non reçue." });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  useEffect(() => {
    if (message?.type === 'success' && paymentMethod === 'stripe') {
      setIsWaitingBackend(true);
    } else {
      setIsWaitingBackend(false);
    }
  }, [message, paymentMethod]);

  useEffect(() => {
    if (message?.type === 'success') {
      const timer = setTimeout(() => onClose(), 2500);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  return (
    <div className="bg-white rounded p-6 w-full max-w-md shadow-lg relative max-h-screen overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
        aria-label="Fermer le formulaire de paiement"
      >
        ✕
      </button>

      <h2 className="text-xl font-bold mb-4 text-center">
        Paiement de la réservation #{reservationId}
      </h2>

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
        <p
          className={`mb-4 text-center ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}
          role="alert"
        >
          {message.text}
        </p>
      )}

      {isWaitingBackend && (
        <p className="mb-4 text-center text-blue-600">
          🔄 Paiement confirmé. Attente de validation côté serveur...
        </p>
      )}

      {paymentMethod === 'stripe' && clientSecret && (
        <Elements stripe={stripePromise} options={elementsOptions} key={clientSecret}>
          <CheckoutForm
            clientSecret={clientSecret}
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
