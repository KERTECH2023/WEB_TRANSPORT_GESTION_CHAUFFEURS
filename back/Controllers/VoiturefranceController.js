const Voiture = require("../Models/Voiturefrance");
const Chauffeur = require("../Models/Chauffeurfrance");

exports.addvoiture = async (req, res) => {
    try {
        const { modelle, immatriculation } = req.body;
        const chauffeurId = req.params.id;
       // const chauffeurexist = await Chauffeur.findOne({ chauffeurId });
      //  if(chauffeurexist){
        // Vérification de l'existence des fichiers uploadés
        const cartegriseUrl = req.uploadedFiles?.photoCartegrise || '';
        const assuranceUrl = req.uploadedFiles?.photoAssurance || '';
        
        console.log("📂 Carte grise URL:", cartegriseUrl);
        console.log("📂 Assurance URL:", assuranceUrl);

        // Vérifier si la voiture existe déjà
        const verifVoiture = await Voiture.findOne({ immatriculation });
        if (verifVoiture) {
            return res.status(403).json({ message: "❌ Voiture existe déjà !" });
        }

        // Création de la nouvelle voiture
        const nouvelleVoiture = new Voiture({
            modelle,
            immatriculation,
            cartegrise: cartegriseUrl,
            assurance: assuranceUrl,
            chauffeur: chauffeurId
        });

        console.log("🚗 Nouvelle voiture enregistrée:", nouvelleVoiture);

        await nouvelleVoiture.save(); // Assurez-vous d'attendre la sauvegarde

        res.status(201).json({ message: "✅ Véhicule enregistré avec succès !" });
   // }

    } catch (error) {
        console.error("❌ Erreur lors de l'ajout du véhicule:", error);
        res.status(500).json({ message: "Erreur serveur, impossible d'ajouter la voiture." });
    }
};

// Récupérer les voitures par ID du chauffeur
exports.getBychauff = async (req, res) => {
    try {
        const voitures = await Voiture.find({ chauffeur: req.params.id });

        if (!voitures || voitures.length === 0) {
            return res.status(404).json({ message: "❌ Aucune voiture trouvée pour ce chauffeur !" });
        }

        res.status(200).json(voitures); // Renvoie toutes les voitures du chauffeur

    } catch (error) {
        console.error("❌ Erreur lors de la récupération des voitures du chauffeur:", error);
        res.status(500).json({ message: "Erreur serveur, impossible de récupérer les véhicules." });
    }
};
