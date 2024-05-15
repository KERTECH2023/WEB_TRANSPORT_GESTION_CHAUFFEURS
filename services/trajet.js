const firebaseModule = require("../services/config");
const realtimeDB = firebaseModule.firestoreApp.database();
const geolib = require('geolib');
const RideRequest = require('../Models/AllRideRequest'); // Import the RideRequest Mongoose model

