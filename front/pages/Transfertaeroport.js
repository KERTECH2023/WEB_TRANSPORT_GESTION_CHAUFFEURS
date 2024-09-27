import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const SimpleForm = () => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [paysOrigine, setPaysOrigine] = useState("");
  const [destination, setDestination] = useState("");
  const [numVol, setNumVol] = useState("");
  const [heureArrivee, setHeureArrivee] = useState("");
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    const errors = {};
    if (!nom) errors.nom = "Le nom est requis";
    if (!prenom) errors.prenom = "Le prénom est requis";
    if (!paysOrigine) errors.paysOrigine = "Le pays d'origine est requis";
    if (!destination) errors.destination = "La destination est requise";
    if (!numVol) errors.numVol = "Le numéro de vol est requis";
    if (!heureArrivee) errors.heureArrivee = "L'heure d'arrivée est requise";
    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const response = await axiosClient.post("/submitForm", {
          nom,
          prenom,
          paysOrigine,
          destination,
          numVol,
          heureArrivee,
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-md"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
          {errors.nom && <span className="text-red-500">{errors.nom}</span>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Prénom</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-md"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
          />
          {errors.prenom && (
            <span className="text-red-500">{errors.prenom}</span>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Pays d origine</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-md"
            value={paysOrigine}
            onChange={(e) => setPaysOrigine(e.target.value)}
          />
          {errors.paysOrigine && (
            <span className="text-red-500">{errors.paysOrigine}</span>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Destination</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-md"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          {errors.destination && (
            <span className="text-red-500">{errors.destination}</span>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Numéro de vol</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-md"
            value={numVol}
            onChange={(e) => setNumVol(e.target.value)}
          />
          {errors.numVol && (
            <span className="text-red-500">{errors.numVol}</span>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Heure d arrivée</label>
          <input
            type="time"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-md"
            value={heureArrivee}
            onChange={(e) => setHeureArrivee(e.target.value)}
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
