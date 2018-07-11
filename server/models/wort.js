// Wort ist hier das HyperWort, das heißt ein Ausdruck ohne Leerzeichen in CamelCase: z.B. ProjektPlanen, GeschaeftsIdeen

const { mongoose } = require('./../db/mongoose');

// !!! hier: 
// hyperwort.de, hyperwort.com registrieren
// wort = hyperwort, satz = hypersatz, ggf. zirkuläre Sätze ermitteln in 2D, 3D, xD
// Aggregationsstufe
// Einzeldaten im Attribut meta zusammenfassen
// Usergruppen mit Rechten
const WortSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  saetze: [mongoose.Schema.Types.ObjectId], // Verbindungen saetze, in denen der aktuelle wort vorkommt
  saetzeCond: [mongoose.Schema.Types.ObjectId], // Verbindungen saetze, bei denen der aktuelle wort Bedingung für die Gükltigkeit ist
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
  wortuser: {
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

const Wort = mongoose.model('Wort', WortSchema);

module.exports = { Wort, WortSchema };
