
const ftp = require("basic-ftp");

var express = require('express');
var router = express.Router();
require("dotenv").config();


// Configuration du serveur FTP
const ftpConfig = {
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
    secure: false,
};

// Route pour récupérer et afficher une image
router.get("/image/:filename", async (req, res) => {
    const client = new ftp.Client();
    client.ftp.verbose = true; // Active les logs FTP pour debug (optionnel)
    
    try {
        await client.access(ftpConfig);
        res.setHeader("Content-Type", "image/jpeg"); // Adapte selon le format de l'image
        
        // Stream directement depuis le serveur FTP vers la réponse HTTP
        const stream = await client.downloadTo(res, req.params.filename);
        
        // Fermer la connexion après l'envoi
        stream.once("end", () => {
            client.close();
        });

    } catch (error) {
        console.error("Erreur lors du chargement de l'image :", error);
        res.status(500).send("Impossible d'afficher l'image.");
        client.close();
    }
});
module.exports = router;


