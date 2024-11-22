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

// Fonction d'upload avec gestion des erreurs et des nouvelles tentatives
const uploadFileWithRetry = async (bucketFile, file, retries = 3) => {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const stream = bucketFile.createWriteStream({
                metadata: {
                    contentType: file.mimetype,
                },
                resumable: false, // Désactiver le téléchargement reprenant
            });

            return await new Promise((resolve, reject) => {
                stream.on('error', reject);
                stream.on('finish', () => resolve());
                stream.end(file.buffer);
            });
        } catch (error) {
            if (attempt === retries - 1) {
                throw error;
            }
            console.log(`Upload failed, retrying attempt ${attempt + 1}...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
};

// Middleware d'upload d'image
const UploadImage = async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next();
    }

    try {
        const files = req.files;
        const uploadedFiles = {};

        const uploadPromises = Object.keys(files).map(async (fieldName) => {
            const file = files[fieldName][0];
            const fileName = `${Date.now()}.${file.originalname.split('.').pop()}`;
            const bucketFile = admin.storage().bucket().file(fileName);

            await uploadFileWithRetry(bucketFile, file);

            const firebaseUrl = `https://storage.googleapis.com/${BUCKET}/${fileName}`;
            uploadedFiles[fieldName] = firebaseUrl;
        });

        await Promise.all(uploadPromises);

        req.uploadedFiles = uploadedFiles;
        next();
    } catch (error) {
        console.error("Failed to upload files:", error);
        res.status(500).json({ 
            error: "File upload failed", 
            details: error.message 
        });
    }
};

// Initialiser Firebase au démarrage
initializeFirebase();

module.exports = UploadImage;
