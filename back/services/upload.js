const admin = require("firebase-admin");
const { MongoClient } = require("mongodb");
const config = require("../config.json");
require("dotenv").config();

const BUCKET = "prd-transport.appspot.com";

// Fonction pour récupérer la clé Firebase depuis MongoDB
async function getFirebaseKey() {
    const client = new MongoClient(config.database, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    });

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db();
        const collection = db.collection("firebasekey");

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
            privateKey: firebaseKey.private_key.replace(/\\n/g, '\n'),
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
            storageBucket: BUCKET,
        });

        console.log("Firebase Admin SDK initialized successfully.");
    } catch (error) {
        console.error("Error initializing Firebase Admin SDK:", error);
        process.exit(1); // Arrêter l'application si l'initialisation échoue
    }
}

// Initialiser Firebase au démarrage
initializeFirebase();

const bucket = admin.storage().bucket();

// Fonction d'upload avec gestion des erreurs et des nouvelles tentatives
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
                try {
                    for (let i = 0; i < retries; i++) {
                        try {
                            await bucketFile.makePublic();
                            console.log("File made public.");
                            resolve();
                            return;
                        } catch (error) {
                            if (i === retries - 1) {
                                throw error;
                            }
                            console.log(`Retrying to make file public (${i + 1}/${retries})...`);
                            await new Promise((res) => setTimeout(res, 1000));
                        }
                    }
                } catch (error) {
                    reject(error);
                }
            });

            stream.end(file.buffer);
        };

        uploadAttempt(0);
    });
};

// Middleware d'upload d'image
const UploadImage = (req, res, next) => {
    if (!req.files) {
        return next();
    }

    const files = req.files;
    const uploadedFiles = {};

    const uploadPromises = Object.keys(files).map((fieldName) => {
        const file = files[fieldName][0];
        const fileName = `${Date.now()}.${file.originalname.split(".").pop()}`;
        const bucketFile = bucket.file(fileName);

        return uploadFileWithRetry(bucketFile, file).then(() => {
            const firebaseUrl = `https://storage.googleapis.com/${BUCKET}/${fileName}`;
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
