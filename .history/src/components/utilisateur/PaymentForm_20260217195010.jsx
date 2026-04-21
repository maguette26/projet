// src/components/PaymentForm.jsx
import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe("pk_test_51RXngePPIpwqHP0R7oDQfgGLbnkvgjGj1j8FnWSxa8G92FeO4XXXmDfflJC8vjCiYgfb3xtzGSuSlDipQzf4jlDH00KASAjcYd");

const CheckoutForm = ({ clientSecret, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return onError("Stripe n'est pas prêt.");

    setLoading(true);
    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) onError(result.error.message);
      else if (result.paymentIntent.status === 'succeeded')
        onSuccess('✅ Paiement réussi !');
      else onError('Paiement échoué. Statut : ' + result.paymentIntent.status);
    } catch (err) {
      onError('Erreur paiement : ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement options={{ style: { base: { fontSize: '16px', color: '#32325d' } } }} />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="px-4 py-2 bg-blue-600 text-white rounded w-full"
      >
        {loading ? 'Paiement en cours...' : 'Payer avec Stripe'}
      </button>
    </form>
  );
};

const PaymentForm = ({ reservationId, onClose, isPremium = false, planId = null }) => {
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [clientSecret, setClientSecret] = useState(null);
  const [message, setMessage] = useState(null);
  const [isWaitingBackend, setIsWaitingBackend] = useState(false);

  const elementsOptions = useMemo(() => ({ clientSecret, appearance: { theme: 'stripe' } }), [clientSecret]);

  const createPayment = async () => {
    try {
      let data;
      if (isPremium) {
        // Premium payment
        data = await axios.post('/api/payments/create', {
          paymentMethod,
          planId,
          userId: localStorage.getItem('userId'), // ton userId
          successUrl: window.location.origin + '/premium-success',
          cancelUrl: window.location.origin + '/premium-cancel',
          currency: 'EUR',
        });
      } else {
        // Reservation payment
        data = await axios.post('/api/payments/create', {
          reservationId,
          paymentMethod,
          successUrl: window.location.origin + '/payment-success',
          cancelUrl: window.location.origin + '/payment-cancel',
          currency: 'EUR',
        });
      }
      return data.data;
    } catch (err) {
      throw new Error(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    setMessage(null);
    setClientSecret(null);
    setIsWaitingBackend(false);

    createPayment()
      .then((data) => {
        if (paymentMethod === 'stripe' && data.clientSecret) setClientSecret(data.clientSecret);
        else if (paymentMethod === 'paypal' && data.approvalUrl) window.location.href = data.approvalUrl;
        else setMessage({ type: 'error', text: 'Impossible de récupérer les infos de paiement.' });
      })
      .catch((err) => setMessage({ type: 'error', text: err.message }));
  }, [paymentMethod, reservationId, planId, isPremium]);

  return (
    <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 text-2xl"
      >&times;</button>

      <h2 className="text-xl font-bold mb-4 text-center">{isPremium ? 'Abonnement Premium' : 'Paiement de réservation'}</h2>

      <div className="flex justify-center gap-4 mb-4">
        <button onClick={() => setPaymentMethod('stripe')} className={`px-4 py-2 rounded ${paymentMethod === 'stripe' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Stripe</button>
        <button onClick={() => setPaymentMethod('paypal')} className={`px-4 py-2 rounded ${paymentMethod === 'paypal' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>PayPal</button>
      </div>

      {message && <p className={`text-center mb-4 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message.text}</p>}
      {isWaitingBackend && <p className="text-blue-600 text-center mb-4 animate-pulse">🔄 Attente validation serveur...</p>}

      {paymentMethod === 'stripe' && clientSecret && (
        <Elements stripe={stripePromise} options={elementsOptions} key={clientSecret}>
          <CheckoutForm clientSecret={clientSecret} onSuccess={(msg) => setMessage({ type: 'success', text: msg })} onError={(msg) => setMessage({ type: 'error', text: msg })} />
        </Elements>
      )}
    </div>
  );
};

PaymentForm.propTypes = {
  reservationId: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  isPremium: PropTypes.bool,
  planId: PropTypes.string,
};

export default PaymentForm;