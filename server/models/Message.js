import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  senderName: { type: String, required: true }, // Ensure this field is present
  userRecipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // For direct messages
  groupRecipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' }, // For group messages
  content: { type: String, required: true }, // Encrypted message content
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  isGroupMessage: { type: Boolean, default: false },
  groupName: { type: String },
});

export default mongoose.model("Message", MessageSchema);
