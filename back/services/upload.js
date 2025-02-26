const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');
require("dotenv").config();

const FTP_HOST = process.env.FTP_HOST;
const FTP_USER = process.env.FTP_USER;
const FTP_PASSWORD = process.env.FTP_PASSWORD;

const BASE_URL = 'https://backend.tunisieuber.com/afficheimage/image';  

const uploadFileWithRetry = async (file, fileName, retries = 3) => {
  const client = new ftp.Client();
  client.ftp.verbose = process.env.NODE_ENV !== 'production';

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
      await client.access({
        host: FTP_HOST,
        user: FTP_USER,
        password: FTP_PASSWORD,
        secure: false,
      });

      // Créer un répertoire dynamique basé sur le nom et le téléphone si nécessaire
      const remoteDir = `${req.body.nom}_${req.body.tel}`;
      await client.ensureDir(remoteDir); // S'assurer que le répertoire existe

      // Upload du fichier dans le répertoire cible
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

  if (fs.existsSync(tempFilePath)) {
    fs.unlinkSync(tempFilePath);
  }

  throw lastError || new Error("Échec de l'upload après plusieurs tentatives");
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
