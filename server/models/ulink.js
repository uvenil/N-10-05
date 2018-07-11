const mongoose = require('mongoose');
mongoose.plugin(require('./lastMod'));
require('./extend');
const Schema = mongoose.Schema;
var { UtxtSchema } = require('./utxt');

// links in Utxt zusammenfassen (name, auf, ab), 2-, 3-wertig
var UlinkSchema = UtxtSchema.extend({ // UtxtSchema wird vererbt
  links: [{ // Verknüpfungstyp
    name: {
      type: String,
      required: true
    },
    auf: [Schema.Types.ObjectId], // aufwaerts liegende utxts
    ab: [Schema.Types.ObjectId] // abwaerts liegende utxts
  }]
});

var Ulink = mongoose.model('Utxt', UlinkSchema);


module.exports = { Ulink };
