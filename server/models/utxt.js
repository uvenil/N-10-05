var mongoose = require('mongoose');

// !!! hier: 
// createdAt automatisch in Mongo erzeugen
// Einzeldaten im Attribut meta zusammenfassen
// creator-String und coworker-Array, editor-rights
var Utxt = mongoose.model('Utxt', {
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
  completedAt: {
    type: Number,
    default: null
  },
  lastModified: {
    type: Number,
    default: null
  },
  createdAt: {
    type: Number,
    default: new Date().getTime()
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = {Utxt};
