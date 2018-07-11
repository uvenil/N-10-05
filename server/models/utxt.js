const mongoose = require('mongoose');
mongoose.plugin(require('./lastMod'));

// !!! hier: 
// hyperwort.de, hyperwort.com registrieren
// utxt = hyperwort, ulink = hypersatz, ggf. zirkuläre Sätze ermitteln in 2D, 3D, xD
// Aggregationsstufe
// Einzeldaten im Attribut meta zusammenfassen
// Usergruppen mit Rechten
const UtxtSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  ulinks: [mongoose.Schema.Types.ObjectId], // Verbindungen ulinks, in denen der aktuelle utxt vorkommt
  ulinkcond: [mongoose.Schema.Types.ObjectId], // Verbindungen ulinks, bei denen der aktuelle utxt Bedingung für die Gükltigkeit ist
  completed: {
    type: Boolean,
    default: false
  },
  time: {
    completedAt: {
      type: Number,
      default: null
    },
    lastModified: {
      type: Number,
      default: new Date().getTime()
    },
    createdAt: {
      type: Number,
      default: new Date().getTime()
    }
  },
  utxtuser: {
    _creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    _editors: [{
      editor: mongoose.Schema.Types.ObjectId,
      right: {
        type: String,
        enum: [null, 'none', 'read', 'write', 'move', 'write-read', 'move-read', 'move-write', 'move-write-read'],
        default: 'none'
      }
    }]
  }
}, { discriminatorKey: '_type' });

const Utxt = mongoose.model('Utxt', UtxtSchema);

module.exports = { Utxt, UtxtSchema };
