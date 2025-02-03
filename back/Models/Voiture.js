const mongoose  =require('mongoose')
const Schema  =mongoose.Schema
const validator = require('validator');

const VoitSchema = new mongoose.Schema(
    {

    immatriculation: {
            type: String,
          
            
        },
        modelle: {
            type: String,
          
            
        },

     

        chauffeur: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chauffeur"
        },


    }
    );



    VoitSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        
    }
});

const Voiture = mongoose.model('Voiture',VoitSchema)
module.exports = Voiture
