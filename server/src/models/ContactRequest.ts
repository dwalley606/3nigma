import mongoose, { Document, Schema, Model } from 'mongoose';

// Define an interface for the ContactRequest document
export interface IContactRequest extends Document {
  _id: mongoose.Types.ObjectId;
  from: mongoose.Types.ObjectId;
  to: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

// Define the status type as a constant to ensure type safety
const CONTACT_REQUEST_STATUSES = ['pending', 'accepted', 'rejected'] as const;
type ContactRequestStatus = typeof CONTACT_REQUEST_STATUSES[number];

const contactRequestSchema: Schema<IContactRequest> = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
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

// Create the model
const ContactRequest: Model<IContactRequest> = mongoose.model<IContactRequest>('ContactRequest', contactRequestSchema);

export default ContactRequest;
