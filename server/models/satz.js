// Satz ist hier der HyperSatz, das heißt eine geordnete Liste von HyperWorten (deren ObjectIds): z.B. GeschaeftsIdeen -> ProjektPlanen -> GewinneMachen

const { mongoose } = require('./../db/mongoose');

const extend = require('mongoose-schema-extend');
const { WortSchema } = require('./wort');

// satz in Wort zusammenfassen (name, auf, ab), 2-, 3-wertig
var SatzSchema = WortSchema.extend({ // WortSchema wird vererbt und erweitert
  ver: [{ // Verknüpfungstyp
    name: {
      type: String,
      required: true
    },
    worte: [mongoose.Schema.Types.ObjectId], // worte in der Verbingung Satz in der richtigen Reihenfolge
    worteCond: [mongoose.Schema.Types.ObjectId] // Bedingung für die Gükltigkeit der Verbindung
  }]
});

const Satz = mongoose.model('Satz', SatzSchema);


module.exports = { Satz };
