import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';



const [destinationSuggestions, setDestinationSuggestions] = useState([]);
const [suggestionLoading, setSuggestionLoading] = useState(false);

// Existing handleChange method modified to include destination suggestions
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));

  // Add destination suggestion logic
  if (name === 'destination' && value.length > 2) {
    fetchDestinationSuggestions(value);
  }
};

// New method to fetch destination suggestions
const fetchDestinationSuggestions = async (query) => {
  if (!query) return;

  setSuggestionLoading(true);
  try {
    const response = await axios.get(
      'https://autocomplete.search.hereapi.com/v1/autocomplete',
      {
        params: {
          apiKey: HERE_API_KEY,
          q: query,
          limit: 5,
          in: 'countryCode:TUN' // Limit to Tunisia
        }
      }
    );

    setDestinationSuggestions(response.data.items || []);
  } catch (error) {
    console.error('Erreur de recherche de destination:', error);
  } finally {
    setSuggestionLoading(false);
  }
};

// Données des aéroports
const AIRPORTS = {
  djerba: {
    name: "Aéroport de Djerba-Zarzis",
    coordinates: [33.875031, 10.775278]  // [latitude, longitude]
  },
  tunis: {
    name: "Aéroport de Tunis-Carthage",
    coordinates: [36.851111, 10.227222]
  }
};

// Clé API HERE Maps
const HERE_API_KEY = 'ZJkO_2aWL0S7JttmiFEegi0FPZh5DvMvEfvXtnw6L2o';



const SimpleForm = () => {
  // États du formulaire
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    whatsapp: "",
    nombreVoyageurs: "",
    paysOrigine: "",
    aeroportDepart: "",
    destination: "",
    numVol: "",
    heureArrivee: ""
  });

  const [destinationCoords, setDestinationCoords] = useState(null); // Coordonnées de la destination
  const [distance, setDistance] = useState(null); // Distance calculée
  const [errors, setErrors] = useState({}); // Erreurs de validation
  const [submitStatus, setSubmitStatus] = useState(""); // Statut de soumission
  const router = useRouter();

  // Gestion des changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Géocodage avec HERE Maps
  const geocodeDestination = async (destination) => {
    try {
      const response = await axios.get(
        `https://geocode.search.hereapi.com/v1/geocode`,
        {
          params: {
            apiKey: HERE_API_KEY,
            q: destination
          }
        }
      );

      if (response.data.items && response.data.items.length > 0) {
        const coords = response.data.items[0].position; // { lat, lng }
        setDestinationCoords([coords.lat, coords.lng]);
        return [coords.lat, coords.lng];
      }
    } catch (error) {
      console.error('Erreur de géocodage:', error);
      toast.error('Erreur lors de la recherche de la destination');
    }
    return null;
  };

  // Calcul de distance avec HERE Maps
  const calculateDistance = async (startCoords, endCoords) => {
    try {
      // Vérification du format des coordonnées
      if (!startCoords || !endCoords || startCoords.length !== 2 || endCoords.length !== 2) {
        throw new Error('Les coordonnées doivent être sous la forme [latitude, longitude]');
      }

      const response = await axios.get(
        'https://router.hereapi.com/v8/routes',
        {
          params: {
            apiKey: HERE_API_KEY,
            origin: `${startCoords[0]},${startCoords[1]}`, // Origine
            destination: `${endCoords[0]},${endCoords[1]}`, // Destination
            transportMode: 'car', // Mode de transport
            return: 'summary' // On ne récupère que le résumé (distance, durée)
          }
        }
      );

      if (response.data.routes && response.data.routes.length > 0) {
        const distanceMeters = response.data.routes[0].sections[0].summary.length; // Distance en mètres
        const distanceKm = (distanceMeters / 1000).toFixed(2); // Conversion en km
        setDistance(distanceKm); // Mise à jour de l'état distance
        return distanceKm;
      }
    } catch (error) {
      console.error('Erreur de calcul de distance:', error);
      toast.error('Erreur lors du calcul de la distance');
    }
    return null;
  };

  // Mise à jour de la distance lorsque l'aéroport ou la destination change
  useEffect(() => {
    const updateDistance = async () => {
      if (formData.aeroportDepart && formData.destination) {
        const airport = AIRPORTS[formData.aeroportDepart];
        if (airport) {
          const destCoords = await geocodeDestination(formData.destination);
          if (destCoords) {
            await calculateDistance(airport.coordinates, destCoords);
          }
        }
      }
    };

    updateDistance();
  }, [formData.aeroportDepart, formData.destination]);

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation des champs
    const errors = {};
    if (!formData.nom) errors.nom = "Le nom est requis";
    if (!formData.prenom) errors.prenom = "Le prénom est requis";
    if (!formData.email && !formData.whatsapp) errors.contact = "Email ou WhatsApp est requis";
    if (!formData.nombreVoyageurs) errors.nombreVoyageurs = "Le nombre de voyageurs est requis";
    if (!formData.paysOrigine) errors.paysOrigine = "Le pays d'origine est requis";
    if (!formData.aeroportDepart) errors.aeroportDepart = "L'aéroport de départ est requis";
    if (!formData.destination) errors.destination = "La destination est requise";
    if (!formData.numVol) errors.numVol = "Le numéro de vol est requis";
    if (!formData.heureArrivee) errors.heureArrivee = "L'heure d'arrivée est requise";
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Format d'email invalide";
    }
    
    setErrors(errors);

    // Si aucune erreur, soumettre le formulaire
    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post("/api/submitForm", {
          ...formData,
          distance
        });
        setSubmitStatus("Votre demande a été soumise avec succès");
        router.push("/");
      } catch (err) {
        console.error(err);
        toast.error("Erreur lors de la soumission du formulaire");
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-5 p-7 bg-white rounded-lg shadow-2xl">
      <h1 className="text-2xl font-bold text-center mb-6">
        Transfert Aéroport
      </h1>

      {distance && (
        <div className="mb-4 p-4 bg-blue-100 text-blue-700 border border-blue-300 rounded">
          Distance estimée: {distance} km
        </div>
      )}

      {submitStatus && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 border border-green-300 rounded">
          {submitStatus}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Nom</label>
          <input
            type="text"
            name="nom"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-md"
            value={formData.nom}
            onChange={handleChange}
          />
          {errors.nom && <span className="text-red-500">{errors.nom}</span>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Prénom</label>
          <input
            type="text"
            name="prenom"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-md"
            value={formData.prenom}
            onChange={handleChange}
          />
          {errors.prenom && <span className="text-red-500">{errors.prenom}</span>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-md"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@email.com"
          />
          {errors.email && <span className="text-red-500">{errors.email}</span>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">WhatsApp</label>
          <input
            type="tel"
            name="whatsapp"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-md"
            value={formData.whatsapp}
            onChange={handleChange}
            placeholder="XX XX XXX XXX"
          />
          {errors.contact && <span className="text-red-500">{errors.contact}</span>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Nombre de voyageurs</label>
          <input
            type="number"
            name="nombreVoyageurs"
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-md"
            value={formData.nombreVoyageurs}
            onChange={handleChange}
          />
          {errors.nombreVoyageurs && (
            <span className="text-red-500">{errors.nombreVoyageurs}</span>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Pays d'origine</label>
          <input
            type="text"
            name="paysOrigine"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-md"
            value={formData.paysOrigine}
            onChange={handleChange}
          />
          {errors.paysOrigine && (
            <span className="text-red-500">{errors.paysOrigine}</span>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Aéroport de départ</label>
          <select
            name="aeroportDepart"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-md"
            value={formData.aeroportDepart}
            onChange={handleChange}
          >
            <option value="">Sélectionnez un aéroport</option>
            <option value="djerba">Aéroport de Djerba-Zarzis</option>
            <option value="tunis">Aéroport de Tunis-Carthage</option>
          </select>
          {errors.aeroportDepart && (
            <span className="text-red-500">{errors.aeroportDepart}</span>
          )}
        </div>

        <div className="max-w-lg mx-auto mt-5 p-7 bg-white rounded-lg shadow-2xl">
      {/* ... other form fields ... */}

      <div className="mb-4 relative">
        <label className="block text-gray-700">Destination</label>
        <input
          type="text"
          name="destination"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-md"
          value={formData.destination}
          onChange={handleChange}
          autoComplete="off"
        />
        {suggestionLoading && (
          <div className="absolute top-full z-10 w-full bg-white border border-gray-300 rounded-b-lg shadow-md p-2">
            Chargement...
          </div>
        )}
        {destinationSuggestions.length > 0 && (
          <ul className="absolute top-full z-10 w-full bg-white border border-gray-300 rounded-b-lg shadow-md">
            {destinationSuggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    destination: suggestion.title
                  }));
                  setDestinationSuggestions([]);
                }}
              >
                {suggestion.title}
                <span className="text-gray-500 text-sm ml-2">
                  {suggestion.address?.label}
                </span>
              </li>
            ))}
          </ul>
        )}
        {errors.destination && (
          <span className="text-red-500">{errors.destination}</span>
        )}
      </div>
      </div>

        <div className="mb-4">
          <label className="block text-gray-700">Numéro de vol</label>
          <input
            type="text"
            name="numVol"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-md"
            value={formData.numVol}
            onChange={handleChange}
          />
          {errors.numVol && (
            <span className="text-red-500">{errors.numVol}</span>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Heure d'arrivée</label>
          <input
            type="time"
            name="heureArrivee"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-md"
            value={formData.heureArrivee}
            onChange={handleChange}
          />
          {errors.heureArrivee && (
            <span className="text-red-500">{errors.heureArrivee}</span>
          )}
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
        >
          Soumettre
        </button>
      </form>
    </div>
  );
};

export default SimpleForm;
