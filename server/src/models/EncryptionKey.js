import mongoose from 'mongoose';

const encryptionKeySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  publicKey: { type: String, required: true },
  privateKey: { type: String, required: true }, // Ensure this is stored securely
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('EncryptionKey', encryptionKeySchema);
