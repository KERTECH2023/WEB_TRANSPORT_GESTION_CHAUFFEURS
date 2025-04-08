import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = () => {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState('');
  
  // Utilisation sécurisée des hooks Stripe
  const stripe = typeof window !== 'undefined' ? useStripe() : null;
  const elements = typeof window !== 'undefined' ? useElements() : null;

  useEffect(() => {
    // Cette partie ne s'exécute que côté client
    if (typeof window === 'undefined') return;
    
    // Créer une intention de paiement dès que le composant est monté
    fetch('/api/create-payment-intent', { // Modifié pour utiliser une API route
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: 1999, currency: 'eur' }), // 19.99€
    })
      .then(res => res.json())
      .then(data => {
        setClientSecret(data.clientSecret);
      })
      .catch(err => console.error('Erreur lors de la création du payment intent:', err));
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
      setProcessing(false);
      return;
    }

    try {
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
    } catch (err) {
      console.error('Erreur lors de la confirmation du paiement:', err);
      setError('Une erreur est survenue lors du traitement du paiement. Veuillez réessayer.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement onChange={handleChange} />
      <button
        disabled={processing || disabled || succeeded || !stripe}
        type="submit"
      >
        {processing ? 'Traitement en cours...' : 'Payer maintenant'}
      </button>
      {/* Afficher les erreurs ou le succès */}
      {error && <div className="error-message">{error}</div>}
      {succeeded && <div className="success-message">Paiement réussi!</div>}
    </form>
  );
};

export default CheckoutForm;
