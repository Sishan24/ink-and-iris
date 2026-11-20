import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IReaderLetter extends Document {
  senderName: string;
  senderEmail: string;
  isAnonymous: boolean;
  bookReferenced?: Types.ObjectId;
  subject: string;
  message: string;
  consentToPublish: boolean;
  status: 'pending' | 'approved' | 'private' | 'replied';
  authorReply?: string;
  repliedAt?: Date;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReaderLetterSchema = new Schema<IReaderLetter>(
  {
    senderName: { type: String, required: true, trim: true },
    senderEmail: { type: String, required: true, lowercase: true, trim: true },
    isAnonymous: { type: Boolean, default: false },
    bookReferenced: { type: Schema.Types.ObjectId, ref: 'Book' },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    consentToPublish: { type: Boolean, required: true, default: false },
    status: {
      type: String,
      enum: ['pending', 'approved', 'private', 'replied'],
      default: 'pending'
    },
    authorReply: { type: String },
    repliedAt: { type: Date },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const ReaderLetter = mongoose.model<IReaderLetter>('ReaderLetter', ReaderLetterSchema);
