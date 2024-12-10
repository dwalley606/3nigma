import mongoose, { Document, Schema, Model } from "mongoose";
import { IUser } from "./User"; // Assuming you have a User interface

// Define an interface for the Group document
export interface IGroup extends Document {
  name: string;
  members: IUser['_id'][];
  admins: IUser['_id'][];
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const groupSchema: Schema<IGroup> = new Schema({
  name: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create the model
const Group: Model<IGroup> = mongoose.model<IGroup>("Group", groupSchema);

export default Group;
