const admin = require("firebase-admin");
const serviceAccount = require("../firebase-key.json");
require("dotenv").config();
const BUCKET = "prd-transport.appspot.com";
const { MongoClient } = require("mongodb");
const config = require("../config.json"); // Importation de config.json
const cer= "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCyOYau+MN5LcmR\n1YAzgxBXnydFd5zMHPMvsrSKtiBcYzjEjGpMMnQ6tgy+u4bsPaHaG5+ekYFf4rjO\n2boTdNpCyBLeNLv5duciAteOg3v0a8/Op77MAqRVSa6Vb+iJWYS1Wblo1znsEZj2\nreTl+lwvfSjQKZ+doR75thmvHJK1AH3I1YJem10U8q49pLz/EQ4iQIPHFeLuFdeX\nlR0UKzXGZP8T4OHkfYy0cGbRKwyi3GRzt6w4rHjo3lpEkVE1n7vbb1LRtRNQBQSX\nlH6BqOLEVIjWXc9OdNQ88QShF6Z31U9xLK9PYafQ8USsgE/ZayAA2KOt/fz6ddFH\nyptgkPebAgMBAAECggEAIhMhjv580QRSD5HUSwT58Oa66WsvDU9Tp4DxR7v+f+tw\nhROblynmUvtPgH/2EeDOuxag8/450A1W7CVwkBu9RxtdkCJg9hcnpbcJY3P8FQUv\n3ADyV6sBpFTMDkIxIWF+H/YhnsvXhSzwI+mnY9j0GxhA31u16rtNYszQKEy8N+Kn\niElxbmolg6f3g32Vw5dXdSaaKuLH5H6a0B/Lid2xDVc3BzsZhNRx3Uacw4dhRjlP\nROefZcznr5EUOlUILYSWChHIkoGDxNkajt01sV7kIwx8Fi7ydCBhQZiKp88i2L4L\nFHiVPwlueI+OA0yiATutwPXxB5katkoPIr2jn+S5gQKBgQD40y9V6sl4IasrviJy\nQdqfQPhRMJ5FwvMC4ACyjjTubg+ivCHYyXu2mgONp1PgYT3WhybwB5vvD/JZsOiK\n7jaZbsKdaj3+Bf+pMPm2E6kx1R31iedlgmmsJ3NiPtDM8yl/h98PdqVSni45p3md\n8Ecoi9qq1pyx9Cg2jFj00Bh84QKBgQC3XSxetytCxflbm83Hd3BQJEtbn6RNDZUt\nQAFcZFkvyZjl3/owNjjSg1lQw3AFXSX7Lzvb1KD0fMM56wmGcP4V011CiQ1JN51/\nhf3HrqvaPz+/Ad5P6NWO7xWtKg4UPURk7J6zQ4jwRPxcUULmGBjp6yvHSQOsCxF3\nqATJeFBn+wKBgEzDCeVdi03ORTo3a/UHr+RVbMXPU+R9oe6PIGf1SwsLVTOFCoQQ\nlGPe253FszCTjzoxc6e1ETwNFVzqILNLjfiDnPJnJjzJqPePLloncpj3AEkRhBti\nwirj+MqkSlIP6gt35S6mEZaNSgFrUy+QQsOVcZ4mmyyjAAzj+0V7NTLBAoGAEgvX\nfBLm7RFy8zMoU4NLyHdp+0CA+RxnHCb6e09c/7kFlUov42LSwNUwiyRQ+BYs0MXb\nTE1m8ej9hcu+Cj9AooFE4nF+n0Ab/hr/2RE11Kr46SGT8aVmr0SUi5BiBlfpTU2E\naPwylAMWGzfcL60bdpowmtJyzBHizDX7EqEGuNUCgYBhMxDksOwtLZ7B1F7q+m4f\nx4W1En9wrUDMvjY52GrUI0H7pr727mhex8xsavPertSQWdUul4by201S1ywkObrc\nnq5zO/9W0513M4ynXHYVfAuN3JEiXbgrdPKCJhEgj37HhRhM5p1iuGAbDIpwNQef\nGl9Irf85ziBE3cbrHwKBlQ==\n-----END PRIVATE KEY-----\n"


// URI de connexion à MongoDB
const databaseUri = config.database;

// Fonction pour récupérer la clé Firebase depuis MongoDB
async function getFirebaseKey() {
    const client = new MongoClient(databaseUri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // Connexion à MongoDB
        await client.connect();
        console.log("Connected to MongoDB");

        // Utilisation de la base de données depuis l'URI
        const db = client.db(); 
        const collection = db.collection("firebasekey"); // Nom de la collection Firebase Key

        // Récupération de la clé Firebase
        const key = await collection.findOne();
        if (!key) {
            throw new Error("Firebase key not found in MongoDB");
        }

        return key;
    } catch (error) {
        console.error("Error fetching Firebase key from MongoDB:", error);
        throw error;
    } finally {
        await client.close();
    }
}

// Fonction pour initialiser Firebase avec la clé récupérée
async function initializeFirebase() {
    try {
        const firebaseKey = await getFirebaseKey();

        // Configuration Firebase
        const firebaseConfig = {
            type: firebaseKey.type,
            projectId: firebaseKey.project_id,
            privateKeyId: firebaseKey.private_key_id,
            privateKey: firebaseKey.private_key,
            clientEmail: firebaseKey.client_email,
            clientId: firebaseKey.client_id,
            authUri: firebaseKey.auth_uri,
            tokenUri: firebaseKey.token_uri,
            authProviderCertUrl: firebaseKey.auth_provider_x509_cert_url,
            clientCertUrl: firebaseKey.client_x509_cert_url,
        };

        // Initialisation de Firebase Admin SDK
        admin.initializeApp({
            credential: admin.credential.cert(firebaseConfig),
            storageBucket: "prd-transport.appspot.com", // Bucket Firebase
        });

        console.log("Firebase Admin SDK initialized successfully.");
    } catch (error) {
        console.error("Error initializing Firebase Admin SDK:", error);
    }
}

// Appel de la fonction d'initialisation
initializeFirebase();

const bucket = admin.storage().bucket();

const uploadFileWithRetry = (bucketFile, file, retries = 3) => {
  return new Promise((resolve, reject) => {
    const uploadAttempt = (attempt) => {
      const stream = bucketFile.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      stream.on("error", (error) => {
        if (error.code === 503 && attempt < retries) {
          console.log(`Upload failed, retrying attempt ${attempt + 1}...`);
          setTimeout(() => uploadAttempt(attempt + 1), 1000);
        } else {
          reject(error);
        }
      });

      stream.on("finish", async () => {
        // Retarder makePublic ou l'envelopper dans une logique de réessai
        try {
          let attempts = 0;
          while (attempts < retries) {
            try {
              await bucketFile.makePublic();
              break;
            } catch (error) {
              if (attempts < retries - 1) {
                console.log(
                  `Failed to make file public, retrying (${
                    attempts + 1
                  }/${retries})...`
                );
                attempts++;
                await new Promise((res) => setTimeout(res, 1000));
              } else {
                throw error;
              }
            }
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      });

      stream.end(file.buffer);
    };

    uploadAttempt(0);
  });
};

const UploadImage = (req, res, next) => {
  if (!req.files) return next();

  const files = req.files;
  const uploadedFiles = {};

  const uploadPromises = Object.keys(files).map((fieldName) => {
    const file = files[fieldName][0];
    const nomeArquivo = Date.now() + "." + file.originalname.split(".").pop();
    const bucketFile = bucket.file(nomeArquivo);

    return uploadFileWithRetry(bucketFile, file).then(() => {
      const firebaseUrl = `https://storage.googleapis.com/${BUCKET}/${nomeArquivo}`;
      uploadedFiles[fieldName] = firebaseUrl;
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
