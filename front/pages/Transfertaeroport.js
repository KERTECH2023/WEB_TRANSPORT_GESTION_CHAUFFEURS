import React, { useState } from 'react';
import { axiosClient } from "../config/axios";
import { toast } from "react-toastify";
import { Helmet } from 'react-helmet';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';


const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [amount, setAmount] = useState(""); // <-- Montant à payer
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmitpayement = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!amount || parseFloat(amount) <= 0) {
      setMessage("Montant invalide.");
      return;
    }

    setLoading(true);
    const card = elements.getElement(CardElement);
    const result = await stripe.createToken(card);

    if (result.error) {
      setMessage(result.error.message);
    } else {
      setMessage("Token créé : " + result.token.id);

      // Exemple d'envoi au backend avec montant
      try {
        await axiosClient.post("/payment/payment", {
          token: result.token.id,
          amount: parseFloat(amount),
        });
        toast.success("Paiement réussi !");
      } catch (error) {
        toast.error("Erreur de paiement.");
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmitpayement} className="mt-4 space-y-4">
      <div>
        <label className="block text-sm font-semibold">Montant à payer (€)</label>
        <input
          type="number"
          min="0"
          step="0.01"
          className="w-full p-2 border rounded"
          placeholder="Ex : 49.99"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold">Informations de carte</label>
        <CardElement className="p-2 border rounded" />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {loading ? "Chargement..." : `Payer ${amount ? amount + " €" : ""}`}
      </button>

      {message && <p className="mt-2 text-red-500">{message}</p>}
    </form>
  );
};

const SimpleForm = () => {
  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-gradient-to-r from-blue-50 to-white rounded-xl shadow-xl">
      <Helmet>
        <title>Transfert Aéroport</title>
      </Helmet>
      <Elements stripe={stripePromise}>
        <PaymentForm />
      </Elements>
    </div>
  );
};

export default SimpleForm;
