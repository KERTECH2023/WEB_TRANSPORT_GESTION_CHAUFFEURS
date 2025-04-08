import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = () => {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState('');
  
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    // Créer une intention de paiement dès que le composant est monté
    fetch('http://localhost:4000/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: 1999, currency: 'eur' }), // 19.99€
    })
      .then(res => res.json())
      .then(data => {
        setClientSecret(data.clientSecret);
      });
  }, []);

  const handleChange = (event) => {
    // Écoutez les changements dans CardElement
    // et affichez les erreurs potentielles au client
    setDisabled(event.empty);
    setError(event.error ? event.error.message : '');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      // Stripe.js n'a pas encore été chargé.
      // Assurez-vous de désactiver le formulaire jusqu'à ce que Stripe.js soit chargé.
      return;
    }

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (payload.error) {
      setError(`Le paiement a échoué: ${payload.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement onChange={handleChange} />
      <button
        disabled={processing || disabled || succeeded}
        type="submit"
      >
        {processing ? 'Traitement en cours...' : 'Payer maintenant'}
      </button>
      {/* Afficher les erreurs ou le succès */}
      {error && <div>{error}</div>}
      {succeeded && <div>Paiement réussi!</div>}
    </form>
  );
};

export default CheckoutForm;
