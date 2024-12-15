import mongoose, { Document, Schema, Model } from "mongoose";
import { IUser } from "./User.js"; // Assuming you have a User interface

// Define an interface for the Group document
export interface IGroup extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  members: IUser['_id'][];
  admins: IUser['_id'][];
  createdAt: Date;
  updatedAt: Date;
  conversationId: mongoose.Types.ObjectId;
}

// Define the schema
const groupSchema: Schema<IGroup> = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
});

// Create the model
const Group: Model<IGroup> = mongoose.model<IGroup>("Group", groupSchema);

export default Group;
