/* eslint-disable @next/next/no-img-element */

import Image from 'next/image';
import Link from 'next/link';
import { AlternateEmail as AlternateEmailIcon } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import ContactPageIcon from '@mui/icons-material/ContactPage';


const TaxiUser = () => {

    const [photo, setPhoto] = useState(null);
  const [Nom, setNom] = useState(null);
  const [Prenom, setPrenom] = useState(null);
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState(null);
  const [address, setAddress] = useState(null);
  const [id, setId] = useState(null);
  const [user , setUser] = useState()

  // console.log("qsddq",id)
  useEffect(() => {
    const localStorageAvailable = typeof window !== 'undefined' && window.localStorage;
    if (localStorageAvailable) {
      setPhoto(localStorage.getItem("userAvatar"));
      setNom(localStorage.getItem("userNom"));
      setPrenom(localStorage.getItem("userPrenom"));
      setRole(localStorage.getItem("userRole"));
      setEmail(localStorage.getItem("userEmail"));
      setAddress(localStorage.getItem("userAdress"));
      setId(localStorage.getItem("userId"));
    }
  }, []);

  useEffect(() => {
    // Check if id is not null before calling getSingleUser
    if (id !== null) {
      getSingleUser(id);
    }
  }, [id]);

  const getSingleUser = async (id)  => {
      const response = await axios.get(`http://localhost:3005/Chauff/searchchauf/${id}`);
      if(response.status===200){
        setUser({ ...response.data })
     console.log("data" , response.data)
      }
    }


  return (
   <div>
    <div className="h-screen bg-gray-200 pt-20">


<div>
    <div className="max-w-sm mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
        <div className="border-b px-4 pb-6">
            <div className="text-center my-4">
            
  <img
    className="h-32 w-32 rounded-full border-4 border-white mx-auto my-4"
    src={user && user.photoAvatar}
    
    alt=""
    width={100}
    height={100}
  />

                <div className="py-2">
                    <h3 className="font-bold text-2xl mb-1">{user && user.Nom} {user && user.Prenom}</h3>
                    <div className="inline-flex text-gray-700 items-center">
                        <svg className="h-5 w-5 text-gray-400 mr-1" fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                            <path className=""
                                d="M5.64 16.36a9 9 0 1 1 12.72 0l-5.65 5.66a1 1 0 0 1-1.42 0l-5.65-5.66zm11.31-1.41a7 7 0 1 0-9.9 0L12 19.9l4.95-4.95zM12 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                        </svg>
                        {user && user.address}
                    </div>

                    <div className="text-gray-700 items-center">
                    <AlternateEmailIcon className="h-5 w-5 text-gray-400 mr-1" fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" /> {user && user.email}
                    </div>

                    <div className="text-gray-700 items-center">
                    <ContactPageIcon className="h-5 w-5 text-gray-400 mr-1" fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" /> {user && user.role}
                    </div>
                </div>
                
                
            </div>
            <div className="flex gap-2 px-2">
              
            <Link href="Editpro">
            <button className="flex-1 rounded-full bg-blue-600 text-white antialiased font-bold hover:bg-blue-800 px-4 py-2"style={{ marginLeft: '110px' }}>Edit Profile</button>
    </Link>                
            </div>
            
   
        </div>
      
    </div>
</div>


</div>
   </div>
  );
};

export default TaxiUser;
