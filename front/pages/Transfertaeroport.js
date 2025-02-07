import React, { useState, useEffect } from 'react';
import { axios } from "../config/axios";
import { toast } from "react-toastify";
import { FaPlaneAlt, FaGlobe, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUsers, FaSuitcase } from 'react-icons/fa';

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
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <FaPlaneAlt className="mr-3 text-blue-600" />
          {lang === 'fr' ? 'Transfert Aéroport' : 'Airport Transfer'}
        </h1>
        <div className="flex items-center space-x-2">
          <FaGlobe className="text-gray-500" />
          {['en', 'fr'].map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 
                ${lang === l 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {['firstName', 'lastName', 'email', 'phone'].map(field => (
              <div key={field}>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  {t(field)}
                </label>
                <div className="relative">
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    className="w-full p-3 pl-10 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center">
                <FaCalendarAlt className="mr-2 text-gray-500" />
                {t('datevol')}
              </label>
              <input
                type="date"
                name="datevol"
                value={form.datevol}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center">
                <FaClock className="mr-2 text-gray-500" />
                {t('heurvol')}
              </label>
              <input
                type="time"
                name="heurvol"
                value={form.heurvol}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center">
              <FaPlaneAlt className="mr-2 text-gray-500" />
              {t('numvol')}
            </label>
            <input
              type="text"
              name="numvol"
              value={form.numvol}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {['bagageCabine', 'bagageSoute', 'bagageHorsFormat'].map(field => (
              <div key={field}>
                <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center">
                  <FaSuitcase className="mr-2 text-gray-500" />
                  {t(field)}
                </label>
                <input
                  type={field === 'bagageHorsFormat' ? 'text' : 'number'}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-gray-500" />
              {t('airport')}
            </label>
            <select
              name="airport"
              value={form.airport}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">--</option>
              {Object.entries(AIRPORTS).map(([key, { name }]) => (
                <option key={key} value={key}>{name[lang]}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-gray-500" />
              {t('destination')}
            </label>
            <input
              type="text"
              name="destination"
              value={form.destination}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    onClick={() => selectDestination(s)}
                    className="p-3 hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    {s.address.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center">
              <FaUsers className="mr-2 text-gray-500" />
              {t('passengers')}
            </label>
            <input
              type="number"
              name="passengers"
              value={form.passengers}
              onChange={handleChange}
              min="1"
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="flex flex-col justify-between">
          {price !== null && price !== undefined && (
            <div className="sticky top-8 space-y-6">
              <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-2xl shadow-lg border border-green-200 text-center">
                <h2 className="text-xl font-bold text-green-800 mb-4">
                  {t('price')}
                </h2>
                <p className="text-3xl font-extrabold text-green-700">
                  {Number(price).toFixed(2)} DT
                </p>
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-blue-600 text-white text-lg font-bold rounded-lg 
                  hover:bg-blue-700 transition-all duration-300 
                  shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {t('submit')}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default SimpleForm;
