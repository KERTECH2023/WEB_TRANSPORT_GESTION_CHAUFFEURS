// controllers/transferController.js

const Transfer = require('../Models/Transfert'); // Assurez-vous que le chemin est correct

exports.createTransfer = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, airport, destination, passengers, price } = req.body;

    // Validation simple des données
    if (!firstName || !lastName || !email || !phone || !airport || !destination || !passengers || !price) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newTransfer = new Transfer({
      firstName,
      lastName,
      email,
      phone,
      airport,
      destination,
      passengers,
      price
    });

    await newTransfer.save();
    res.status(201).json({ message: 'Transfer created successfully', transfer: newTransfer });
  } catch (error) {
    console.error(error);
    
    // Gestion des erreurs Mongoose (par exemple, erreur de validation)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }

    res.status(500).json({ message: 'Error creating transfer', error: error.message });
  }
};
