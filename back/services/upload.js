const admin = require("firebase-admin");
const { MongoClient } = require("mongodb");
const config = require("../config.json");
require("dotenv").config();

const BUCKET = process.env.FIREBASE_BUCKET || "prd-transport.appspot.com";

// Fonction pour récupérer la clé Firebase depuis MongoDB
async function getFirebaseKey() {
    if (!config.database) {
        throw new Error("Database configuration is missing");
    }

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

        // Validation des clés requises
        const requiredKeys = [
            'type', 'project_id', 'private_key_id', 'private_key', 
            'client_email', 'client_id', 'auth_uri', 'token_uri'
        ];
        requiredKeys.forEach(key => {
            if (!firebaseKey[key]) {
                throw new Error(`Missing required Firebase key: ${key}`);
            }
        });

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
        if (admin.apps.length === 0) {  // Éviter l'initialisation multiple
            admin.initializeApp({
                credential: admin.credential.cert(firebaseConfig),
                storageBucket: BUCKET,
            });

            console.log("Firebase Admin SDK initialized successfully.");
        }
    } catch (error) {
        console.error("Error initializing Firebase Admin SDK:", error);
        process.exit(1); // Arrêter l'application si l'initialisation échoue
    }
}

// Appel différé de l'initialisation
initializeFirebase();

const uploadFileWithRetry = (bucketFile, file, retries = 3) => {
    return new Promise((resolve, reject) => {
        if (!file || !file.buffer) {
            return reject(new Error('Invalid file object'));
        }

        const uploadAttempt = (attempt) => {
            const stream = bucketFile.createWriteStream({
                metadata: {
                    contentType: file.mimetype || 'application/octet-stream',
                },
                resumable: false  // Désactiver le téléchargement reprenant
            });

            stream.on("error", (error) => {
                console.error(`Upload error (Attempt ${attempt}):`, error);
                if (attempt < retries) {
                    console.log(`Retrying upload (${attempt + 1}/${retries})...`);
                    setTimeout(() => uploadAttempt(attempt + 1), 1000 * attempt);
                } else {
                    reject(error);
                }
            });

            stream.on("finish", async () => {
                try {
                    let publicAttempts = 0;
                    while (publicAttempts < retries) {
                        try {
                            await bucketFile.makePublic();
                            resolve();
                            return;
                        } catch (publicError) {
                            publicAttempts++;
                            console.warn(`Public access attempt ${publicAttempts} failed`);
                            if (publicAttempts >= retries) {
                                throw publicError;
                            }
                            await new Promise(res => setTimeout(res, 1000 * publicAttempts));
                        }
                    }
                } catch (finalError) {
                    reject(finalError);
                }
            });

            stream.end(file.buffer);
        };

        uploadAttempt(0);
    });
};

const UploadImage = (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next();
    }

    const files = req.files;
    const uploadedFiles = {};

    const uploadPromises = Object.keys(files).map((fieldName) => {
        const fileList = files[fieldName];
        if (!fileList || fileList.length === 0) {
            console.warn(`No files found for field: ${fieldName}`);
            return Promise.resolve();
        }

        const file = fileList[0];
        const fileExtension = file.originalname.split(".").pop() || 'unknown';
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
        const bucketFile = bucket.file(fileName);

        return uploadFileWithRetry(bucketFile, file).then(() => {
            const firebaseUrl = `https://storage.googleapis.com/prd-transport.appspot.com/${fileName}`;
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
            res.status(500).json({ 
                error: "File upload failed", 
                details: error.message 
            });
        });
};

module.exports = UploadImage;
