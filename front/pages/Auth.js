/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import axios from "axios";
import { useRouter } from "next/router";

const Auth = () => {
  const [submitStatus, setSubmitStatus] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [compteError, setCompteError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3005/Chauff/reset", { email })
      .then(() => {
        setSubmitStatus("Un email a été envoyé");
        setEmail("");
        setEmailError("");
        setTimeout(() => setSubmitStatus(""), 10000);
      })
      .catch((err) => {
        console.warn(err);
        if (err.response && err.response.status === 404) {
          setEmailError("L'email n'existe pas");
        }
      });
  };

  const handleSubmitLogin = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3005/Chauff/loginch", { email, password })
      .then((response) => {
        const user = response.data;
        if (user.Cstatus === "Désactivé") {
          setCompteError("Votre compte est désactivé");
          router.push("/Auth");
          return;
        }
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("userNom", user.Nom);
        localStorage.setItem("userPrenom", user.Prenom);
        localStorage.setItem("userAvatar", user.photoAvatar);
        localStorage.setItem("userAdress", user.address);
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("Cstatus", user.Cstatus);
        setEmailError("");
        setPasswordError("");
        setCompteError("");
        router.push("/profile");
      })
      .catch((err) => {
        console.warn(err);
        if (err.response) {
          if (err.response.status === 403) {
            setEmailError("L'email n'existe pas");
          }
          if (err.response.status === 406) {
            setPasswordError("Mot de passe incorrect");
          }
        }
      });
  };

  return (
    <div className="flex items-center -mt-14 justify-center min-h-screen bg-gray-100">
      <div className="relative w-full max-w-lg bg-white shadow-xl rounded-lg overflow-hidden border border-gray-300 transition-transform transform hover:scale-105 duration-300 ease-in-out">
        <div className="absolute inset-x-0 top-0 flex border-b border-gray-300">
          <div
            className={`cursor-pointer px-6 py-3 text-lg font-medium ${
              !isForgotPassword
                ? "bg-gold text-white"
                : "bg-gray-200 text-gray-bg-gold"
            } w-1/2 text-center transition duration-300`}
            onClick={() => setIsForgotPassword(false)}
          >
            Log In
          </div>
          <div
            className={`cursor-pointer px-6 py-3 text-lg font-medium ${
              isForgotPassword
                ? "bg-gold text-white"
                : "bg-gray-200 text-gray-bg-gold"
            } w-1/2 text-center transition duration-300`}
            onClick={() => setIsForgotPassword(true)}
          >
            MOT DE PASSE OUBLIÉ?
          </div>
        </div>
        <div className="p-8">
          {!isForgotPassword ? (
            <form onSubmit={handleSubmitLogin}>
              <h4 className="text-2xl mt-16 font-semibold mb-6 text-center text-gray-700">
                Log In
              </h4>
              {compteError && (
                <p className="text-red-600 mb-4 text-center">{compteError}</p>
              )}
              <div className="relative mb-6">
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gold transition duration-300 ease-in-out"
                  placeholder="Email"
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                />
                <EmailIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                {emailError && (
                  <p className="text-red-600 mt-1">{emailError}</p>
                )}
              </div>
              <div className="relative mb-6">
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gold transition duration-300 ease-in-out"
                  placeholder="Mot de passe"
                  autoComplete="off"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                />
                <LockIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                {passwordError && (
                  <p className="text-red-600 mt-1">{passwordError}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gray-700 text-white rounded-lg hover:bg-gold transition duration-300 ease-in-out shadow-xl"
              >
                Log In
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              {submitStatus && (
                <div className="mb-6  text-green-600 bg-white border border-green-600 rounded-lg py-2 px-4 text-center shadow-md">
                  {submitStatus}
                </div>
              )}
              <h4 className="text-2xl font-semibold mb-8 mt-16 text-center text-gray-700">
                MOT DE PASSE OUBLIÉ ?
              </h4>
              <div className="relative mb-6">
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gold transition duration-300 ease-in-out"
                  placeholder="Email"
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                />
                <EmailIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                {emailError && (
                  <p className="text-red-600 mt-1">{emailError}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full text py-3 bg-gray-700 text-white rounded-lg hover:bg-gold transition duration-300 ease-in-out shadow-xl"
              >
                Envoyer
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
