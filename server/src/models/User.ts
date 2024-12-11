// server/models/User.ts
import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import { IGroup } from "./Group.js"; // Assuming you have a Group interface

// Define an interface for the User document
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  _id: mongoose.Types.ObjectId;
  groups: mongoose.Types.ObjectId[];
  phoneNumber?: string;
  publicKey?: string;
  lastSeen?: Date;
  profilePicUrl?: string;
  contacts: mongoose.Types.ObjectId[];
}

// Define the schema
const userSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
  ],
  phoneNumber: String,
  publicKey: String,
  lastSeen: Date,
  profilePicUrl: String,
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

// Pre-save middleware to hash the password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Create the model
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
