// controllers/transferController.js

const Transfer = require('../Models/Transfert'); // Assurez-vous que le chemin est correct
const nodemailer = require("nodemailer");

exports.createTransfer = async (req, res) => {

  try {
    const { firstName, lastName, email, phone,bagageCabine,bagageSoute,bagageHorsFormat,datevol,heurvol,numvol, airport, destination, passengers, price } = req.body;

    // Validation simple des données
    if (!firstName || !lastName || !email || !phone||!bagageCabine||!bagageSoute||!bagageHorsFormat|| !datevol|| !heurvol|| !numvol || !airport || !destination || !passengers || !price) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newTransfer = new Transfer({
      firstName,
      lastName,
      email,
      phone,
      bagageCabine,
      bagageSoute,
      bagageHorsFormat,
      datevol,
      heurvol,
      numvol,
      airport,
      destination,
      passengers,
      price
    });

    await newTransfer.save();
      // Configuration de l'envoi d'email
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "noreplyflashdriver@gmail.com",
          pass: "uvfu llrf qsbw esok", // Remplace par un mot de passe d'application sécurisé
        },
      });
  
      const mailOptions = {
        from: "Flash Driver <noreplyflashdriver@gmail.com>",
        to: [email, "khaled.erjili@kertechnologie.fr"],
        subject: "Flash Driver - Réservation Enregitrée",
        html: `
          <!DOCTYPE html>
          <html lang="fr">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Réservation Enregitrée</title>
              <style>
                  body {
                      font-family: 'Poppins', Arial, sans-serif;
                      line-height: 1.6;
                      color: #5D541D;
                      max-width: 600px;
                      margin: 0 auto;
                  }
                  .container {
                      background-color: #FAD939;
                      border-radius: 20px;
                      padding: 20px;
                      text-align: center;
                  }
                  .content {
                      background-color: #FFFFFF;
                      border-radius: 10px;
                      padding: 30px;
                      margin-top: 20px;
                  }
                  .footer {
                      margin-top: 20px;
                      font-size: 12px;
                      color: #5D541D;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="content">
                      <h1>Votre réservation a été enregitrer</h1>
                      <p>Bonjour ${firstName} ${lastName},</p>
                      <p>Votre réservation a été enregitrer avec succès.</p>
                      <p><strong>Email :</strong> ${email}</p>
                      <p><strong>Num vol :</strong> ${numvol}</p>
                      <p><strong>Date :</strong> ${datevol}</p>
                      <p><strong>Heure :</strong> ${heurvol}</p>
                      <p><strong>Aéroport :</strong> ${airport}</p>
                      <p><strong>Destination :</strong> ${destination}</p>
                      <p><strong>Passagers :</strong> ${passengers}</p>
                      <p><strong>Prix :</strong> ${parseFloat(price).toFixed(2)} €</p>
                      <div class="footer">
                          <p>Cordialement,<br>L'équipe Flash Driver</p>
                          <p style="font-size: 10px; color: #888;">
                              Si vous n'avez pas réservé ce transfert, veuillez nous contacter.
                          </p>
                      </div>
                  </div>
              </div>
          </body>
          </html>
        `,
      };
  
      // Envoi de l'email
      await transporter.sendMail(mailOptions);
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
