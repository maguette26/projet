import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

/* 🔑 Ta clé publique Stripe */
const stripePromise = loadStripe(
  "pk_test_51RXngePPIpwqHP0R7oDQfgGLbnkvgjGj1j8FnWSxa8G92FeO4XXXmDfflJC8vjCiYgfb3xtzGSuSlDipQzf4jlDH00KASAjcYd"
);

/* ✅ Formulaire Stripe */
const CheckoutForm = ({ clientSecret, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    const cardElement = elements.getElement(CardElement);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (result.error) {
      setMessage(result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      setMessage("✅ Paiement Premium réussi !");

      /* Upgrade rôle */
      localStorage.setItem("role", "PREMIUM");

      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 2000);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement />

      {message && (
        <p className="text-center text-sm text-red-600">{message}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
      >
        {loading ? "Paiement..." : "Payer avec Stripe"}
      </button>
    </form>
  );
};

/* ✅ Modal Premium */
const PremiumPaymentModal = ({ planId, onClose }) => {
  const [clientSecret, setClientSecret] = useState(null);

  /* 🔥 Créer PaymentIntent Premium */
  useEffect(() => {
    axios
      .post("/api/payments/premium/create", {
        planId,
        currency: "EUR",
        
      })
      .then((res) => {
        setClientSecret(res.data.clientSecret);
      })
      .catch((err) => {
        console.error(err);
        alert("❌ Impossible de créer le paiement Premium");
      });
  }, [planId]);

  const options = useMemo(
    () => ({
      clientSecret,
    }),
    [clientSecret]
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-700"
        >
          ×
        </button>

        <h2 className="text-xl font-bold text-center mb-6">
          Paiement Premium
        </h2>

        {!clientSecret ? (
          <p className="text-center text-indigo-600 animate-pulse">
            Chargement Stripe...
          </p>
        ) : (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm clientSecret={clientSecret} onClose={onClose} />
          </Elements>
        )}
      </div>
    </div>
  );
};

PremiumPaymentModal.propTypes = {
  planId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PremiumPaymentModal;