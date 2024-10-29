// server/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
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
      // Add this field
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
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
