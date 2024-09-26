/* eslint-disable @next/next/no-img-element */
import React from 'react'

import axios from "axios";
import { useState , useEffect } from "react";
import { useParams } from "react-router-dom"
import { useRouter } from "next/router";

const Editpro = () => {


    const [photoAvatar, setphotoAvatar] = useState({file :[]})
    const [form, setform] = useState({})
    const [forme, setForme] = useState({ oldPassword: '', newPassword: '' });

    const [id, setId] = useState(null);
    const router = useRouter();
 
    const [phoneError, setPhoneError] = useState("");
const [cinError, setCinError] = useState("");
const [emailError, setEmailError] = useState("");
const [passError, setPassError] = useState("");




    useEffect(() => {
      const localStorageAvailable = typeof window !== 'undefined' && window.localStorage;
      if (localStorageAvailable) {
        setId(localStorage.getItem("userId"));
      }
    }, []);
    // console.log("idddd", id);


   
    useEffect(() => {
      // Check if id is not null before calling getSingleUser
      if (id !== null) {
        getSingleUser(id);
      }
    }, [id]);

    const getSingleUser = async (id)  => {
        const response = await axios.get(`http://localhost:3005/Chauff/searchchauf/${id}`);
        if(response.status===200){
       setform({ ...response.data })
      //  console.log("data" , response.data)
        }
      }

      const onChangeHandler = (e)=>{
        setform({
            ...form,
            [e.target.name] : e.target.value,
            //photoAvatar : e.Target.files[0],
        })
      
      }
      


      const handleSubmit = e => {
        // Prevent the default submit and page reload
        e.preventDefault()
      
      const data = new FormData();
      data.append('photoAvatar',e.target.photoAvatar.files[0]);
      // console.log("fileeeeee",photoAvatar)
      for (const key in form) {
        data.append(key, form[key]);
      }
  
   
    
     
      const phoneRegex = /^\+?[0-9]{8,14}$/;
      if (!phoneRegex.test(form.phone)) {
        setPhoneError("La longueur doit être entre 8 et 14");
        return;
      }

    const cinRegex = /^[0-9]{8,12}$/;
    if (!cinRegex.test(form.cnicNo)) {
      setCinError("La longueur doit être entre 8 et 12");
      return;
    }
      
    
        // Handle validations
        axios
          .put(`http://localhost:3005/Chauff/updatechauf/${id}`,data
          ,{ headers: {
            'Content-Type': 'multipart/form-data',
          },})
         
          .then(response => {
         
        
          // console.log("file",data)
            //navigate("/users")
            router.push("/profile");
            // console.log(response.Nom)
      
            
          
                        // Handle response
          })
         
      .catch(err =>{
        if (err.response) {
          if (err.response.status === 403) {
            setEmailError("l'email existe déjà");
          } else {
            setEmailError("");
          }
          if (err.response.data.phoneExists) {
            setPhoneError("Phone already exists");
          } else {
            setPhoneError("");
          }
          if (err.response.data.cinExists) {
            setCinError("CIN already exists");
          } else {
            setCinError("");
          }
        }
    
      })
      
        }



        const handleInputChange = e => {
          const { name, value } = e.target;
         
          setForme(prevForme => ({ ...prevForme, [name]: value }));
        };

     
        


        const handleSubmits = e => {
          e.preventDefault();
        
          const data = {
            oldPassword: forme.oldPassword,
            newPassword: forme.newPassword,
          };
        
          axios.put(`http://localhost:3005/Chauff/pass/${id}`, data)
            .then(response => {
              // Handle successful response
              // For example, navigate to a new page
              router.push("/profile");
            })
            .catch(err => {
              // Handle error responses
              if (err.response) {
                if (err.response.status === 401) {
                  setPassError("Ancien mot de passe est incorrect");
                } else {
                  setPassError("");
                }
              }
            });
        };
        

        



        const handleSubmite = () => {
          // Prevent the default submit and page reload
        
        
      
          // Handle validations
          axios
            .put(`http://localhost:3005/Chauff/updatestatus/${id}`
            ,{ headers: {
              'Content-Type': 'multipart/form-data',
            },})
           
            .then(response => {
           
              window.localStorage.clear();
              setIsLoggedIn(false);
              router.push("/Auth");
        
              //navigate("/users")
            
            
        
              
            
                          // Handle response
            })
           
        .catch(err =>{
          console.warn(err)
     
        })
        
          }
        



  return (
    
    <div className='hi'>
        <form action="" id="login" method="put" onSubmit={handleSubmit}>
       <div className="wrappere bg-white mt-sm-5">
    <h4 className="pb-4 border-bottom">Paramètres du compte</h4>
    <div className="d-flex align-items-start py-3 border-bottom">
        <img   src={form.photoAvatar || ""}
            className="img" alt="" />
        <div className="pl-sm-4 pl-2" id="img-section">
            <b>Photo Profile </b>
            <p>Accepter fichier type .png. Moins De 1MB</p>
        

  <input
    type="file"
    onChange={e => setphotoAvatar(e.target.files[0])}
    name="photoAvatar"
    className="ji"
    id="photoAvatar"
    
  />

        </div>
    </div>
    <div className="py-2">
        <div className="row py-2">
            <div className="col-md-6">
                <label htmlFor="firstname">Nom</label>
                <input type="text" 
                onChange={onChangeHandler}
                 className="bg-light form-control" 
                 placeholder="Steve" 
                 name="Nom"
                value={form.Nom || ""}
                 required />
            </div>
            <div className="col-md-6 pt-md-0 pt-3">
    <label htmlFor="lastname">Prenom</label>
    <input
        type="text"
        onChange={onChangeHandler}
        className="bg-light form-control"
        placeholder="Smith"
        name="Prenom"
        value={form.Prenom || ""}
        required
    />
</div>
        </div>
        <div className="row py-2">
            <div className="col-md-6">
                <label htmlFor="email">Email Address</label>
                <input type="text"
                 onChange={onChangeHandler} 
                 className="bg-light form-control" 
                 placeholder="steve_@email.com" 
                 value={ form.email || ""} 
                 name="email"
                 disabled
                 required />
                 {emailError && <label className="text-red-500">{emailError}</label>}

            </div>
            <div className="col-md-6 pt-md-0 pt-3">
            <label htmlFor="phone">N° Tél</label>
                <input type="tel" 
                name="phone"
                 onChange={onChangeHandler} 
                 className="bg-light form-control"
                  placeholder="+1 213-548-6015"
                   value={form.phone || "" } 
                   required />
                   {phoneError && <label className="text-red-500">{phoneError}</label>}

            </div>
            <div className="col-md-6 pt-md-0 pt-3">
            <label htmlFor="cnicNo">Cin</label>
                <input type="text"
                name="cnicNo"
                 onChange={onChangeHandler} 
                 className="bg-light form-control" 
                 placeholder="0745.."
                 value={form.cnicNo || "" } 
                 required />
                 {cinError && <label className="text-red-500">{cinError}</label>}

            </div>
            <div className="col-md-6 pt-md-0 pt-3">
            <label htmlFor="address">Adresse</label>
                <input type="tel" 
                name="adresse"
                onChange={onChangeHandler} 
                className="bg-light form-control" 
                placeholder="Tunisie ...." 
                value={form.address || ""}
                 required />

            </div>
            <div className="col-md-6 pt-md-0 pt-3">
            <label htmlFor="postalCode">Code Postal</label>
                <input type="tel"
                name="postalCode"
                 onChange={onChangeHandler} 
                 className="bg-light form-control" 
                 placeholder="65412"
                  value={form.postalCode || ""} 
                  required />

            </div>

       


        </div>
        
        <div className="py-3 pb-4 border-bottom">
            <button  type="submit" className="btn btn-primary mr-3">Sauvegarder les modifications</button>
            
        </div>

        



        <div className="d-sm-flex align-items-center pt-3" id="deactivate">
            <div>
                <b>Desavtiver Votre Compte</b>
               
            </div>
            <div className="ml-auto">
                <button className="btn danger" onClick={handleSubmite}>Désactiver</button>
            </div>
        </div>
        
    </div>
</div>


</form>

<form>
<div className="wrappere bg-white mt-sm-5">
<h3 className="pb-4 border-bottom">Modifier Mot De passe</h3>
    <div className="col-md-6 pt-md-0 pt-3">
      <label htmlFor="oldPassword">Ancien Mot de Passe</label>
      <input
        type="password" 
        className="bg-light form-control"
        placeholder="Ancien Mot de Passe"
        name="oldPassword"
        value={forme.oldPassword || ""}
        onChange={handleInputChange} 
      />
      <div>
      {passError && <label className="text-red-500">{passError}</label>}
      </div>
    </div>
    <div className="col-md-6 pt-md-0 pt-3">
      <label htmlFor="newPassword">Nouveau Mot de Passe</label>
      <input
        type="password" 
        className="bg-light form-control"
        placeholder="Nouveau Mot de Passe"
        name="newPassword"
        value={forme.newPassword || ""}
        onChange={handleInputChange} 
      />
      
    </div>
    <div className="py-3 pb-4 border-bottom">
      <button type="submit" className="btn btn-primary mr-3" onClick={handleSubmits}>
        Modifier Mot De Passe
      </button>
    </div>
  </div>
</form>

       

    </div>
  )
}

export default Editpro