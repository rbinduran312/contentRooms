const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DraftSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  text: {
    type: String,
  },
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  type: {
    type: String,
  },
  dash: {
    type: String,
  },

});

module.exports = Draft = mongoose.model('draft', DraftSchema);
