import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

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

// Remplacez ceci par votre clé API OpenRouteService
const ORS_API_KEY = '5b3ce3597851110001cf6248666a7544a8974e0ca4291ebd8e4095a8';

const SimpleForm = () => {
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

  const [destinationCoords, setDestinationCoords] = useState(null);
  const [distance, setDistance] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const geocodeDestination = async (destination) => {
    try {
      const response = await axios.get(
        `https://api.openrouteservice.org/geocode/search`,
        {
          params: {
            api_key: ORS_API_KEY,
            text: destination,
            size: 1
          }
        }
      );

      if (response.data.features && response.data.features.length > 0) {
        const coords = response.data.features[0].geometry.coordinates;
        setDestinationCoords(coords);
        return coords;
      }
    } catch (error) {
      console.error('Erreur de géocodage:', error);
      toast.error('Erreur lors de la recherche de la destination');
    }
    return null;
  };

  const calculateDistance = async (startCoords, endCoords) => {
    try {
      const response = await axios.post(
        'https://api.openrouteservice.org/v2/directions/driving-car',
        {
          coordinates: [startCoords, endCoords]
        },
        {
          headers: {
            'Authorization': ORS_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.routes && response.data.routes.length > 0) {
        const distanceKm = (response.data.routes[0].summary.distance / 1000).toFixed(2);
        setDistance(distanceKm);
        return distanceKm;
      }
    } catch (error) {
      console.error('Erreur de calcul de distance:', error);
      toast.error('Erreur lors du calcul de la distance');
    }
    return null;
  };

  useEffect(() => {
    const updateDistance = async () => {
      if (formData.aeroportDepart && formData.destination) {
        const airport = AIRPORTS[formData.aeroportDepart];
        if (airport) {
          const destCoords = await geocodeDestination(formData.destination);
          if (destCoords) {
            calculateDistance(airport.coordinates.reverse(), destCoords);
          }
        }
      }
    };

    updateDistance();
  }, [formData.aeroportDepart, formData.destination]);

  const handleSubmit = async (e) => {
    e.preventDefault();

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

        <div className="mb-4">
          <label className="block text-gray-700">Destination</label>
          <input
            type="text"
            name="destination"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-md"
            value={formData.destination}
            onChange={handleChange}
          />
          {errors.destination && (
            <span className="text-red-500">{errors.destination}</span>
          )}
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
