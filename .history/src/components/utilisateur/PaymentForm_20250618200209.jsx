// PaymentForm.jsx
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_TA_CLÉ_PUBLIQUE');

function CheckoutForm({ reservationId, onClose }) {
  // ... code complet comme avant ...

  return (
    <div style={{ maxWidth: 400, margin: 'auto', border: '1px solid #ddd', padding: 20, borderRadius: 8 }}>
      <button onClick={onClose} style={{ float: 'right' }}>X</button>
      {/* le reste du formulaire */}
    </div>
  );
}

export default function PaymentForm(props) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
}
