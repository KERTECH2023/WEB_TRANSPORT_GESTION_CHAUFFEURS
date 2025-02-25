const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');
require("dotenv").config();

// Configuration FTP
const FTP_HOST = process.env.FTP_HOST;
const FTP_USER = process.env.FTP_USER;
const FTP_PASSWORD = process.env.FTP_PASSWORD;
const FTP_DIR = process.env.FTP_DIR || '/uploads';

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
        secure: false
      });
      
      // S'assurer que le répertoire existe
      try {
        await client.ensureDir(FTP_DIR);
      } catch (err) {
        console.log(`Création du répertoire: ${err.message}`);
        await client.makeDir(FTP_DIR);
      }
      
      // Upload du fichier
      await client.uploadFrom(tempFilePath, path.join(FTP_DIR, fileName));
      
      // Succès - nettoyer et retourner l'URL
      fs.unlinkSync(tempFilePath);
      client.close();
      return `${process.env.FTP_BASE_URL || 'ftp://'}${path.join(FTP_DIR, fileName)}`;
    } catch (error) {
      lastError = error;
      attempt++;
      console.log(`Tentative d'upload échouée (${attempt}/${retries}): ${error.message}`);
      
      // Attendre avant de réessayer
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    } finally {
      if (client.closed === false) {
        client.close();
      }
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
    
    return uploadFileWithRetry(file, fileName).then((ftpUrl) => {
      uploadedFiles[fieldName] = ftpUrl;
    });
  });

  Promise.all(uploadPromises)
    .then(() => {
      req.uploadedFiles = uploadedFiles;
      next();
    })
    .catch((error) => {
      console.error("Échec de l'upload des fichiers:", error);
      res.status(500).send({ error: "L'upload des fichiers a échoué" });
    });
};

module.exports = UploadImage;
