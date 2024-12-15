import mongoose, { Document, Schema, Model } from "mongoose";
import { IUser } from "./User.js"; // Assuming you have a User interface
import { IGroup } from "./Group.js"; // Assuming you have a Group interface

// Define an interface for the Message document
export interface IMessage extends Document {
  _id: mongoose.Types.ObjectId;
  content: string;
  sender: mongoose.Types.ObjectId;
  userRecipientId?: mongoose.Types.ObjectId;
  timestamp: Date;
  isGroupMessage: boolean;
  groupRecipientId?: mongoose.Types.ObjectId;
}

// Define the schema
const messageSchema: Schema<IMessage> = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  content: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userRecipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  timestamp: { type: Date, default: Date.now },
  isGroupMessage: { type: Boolean, default: false },
  groupRecipientId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
});

// Create the model
const Message: Model<IMessage> = mongoose.model<IMessage>("Message", messageSchema);

export default Message;
