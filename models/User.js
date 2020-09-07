const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  cogid: {
    type: String,
  },
  creator: {
    type: Boolean,
    required: true,
  },
  customer_id: {
    type: String,
  },
  friends:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  friendRequestSent: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  googleId: {
    type: String,
  },
});

module.exports = User = mongoose.model('user', UserSchema);
