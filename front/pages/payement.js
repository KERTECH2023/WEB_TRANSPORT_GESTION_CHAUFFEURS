import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const card = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      setMessage(error.message);
    } else {
      // Envoie paymentMethod.id à votre serveur pour finaliser le paiement
      setMessage('Paiement réussi ! ID: ' + paymentMethod.id);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="block mb-4">
        <span className="text-gray-700">Carte bancaire</span>
        <div className="p-2 border rounded">
          <CardElement />
        </div>
      </label>
      <button
        type="submit"
        disabled={!stripe || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Traitement...' : 'Payer'}
      </button>
      {message && <div className="mt-4 text-green-600">{message}</div>}
    </form>
  );
}
