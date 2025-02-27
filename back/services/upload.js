const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');
require("dotenv").config();

const FTP_HOST = process.env.FTP_HOST;
const FTP_USER = process.env.FTP_USER;
const FTP_PASSWORD = process.env.FTP_PASSWORD;

const BASE_URL = 'https://backend.tunisieuber.com/afficheimage/image';  

const uploadFileWithRetry = async (file, fileName, userData, retries = 3) => {
  const client = new ftp.Client();
  client.ftp.verbose = process.env.NODE_ENV !== 'production';

  // Créer le répertoire temporaire
  const tempDir = path.join(__dirname, 'tmp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Vérifier que le fichier contient un buffer
  if (!file.buffer) {
    throw new Error("Le fichier ne contient pas de données (buffer manquant)");
  }

  // Utiliser simplement le dossier temporaire pour stocker le fichier - PAS de sous-dossier
  const tempFilePath = path.join(tempDir, fileName);
  
  try {
    // Écrire le fichier temporaire
    fs.writeFileSync(tempFilePath, file.buffer);
    console.log(`✅ Fichier temporaire créé: ${tempFilePath}`);
    
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

        // Créer un répertoire dynamique sur le serveur FTP basé sur le nom et le téléphone
        const remoteDir = `${userData.nom}_${userData.tel}`;
        console.log(`🚀 Création/vérification du répertoire distant: ${remoteDir}`);
        await client.ensureDir(remoteDir);

        // Upload du fichier dans le répertoire cible distant
        const remotePath = `${remoteDir}/${fileName}`;
        console.log(`🚀 Téléchargement du fichier: ${remotePath}`);
        await client.uploadFrom(tempFilePath, remotePath);

        try {
          await client.send(`SITE CHMOD 644 ${remotePath}`);
          console.log(`✅ Permissions du fichier ${remotePath} définies comme publiques`);
        } catch (chmodErr) {
          console.warn(`⚠️ Impossible de définir les permissions: ${chmodErr.message}`);
        }

        console.log(`✅ Fichier ${remotePath} téléchargé avec succès`);

        const fileUrl = `${BASE_URL}/${remotePath}`;
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
        try {
          client.close();
        } catch (err) {
          console.warn("Erreur lors de la fermeture du client FTP", err.message);
        }
      }
    }

    throw lastError || new Error("Échec de l'upload après plusieurs tentatives");
  } finally {
    // Nettoyer le fichier temporaire à la fin, qu'importe le résultat
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
      console.log(`🧹 Fichier temporaire supprimé: ${tempFilePath}`);
    }
  }
};


const UploadImage = (req, res, next) => {
  if (!req.files || !req.body.Nom || !req.body.fullPhoneNumber) {console.log("kjdkjsdkj"+req.body.Nom+req.body.fullPhoneNumber); return next();}

  const userDir = `${req.body.Nom}_${req.body.fullPhoneNumber}`;
  const files = req.files;
  const uploadedFiles = {};

  const uploadPromises = Object.keys(files).map((fieldName) => {
    const file = files[fieldName][0];
    const remotePath = `${userDir}/${fieldName}.${file.originalname.split(".").pop()}`;

    return uploadFileWithRetry(file, remotePath).then((fileUrl) => {
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
