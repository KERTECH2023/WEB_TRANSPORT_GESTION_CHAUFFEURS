const ftp = require('basic-ftp');
const path = require('path');
require("dotenv").config();

const FTP_HOST = process.env.FTP_HOST; // Add your FTP host
const FTP_USER = process.env.FTP_USER; // Add your FTP username
const FTP_PASSWORD = process.env.FTP_PASSWORD; // Add your FTP password
const FTP_DIR = process.env.FTP_DIR || '/uploads'; // The directory on your FTP server

const uploadFileWithRetry = (ftpClient, filePath, retries = 3) => {
  return new Promise((resolve, reject) => {
    const uploadAttempt = async (attempt) => {
      try {
        await ftpClient.uploadFrom(filePath, path.join(FTP_DIR, path.basename(filePath)));
        resolve();
      } catch (error) {
        if (attempt < retries) {
          console.log(`Upload failed, retrying attempt ${attempt + 1}...`);
          setTimeout(() => uploadAttempt(attempt + 1), 1000);
        } else {
          reject(error);
        }
      }
    };

    uploadAttempt(0);
  });
};



const UploadImage = (req, res, next) => {
  if (!req.files || !req.nom) return next();

  const files = req.files;
  const uploadedFiles = {};

  // Créer un nouveau dossier avec le nom de req.nom
  const folderPath = path.join(__dirname, 'tmp', req.nom);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const uploadPromises = Object.keys(files).map((fieldName) => {
    const file = files[fieldName][0];
    const filePath = path.join(folderPath, Date.now() + '.' + file.originalname.split('.').pop());

    // Enregistrer le fichier dans le dossier créé
    fs.writeFileSync(filePath, file.buffer);

    return new Promise((resolve, reject) => {
      const client = new ftp.Client();
      
      client.on('ready', () => {
        client.put(filePath, `${FTP_DIR}/${req.nom}/${path.basename(filePath)}`, (err) => {
          if (err) {
            console.error("FTP Upload failed:", err);
            reject(err);
          } else {
            const ftpUrl = `ftp://${FTP_HOST}${FTP_DIR}/${req.nom}/${path.basename(filePath)}`;
            uploadedFiles[fieldName] = ftpUrl;

            // Supprimer le fichier temporaire après l'upload
            fs.unlinkSync(filePath);
            resolve();
          }
          client.end();
        });
      });

      client.connect({
        host: FTP_HOST,
        user: FTP_USER,
        password: FTP_PASSWORD,
      });
    });
  });

  Promise.all(uploadPromises)
    .then(() => {
      req.uploadedFiles = uploadedFiles;
      next();
    })
    .catch((error) => {
      console.error("Failed to upload files:", error);
      res.status(500).send({ error: "File upload failed" });
    });
};

module.exports = UploadImage;
