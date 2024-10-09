const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  publicKey: { type: String, required: true },   // Public Key for encryption
  privateKey: { type: String },  // Private Key should not be stored on the server!
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lastSeen: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
