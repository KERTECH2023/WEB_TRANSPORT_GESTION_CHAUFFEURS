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
  const steps = ["Information Personnelles", "Documents", "Détails Véhicule"];
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  /*const checkChauffeur = async () => {
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
  */

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
        !address ||
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
    
        setAddressError(!address ? "Veuillez entrer votre Adresse" : "");
       
       
      
        setTypeChauffeurError(
          !typeChauffeur ? "Veuillez sélectionner votre Type de Chauffeur" : ""
        );

        setPhoneCodeError(!phoneCode ? "Requis" : "");

        return;
      }

   /* const chauffeurExists = await checkChauffeur();

      if (!chauffeurExists) {
        return;
      }*/

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
  const [isChecked, setIsChecked] = useState(false);
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const [chauffId, setChauffId] = useState();
  const [immatriculation, setImmatriculation] = useState();
  const [modelle, setModelle] = useState();

 

  const [immatriculationError, setImmatriculationError] = useState("");
  const [modelleError, setModelleError] = useState("");
 
 

  const [submitStatus, setSubmitStatus] = useState("");
  const [Nom, setNom] = useState();
  const [Prenom, setPrenom] = useState();
  const [email, setemail] = useState();
  const [phone, setphone] = useState();
  const [photoAvatar, setphotoAvatar] = useState({ file: [] });
  const [photoVtc, setphotoVtc] = useState({ file: [] });
  const [photoCin, setphotoCin] = useState({ file: [] });
  const [civilite, setCivilite] = useState();
  const [typeChauffeur, setTypeChauffeur] = useState();
  const [cnicNo, setcnicNo] = useState();
  const [address, setaddress] = useState();
  const [emailError, setEmailError] = useState("");
  const [cinError, setCinError] = useState("");
  const [nomError, setNomError] = useState("");
  const [prenError, setPrenError] = useState("");
  const [typeChauffeurError, setTypeChauffeurError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [civiliteError, setCiviliteError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneCodeError, setPhoneCodeError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setloadingSubmit] = useState(false);
  const router = useRouter();


  const [progress, setProgress] = useState(0);

  useEffect(() => {
  

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



  useEffect(() => {
    console.log("Updated chauffId:", chauffId);
  }, [chauffId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
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

    if (!isChecked) {
      e.preventDefault();
      alert("Vous devez accepter les conditions générales pour continuer.");
      return;
    }

    // Assemble chauffeur details
    const fullPhoneNumber = `${phoneCode}${phone}`;
    setLoading(true);

    try {

       
      let hasError = false;

      if (!immatriculation) {
        setImmatriculationError("L'immatriculation est requise.");
        hasError = true;
      }
      if (!modelle) {
        setModelleError("Le modèle est requis.");
        hasError = true;
      }
     
     
       
      

      if (hasError) return;




      // Envoi des détails du chauffeur
      const chauffeurResponse = await axiosClient.post(
        "/Chauff/AjoutChauf",
        {
          Nom,
          Prenom,
          email,
          fullPhoneNumber,
          photoAvatar,
          photoCin,
          photoVtc,
          civilite,
          cnicNo,
          address,
          typeChauffeur,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );


      setNom("");
      setPrenom("");
      setemail("");
      setphone("");
      document.getElementById("login").reset();
      setCivilite("");
      setcnicNo("");
      setaddress("");
      setEmailError("");
      setPhoneError("");
      setCinError("");
      setPhoneCodeError("");

      const userData = chauffeurResponse.data;
      setChauffId(userData);
      // Réinitialisation des champs chauffeur

      console.log("Chauffeur ajouté avec succès", chauffId);

      // Validation des champs voiture
      setImmatriculationError("");
      setModelleError("");
      
      


      setloadingSubmit(true); // Start loading

      setChauffId(userData);


      // Envoi des détails de la voiture
      const response = await axiosClient.post(
        `/Voi/addvoiture/${userData}`,
        {
          
          
          immatriculation,
          modelle,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Voiture ajoutée avec succès", response.data);

      setSubmitStatus(
        "Merci Pour Votre inscription votre dossier sera traité dans les prochains jours"
      );
      setImmatriculation("");
      setModelle("");



      setActiveStep((prevActiveStep) => prevActiveStep + 1);

    } catch (err) {
      console.warn("Erreur :", err);

      // Gestion des erreurs spécifiques
      if (err.response) {
        if (err.response.status === 403) {
          setEmailError("L'email existe déjà.");
          toast.error("L'email existe déjà.");
        }
        if (err.response.data.phoneExists) {
          setPhoneError("Le numéro de téléphone existe déjà.");
          toast.error("Le numéro de téléphone existe déjà.");
        }
        if (err.response.data.cinExists) {
          setCinError("Le CIN existe déjà.");
          toast.error("Le CIN existe déjà.");
        }
      } else {
        toast.error("Merci de vérifier vos données.");
      }
    } finally {
      setLoading(false);
      setloadingSubmit(false); // Stop loading for both processes
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

                  

                  

                    {/* Other attachment fields */}
                  </div>
                )}
                {activeStep === 2 && (
                  <div>
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
                    
                   

                    <div className="col-span-1 row-span-1 p-4 px-8 border">
                      <div className="flex items-start">
                        <input
                          type="radio"
                          id="termsRadio"
                          name="termsRadioGroup"
                          className="mr-3 mt-1 h-5 w-5 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                          checked={isChecked}
                          onChange={(e) => setIsChecked(e.target.checked)}
                          required
                          aria-label="J'accepte les conditions générales"
                        />
                        <label htmlFor="termsRadio" className="text-gray-900 leading-6">
                          J'accepte les{" "}
                          <a
                            href="https://firebasestorage.googleapis.com/v0/b/prd-transport.appspot.com/o/Condition%20G%C3%A9n%C3%A9rale.pdf?alt=media&token=53dd298c-e1e1-4964-86af-935f37e9e2f7"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            conditions générales
                          </a>
                        </label>
                      </div>
                    </div>



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
                    {activeStep === steps.length - 2 ? (
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
                    ) : activeStep === steps.length - 1 ? (
                      <Button
                        id="sub_btn"
                        type="submit"
                        value="login"
                        variant="contained"
                        color="primary"
                        onClick={(e) => {
                          handleCarDetailsSubmit(e);
                        }}
                        disabled={loading}
                      >
                        {loading ? `${progress}%` : "Rejoignez Nous"}
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        disabled={loading}
                      >
                        {loading ? `${progress}%` : "Suivant"}
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
