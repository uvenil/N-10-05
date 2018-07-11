const mongoose = require('mongoose');
mongoose.plugin(require('./lastMod'));
require('./extend');
const { UtxtSchema } = require('./utxt');

// links in Utxt zusammenfassen (name, auf, ab), 2-, 3-wertig
var UlinkSchema = UtxtSchema.extend({ // UtxtSchema wird vererbt
  ver: [{ // Verknüpfungstyp
    name: {
      type: String,
      required: true
    },
    utxts: [mongoose.Schema.Types.ObjectId], // utxts in der Verbingung Ulink in der richtigen Reihenfolge
    ulinkcond: [mongoose.Schema.Types.ObjectId] // Bedingung für die Gükltigkeit der Verbindung
  }]
});

var Ulink = mongoose.model('Utxt', UlinkSchema);


module.exports = { Ulink };
