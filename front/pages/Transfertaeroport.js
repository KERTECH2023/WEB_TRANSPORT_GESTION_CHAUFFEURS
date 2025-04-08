import React, { useState, useEffect } from 'react';
import { axiosClient } from "../config/axios";
import { toast } from "react-toastify";
import { Helmet } from 'react-helmet';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe("pk_test_51QwQjNQ8obTEqrkWf67svmq3hUsbXmjOnQDF7FxfJYJRYbG4FYnAF7EoNDK1Wa8dtJGCOPZglhd1f3iyeuZQM8X100CxqsPfYC");

const LANGS = {
  fr: {
    firstName: "Prénom",
    lastName: "Nom",
    email: "Email",
    phone: "Téléphone",
    airport: "Aéroport de départ",
    destination: "Destination",
    passengers: "Nombre de passagers",
    price: "Prix",
    submit: "Réserver",
    datevol: "Date du vol",
    heurvol: "Heure du vol",
    numvol: "Numéro du vol",
    bagageCabine: "Bagage en cabine",
    bagageSoute: "Bagage en soute",
    bagageHorsFormat: "Bagage hors format"
  },
  en: {
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phone: "Phone",
    airport: "Departure Airport",
    destination: "Destination",
    passengers: "Passengers",
    price: "Price",
    submit: "Book",
    datevol: "Flight Date",
    heurvol: "Flight Time",
    numvol: "Flight Number",
    bagageCabine: "Cabin Baggage",
    bagageSoute: "Checked Baggage",
    bagageHorsFormat: "Oversized Baggage"
  }
};

const AIRPORTS = {
  djerba: { name: { fr: "Aéroport de Djerba-Zarzis", en: "Djerba-Zarzis Airport" }, coords: [33.875031, 10.775278] },
  tunis: { name: { fr: "Aéroport de Tunis-Carthage", en: "Tunis-Carthage Airport" }, coords: [36.851111, 10.227222] }
};

const HERE_KEY = 'ZJkO_2aWL0S7JttmiFEegi0FPZh5DvMvEfvXtnw6L2o';

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
  const [lang, setLang] = useState('fr');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    bagageCabine: '', bagageSoute: '', bagageHorsFormat: '',
    datevol: '', heurvol: '', numvol: '',
    airport: '', destination: '', passengers: ''
  });
  const [suggestions, setSuggestions] = useState([]);
  const [price, setPrice] = useState(null);
  const [distance, setDistance] = useState(0);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [cache, setCache] = useState({});
  const [pricingData, setPricingData] = useState({ prixdepersonne: 0, prixdebase: 0 });

  const t = key => LANGS[lang][key];

  const calculatePrice = (numPassengers, distance) => {
    return (distance * pricingData.prixdebase) + ((numPassengers - 1) * pricingData.prixdepersonne);
  };

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        const response = await axiosClient.get("/tariftransfert");
        if (response.data && response.data.length > 0) {
          setPricingData({
            prixdepersonne: response.data[0].prixdepersonne,
            prixdebase: response.data[0].prixdebase
          });
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des tarifs :", error);
      }
    };
    fetchPricingData();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === 'passengers') {
      const numPassengers = parseInt(value) || 1;
      const newPrice = calculatePrice(numPassengers, distance);
      setPrice(newPrice);
    }

    if (name === 'destination') {
      if (debounceTimer) clearTimeout(debounceTimer);
      const timer = setTimeout(() => {
        fetchSuggestions(value);
      }, 300);
      setDebounceTimer(timer);
    }
  };

  const fetchSuggestions = async (query) => {
    if (!query || form.airport === '') return;
    if (cache[query]) {
      setSuggestions(cache[query]);
      return;
    }

    const airport = AIRPORTS[form.airport];
    try {
      const res = await fetch(`https://discover.search.hereapi.com/v1/discover?apiKey=${HERE_KEY}&q=${query}&at=${airport.coords.join(',')}&lang=${lang}`);
      const data = await res.json();
      setSuggestions(data.items || []);
      setCache(prev => ({ ...prev, [query]: data.items || [] }));
    } catch (err) {
      console.error(err);
    }
  };

  const selectDestination = async suggestion => {
    const coords = [suggestion.position.lat, suggestion.position.lng];
    setForm(prev => ({ ...prev, destination: suggestion.address.label }));
    setSuggestions([]);

    try {
      const airport = AIRPORTS[form.airport];
      const res = await fetch(`https://router.hereapi.com/v8/routes?apiKey=${HERE_KEY}&transportMode=car&origin=${airport.coords.join(',')}&destination=${coords.join(',')}&return=summary`);
      const data = await res.json();
      const newDistance = data?.routes?.[0]?.sections?.[0]?.summary?.length / 1000 || 0;
      setDistance(newDistance);
      const numPassengers = parseInt(form.passengers) || 1;
      setPrice(calculatePrice(numPassengers, newDistance));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(form).some(field => !field.trim()) || !price) {
      toast.error("Tous les champs sont requis !");
      return;
    }

    try {
      await axiosClient.post("/transfert/add", { ...form, price });
      toast.success("Transfert ajouté avec succès");
      setForm({ firstName: '', lastName: '', email: '', phone: '', bagageCabine: '', bagageSoute: '', bagageHorsFormat: '', datevol: '', heurvol: '', numvol: '', airport: '', destination: '', passengers: '' });
      setPrice(null);
    } catch (error) {
      toast.error("Erreur lors de l'ajout du transfert");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-gradient-to-r from-blue-50 to-white rounded-xl shadow-xl">
      <Helmet>
        <title>Transfert Aéroport</title>
      </Helmet>

      <form onSubmit={handleSubmit}>
        {/* Vos champs de formulaire ici */}
      </form>

      <Elements stripe={stripePromise}>
        <PaymentForm />
      </Elements>
    </div>
  );
};

export default SimpleForm;
