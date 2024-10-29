import mongoose from "mongoose";

const { Schema } = mongoose;

// Define the Message schema
const messageSchema = new Schema({
  content: { type: String, required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
  isGroupMessage: { type: Boolean, default: false },
  groupRecipientId: { type: Schema.Types.ObjectId, ref: 'Group' },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
