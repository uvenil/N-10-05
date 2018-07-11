const mongoose = require('mongoose');
mongoose.plugin(require('./lastMod'));

// !!! hier: 
// Usergruppen mit Rechten
// Aggregationsstufe
// Einzeldaten im Attribut meta zusammenfassen
// user groups
// creator-String und coworker-Array, editor-rights
const UtxtSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
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
