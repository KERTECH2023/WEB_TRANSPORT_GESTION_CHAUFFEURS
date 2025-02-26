const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');
require("dotenv").config();

// Configuration FTP
const FTP_HOST = process.env.FTP_HOST;
const FTP_USER = process.env.FTP_USER;
const FTP_PASSWORD = process.env.FTP_PASSWORD;
const FTP_DIR = 'upload';
const BASE_URL = 'http://77.37.124.206:3000/images/ftpuser';
const FTP_DIR = 'upload';  // Conservé comme dans le code original
const BASE_URL = 'http://77.37.124.206:3000/images/ftpuser';  // Conservé comme dans le code original

/**
 * Fonction pour télécharger un fichier avec réessais automatiques


  while (attempt < retries) {
    try {
      // Connexion FTP
      // Connexion au serveur FTP
      await client.access({
        host: FTP_HOST,
        user: FTP_USER,

      });

      // Vérifier si le répertoire existe
      let directoryExists = true;
      try {
        await client.cd(FTP_DIR);
      } catch (err) {
        await client.send(`MKD ${FTP_DIR}`);
        await client.cd(FTP_DIR);
        directoryExists = false;
      }

      if (!directoryExists) {
        console.log(`⚠️ Le répertoire ${FTP_DIR} n'existe pas. Tentative de création...`);
        try {
          await client.ensureDir(FTP_DIR);
          console.log(`✅ Répertoire ${FTP_DIR} créé avec succès`);
        } catch (createErr) {
          console.error(`❌ Impossible de créer le répertoire ${FTP_DIR}: ${createErr.message}`);
          throw new Error(`Impossible de créer le répertoire ${FTP_DIR}`);
        }
      }

      // Upload du fichier
      console.log(`🚀 Téléchargement du fichier: ${fileName}`);
      await client.uploadFrom(tempFilePath, fileName);
      
      // Définir les permissions pour un accès public (644 = rw-r--r--)
      try {
        await client.send(`SITE CHMOD 644 ${fileName}`);
        console.log(`✅ Permissions du fichier ${fileName} définies comme publiques`);
      } catch (chmodErr) {
        console.warn(`⚠️ Impossible de définir les permissions: ${chmodErr.message}`);
        // Continuer même si CHMOD échoue
      }
      
      console.log(`✅ Fichier ${fileName} téléchargé avec succès et accessible publiquement`);

      // Modifier les permissions pour rendre le fichier public
      await client.send(`SITE CHMOD 644 ${FTP_DIR}/${fileName}`);

      console.log(`✅ Fichier ${fileName} téléchargé avec succès`);

      // Construire l'URL publique
      // Construire l'URL selon le format original
      const fileUrl = `${BASE_URL}/${FTP_DIR}/${fileName}`;

      // Nettoyage


/**
 * Middleware pour gérer l'upload d'images vers un serveur FTP
 * Garde le même nom que dans le code original
 */
const UploadImage = (req, res, next) => {
  if (!req.files) return next();

  Promise.all(uploadPromises)
    .then(() => {
      req.uploadedFiles = uploadedFiles;
      
      // Ajouter les informations des fichiers à la réponse également
      // pour faciliter l'accès direct
      res.locals.uploadedFiles = uploadedFiles;
      
      next();
    })
    .catch((error) => {
      console.error("⛔ Échec de l'upload des fichiers:", error);
      res.status(500).send({ error: "L'upload des fichiers a échoué" });
    });
};

module.exports = UploadImage;
