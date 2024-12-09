import mongoose, { Document, Schema } from 'mongoose';

// Define an interface for the ContactRequest document
interface IContactRequest extends Document {
  from: mongoose.Types.ObjectId;
  to: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

// Define the status type as a constant to ensure type safety
const CONTACT_REQUEST_STATUSES = ['pending', 'accepted', 'rejected'] as const;
type ContactRequestStatus = typeof CONTACT_REQUEST_STATUSES[number];

const contactRequestSchema = new Schema<IContactRequest>({
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: CONTACT_REQUEST_STATUSES,
    default: 'pending',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the model with type information
export default mongoose.model<IContactRequest>('ContactRequest', contactRequestSchema);
