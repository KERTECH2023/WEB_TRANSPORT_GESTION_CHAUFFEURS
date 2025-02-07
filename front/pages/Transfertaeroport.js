import React, { useState, useEffect } from 'react';
import { axios } from "../config/axios";
import { toast } from "react-toastify";

import { axiosClient } from "../config/axios";



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
    datevol: "Date du vol",     // Traduction ajoutée
    heurvol: "Heure du vol",     // Traduction ajoutée
    numvol: "Numéro du vol",     // Traduction ajoutée
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
    heurvol: "Flight Time",       // Traduction ajoutée
    numvol: "Flight Number",      // Traduction ajoutée
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

const SimpleForm = () => {
  const [lang, setLang] = useState('fr');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '' ,bagageCabine:'', bagageSoute:'',bagageHorsFormat:'',  datevol: '',   heurvol: '',    numvol: '',    airport: '', destination: '', passengers: '' });
  const [suggestions, setSuggestions] = useState([]);
  const [price, setPrice] = useState(null);
  const [distance, setDistance] = useState(0);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [cache, setCache] = useState({}); // Cache pour les résultats de recherche
  const [pricingData, setPricingData] = useState({ prixdepersonne: 0, prixdebase: 0 });


 

  const calculatePrice = (numPassengers, distance) => {
    return (distance * numPassengers * pricingData.prixdepersonne) + pricingData.prixdebase;
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
      const res = await fetch(
        `https://router.hereapi.com/v8/routes?apiKey=${HERE_KEY}&transportMode=car&origin=${airport.coords.join(',')}&destination=${coords.join(',')}&return=summary`
      );
      const data = await res.json();
      const newDistance = data?.routes?.[0]?.sections?.[0]?.summary?.length / 1000 || 0;
      setDistance(newDistance);
      const numPassengers = parseInt(form.passengers) || 1;
      const newPrice = calculatePrice(numPassengers, newDistance);
      setPrice(newPrice);
     
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
  
    try {
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
          price: price, // Ajout du prix
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Transfert ajouté avec succès");
      toast.success("Transfert ajouté avec succès");
  
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
    } catch (error) {
      console.error("Erreur lors de l'ajout du transfert :", error);
      toast.error("Erreur lors de l'ajout du transfert");
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
    <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Language Selector */}
      <div className="flex justify-between items-center p-6 bg-blue-600 text-white">
        <h1 className="text-3xl font-bold">
          {lang === 'fr' ? 'Transfert Aéroport' : 'Airport Transfer'}
        </h1>
        <div className="flex gap-2">
          {['en', 'fr'].map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-4 py-2 rounded-full transition-all ${
                lang === l 
                  ? 'bg-white text-blue-600 shadow-md' 
                  : 'hover:bg-blue-500'
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-8 grid md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: 'firstName', icon: User },
              { name: 'lastName', icon: User },
              { name: 'email', icon: Mail },
              { name: 'phone', icon: Phone }
            ].map(({ name, icon: Icon }) => (
              <div key={name} className="relative">
                <label className="block mb-2 text-gray-700 font-medium">
                  {t(name)}
                </label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={name === 'email' ? 'email' : 'text'}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Flight Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block mb-2 text-gray-700 font-medium">
                {t('datevol')}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="date"
                  name="datevol"
                  value={form.datevol}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="relative">
              <label className="block mb-2 text-gray-700 font-medium">
                {t('heurvol')}
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="time"
                  name="heurvol"
                  value={form.heurvol}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Flight Number */}
          <div className="relative">
            <label className="block mb-2 text-gray-700 font-medium">
              {t('numvol')}
            </label>
            <div className="relative">
              <Plane className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="numvol"
                value={form.numvol}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Luggage */}
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: 'bagageCabine', type: 'number', icon: Luggage },
              { name: 'bagageSoute', type: 'number', icon: Luggage },
              { name: 'bagageHorsFormat', type: 'text', icon: Luggage }
            ].map(({ name, type, icon: Icon }) => (
              <div key={name} className="relative">
                <label className="block mb-2 text-gray-700 font-medium">
                  {t(name)}
                </label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Airport and Destination */}
          <div className="space-y-4">
            <div className="relative">
              <label className="block mb-2 text-gray-700 font-medium">
                {t('airport')}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <select
                  name="airport"
                  value={form.airport}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">--</option>
                  {Object.entries(AIRPORTS).map(([key, { name }]) => (
                    <option key={key} value={key}>{name[lang]}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="relative">
              <label className="block mb-2 text-gray-700 font-medium">
                {t('destination')}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="destination"
                  value={form.destination}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {suggestions.length > 0 && (
                  <ul className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                    {suggestions.map((s, i) => (
                      <li
                        key={i}
                        onClick={() => selectDestination(s)}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {s.address.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Passengers */}
          <div className="relative">
            <label className="block mb-2 text-gray-700 font-medium">
              {t('passengers')}
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="number"
                name="passengers"
                value={form.passengers}
                onChange={handleChange}
                min="1"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Price and Submit */}
          {price !== null && price !== undefined && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <p className="text-2xl font-bold text-green-700 mb-4">
                {t('price')}: {Number(price).toFixed(2)} DT
              </p>
              <button
                type="submit"
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md text-lg font-semibold"
              >
                {t('submit')}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  </div>
  );
};

export default SimpleForm;
