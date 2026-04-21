import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import axios from "axios";

const stripePromise = loadStripe(
  "pk_test_51RXngePPIpwqHP0R7oDQfgGLbnkvgjGj1j8FnWSxa8G92FeO4XXXmDfflJC8vjCiYgfb3xtzGSuSlDipQzf4jlDH00KASAjcYd"
);

/* ✅ Formulaire Stripe */
const CheckoutForm = ({ clientSecret, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return onError("Stripe n'est pas prêt.");
    }

    setLoading(true);

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        onError(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        onSuccess("🎉 Paiement Premium réussi !");
      }
    } catch (err) {
      onError("Erreur paiement : " + err.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="p-3 border rounded-lg" />

      <button
        disabled={loading}
        className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition"
      >
        {loading ? "Paiement..." : "Payer & Devenir Premium"}
      </button>
    </form>
  );
};

CheckoutForm.propTypes = {
  clientSecret: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};

/* ✅ Modal Premium */
const PremiumPaymentModal = ({ planId, onClose }) => {
  const [clientSecret, setClientSecret] = useState(null);
  const [message, setMessage] = useState(null);

  /* ✅ Appel backend Premium */
  useEffect(() => {
    axios
      .post("/api/payments/premium/create", {
        planId,
        currency: "EUR",
      })
      .then((res) => {
        setClientSecret(res.data.clientSecret);
      })
      .catch(() => {
        setMessage("❌ Impossible de démarrer le paiement Premium.");
      });
  }, [planId]);

  const options = useMemo(
    () => ({
      clientSecret,
      appearance: { theme: "stripe" },
    }),
    [clientSecret]
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-xl relative">
        {/* ❌ Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-700"
        >
          ×
        </button>

        <h2 className="text-xl font-extrabold text-center mb-6 text-indigo-700">
          Paiement Premium
        </h2>

        {/* Message */}
        {message && (
          <p className="text-red-600 text-center mb-4">{message}</p>
        )}

        {/* Stripe Form */}
        {clientSecret && (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm
              clientSecret={clientSecret}
              onSuccess={(msg) => {
                setMessage(msg);

                // ✅ Premium activé côté frontend
                localStorage.setItem("role", "PREMIUM");

                setTimeout(() => {
                  onClose();
                  window.location.href = "/tableauUtilisateur";
                }, 2000);
              }}
              onError={(err) => setMessage("❌ " + err)}
            />
          </Elements>
        )}

        {!clientSecret && !message && (
          <p className="text-center text-gray-500 animate-pulse">
            Chargement du paiement...
          </p>
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