const { mongoose } = require('./../db/mongoose');

const extend = require('mongoose-schema-extend');
const { UtxtSchema } = require('./utxt');

// links in Utxt zusammenfassen (name, auf, ab), 2-, 3-wertig
var UlinkSchema = UtxtSchema.extend({ // UtxtSchema wird vererbt
  ver: [{ // Verknüpfungstyp
    name: {
      type: String,
      required: true
    },
    utxts: [mongoose.Schema.Types.ObjectId], // utxts in der Verbingung Ulink in der richtigen Reihenfolge
    utxtsCond: [mongoose.Schema.Types.ObjectId] // Bedingung für die Gükltigkeit der Verbindung
  }]
});

const Ulink = mongoose.model('Ulink', UlinkSchema);


module.exports = { Ulink };
