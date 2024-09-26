const mongoose  =require('mongoose')
const Schema  =mongoose.Schema


const HistoSchema = new mongoose.Schema(
    {
       
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client"
        },
        Traift: {
            type: String,
           
        },
        kilo: {
            type: String,
          
          },
          desti: {
            type: String,
          
        },
        source: {
            type: String,
          
        },
        trage: {
            type: String,
          
        },
      
        status: {
            type: String,
            default: 'En Attend'
            
        },

      
      
        driveracc: { type: mongoose.Schema.Types.ObjectId, ref: "Chauffeur" },

      
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        }
    },
     {timestamps: true},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);
HistoSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        
    }
});

const Historique = mongoose.model('Historique',HistoSchema)
module.exports = Historique