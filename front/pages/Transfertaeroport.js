import React, { useState, useEffect } from 'react';
import { axiosClient } from "../config/axios";
import { toast } from "react-toastify";
import { Helmet } from 'react-helmet';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe("pk_live_51PMnbnRp5sVG0Ju5Hju1wYglZkQds0VVFGCWbBdTATT5NGtYnIvTYIKPqmIRyE69cqonzdtRR5M3LC3jhHYESzRB00eKW6xc4g");


const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmitpayement = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const card = elements.getElement(CardElement);
    const result = await stripe.createToken(card);

    if (result.error) {
      setMessage(result.error.message);
    } else {
      setMessage("Token créé : " + result.token.id);
      // Envoie du token au backend pour traiter le paiement
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmitpayement} className="mt-4">
      <CardElement className="p-2 border rounded" />
      <button type="submit" disabled={!stripe || loading} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        {loading ? "Chargement..." : "Payer"}
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
