/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/google-font-display */
/* eslint-disable @next/next/no-page-custom-font */
import React, { useState, useEffect } from "react";
import { axiosClient } from "../config/axios";

const histo = () => {
  const [user, setUser] = useState();
  const [id, setId] = useState(null);
  console.log("idddd", id);

  useEffect(() => {
    const localStorageAvailable =
      typeof window !== "undefined" && window.localStorage;
    if (localStorageAvailable) {
      setId(localStorage.getItem("userId"));
    }
  }, []);

  useEffect(() => {
    // Check if id is not null before calling getSingleUser
    if (id !== null) {
      getSingleUser(id);
    }
  }, [id]);

  const getSingleUser = async (id) => {
    try {
      const response = await axiosClient.get(`/hist/history/${id}`);
      if (response.status === 200) {
        setUser(response.data);
        console.log("API response data:", response.data);
      } else {
        console.error("Error fetching single user. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching single user:", error);
    }
  };

  console.log("user", user);

  return (
    <div>
      <link
        href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp"
        rel="stylesheet"
      />
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="col-span-12">
          <div className="overflow-auto lg:overflow-visible ">
            <table
              className="table text-gray-400 border-separate space-y-6 text-sm"
              style={{ width: "1000px", height: "300px" }}
            >
              <thead className="bg-gray-800 text-gray-500">
                <tr>
                  <th className="p-3">Nom du Voyageur </th>
                  <th className="p-3 text-left">Source Localisation</th>
                  <th className="p-3 text-left">Destination</th>
                  <th className="p-3 text-left">Kilométrage</th>
                  <th className="p-3 text-left">Trager</th>
                  <th className="p-3 text-left">Status </th>
                  <th className="p-3 text-left">Tarift </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(user) && user.length > 0 ? (
                  user.map((item) => (
                    <tr className="bg-gray-800" key={item._id}>
                      <td className="p-3">
                        <div className="flex align-items-center">
                          <div className="ml-3">
                            <div className="">{item.clientName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">{item.source}</td>
                      <td className="p-3 font-bold">{item.desti}</td>
                      <td className="p-3 font-bold">{item.kilo} km</td>
                      <td className="p-3 font-bold">{item.trage} min</td>
                      <td className="p-3">
                        <span
                          className={`${
                            item.status === "Accepter"
                              ? "bg-green-400"
                              : item.status === "Refuser"
                              ? "bg-red-400"
                              : "bg-yellow-400"
                          } text-gray-50 rounded-md px-2`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3 font-bold">{item.Traift} dt</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-3 text-center">
                      {user === null ? "Loading data..." : "No data available"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default histo;
