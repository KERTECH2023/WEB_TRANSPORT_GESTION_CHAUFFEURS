// controllers/transferController.js

const Transfer = require('../Models/Transfert');

exports.createTransfer = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, airport, destination, passengers, price } = req.body;
    
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
    res.status(500).json({ message: 'Error creating transfer', error: error.message });
  }
};
