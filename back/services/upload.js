const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');
require("dotenv").config();

// Configuration FTP
const FTP_HOST = process.env.FTP_HOST;
const FTP_USER = process.env.FTP_USER;
const FTP_PASSWORD = process.env.FTP_PASSWORD;
const FTP_DIR = 'upload';  // Répertoire principal
const BASE_URL = 'http://77.37.124.206:3000/images/ftpuser';

/**
 * Fonction pour créer un répertoire distant de manière récursive
 * (crée tous les répertoires parents si nécessaire)
 */
const createDirectoryRecursive = async (client, dirPath) => {
  const parts = dirPath.split('/').filter(part => part !== '');
  let currentPath = '';

  for (const part of parts) {
    currentPath += (currentPath ? '/' : '') + part;
    
    try {
      // Tenter de naviguer vers le répertoire pour vérifier s'il existe
      await client.cd('/');  // Revenir à la racine
      await client.cd(currentPath);
    } catch (err) {
      // Le répertoire n'existe pas, on le crée
      try {
        await client.cd('/');  // Revenir à la racine
        
        // Si le répertoire parent existe, on peut créer le sous-répertoire
        if (currentPath.includes('/')) {
          const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
          await client.cd(parentPath);
        }
        
        console.log(`🔨 Création du répertoire: ${part}`);
        await client.send(`MKD ${part}`);
        
        // Vérifier que le répertoire a bien été créé
        await client.cd('/');
        await client.cd(currentPath);
      } catch (mkdErr) {
        console.error(`❌ Impossible de créer le répertoire ${part}: ${mkdErr.message}`);
        throw new Error(`Échec de création du répertoire ${part}`);
      }
    }
  }
  
  // Revenir à la racine puis au chemin complet pour être sûr d'y être
  await client.cd('/');
  await client.cd(dirPath);
  console.log(`✅ Répertoire distant vérifié/créé: ${dirPath}`);
};

/**
 * Fonction pour télécharger un fichier avec réessais automatiques
 */
const uploadFileWithRetry = async (file, filePath, retries = 3) => {
  const client = new ftp.Client();
  client.ftp.verbose = process.env.NODE_ENV !== 'production';

  // Extraire le nom du fichier et le chemin du répertoire
  const fileName = path.basename(filePath);
  const dirPath = path.dirname(filePath);

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

      // Créer/vérifier le répertoire de destination
      console.log(`🚀 Création/vérification du répertoire distant: ${dirPath}`);
      await createDirectoryRecursive(client, dirPath);

      // Upload du fichier
      console.log(`🚀 Téléchargement du fichier vers: ${filePath}`);
      await client.uploadFrom(tempFilePath, fileName);
      
      // Définir les permissions du fichier (644 = rw-r--r--)
      try {
        await client.send(`SITE CHMOD 644 ${fileName}`);
        console.log(`🔒 Permissions du fichier définies: ${fileName}`);
      } catch (chmodErr) {
        console.warn(`⚠️ Impossible de définir les permissions: ${chmodErr.message}`);
        // Continuer même si CHMOD échoue
      }
      
      console.log(`✅ Fichier ${filePath} téléchargé avec succès`);

      // Construire l'URL
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
      } catch (e) {
        // Ignorer les erreurs lors de la fermeture
      }
    }
  }

  // Échec après tous les essais
  if (fs.existsSync(tempFilePath)) {
    fs.unlinkSync(tempFilePath);
  }
  
  console.error(`❌ Erreur lors de l'upload de ${path.basename(filePath)}: ${lastError?.message || 'Erreur inconnue'}`);
  throw lastError || new Error("Échec de l'upload après plusieurs tentatives");
};

/**
 * Middleware pour gérer l'upload d'images vers un serveur FTP
 */
const UploadImage = (req, res, next) => {
  if (!req.files) return next();

  const files = req.files;
  const uploadedFiles = {};
  
  // Obtenir le préfixe de dossier (par exemple: ID utilisateur)
  const folderPrefix = req.body.folderPrefix || req.body.userId || req.params.userId || '';
  
  const uploadPromises = Object.keys(files).map((fieldName) => {
    const file = files[fieldName][0];
    const fileExtension = file.originalname.split(".").pop();
    
    // Construire le chemin du fichier avec sous-dossier si nécessaire
    let filePath;
    if (folderPrefix) {
      // Utiliser le nom de fichier original ou générer un nom basé sur le champ
      const fileName = `${fieldName}.${fileExtension}`;
      filePath = `${FTP_DIR}/${folderPrefix}/${fileName}`;
    } else {
      // Sans préfixe, utiliser simplement un timestamp
      const fileName = `${Date.now()}.${fileExtension}`;
      filePath = `${FTP_DIR}/${fileName}`;
    }
    
    console.log(`📂 Préparation de l'upload: ${fieldName} -> ${filePath}`);
    
    return uploadFileWithRetry(file, filePath).then((fileUrl) => {
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
