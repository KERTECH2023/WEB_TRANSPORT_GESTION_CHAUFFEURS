const RideRequest = require('../Models/AllRideRequest');
const Facture = require('../Models/Facture');

const saveRide = async (req, res) => {
    try {
        const {
            HealthStatus,
            
            destination,
            
            driverLocation,
            fareAmount,
            driverName,
            driverPhone,
            source,
            status,
            time,
            userName,
            userPhone,
        } = req.body;

        // Créer une nouvelle instance de RideRequest
        const newRideRequest = new RideRequest({
            HealthStatus: HealthStatus,
            destination: {
                latitude: destination.latitude,
                longitude: destination.longitude
            },
            driverLocationData: {
                latitude: driverLocation.latitude,
                longitude: driverLocation.longitude
            },
            fareAmount: fareAmount,
            driverPhone: driverPhone,
            source: {
                latitude: source.latitude,
                longitude: source.longitude
            },
            status: status,
            time: time,
            userName: userName,
            userPhone: userPhone
        });

        // Sauvegarder la demande de trajet dans la base de données
        await newRideRequest.save();

        res.status(201).json({ message: 'Demande de trajet sauvegardée avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la sauvegarde de la demande de trajet :', error);
        res.status(500).json({ message: 'Erreur lors de la sauvegarde de la demande de trajet.' });
    }
};
const pipeline = [
    {
      $project: {
        _id: 0,
        yearMonth: { $month: "$time" },
        yearWeek: { $isoWeek: "$time" },
        driverPhone: "$driverPhone",
        fareAmount: 1,
       // HealthStatus: 1,
       // destination: 1,
        //source: 1,
        //status: 1,
        //userName: 1,
        //userPhone: 1,
        time: 1,
      },
    },
    {
      $group: {
        _id: {
          yearMonth: "$yearMonth",
          yearWeek: "$yearWeek",
          driverPhone: "$driverPhone",
        },
        totalFareAmount: { $sum: "$fareAmount" },
        //documentCount: { $sum: 1 },
        //HealthStatus: { $push: "$HealthStatus" },
       // destination: { $push: "$destination" },
        //source: { $push: "$source" },
        //status: { $push: "$status" },
       // userName: { $push: "$userName" },
       // userPhone: { $push: "$userPhone" },
        time: { $push: "$time" },
      },
    },
    {
      $sort: {
        "_id.yearMonth": 1,
        "_id.yearWeek": 1,
        "_id.driverPhone": 1,
      },
    },
  ];
  const getfact = (req, res) => {
    RideRequest.aggregate(pipeline, (err, data) => {
      if (err) {
        res.status(500).send("Error during aggregation");
      } else {
        const factures = data.map((entry) => {
          return new Facture({
            chauffeur:entry.driverPhone,
            date: new Date(entry.time[0]), // assuming time is an array of dates
            montant: entry.totalFareAmount,
            description: "",
            isPaid: false,
          });
        });
        res.send(factures);
        console.log(factures);
      }
    });
  };
  // Execute the aggregation pipeline
  const result =  RideRequest.aggregate(pipeline)
  console.log(result);

module.exports = { saveRide ,getfact};
