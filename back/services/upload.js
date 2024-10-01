const admin = require("firebase-admin");
const serviceAccount = require("../firebase-key.json");
require("dotenv").config();
const BUCKET = "prd-transport.appspot.com";
const config = {
  "type": "service_account",
  "project_id": "prd-transport",
  "private_key_id": "d0dd1f140716f5006faf472bef1b70c5332e53db",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC84PWO8RuCW13i\nwYRN9JKlZvXyihHFtThtFuVdKjS3BW//G/wthMWpSDaJ0kacV70LTrxR33lEirWw\nv4GdJtOJ7HyVBb+QgrPbeEGOgzCYHZKFRmpdUreio+R7b+yuf99qEBf259ASJwl2\ngw3vEB0aPowgwFW3OlFklqdXuBqVN9HLtS2wLG7xDg54A8/4aoxP9NCOI3eFkCj9\n/A+x7NpL0fUcB/rzp27h3u4t85lXpX3UCEviLkYBL14qpdYYD7KmdqpQxEOqA6AQ\nCWlFdj9/BGmR1UNS4mVLNzHhueqe83vO1C4HZBxatf04fbjlKYVjRKFc0PxR7y5Z\nVZZm9bY/AgMBAAECggEABHKEpJuXSeXAcumJ2PmoJLS+y0JVZ5hrHC1mTZM3K3ns\nkRvuUH7/xQJwnT5Jq755qjDUN4mRmTd+6BwKQ7iw6xpEeTrhWnHNrfO4mhzG8uAd\nyFtQkKLoTkm75oaP8Lj8V+zsJrttq6lZpeQgOHcm3ZuIFhLvKTcchHKMvTxac1no\ng0RlnipkbfOaY/dLW00r8M+NqQb9GTyP113A7Obq5Bg8frHlFvjDXgzZMdbERn4k\ndzI2x+DFizN42Lqdx8B17zxKSfLOxliNjWseO+1AGMYBKa9fCgTv3uMpBhI8WJQ3\nc2J9sSNhMPvc+HItmwJA4r/l+Ml5WvfczemCRgkSiQKBgQDzVGtFATk7SpggBMsP\nu3Sd0PRS9mE46xKiTHj1KiMD9Bfyf4IXH+I4CyBwIq49zux5PXw9oS/82ieRge1r\nKF4r/tkptolMD/bU+rpPk/nU3lUNEu95kYCPjro/yvfWDm071QOvQ5VIFvkvT030\n0/aE+h88TXTfEDn9Oi5fLn9LtQKBgQDGtrWPvG4e4Nb1CSfaePjBhN6/IAG6jpR7\n/Qo9EmSkSMOF9+lR09bJhabDAlokWN0+2ZbSFatKL3/mgWom4UDyD+eSK4Rtfsy4\nCwipxbNE2sxZMjK4ovBKqr48LEVB1GSq5rlSxoF0rmZV8yYc/V7Q0fNtxaC/5PJb\nWh206au6owKBgQDAQmV3Yl4cEPZd5iujxJOB1oYVvwJWfLZ+cjnoTGDaUNVTD5h0\nOQb/DRuWPnC5+XMy4Hf4IhHOkXhOKgCzeHPgAz8HDGkzJjH7Whg3pE3z+a/t4pZA\n0cxooXdbzD1Cbqe0bLy6kIW1LiG5VcnctlXD//UKKpE7ZpDLGltlbVG7OQKBgH4p\neIKmpt/R7ogqZPQvg/gRrP55ir9wUNObp0l5CQ7I5+KBsM/0CFVwFp2PO74B8Y46\nxafifBsgpzqpBcVjlEFbWbITEQQX0lAzKS/oxlW7+KvU1CEnyhoN57P6g4o1GCjt\nTdJBF+YF6BE/y/3x26YG9l/GbrYG3NylDWFUTmSzAoGAKXIKcPBA53InRy23PA5K\n6Imh1w5/oTOxYJDm+tsuoaF9IJpoAZbGLy+U5NUOd9yD45ENCMMzREFALdzNpRo2\nVO3FcavdG1kKq2lQd2b5Yk+pKtPbpvL+lpBNB9LJWqwxp+/PuGIWqZP52fqf+ty0\nAuQpgR9hKCIbrf7N3cpswzc=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-dpu42@prd-transport.iam.gserviceaccount.com",
  "client_id": "115384259108610553271",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-dpu42%40prd-transport.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};
admin.initializeApp({
  credential: admin.credential.cert(config),
  storageBucket: BUCKET,
});

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
