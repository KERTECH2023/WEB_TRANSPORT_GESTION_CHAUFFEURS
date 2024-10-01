import React, { useState } from "react";
import { axiosClient } from "../config/axios";

const Contact = () => {
  const [submitStatus, setSubmitStatus] = useState("");
  const [Nom, setNom] = useState();
  const [Prenom, setPrenom] = useState();
  const [Email, setEmail] = useState();
  const [Tel, setTel] = useState();
  const [phoneError, setPhoneError] = useState("");

  const [Message, setMessage] = useState();

  const [values, setValues] = useState("");

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    if (inputValue.length <= 3000) {
      setValues(inputValue);
    }
  };

  const handleSubmite = (e) => {
    // Prevent the default submit and page reload
    e.preventDefault();

    const phoneRegex = /^[0-9]{8,14}$/;
    if (!phoneRegex.test(Tel)) {
      setPhoneError("La longueur doit être entre 8 et 14");
    } else {
      setPhoneError("");
    }
    // Handle validations
    axiosClient
      .post("/Con/add", { Nom, Prenom, Email, Tel, Message })
      .then((response) => {
        console.log(response);
        setNom("");
        setPrenom("");
        setEmail("");
        setTel("");
        setMessage("");
        setSubmitStatus("Votre Message a été envoyé");

        setTimeout(() => {
          setSubmitStatus("");
        }, 3000);
        // Handle response
      })

      .catch((err) => {
        console.warn(err);
        if (err.response) {
          if (err.response.data.phoneExists) {
            setPhoneError("Phone already exists");
          } else {
            setPhoneError("");
          }
        }
      });
  };

  return (
    <div>
      {/* Content */}
      <div>
        <form action="" id="login" method="post" onSubmit={handleSubmite}>
          <div className="flex flex-col items-center justify-center  space-y-4 py-24">
            <p className="text-3xl text-center font-light text-gray-600">
              Besoin D`aide ? <br />
              Veuillez remplir le formulaire ci-dessous avec des questions ou
              des commentaires
            </p>
            {submitStatus && (
              <div className="flex justify-center items-center mt-4">
                <p className="text-green-500 bg-white border border-green-500 rounded-lg py-2 px-4">
                  {submitStatus}
                </p>
              </div>
            )}

            <div className=" container mx-auto px-16 lg:grid  lg:grid-cols-2 lg:grid-rows-3   w-full">
              <div className="col-span-1 row-span-1  p-4 px-8 border">
                <label className="block mb-2  text-gray-900 ">Nom</label>
                <input
                  type="Text"
                  id="nom"
                  className="text-gray-900  block w-full p-2.5 "
                  placeholder="NOM"
                  onChange={(e) => setNom(e.target.value)}
                  value={Nom || ""}
                  required
                />
              </div>
              <div className="col-span-1 row-span-3 p-4  border">
                <label className="block mb-2  text-gray-900 ">
                  Votre Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  style={{ width: "100%", height: "230px", resize: "none" }}
                  className="block p-2.5 w-full  text-gray-900  "
                  placeholder="Laissez un commentaire..."
                  value={Message || ""}
                  maxLength={3000}
                  onInput={handleInputChange}
                  required
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>
              <div className="col-span-1 row-span-1  p-4 px-8 border">
                <label className="block mb-2  text-gray-900 ">Prenom</label>
                <input
                  type="text"
                  id="prenom"
                  className="text-gray-900  block w-full p-2.5 "
                  placeholder="Prenom"
                  onChange={(e) => setPrenom(e.target.value)}
                  value={Prenom || ""}
                  required
                />
              </div>
              <div className="col-span-1 row-span-1 p-4 px-8 border">
                <label className="block mb-2  text-gray-900 ">Email</label>
                <input
                  type="email"
                  id="email"
                  className="  text-gray-900  block w-full p-2.5 "
                  placeholder="exemple@domaine.com"
                  onChange={(e) => setEmail(e.target.value)}
                  value={Email || ""}
                  required
                />
              </div>

              <div className="col-span-1 row-span-1 p-4 px-8 border">
                <label className="block mb-2  text-gray-900 ">
                  N° Téléphone
                </label>
                <input
                  type="text"
                  id="tel"
                  className="  text-gray-900  block w-full p-2.5 "
                  placeholder="012345678"
                  onChange={(e) => setTel(e.target.value)}
                  value={Tel || ""}
                  required
                />
              </div>
            </div>
            <button
              id="sub_btn"
              type="submit"
              value="login"
              className=" text-white  bg-amber-600 hover:bg-amber-800   rounded-3xl  px-8 py-3 text-center mr-2 mb-2 "
            >
              CONTACTEZ-NOUS
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Contact;
