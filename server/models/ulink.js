var mongoose = require('mongoose');
mongoose.plugin(require('./lastMod'));

// links in Utxt zusammenfassen (name, auf, ab), 2-, 3-wertig
var Ulink = mongoose.model('Utxt', {
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
      default: null
    },
    createdAt: {
      type: Number,
      default: new Date().getTime()
    }
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = {Ulink};
