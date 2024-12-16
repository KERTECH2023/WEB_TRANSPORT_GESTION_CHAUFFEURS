/* eslint-disable @next/next/no-img-element */
import { toast } from "react-toastify";

import React, { useState, useEffect } from "react";
import Select from "react-select";
import { axiosClient } from "../config/axios";


import { useRouter } from "next/router";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Container,
} from "@material-ui/core";

const Conducteur = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Information Personnelles", "Documents"];
  const [isSubmitted, setIsSubmitted] = useState(false);
  const checkChauffeur = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/Chauff/checkchauffeur",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, phone, cnicNo, phoneCode }),
        }
      );

      const data = await response.json();

      // Vérifier si un chauffeur existe avec des champs spécifiques
      if (data.exists) {
        if (data.duplicateField === "permisNumber") {
          setCinError("Ce numéro de permis existe déjà");
          setPhoneError("");
          setEmailError("");
        } else if (data.duplicateField === "email") {
          setEmailError("Cet email existe déjà");
          setCinError("");
          setPhoneError("");
        } else if (data.duplicateField === "phone") {
          setPhoneError("Ce numéro de téléphone existe déjà");
          setCinError("");
          setEmailError("");
        }
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error("Error checking chauffeur:", error);
      return false;
    }
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      // Check required fields
      if (
        !Nom ||
        !Prenom ||
        !email ||
        !cnicNo ||
        !phone ||
        !civilite ||
        !DateNaissance ||
        !address ||
        !postalCode ||
        !ville ||
        !pays ||
        !typeChauffeur ||
        !phoneCode
      ) {
        setNomError(!Nom ? "Veuillez entrer votre Nom" : "");
        setPrenError(!Prenom ? "Veuillez entrer votre Prénom" : "");
        setEmailError(!email ? "Veuillez entrer votre Email" : "");
        setCinError(!cnicNo ? "Veuillez entrer votre Numéro de Permis" : "");
        setPhoneError(
          !phone ? "Veuillez entrer votre Numéro de Téléphone" : ""
        );
        setCiviliteError(
          !civilite ? "Veuillez sélectionner votre Civilité" : ""
        );
        setDateNaissanceError(
          !DateNaissance ? "Veuillez entrer votre Date de Naissance" : ""
        );
        setAddressError(!address ? "Veuillez entrer votre Adresse" : "");
        setPostalCodeError(
          !postalCode ? "Veuillez entrer votre Code Postal" : ""
        );
        setVilleError(!ville ? "Veuillez entrer votre Ville" : "");
        setPaysError(!pays ? "Veuillez entrer votre Pays" : "");
        setTypeChauffeurError(
          !typeChauffeur ? "Veuillez sélectionner votre Type de Chauffeur" : ""
        );

        setPhoneCodeError(!phoneCode ? "Requis" : "");

        return;
      }

      const chauffeurExists = await checkChauffeur();

      if (!chauffeurExists) {
        return;
      }

      // Proceed to next step
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if (activeStep === 1) {
      // For step 2 (activeStep === 1)
      setLoading(true); // Start loading

      try {
        // Call handleSubmit function
        await handleSubmit();

        // Move to next step
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } catch (error) {
        console.error("Error in handleSubmit:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const [chauffId, setChauffId] = useState();
  const [immatriculation, setImmatriculation] = useState();
  const [modelle, setModelle] = useState();
  const [photoAssurance, setPhotoAssurance] = useState({ file: [] });
  const [photoCartegrise, setPhotoCartegrise] = useState({ file: [] });

  const [immatriculationError, setImmatriculationError] = useState("");
  const [modelleError, setModelleError] = useState("");
  const [photoAssuranceError, setPhotoAssuranceError] = useState("");
  const [photoCartegriseError, setPhotoCartegriseError] = useState("");

  const [submitStatus, setSubmitStatus] = useState("");
  const [Nom, setNom] = useState();
  const [Prenom, setPrenom] = useState();
  const [email, setemail] = useState();
  const [phone, setphone] = useState();
  const [photoAvatar, setphotoAvatar] = useState({ file: [] });
  const [photoPermisRec, setphotoPermisRec] = useState({ file: [] });
  const [photoPermisVer, setphotoPermisVer] = useState({ file: [] });
  const [photoVtc, setphotoVtc] = useState({ file: [] });
  const [photoCin, setphotoCin] = useState({ file: [] });
  const [civilite, setCivilite] = useState();
  const [ville, setVille] = useState();
  const [pays, setPays] = useState();
  const [typeChauffeur, setTypeChauffeur] = useState();
  const [DateNaissance, setDateNaissance] = useState();
  const [Nationalite, setNationalite] = useState();
  const [cnicNo, setcnicNo] = useState();
  const [address, setaddress] = useState();
  const [postalCode, setpostalCode] = useState();
  const [villeError, setVilleError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [cinError, setCinError] = useState("");
  const [nomError, setNomError] = useState("");
  const [prenError, setPrenError] = useState("");
  const [typeChauffeurError, setTypeChauffeurError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [civiliteError, setCiviliteError] = useState("");
  const [PaysError, setPaysError] = useState("");
  const [dateNaissanceError, setDateNaissanceError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [postalCodeError, setPostalCodeError] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneCodeError, setPhoneCodeError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setloadingSubmit] = useState(false);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const router = useRouter();

 
    const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => {
        const countriesData = data
          .map((country) => ({
            value: country.name.common, // Nom du pays
            label: country.idd?.root
              ? `${country.idd.root}${country.idd.suffixes ? country.idd.suffixes[0] : ""
              }`
              : "",
            icon: country.flags?.png,
          }))
          .filter((country) => country.label);

        const sortedData = countriesData.sort((a, b) =>
          a.value.localeCompare(b.value)
        );

        setCountries(sortedData);
      })
      .catch((error) => console.error("Error fetching countries:", error));


    let interval;
    if (loading && progress < 100) {
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress < 100) {
            return Math.min(prevProgress + 10, 100); // Increment progress
          }
          clearInterval(interval);
          return 100;
        });
      }, 1000); // Update progress every second (adjust as needed)
    }
    return () => clearInterval(interval); // Clear interval on component unmount
  }, [loading, progress]);

  const calculateMaxDate = () => {
    const today = new Date();
    const minBirthDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );

    const year = minBirthDate.getFullYear();
    let month = minBirthDate.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }

    let day = minBirthDate.getDate();
    if (day < 10) {
      day = `0${day}`;
    }

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    console.log("Updated chauffId:", chauffId);
  }, [chauffId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit function is called");

    const fullPhoneNumber = `${phoneCode}${phone}`;

    setLoading(true);

    try {
      const response = await axiosClient.post(
        "/Chauff/AjoutChauf",
        {
          Nom,
          Prenom,
          email,
          fullPhoneNumber,
          photoAvatar,
          photoCin,
          photoPermisRec,
          photoPermisVer,
          photoVtc,
          civilite,
          DateNaissance,
          Nationalite,
          cnicNo,
          address,
          postalCode,
          ville,
          pays,
          typeChauffeur,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newUser = response.data.uses;
      setNom("");
      setPrenom("");
      setemail("");
      setphone("");
      document.getElementById("login").reset();
      setCivilite("");
      setDateNaissance("");
      setNationalite("");
      setcnicNo("");
      setaddress("");
      setpostalCode("");
      setEmailError("");
      setPhoneError("");
      setCinError("");
      setPhoneCodeError("");

      const userData = response.data;
      setChauffId(userData);

      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } catch (err) {
      console.warn(err);
      if (err.response) {
        if (err.response.status === 403) {
          setEmailError("l'email existe déjà");
          toast.error(`${emailError}`);
        } else {
          setEmailError("");
        }
        if (err.response.data.phoneExists) {
          setPhoneError("Phone already exists");
          toast.error(`${phoneError}`);
        } else {
          setPhoneError("");
        }
        if (err.response.data.cinExists) {
          setCinError("CIN already exists");
          toast.error(`${cinError}`);
        } else {
          setCinError("");
        }
      } else {
        toast.error(`Merci de verifier vos données`);
      }
    } finally {
      setLoading(false);
    }
  };

  function compressImage(file, callback) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        // Créer un canvas pour la compression
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Redimensionner l'image si nécessaire
        const maxWidth = 800;
        const maxHeight = 800;
        let width = img.width;
        let height = img.height;

        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir le canvas en un fichier avec une compression de qualité
        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob], file.name, { type: file.type });
            callback(compressedFile); // Retourner le fichier compressé
          },
          file.type === "image/jpeg" ? "image/jpeg" : "image/png",
          0.7 // Compression (qualité entre 0 et 1, 0.7 est une bonne valeur de compromis)
        );
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }


  const handleCarDetailsSubmit = async (e) => {
    e.preventDefault();
    console.log("handleCarDetailsSubmit function is called");

    setImmatriculationError("");
    setModelleError("");
    setPhotoAssuranceError("");
    setPhotoCartegriseError("");

    let hasError = false;

    if (!immatriculation) {
      setImmatriculationError("L'immatriculation est requise.");
      hasError = true;
    }
    if (!modelle) {
      setModelleError("Le modèle est requis.");
      hasError = true;
    }

    if (
      !photoCartegrise ||
      !(photoCartegrise instanceof File) ||
      photoCartegrise.size === 0
    ) {
      setPhotoCartegriseError("La photo de la carte grise est requise.");
      hasError = true;
    }
    if (
      !photoAssurance ||
      !(photoAssurance instanceof File) ||
      photoAssurance.size === 0
    ) {
      setPhotoAssuranceError("La photo de l'assurance est requise.");
      hasError = true;
    }

    if (hasError) return;

    setloadingSubmit(true); // Start loading

    try {
      const response = await axiosClient.post(
        `/Voi/addvoiture/${chauffId}`,
        {
          photoCartegrise,
          photoAssurance,
          immatriculation,
          modelle,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSubmitStatus(
        "Merci Pour Votre inscription votre dossier sera traité dans les prochains jours"
      );
      setImmatriculation("");
      setModelle("");

      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } catch (err) {
      console.warn(err);
    } finally {
      setloadingSubmit(false); // Stop loading
    }
  };

  return (
    <Container>
      {loadingSubmit ? (
        <div class="flex items-center w-full justify-center text-center min-h-screen ">
          <div class="text-2xl font-semibold text-gray-800 text-center animate-pulse">
            Veuillez patienter un moment pendant que nous traitons votre
            demande. <br />
            <span class="text-gold">Chargement en cours...</span>
          </div>
        </div>
      ) : (
        <div>
          <form action="" id="login" method="post" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center justify-center space-y-4 py-24">
              <p className="text-3xl text-center font-light text-gray-600">
                Vous souhaitez nous Rejoindre ?<br />
                Veuillez Remplir Le Formulaire ci-dessous avec vos informations
              </p>
              {submitStatus && (
                <div className="flex justify-center items-center mt-4">
                  <p className="text-green-500 bg-white border border-green-500 rounded-lg py-2 px-4">
                    {submitStatus}
                  </p>
                </div>
              )}
              <Stepper activeStep={activeStep}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <div className="container mx-auto px-8 xl:px-32 lg:grid lg:grid-cols-2 gap-8">
                {activeStep === 0 && (
                  <div>
                    <Typography variant="h5" gutterBottom>
                      Informations Personnelles
                    </Typography>

                    {/* Civilité */}
                    <div className="col-span-1 row-span-1  p-4 px-8 border">
                      <label className="block mb-2 text-gray-900">
                        Civilité
                      </label>
                      <select
                        id="civilite"
                        className="text-gray-900 block w-full p-2.5"
                        onChange={(e) => setCivilite(e.target.value)}
                        value={civilite || ""}
                        required
                      >
                        <option value="">Sélectionner</option>
                        <option value="Mr">Homme</option>
                        <option value="Mme">Femme</option>
                      </select>
                      {civiliteError && (
                        <label className="text-red-500">{civiliteError}</label>
                      )}
                    </div>

                    {/* Nom */}
                    <div className="col-span-1 row-span-1 p-4 px-8 border">
                      <label className="block mb-2 text-gray-900">Nom</label>
                      <input
                        type="text"
                        id="nom"
                        className="text-gray-900 block w-full p-2.5"
                        placeholder="NOM"
                        onChange={(e) => setNom(e.target.value)}
                        value={Nom || ""}
                        required
                      />
                      {nomError && (
                        <label className="text-red-500">{nomError}</label>
                      )}
                    </div>

                    {/* Prénom */}
                    <div className="col-span-1 row-span-1 p-4 px-8 border">
                      <label className="block mb-2 text-gray-900">Prénom</label>
                      <input
                        type="text"
                        id="prenom"
                        className="text-gray-900 block w-full p-2.5"
                        placeholder="Prénom"
                        onChange={(e) => setPrenom(e.target.value)}
                        value={Prenom || ""}
                        required
                      />
                      {prenError && (
                        <label className="text-red-500">{prenError}</label>
                      )}
                    </div>

                    {/* Date de Naissance */}
                    <div className="col-span-1 row-span-1 p-4 px-8 border">
                      <label className="block mb-2 text-gray-900">
                        Date de Naissance
                      </label>
                      <input
                        type="date"
                        id="dateNaissance"
                        className="text-gray-900 block w-full p-2.5"
                        onChange={(e) => setDateNaissance(e.target.value)}
                        value={DateNaissance || ""}
                        max={calculateMaxDate()}
                        required
                      />
                      {dateNaissanceError && (
                        <label className="text-red-500">
                          {dateNaissanceError}
                        </label>
                      )}
                    </div>
                    {/* Num permis */}
                    <div className="col-span-1 row-span-1  p-4 px-8 border">
                      <label className="block mb-2 text-gray-900">
                        Num Permis
                      </label>
                      <input
                        type="number"
                        id="cin"
                        className="text-gray-900 block w-full p-2.5"
                        placeholder="012345678"
                        onChange={(e) => setcnicNo(e.target.value)}
                        value={cnicNo || ""}
                        required
                      />
                      {cinError && (
                        <label className="text-red-500">{cinError}</label>
                      )}
                    </div>
                    {/* Email */}
                    <div className="col-span-1 row-span-1 p-4 px-8 border">
                      <label className="block mb-2 text-gray-900">Email</label>
                      <input
                        type="email"
                        id="email"
                        className="text-gray-900 block w-full p-2.5"
                        placeholder="name@gmail.com"
                        onChange={(e) => setemail(e.target.value)}
                        value={email || ""}
                        required
                      />
                      {emailError && (
                        <label className="text-red-500">{emailError}</label>
                      )}
                    </div>

                    {/* Téléphone */}
                    <div className="col-span-1 row-span-1 p-4 px-8 border">
                      <label className="block mb-2 text-gray-900">
                        Téléphone
                      </label>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-2">
                        <select
                          id="phoneCode"
                          className="w-full sm:w-36 p-2.5 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          onChange={(e) => setPhoneCode(e.target.value)}
                          value={phoneCode || ""}
                          required
                        >
                          <option value="">Choisir le code</option>
                          <option value="+33">France (+33)</option>
                          <option value="+216">Tunisie (+216)</option>
                        </select>


                        <input
                          type="number"
                          id="phone"
                          className="w-full p-2.5 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          placeholder="012345678"
                          onChange={(e) => setphone(e.target.value)}
                          value={phone || ""}
                          required
                        />
                      </div>


                      {/* Messages d'erreur */}
                      <div className="flex gap-28">
                        {phoneCodeError && (
                          <p className="text-red-500 text-sm">
                            {phoneCodeError}
                          </p>
                        )}
                        {phoneError && (
                          <p className="text-red-500 text-sm">{phoneError}</p>
                        )}
                      </div>
                    </div>

                    {/* Adresse */}

                    <div className="col-span-1 row-span-1 p-4 px-8 border">
                      <label className="block mb-2 text-gray-900">
                        Adresse
                      </label>
                      <input
                        type="text"
                        id="adresse"
                        className="text-gray-900 block w-full p-2.5"
                        placeholder="Adresse"
                        onChange={(e) => setaddress(e.target.value)}
                        value={address || ""}
                        required
                      />
                      {addressError && (
                        <label className="text-red-500">{addressError}</label>
                      )}
                    </div>

                    {/* Ville */}
                    <div className="col-span-1 row-span-1 p-4 px-8 border">
                      <label className="block mb-2 text-gray-900">
                        Ville
                      </label>
                      <input
                        type="text"
                        id="ville"
                        className="text-gray-900 block w-full p-2.5"
                        placeholder="Ville"
                        onChange={(e) => setVille(e.target.value)}
                        value={ville || ""}
                        required
                      />{" "}
                      {villeError && (
                        <label className="text-red-500">{villeError}</label>
                      )}
                    </div>

                    {/* Pays */}
                    <div className="col-span-1 row-span-1 p-4 px-8 border">
                      <label className="block mb-2 text-gray-900">Pays</label>
                      <input
                        type="text"
                        id="pays"
                        className="text-gray-900 block w-full p-2.5"
                        placeholder="Pays"
                        onChange={(e) => setPays(e.target.value)}
                        value={pays || ""}
                        required
                      />
                      {PaysError && (
                        <label className="text-red-500">{PaysError}</label>
                      )}
                    </div>

                    {/* Code Postal */}
                    <div className="col-span-1 row-span-1 p-4 px-8 border">
                      <label className="block mb-2 text-gray-900">
                        Code Postal
                      </label>
                      <input
                        type="number"
                        id="codePostal"
                        className="text-gray-900 block w-full p-2.5"
                        placeholder="Code Postal"
                        onChange={(e) => setpostalCode(e.target.value)}
                        value={postalCode || ""}
                        required
                      />{" "}
                      {postalCodeError && (
                        <label className="text-red-500">
                          {postalCodeError}
                        </label>
                      )}
                    </div>

                    {/* Type de Chauffeur */}
                    <div className="col-span-1 row-span-1  p-4 px-8 border">
                      <label className="block mb-2 text-gray-900">
                        Type de Chauffeur
                      </label>
                      <select
                        id="typeChauffeur"
                        className="text-gray-900 block w-full p-2.5"
                        onChange={(e) => setTypeChauffeur(e.target.value)}
                        value={typeChauffeur || ""}
                        required
                      >
                        <option value="">Sélectionner</option>
                        <option value="Chauffeur privé">Chauffeur Privé</option>
                        <option value="Chauffeur Taxi">Chauffeur Taxi</option>
                      </select>
                      {typeChauffeurError && (
                        <label className="text-red-500">
                          {typeChauffeurError}
                        </label>
                      )}
                    </div>
                  </div>
                )}

                {activeStep === 1 && (
                  <div>
                    <Typography variant="h5" gutterBottom>
                      Documents
                    </Typography>
                    {/* Add attachment fields */}
                    {/* Photo visage */}
                    <div className="col-span-1 row-span-1 p-4 px-8 border">
                      <label className="block mb-2 text-gray-900">Visage</label>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        id="avatar"
                        className="text-gray-900 block w-full p-2.5"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          compressImage(file, (compressedFile) => {
                            setphotoAvatar(compressedFile);
                          });
                        }}
                        required
                      />
                    </div>

                    <div className="col-span-1 row-span-1 p-4 px-8 border">
                      <label className="block mb-2 text-gray-900">CIN</label>
                      <input
                        type="file"
                        id="photo_cin"
                        accept=".jpg,.jpeg,.png,.pdf"
                        className="text-gray-900 block w-full p-2.5"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          compressImage(file, (compressedFile) => {
                            setphotoCin(compressedFile);
                          });
                        }}
                        required
                      />
                    </div>

                    <div className="col-span-1 row-span-1 p-4 px-8 border">
                      <label className="block mb-2 text-gray-900">Carte professionnelle</label>
                      <input
                        type="file"
                        id="photo_VTC"
                        accept=".jpg,.jpeg,.png,.pdf"
                        className="text-gray-900 block w-full p-2.5"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          compressImage(file, (compressedFile) => {
                            setphotoVtc(compressedFile);
                          });
                        }}
                        required
                      />
                    </div>

                    <div className="col-span-1 row-span-1 p-4 px-8 border">
                      <label className="block mb-2 text-gray-900">Permis Recto</label>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        id="permis_recto"
                        className="text-gray-900 block w-full p-2.5"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          compressImage(file, (compressedFile) => {
                            setphotoPermisVer(compressedFile);
                          });
                        }}
                        required
                      />
                    </div>

                    <div className="col-span-1 row-span-1 p-4 px-8 border">
                      <label className="block mb-2 text-gray-900">Permis Verso</label>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        id="permis_verso"
                        className="text-gray-900 block w-full p-2.5"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          compressImage(file, (compressedFile) => {
                            setphotoPermisRec(compressedFile);
                          });
                        }}
                        required
                      />
                    </div>


                    <Typography variant="h5" gutterBottom>
                      Détails Véhicule
                    </Typography>

                    <div className="col-span-1 row-span-1  p-4 px-8 border">
                      <label className="block mb-2 text-gray-900">
                        Immatriculation
                      </label>
                      <input
                        type="text"
                        id="immatriculation"
                        className="text-gray-900 block w-full p-2.5"
                        placeholder="Immatriculation"
                        value={immatriculation}
                        onChange={(e) => setImmatriculation(e.target.value)}
                        required
                      />
                      {immatriculationError && (
                        <label className="text-red-500 ">
                          {immatriculationError}
                        </label>
                      )}
                    </div>
                    <div className="col-span-1 row-span-1  p-4 px-8 border">
                      <label className="block mb-2 text-gray-900">
                        Modelle
                      </label>
                      <input
                        type="text"
                        id="modelle"
                        className="text-gray-900 block w-full p-2.5"
                        placeholder="Modelle"
                        value={modelle}
                        onChange={(e) => setModelle(e.target.value)}
                        required
                      />
                      {modelleError && (
                        <label className="text-red-500 ">{modelleError}</label>
                      )}
                    </div>
                    <div className="col-span-1 row-span-1  p-4 px-8 border">
                      <label className="block mb-2 text-gray-900">
                        {" "}
                        Cartegrise
                      </label>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        id="categrise"
                        className="text-gray-900 block w-full p-2.5"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          compressImage(file, (compressedFile) => {
                            setPhotoCartegrise(compressedFile);
                          });
                        }}
                       
                        required
                      />
                      {photoCartegriseError && (
                        <label className="text-red-500 ">
                          {photoCartegriseError}
                        </label>
                      )}
                    </div>
                    <div className="col-span-1 row-span-1  p-4 px-8 border">
                      <label className="block mb-2 text-gray-900">
                        Assurance
                      </label>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        id="assurance"
                        className="text-gray-900 block w-full p-2.5"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          compressImage(file, (compressedFile) => {
                            setPhotoAssurance(compressedFile);
                          });
                        }}
                        required
                      />
                      {photoAssuranceError && (
                        <label className="text-red-500 ">
                          {photoAssuranceError}
                        </label>
                      )}
                    </div>

 


                    {/* Other attachment fields */}
                  </div>

                )}
               
              </div>
              <div className="mt-2">
                {activeStep === steps.length ? (
                  <div>
                    <Typography variant="h5" gutterBottom>
                      Merci pour nous rejoindre
                    </Typography>
                  </div>
                ) : (
                  <div>
                    <Button disabled={activeStep === 0} onClick={handleBack}>
                      Retour
                    </Button>
                    {activeStep === steps.length - 1 ? (
                      <Button
                        id="sub_btn"
                        type="submit"
                        value="login"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                      >
                        {loading ? `${progress}%` : "Suivant"}
                      </Button>
                    )  : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={(e) => {
                          handleNext;
                          handleCarDetailsSubmit(e);
                          
                        }}
                        disabled={loading}
                      >
                        {loading ? `${progress}%` : "Rejoignez Nous"}
                      </Button>
                    )}
                  </div>
                )}

              </div>
            </div>
          </form>
        </div>
      )}
    </Container>
  );
};
export default Conducteur;
