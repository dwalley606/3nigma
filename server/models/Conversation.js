import mongoose from "mongoose";

const { Schema } = mongoose;

// Define the Conversation schema
const conversationSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }], // Use references
  lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' }, // Reference to the last message
  isGroup: { type: Boolean, default: false },
  name: { type: String },
  unreadCount: { type: Number, default: 0 },
});

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;