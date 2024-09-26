const Historique = require('../Models/histo');
const Client   = require('../Models/Client')

exports.add = async (req, res) => {
    const {Traift, kilo,desti,source, trage,client,driveracc} = req.body

 

    let histo = await new Historique({
        Traift,
        kilo,
        desti,
        source,
        trage,
        status:"En_cours",
        client,
        driveracc,
        
    }).save()

    return res.status(200).send({message: "Historique added successfully", histo});
}

exports.updateStatus = async (req, res, next) => {
    const { clientId, driveraccId } = req.params;
  
    try {
      // Find the existing record in the Historique table with the given client and driveracc IDs
      const existingRecord = await Historique.findOne({ client: clientId, driveracc: driveraccId });
  
      // If a record is found, update its status
      if (existingRecord) {
        existingRecord.status = "Accepter"; // Set the new status value here
        await existingRecord.save();
  
        return res.status(200).send({
          message: "Historique status was updated successfully!",
        });
      } else {
        // If no record is found, you can choose to handle this case differently
        return res.status(404).send({
          message: "No matching record found in Historique for the given IDs!",
        });
      }
    } catch (error) {
      return res.status(500).send({ err: error });
    }
  };

  exports.updateRef = async (req, res, next) => {
    const { clientId, driveraccId } = req.params;
  
    try {
      // Find the existing record in the Historique table with the given client and driveracc IDs
      const existingRecord = await Historique.findOne({ client: clientId, driveracc: driveraccId });
  
      // If a record is found, update its status
      if (existingRecord) {
        existingRecord.status = "Refuser"; // Set the new status value here
        await existingRecord.save();
  
        return res.status(200).send({
          message: "Historique status was updated successfully!",
        });
      } else {
        // If no record is found, you can choose to handle this case differently
        return res.status(404).send({
          message: "No matching record found in Historique for the given IDs!",
        });
      }
    } catch (error) {
      return res.status(500).send({ err: error });
    }
  };

  exports.getHistoryWithClientName = async (req, res, next) => {
    const { driveraccId } = req.params;
  
    try {
      // Find the history with the given driveracc ID
      const history = await Historique.find({ driveracc: driveraccId }).populate('client', 'Nom');
  
      if (!history || history.length === 0) {
        return res.status(404).send({
          message: "No history found for the given driveracc ID!",
        });
      }
  
      // Transform the data to include client name separately
      const transformedHistory = history.map((record) => ({
        _id: record._id,
        Traift: record.Traift,
        kilo: record.kilo,
        trage: record.trage,
        status: record.status,
        desti: record.desti,
        source: record.source,
        driveracc: record.driveracc,
        createdAt: record.createdAt,
        clientName: record.client.Nom, // Access the client's name here
      }));
  
      return res.status(200).json(transformedHistory);
    } catch (error) {
      return res.status(500).send({ err: error });
    }
  };