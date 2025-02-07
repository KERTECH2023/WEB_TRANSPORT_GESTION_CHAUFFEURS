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
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">


    <h1 className="text-2xl font-bold text-center mb-6">
      {lang === 'fr' ? 'Transfert Aéroport' : 'Airport Transfer'}
    </h1>
    <div className="flex justify-end gap-2 mb-6">
      {['fr', 'en'].map(l => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-3 py-1 rounded ${lang === l ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>

    <form className="space-y-4" onSubmit={handleSubmit}>
      <table>
        <tr><td>


          <div className="grid grid-cols-2 gap-4">
            {['firstName', 'lastName', 'email', 'phone'].map(field => (
              <div key={field}>
                <label className="block mb-1 font-medium">{t(field)}</label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            ))}
          </div>


          <div>
            <label className="block mb-1 font-medium">{t('datevol')}</label>
            <input
              type="date"
              name="datevol"
              value={form.datevol}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">{t('heurvol')}</label>
            <input
              type="time"
              name="heurvol"
              value={form.heurvol}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">{t('numvol')}</label>
            <input
              type="text"
              name="numvol"
              value={form.numvol}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {['bagageCabine', 'bagageSoute', 'bagageHorsFormat'].map(field => (
              <div key={field}>
                <label className="block mb-1 font-medium">{t(field)}</label>
                <input
                  type={field === 'bagageHorsFormat' ? 'text' : 'number'}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block mb-1 font-medium">{t('airport')}</label>
            <select
              name="airport"
              value={form.airport}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">--</option>
              {Object.entries(AIRPORTS).map(([key, { name }]) => (
                <option key={key} value={key}>{name[lang]}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <label className="block mb-1 font-medium">{t('destination')}</label>
            <input
              type="text"
              name="destination"
              value={form.destination}
              onChange={handleChange}
              className="w-full p-2 border rounded"
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



          <div>
            <label htmlFor="passengers" className="block mb-1 font-medium">
              {t('passengers')}
            </label>
            <input
              id="passengers"
              type="number"
              name="passengers"
              value={form.passengers}
              onChange={handleChange}
              min="1"
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </td>
          <td>

            {price !== null && price !== undefined && (
              <div>
                <div className="p-5 bg-green-100 text-green-800 rounded-lg text-xl font-semibold shadow-md border border-green-300">
                  <strong>{t('price')}</strong>: {Number(price).toFixed(2)} DT
                </div>
                <button
                  type="submit"
                  className="w-full mt-4 py-3 px-5 bg-green-600 text-white text-lg font-medium rounded-lg hover:bg-green-700 transition-all shadow-md"
                >
                  {t('submit')}
                </button>
              </div>
            )}

          </td>
        </tr>
      </table>

    </form>
  </div>
  );
};

export default SimpleForm;
