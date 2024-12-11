import mongoose, { Document, Schema, Model } from 'mongoose';

// Define interfaces for the Conversation document
interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  messages: mongoose.Types.ObjectId[];
  lastMessage?: mongoose.Types.ObjectId;
  isGroup: boolean;
  name?: string;
  unreadCount: number;
  groupId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>({
  participants: {
    type: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'User'
    }],
    required: true,
    validate: {
      validator: function(array: mongoose.Types.ObjectId[]) {
        return array && array.length > 0;
      },
      message: 'Participants array cannot be empty'
    }
  },
  messages: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Message' 
  }],
  lastMessage: { 
    type: Schema.Types.ObjectId, 
    ref: 'Message' 
  },
  isGroup: { 
    type: Boolean, 
    default: false 
  },
  name: { 
    type: String 
  },
  unreadCount: { 
    type: Number, 
    default: 0 
  },
  groupId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Group' 
  }
}, { timestamps: true });

// Export the model with type information
export default mongoose.model<IConversation>('Conversation', conversationSchema);