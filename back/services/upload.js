const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');
require("dotenv").config();

// Configuration FTP
const FTP_HOST = process.env.FTP_HOST;
const FTP_USER = process.env.FTP_USER;
const FTP_PASSWORD = process.env.FTP_PASSWORD;
const FTP_DIR =  'upload';
const BASE_URL =  'http://77.37.124.206:3000/images/ftpuser';

/**
 * Fonction pour télécharger un fichier avec réessais automatiques
 */
const uploadFileWithRetry = async (file, fileName, retries = 3) => {
  const client = new ftp.Client();
  client.ftp.verbose = process.env.NODE_ENV !== 'production';

  // Créer un fichier temporaire pour l'upload
  const tempDir = path.join(__dirname, 'tmp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

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

      // Vérifier si le répertoire existe
      let directoryExists = true;
      try {
        await client.cd(FTP_DIR);
      } catch (err) {
        directoryExists = false;
      }

      if (!directoryExists) {
        console.log(`⚠️ Le répertoire ${FTP_DIR} n'existe pas. Assurez-vous qu'il est créé manuellement.`);
        throw new Error(`Répertoire ${FTP_DIR} introuvable`);
      }

      // Upload du fichier
      console.log(`🚀 Téléchargement du fichier: ${fileName}`);
      await client.uploadFrom(tempFilePath, fileName);
      console.log(`✅ Fichier ${fileName} téléchargé avec succès`);

      // Construire l'URL selon le format demandé
      const fileUrl = `${BASE_URL}/${FTP_DIR}/${fileName}`;

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
      client.close();
    }
  }

  // Échec après tous les essais
  if (fs.existsSync(tempFilePath)) {
    fs.unlinkSync(tempFilePath);
  }

  throw lastError || new Error("Échec de l'upload après plusieurs tentatives");
};

/**
 * Middleware pour gérer l'upload d'images vers un serveur FTP
 */
const UploadImage = (req, res, next) => {
  if (!req.files) return next();

  const files = req.files;
  const uploadedFiles = {};

  const uploadPromises = Object.keys(files).map((fieldName) => {
    const file = files[fieldName][0];
    const fileName = Date.now() + "." + file.originalname.split(".").pop();

    return uploadFileWithRetry(file, fileName).then((fileUrl) => {
      uploadedFiles[fieldName] = fileUrl;
    });
  });

  Promise.all(uploadPromises)
    .then(() => {
      req.uploadedFiles = uploadedFiles;
      next();
    })
    .catch((error) => {
      console.error("⛔ Échec de l'upload des fichiers:", error);
      res.status(500).send({ error: "L'upload des fichiers a échoué" });
    });
};

module.exports = UploadImage;
