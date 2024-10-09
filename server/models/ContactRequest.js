const mongoose = require('mongoose');

const ContactRequestSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',      // Reference to the User who sent the request
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',      // Reference to the User who received the request
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],  // Possible statuses for a contact request
    default: 'pending',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,  // Automatically set the date when the request was created
  },
});

module.exports = mongoose.model('ContactRequest', ContactRequestSchema);
