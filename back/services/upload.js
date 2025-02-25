const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');
require("dotenv").config();

const FTP_HOST = process.env.FTP_HOST;
const FTP_USER = process.env.FTP_USER;
const FTP_PASSWORD = process.env.FTP_PASSWORD;
const FTP_DIR = process.env.FTP_DIR || '/uploads';

const UploadImage = async (req, res, next) => {
  if (!req.files || !req.nom) return next();

  const files = req.files;
  const uploadedFiles = {};

  // Créer un nouveau dossier avec le nom de req.nom
  const folderPath = path.join(__dirname, 'tmp', req.nom);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  try {
    const client = new ftp.Client();
    client.ftp.verbose = process.env.NODE_ENV !== 'production';
    
    try {
      await client.access({
        host: FTP_HOST,
        user: FTP_USER,
        password: FTP_PASSWORD,
        secure: false
      });
      
      // Vérifier et créer le dossier distant si nécessaire
      try {
        await client.ensureDir(path.join(FTP_DIR, req.nom));
      } catch (err) {
        console.log(`Création du dossier distant: ${err.message}`);
        await client.makeDir(path.join(FTP_DIR, req.nom));
      }
      
      // Traiter chaque fichier
      for (const fieldName in files) {
        const file = files[fieldName][0];
        const fileName = Date.now() + '.' + file.originalname.split('.').pop();
        const filePath = path.join(folderPath, fileName);
        
        // Enregistrer le fichier temporairement
        fs.writeFileSync(filePath, file.buffer);
        
        // Télécharger le fichier avec retry
        try {
          await client.uploadFrom(
            filePath, 
            path.join(FTP_DIR, req.nom, fileName)
          );
          
          const ftpUrl = `${req.nom}/${fileName}`;
          uploadedFiles[fieldName] = ftpUrl;
        } catch (uploadError) {
          console.error("Erreur lors du téléchargement:", uploadError);
          throw uploadError;
        } finally {
          // Supprimer le fichier temporaire
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      }
    } finally {
      client.close();
    }
    
    req.uploadedFiles = uploadedFiles;
    next();
  } catch (error) {
    console.error("Échec du téléchargement des fichiers:", error);
    res.status(500).send({ error: "Le téléchargement des fichiers a échoué" });
  }
};

module.exports = UploadImage;
