const Voiture = require("../Models/Voiture");

exports.addvoiture = async (req, res) => {
  try {
    const { modelle, immatriculation } = req.body;
    const chauffeurId = req.params.id;

    // Vérifier si les fichiers uploadés existent
    const cartegriseUrl = req.uploadedFiles?.photoCartegrise || '';
    const assuranceUrl = req.uploadedFiles?.photoAssurance || '';
    console.log("Carte grise:", cartegriseUrl);

    // Vérifier si une voiture avec la même immatriculation existe déjà
    const verifVoiture = await Voiture.findOne({ immatriculation });
    if (verifVoiture) {
      return res.status(403).send({ message: "Voiture existe déjà !" });
    }

    // Créer un nouvel objet Voiture
    const nouvelleVoiture = new Voiture({
      modelle,
      immatriculation,
      cartegrise: cartegriseUrl,
      assurance: assuranceUrl,
      chauffeur: chauffeurId,
    });

    console.log("Nouvelle voiture:", nouvelleVoiture);

    // Sauvegarder la nouvelle voiture dans la base de données
    await nouvelleVoiture.save();
    return res.status(201).send({ message: "Voiture ajoutée avec succès !" });

  } catch (error) {
    console.error("Erreur lors de l'ajout de la voiture:", error);
    res.status(500).send({ message: "Erreur interne du serveur." });
  }
};

exports.getBychauff = async (req, res) => {
  try {
    const chauffeurId = req.params.id;

    const voitures = await Voiture.find({ chauffeur: chauffeurId });

    if (!voitures || voitures.length === 0) {
      return res.status(404).send({ message: "Aucune voiture trouvée pour le chauffeur avec id " + chauffeurId });
    }

    res.send(voitures); // Envoyer toutes les voitures pour le chauffeur
  } catch (error) {
    console.error("Erreur lors de la récupération des voitures:", error);
    res.status(500).send({ message: "Erreur interne du serveur." });
  }
};
