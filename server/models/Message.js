const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },  // Encrypted message content
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  isGroupMessage: { type: Boolean, default: false },
});

module.exports = mongoose.model('Message', MessageSchema);
