const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');
require("dotenv").config();

// Configuration FTP
const FTP_HOST = process.env.FTP_HOST;
const FTP_USER = process.env.FTP_USER;
const FTP_PASSWORD = process.env.FTP_PASSWORD;
const FTP_BASE_DIR = 'upload'; // Dossier racine FTP
const BASE_URL = 'http://77.37.124.206:3000/images/ftpuser';

/**
 * Fonction pour télécharger un fichier avec création de dossier et réessais automatiques
 */
const uploadFileWithRetry = async (file, fileName, subDir, retries = 3) => {
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

      // Chemin complet de stockage (ex: "upload/NOM_UTILISATEUR")
      const fullFtpPath = `${FTP_BASE_DIR}/${subDir}`;

      // Vérifier si le répertoire existe et le créer si nécessaire
      try {
        await client.cd(fullFtpPath);
      } catch (err) {
        console.log(`📁 Création du dossier: ${fullFtpPath}`);
        await client.ensureDir(fullFtpPath);
      }

      // Upload du fichier
      console.log(`🚀 Téléchargement du fichier: ${fileName}`);
      await client.uploadFrom(tempFilePath, `${fullFtpPath}/${fileName}`);
      console.log(`✅ Fichier ${fileName} téléchargé avec succès`);

      // Construire l'URL finale
      const fileUrl = `${BASE_URL}/${fullFtpPath}/${fileName}`;

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
 * Middleware pour gérer l'upload d'images vers un serveur FTP avec sous-dossier dynamique
 */
const UploadImage = (req, res, next) => {
  if (!req.files || !req.nom) {
    return res.status(400).send({ error: "Fichiers ou nom manquant" });
  }

  const files = req.files;
  const uploadedFiles = {};
  const subDir = req.nom; // Dossier personnalisé basé sur req.nom

  const uploadPromises = Object.keys(files).map((fieldName) => {
    const file = files[fieldName][0];
    const fileName = Date.now() + "." + file.originalname.split(".").pop();

    return uploadFileWithRetry(file, fileName, subDir).then((fileUrl) => {
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
