const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');
require("dotenv").config();

// Configuration FTP
const FTP_HOST = process.env.FTP_HOST;
const FTP_USER = process.env.FTP_USER;
const FTP_PASSWORD = process.env.FTP_PASSWORD;
const BASE_URL = 'https://backend.tunisieuber.com/afficheimage/image/';

/**
 * Fonction pour télécharger un fichier avec réessais automatiques
 */
const uploadFileWithRetry = async (file, fileName, nom, phone, retries = 3) => {
  const client = new ftp.Client();
  client.ftp.verbose = process.env.NODE_ENV !== 'production';

  // Créer un fichier temporaire pour l'upload
  const tempDir = path.join(__dirname, 'tmp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const tempFilePath = path.join(tempDir, fileName);

  // Vérifier si `file.buffer` est disponible, sinon utiliser `file.path`
  if (file.buffer) {
    fs.writeFileSync(tempFilePath, file.buffer);
  } else if (file.path) {
    fs.copyFileSync(file.path, tempFilePath);
  } else {
    throw new Error("Le fichier ne contient pas de données valides.");
  }

  let attempt = 0;
  let lastError = null;

  while (attempt < retries) {
    try {
      await client.access({
        host: FTP_HOST,
        user: FTP_USER,
        password: FTP_PASSWORD,
        secure: false,
      });

      const remoteDir = `${nom}${phone}`;

      // Vérifier si le répertoire existe, sinon le créer
      try {
        await client.cd(remoteDir);
      } catch {
        console.log(`⚠️ Répertoire ${remoteDir} inexistant, création en cours...`);
        await client.ensureDir(remoteDir);
        console.log(`✅ Répertoire ${remoteDir} créé avec succès`);
      }

      // Upload du fichier
      console.log(`🚀 Téléchargement du fichier: ${fileName}`);
      await client.uploadFrom(tempFilePath, `${remoteDir}/${fileName}`);

      // Définir les permissions si supporté par le serveur
      try {
        await client.send(`SITE CHMOD 644 ${remoteDir}/${fileName}`);
        console.log(`✅ Permissions du fichier ${fileName} définies comme publiques`);
      } catch (chmodErr) {
        console.warn(`⚠️ Impossible de définir les permissions: ${chmodErr.message}`);
      }

      console.log(`✅ Fichier ${fileName} téléchargé avec succès et accessible publiquement`);

      // Construire l'URL proprement
      const fileUrl = `${BASE_URL}${remoteDir}/${fileName}`;

      // Nettoyage
      fs.unlinkSync(tempFilePath);
      client.close();
      return fileUrl;
    } catch (error) {
      lastError = error;
      attempt++;
      console.error(`❌ Tentative ${attempt}/${retries} échouée: ${error.message}`);

      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    } finally {
      client.close();
    }
  }

  // Échec final
  if (fs.existsSync(tempFilePath)) {
    fs.unlinkSync(tempFilePath);
  }

  throw lastError || new Error("Échec de l'upload après plusieurs tentatives");
};

/**
 * Middleware pour gérer l'upload d'images vers un serveur FTP
 */
const UploadImage = (req, res, next) => {
  if (!req.files || !req.body.nom || !req.body.phone) return next();

  const files = req.files;
  const uploadedFiles = {};

  const uploadPromises = Object.keys(files).map((fieldName) => {
    const file = files[fieldName][0];
    const fileName = Date.now() + "." + file.originalname.split(".").pop();

    return uploadFileWithRetry(file, fileName, req.body.nom, req.body.phone).then((fileUrl) => {
      uploadedFiles[fieldName] = fileUrl;
    });
  });

  Promise.all(uploadPromises)
    .then(() => {
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
