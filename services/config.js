// config.js

// config.js
const { initializeApp } = require('firebase/app') ;

const admin = require("firebase-admin");


const firestoreServiceAccount = require("../firebase.json"); // Assuming this is your storage key
const storageServiceAccount  = require("../firebase-key.json");
// Add a new JSON key for Firestore

const { getAuth } = require("firebase-admin/auth");

const STORAGE_BUCKET = "imagestor-768b5.appspot.com";

// Initialize the Firebase instance for storage
const storageApp = admin.initializeApp({
  credential: admin.credential.cert(storageServiceAccount),
  storageBucket: STORAGE_BUCKET,
}, 'storageApp');

// Initialize the Firebase instance for Firestore
const firestoreApp = admin.initializeApp({
  credential: admin.credential.cert(firestoreServiceAccount),
  // Add other Firestore configurations here
  databaseURL: "https://transport-app-36443-default-rtdb.firebaseio.com/"
  
}, 'firestoreApp');

admin.initializeApp({  credential: admin.credential.cert(firestoreServiceAccount),
})
const db = admin.firestore;

module.exports = {
  admin,
  STORAGE_BUCKET,
  storageApp, // Export the storage instance
  firestoreApp, // Export the Firestore instance
db
};
