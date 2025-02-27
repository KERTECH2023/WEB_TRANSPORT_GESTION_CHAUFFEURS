const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');
require("dotenv").config();

const FTP_HOST = process.env.FTP_HOST;
const FTP_USER = process.env.FTP_USER;
const FTP_PASSWORD = process.env.FTP_PASSWORD;

const BASE_URL = 'https://backend.tunisieuber.com/afficheimage/image';  

const uploadFileWithRetry = async (file, filePath, retries = 3) => {
  const client = new ftp.Client();
  client.ftp.verbose = process.env.NODE_ENV !== 'production';

  // Créer un fichier temporaire pour l'upload
  const tempDir = path.join(__dirname, 'tmp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Extraire juste le nom du fichier sans le chemin du dossier pour le fichier temporaire
  const fileName = path.basename(filePath);
  const tempFilePath = path.join(tempDir, fileName);
  fs.writeFileSync(tempFilePath, file.buffer);

  let attempt = 0;
  let lastError = null;

  while (attempt < retries) {
    try {
      // Connexion au serveur FTP
      await client.access({
        host: FTP_HOST,
        user: FTP_USER,
        password: FTP_PASSWORD,
        secure: false,
      });

      // Extraire le répertoire à partir du chemin du fichier
      const remoteDir = path.dirname(filePath);
      
      // Créer le répertoire distant s'il n'existe pas
      if (remoteDir && remoteDir !== '.') {
        console.log(`🚀 Création/vérification du répertoire distant: ${remoteDir}`);
        try {
          await client.ensureDir(remoteDir);
        } catch (err) {
          console.error(`❌ Erreur lors de la création du répertoire ${remoteDir}: ${err.message}`);
          // Tentative alternative de création du répertoire
          try {
            await client.send(`MKD ${remoteDir}`);
            console.log(`✅ Répertoire ${remoteDir} créé via commande MKD`);
          } catch (mkdErr) {
            // Si le répertoire existe déjà, on continue
            console.warn(`⚠️ Erreur MKD (peut-être que le répertoire existe déjà): ${mkdErr.message}`);
          }
        }
      }

      // Upload du fichier
      console.log(`🚀 Téléchargement du fichier vers: ${filePath}`);
      await client.uploadFrom(tempFilePath, filePath);
      
      // Définir les permissions pour un accès public (644 = rw-r--r--)
      try {
        await client.send(`SITE CHMOD 644 ${filePath}`);
        console.log(`✅ Permissions du fichier ${filePath} définies comme publiques`);
      } catch (chmodErr) {
        console.warn(`⚠️ Impossible de définir les permissions: ${chmodErr.message}`);
        // Continuer même si CHMOD échoue
      }
      
      console.log(`✅ Fichier ${filePath} téléchargé avec succès et accessible publiquement`);

      // Construire l'URL selon le format original
      const fileUrl = `${BASE_URL}/${filePath}`;

      // Nettoyage
      fs.unlinkSync(tempFilePath);
      client.close();
      return fileUrl;
    } catch (error) {
      lastError = error;
      attempt++;
      console.error(`❌ Tentative ${attempt}/${retries} échouée: ${error.message}`);

      // Attendre avant de réessayer
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    } finally {
      try {
        client.close();
      } catch (err) {
        console.warn("Erreur lors de la fermeture du client FTP", err.message);
      }
    }
  }

  // Échec après tous les essais
  if (fs.existsSync(tempFilePath)) {
    fs.unlinkSync(tempFilePath);
  }

  throw lastError || new Error("Échec de l'upload après plusieurs tentatives");
};


const UploadImage = (req, res, next) => {
  // Vérifier la présence des fichiers et des données utilisateur
  if (!req.files || Object.keys(req.files).length === 0) {
    console.log("❌ Aucun fichier n'a été fourni");
    return next();
  }
  
  if (!req.body.Nom || !req.body.fullPhoneNumber) {
    console.log(`❌ Données utilisateur manquantes: Nom=${req.body.Nom}, Tel=${req.body.fullPhoneNumber}`);
    return next();
  }

  // Créer un nom de répertoire pour l'utilisateur
  const userDir = `${req.body.Nom}_${req.body.fullPhoneNumber}`;
  const files = req.files;
  const uploadedFiles = {};

  // Préparer les promesses d'upload pour chaque fichier
  const uploadPromises = Object.keys(files).map((fieldName) => {
    const file = files[fieldName][0];
    // Obtenir l'extension du fichier original
    const extension = file.originalname.split(".").pop();
    // Construire le chemin distant avec le dossier utilisateur
    const remotePath = `${userDir}/${fieldName}.${extension}`;

    console.log(`📂 Préparation de l'upload: ${fieldName} -> ${remotePath}`);
    
    return uploadFileWithRetry(file, remotePath)
      .then((fileUrl) => {
        uploadedFiles[fieldName] = fileUrl;
        console.log(`✅ URL générée pour ${fieldName}: ${fileUrl}`);
      })
      .catch(err => {
        console.error(`❌ Erreur lors de l'upload de ${fieldName}: ${err.message}`);
        throw err; // Propager l'erreur pour être attrapée par Promise.all
      });
  });

  // Exécuter tous les uploads en parallèle
  Promise.all(uploadPromises)
    .then(() => {
      console.log(`✅ Tous les fichiers ont été uploadés avec succès dans ${userDir}`);
      req.uploadedFiles = uploadedFiles;
      res.locals.uploadedFiles = uploadedFiles;
      next();
    })
    .catch((error) => {
      console.error("⛔ Échec de l'upload des fichiers:", error);
      res.status(500).send({ error: "L'upload des fichiers a échoué" });
    });
};

module.exports = UploadImage;
