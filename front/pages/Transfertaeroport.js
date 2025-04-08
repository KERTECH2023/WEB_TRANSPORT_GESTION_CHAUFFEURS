import React, { useState, useEffect } from 'react';
import { axiosClient } from "../config/axios";
import { toast } from "react-toastify";
import { Helmet } from 'react-helmet';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe("pk_test_51PMnbnRp5sVG0Ju5s6oeT6oREpCV3ZPkOBc8MCJXf0kFYxz2hhgCgWU3XrwtvrytMTXuIuFEpCqETgkxcRxfYWqE00Sa40NqVa");
const HERE_KEY = 'ZJkO_2aWL0S7JttmiFEegi0FPZh5DvMvEfvXtnw6L2o';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [lang, setLang] = useState('fr');
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const [form, setForm] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    phone: '',
    bagageCabine: '', 
    bagageSoute: '',
    bagageHorsFormat: '',  
    datevol: '',   
    heurvol: '',    
    numvol: '',    
    airport: '', 
    destination: '', 
    passengers: '' 
  });
  
  const [suggestions, setSuggestions] = useState([]);
  const [price, setPrice] = useState(null);
  const [distance, setDistance] = useState(0);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [cache, setCache] = useState({}); 
  const [pricingData, setPricingData] = useState({ prixdepersonne: 0, prixdebase: 0 });

  const calculatePrice = (numPassengers, distance) => {
    return (distance * pricingData.prixdebase) + ((numPassengers - 1) * pricingData.prixdepersonne);
  };

  // Récupérer les tarifs depuis l'API
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

  // Fonction de traduction
  const t = key => LANGS[lang][key];

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === 'passengers') {
      const numPassengers = parseInt(value) || 1;
      const newPrice = calculatePrice(numPassengers, distance);
      setPrice(newPrice);
    }

    if (name === 'destination') {
      // Annuler le timer précédent
      if (debounceTimer) clearTimeout(debounceTimer);

      // Débouncer l'appel API
      const timer = setTimeout(() => {
        fetchSuggestions(value);
      }, 300); // Attendre 300 ms avant d'appeler l'API

      setDebounceTimer(timer);
    }
  };

  const fetchSuggestions = async (query) => {
    if (!query || form.airport === '') return;

    // Vérifier si la recherche est dans le cache
    if (cache[query]) {
      setSuggestions(cache[query]);
      return;
    }

    const airport = AIRPORTS[form.airport];
    if (!airport) return;
    
    try {
      const res = await fetch(
        `https://discover.search.hereapi.com/v1/discover?apiKey=${HERE_KEY}&q=${query}&at=${airport.coords.join(',')}&lang=${lang}`
      );
      const data = await res.json();
      setSuggestions(data.items || []);
      // Mettre à jour le cache
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
      if (!airport) return;
      
      const res = await fetch(
        `https://router.hereapi.com/v8/routes?apiKey=${HERE_KEY}&transportMode=car&origin=${airport.coords.join(',')}&destination=${coords.join(',')}&return=summary`
      );
      const data = await res.json();
      const newDistance = data?.routes?.[0]?.sections?.[0]?.summary?.length / 1000 || 0;
      setDistance(newDistance);
      
      const numPassengers = parseInt(form.passengers) || 1;
      const newPrice = calculatePrice(numPassengers, newDistance);
      setPrice(newPrice);
      setAmount(newPrice.toFixed(2)); // Définir automatiquement le montant du paiement
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Vérifier si tous les champs sont remplis
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.bagageCabine.trim() ||
      !form.bagageSoute.trim() ||
      !form.bagageHorsFormat.trim() ||
      !form.datevol.trim() || 
      !form.heurvol.trim() || 
      !form.numvol.trim() ||  
      !form.airport.trim() ||
      !form.destination.trim() ||
      !form.passengers ||
      !price
    ) {
      toast.error("Tous les champs sont requis !");
      return;
    }
    
    // Traitement du paiement
    if (!stripe || !elements) {
      toast.error("Le système de paiement n'est pas disponible");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Montant invalide.");
      return;
    }

    setLoading(true);
    const card = elements.getElement(CardElement);
    const result = await stripe.createToken(card);

    if (result.error) {
      setMessage(result.error.message);
      setLoading(false);
      return;
    }
    
    try {
      // Envoi du paiement
      await axiosClient.post("/payment/payment", {
        token: result.token.id,
        amount: parseFloat(amount),
      });
      
      // Si le paiement réussit, enregistrer le transfert
      await axiosClient.post(
        "/transfert/add",
        {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          bagageCabine: form.bagageCabine,
          bagageSoute: form.bagageSoute,
          bagageHorsFormat: form.bagageHorsFormat,
          datevol: form.datevol,   
          heurvol: form.heurvol,   
          numvol: form.numvol,    
          airport: form.airport,
          destination: form.destination,
          passengers: form.passengers,
          price: price,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      toast.success("Transfert réservé et payé avec succès");
  
      // Réinitialisation du formulaire après soumission réussie
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        bagageCabine: '',
        bagageSoute: '',
        bagageHorsFormat: '',
        datevol: '',   
        heurvol: '',   
        numvol: '',    
        airport: '',
        destination: '',
        passengers: '',
      });
      setPrice(null);
      setAmount("");
      setMessage("");
      
      // Réinitialiser l'élément de carte
      if (card) {
        card.clear();
      }
    } catch (error) {
      console.error("Erreur lors du traitement :", error);
      toast.error(error.response?.data?.message || "Erreur lors du traitement de votre demande");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {['firstName', 'lastName', 'email', 'phone'].map(field => (
          <div key={field} className="flex flex-col">
            <label className="text-lg font-medium mb-2">{t(field)}</label>
            <input
              type={field === 'email' ? 'email' : 'text'}
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="px-4 py-3 rounded-xl border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              required
            />
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex flex-col">
          <label className="text-lg font-medium mb-2">{t('datevol')}</label>
          <input
            type="date"
            name="datevol"
            value={form.datevol}
            onChange={handleChange}
            className="px-4 py-3 rounded-xl border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-lg font-medium mb-2">{t('heurvol')}</label>
          <input
            type="time"
            name="heurvol"
            value={form.heurvol}
            onChange={handleChange}
            className="px-4 py-3 rounded-xl border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-lg font-medium mb-2">{t('numvol')}</label>
          <input
            type="text"
            name="numvol"
            value={form.numvol}
            onChange={handleChange}
            className="px-4 py-3 rounded-xl border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {['bagageCabine', 'bagageSoute', 'bagageHorsFormat'].map(field => (
            <div key={field} className="flex flex-col">
              <label className="text-lg font-medium mb-2">{t(field)}</label>
              <input
                type="number"
                min="0"
                name={field}
                value={form[field]}
                onChange={handleChange}
                className="px-4 py-3 rounded-xl border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                required
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col">
          <label className="text-lg font-medium mb-2">{t('airport')}</label>
          <select
            name="airport"
            value={form.airport}
            onChange={handleChange}
            className="px-4 py-3 rounded-xl border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            required
          >
            <option value="" className="text-gray-400">--</option>
            {Object.entries(AIRPORTS).map(([key, { name }]) => (
              <option
                key={key}
                value={key}
                className={`hover:bg-blue-100 ${
                  form.airport === key ? 'bg-blue-100 font-semibold' : ''
                }`}
              >
                {name[lang]}
              </option>
            ))}
          </select>
        </div>

        <div className="relative flex flex-col">
          <label className="text-lg font-medium mb-2">{t('destination')}</label>
          <input
            type="text"
            name="destination"
            value={form.destination}
            onChange={handleChange}
            className="px-4 py-3 rounded-xl border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            required
          />
          {suggestions.length > 0 && (
            <ul className="absolute top-full left-0 right-0 z-10 bg-white shadow-lg rounded-lg mt-1 max-h-60 overflow-y-auto">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  onClick={() => selectDestination(s)}
                  className="px-4 py-3 hover:bg-blue-200 cursor-pointer transition-all duration-200"
                >
                  {s.address.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="passengers" className="text-lg font-medium mb-2">{t('passengers')}</label>
          <input
            id="passengers"
            type="number"
            name="passengers"
            value={form.passengers}
            onChange={handleChange}
            min="1"
            className="px-4 py-3 rounded-xl border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            required
          />
        </div>
      </div>

      {price !== null && price !== undefined && (
        <div className="mt-8 bg-green-100 text-green-800 p-6 rounded-xl shadow-xl text-xl font-semibold border border-green-300">
          <strong>{t('price')}</strong>: {Number(price).toFixed(2)} €
        </div>
      )}
  
      <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
        <h3 className="text-xl font-bold mb-4 text-blue-800">{t('paymentInfo')}</h3>
        
        <div>
          <label className="block text-sm font-semibold mb-2">{t('amountToPay')} (€)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            placeholder="Ex : 49.99"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold mb-2">{t('cardInfo')}</label>
          <div className="p-3 border rounded-xl bg-white">
            <CardElement 
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
      >
        {loading ? t('loading') : `${t('pay')} ${amount ? amount + " €" : ""}`}
      </button>

      {message && <p className="mt-2 text-red-500">{message}</p>}
    </form>
  );
};


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
    bagageHorsFormat: "Bagage hors format",
    paymentInfo: "Informations de paiement",
    amountToPay: "Montant à payer",
    cardInfo: "Informations de carte",
    pay: "Payer",
    loading: "Chargement..."
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
    bagageHorsFormat: "Oversized Baggage",
    paymentInfo: "Payment Information",
    amountToPay: "Amount to pay",
    cardInfo: "Card Information",
    pay: "Pay",
    loading: "Loading..."
  }
};

const AIRPORTS = {
  djerba: { name: { fr: "Aéroport de Djerba-Zarzis", en: "Djerba-Zarzis Airport" }, coords: [33.875031, 10.775278] },
  tunis: { name: { fr: "Aéroport de Tunis-Carthage", en: "Tunis-Carthage Airport" }, coords: [36.851111, 10.227222] }
};

const TransfertAeroport = () => {
  const [lang, setLang] = useState('fr');

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-gradient-to-r from-blue-50 to-white rounded-xl shadow-xl">
      <Helmet>
        <title>Transfert Aéroport Djerba, Tunis - Réservez votre transfert privé</title>
        <meta name="google-site-verification" content="ZkLdwUYGAa68OYJ1x53yQLm9q6-8CdZkGwnoleG6agg" />
        <meta charSet="UTF-8" />
        <meta name="description" content="Réservez votre transfert privé à l'aéroport de Djerba, Tunis, Zarzis, et Carthage. Transfert confortable, rapide et abordable pour vos voyages d'affaires ou de loisirs." />
        <meta name="keywords" content="transfert aéroport Djerba, transfert aéroport Tunis, transfert aéroport Djerba Zarzis, transport aéroport Carthage, transfert privé Tunis, transport aéroport Djerba, réservation aéroport Carthage, taxi privé Djerba, navette aéroport Tunis, transfert direct Djerba Tunis, transport aéroport Tunisie,Transfer to Djerba airport, transfer to Tunis airport, transfer to Djerba Zarzis airport, transport to Carthage airport, private transfer to Tunis, transport to Djerba airport, reservation for Carthage airport, private taxi to Djerba, shuttle to Tunis airport, direct transfer from Djerba to Tunis, transport to Tunisia airport,trasfe djerba ,transfert tunis ,tax privé ,taxintaxi aéroport djerba ,aeropoort djerba ,aeroport tunis ,transfert ,aéroport djerba jarziz," />
        <meta name="author" content="tunisieuber.com" />
        <meta property="og:title" content="Transfert Aéroport Djerba, Tunis, Zarzis - Réservez votre transfert privé" />
        <meta property="og:description" content="Réservez votre transfert privé à l'aéroport de Djerba, Tunis, Zarzis, et Carthage. Service rapide et fiable pour un transport confortable à travers la Tunisie." />
        <meta property="og:url" content="https://www.tunisieuber.com/Transfertaeroport" />
        <meta property="og:type" content="tunisieuber" />
        <meta name="twitter:title" content="Transfert Aéroport Djerba, Tunis, Zarzis - Réservez votre transfert privé" />
        <meta name="twitter:description" content="Profitez de nos services de transfert à l'aéroport de Djerba, Tunis, Zarzis, et Carthage. Réservez facilement en ligne pour un transport privé et sécurisé." />
        <link rel="canonical" href="https://www.tunisieuber.com/Transfertaeroport" />
      </Helmet>
      
      <h1 className="text-3xl font-extrabold text-center text-blue-800 mb-8">
        {lang === 'fr' ? 'Transfert Aéroport' : 'Airport Transfer'}
      </h1>

      <div className="flex justify-end gap-4 mb-8">
        {['fr', 'en'].map(l => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-5 py-2 rounded-lg text-lg font-semibold transition-all duration-300 ${lang === l ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-blue-300'}`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <Elements stripe={stripePromise}>
        <PaymentForm lang={lang} />
      </Elements>
    </div>
  );
};

export default TransfertAeroport;
