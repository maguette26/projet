import React, { useState } from 'react';

const PaymentForm = ({ onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePayment = () => {
    if (!paymentMethod) {
      setMessage({ type: 'error', text: 'Veuillez choisir un mode de paiement.' });
      return;
    }
    setLoading(true);
    setMessage(null);

    setTimeout(() => {
      setLoading(false);
      setMessage({ type: 'success', text: `✅ Paiement effectué avec ${paymentMethod}. Merci !` });
    }, 1500);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 mx-auto relative">
      <button
        onClick={onClose}
        aria-label="Fermer"
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
      >
        &times;
      </button>

      <h2 className="text-center text-2xl font-semibold mb-6 text-indigo-700">
        Choisissez votre mode de paiement
      </h2>

      <div className="flex justify-center gap-6 mb-6">
        <button
          onClick={() => setPaymentMethod('Stripe')}
          className={`px-6 py-3 rounded-lg shadow font-medium transition-colors ${
            paymentMethod === 'Stripe'
              ? 'bg-indigo-600 text-white'
              : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
          }`}
        >
          Stripe
        </button>
        <button
          onClick={() => setPaymentMethod('PayPal')}
          className={`px-6 py-3 rounded-lg shadow font-medium transition-colors ${
            paymentMethod === 'PayPal'
              ? 'bg-yellow-500 text-white'
              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
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
          role="alert"
        >
          {message.text}
        </p>
      )}

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-semibold shadow hover:from-indigo-600 hover:to-indigo-800 transition flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading && (
          <svg
            className="animate-spin h-5 w-5 text-white"
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
        )}
        {loading ? 'Paiement en cours...' : 'Payer'}
      </button>
    </div>
  );
};

export default PaymentForm;
