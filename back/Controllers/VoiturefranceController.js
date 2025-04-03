const Voiture = require("../Models/Voiturefrance");
const Chauffeur = require("../Models/Chauffeurfrance");
const mongoose = require("mongoose");

exports.addvoiture = async (req, res) => {
    try {
        const { modelle, immatriculation } = req.body;
        const chauffeurId = req.params.id;

        // Vérifier si l'ID du chauffeur est valide
        if (!mongoose.Types.ObjectId.isValid(chauffeurId)) {
            return res.status(400).json({ message: "❌ ID du chauffeur invalide !" });
        }

        // Vérifier si le chauffeur existe
        const chauffeurExist = await Chauffeur.findById(chauffeurId);
        if (!chauffeurExist) {
            return res.status(404).json({ message: "❌ Chauffeur non trouvé, aucune insertion effectuée." });
        }

        // Vérification de l'existence des fichiers uploadés
        const cartegriseUrl = req.uploadedFiles?.photoCartegrise || null;
        const assuranceUrl = req.uploadedFiles?.photoAssurance || null;

        console.log("📂 Carte grise URL:", cartegriseUrl || "Non fournie");
        console.log("📂 Assurance URL:", assuranceUrl || "Non fournie");

      
        // Création de la nouvelle voiture
        const nouvelleVoiture = new Voiture({
            modelle,
            immatriculation,
            cartegrise: cartegriseUrl,
            assurance: assuranceUrl,
            chauffeur: chauffeurId
        });

        await nouvelleVoiture.save();

        console.log("🚗 Nouvelle voiture enregistrée:", nouvelleVoiture);
        res.status(201).json({ message: "✅ Véhicule enregistré avec succès !", voiture: nouvelleVoiture });

    } catch (error) {
        console.error("❌ Erreur lors de l'ajout du véhicule:", error);
        res.status(500).json({ message: "❌ Erreur serveur, impossible d'ajouter la voiture." });
    }
};

// Récupérer les voitures par ID du chauffeur
exports.getBychauff = async (req, res) => {
    try {
        const chauffeurId = req.params.id;

        // Vérifier si l'ID du chauffeur est valide
        if (!mongoose.Types.ObjectId.isValid(chauffeurId)) {
            return res.status(400).json({ message: "❌ ID du chauffeur invalide !" });
        }

        const voitures = await Voiture.find({ chauffeur: chauffeurId });

        if (!voitures || voitures.length === 0) {
            return res.status(404).json({ message: "❌ Aucune voiture trouvée pour ce chauffeur !" });
        }

        res.status(200).json(voitures);

    } catch (error) {
        console.error("❌ Erreur lors de la récupération des voitures du chauffeur:", error);
        res.status(500).json({ message: "❌ Erreur serveur, impossible de récupérer les véhicules." });
    }
};
