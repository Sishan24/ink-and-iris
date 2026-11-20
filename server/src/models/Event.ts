import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  eventType: 'Book Launch' | 'Literary Festival' | 'Reading' | 'Interview' | 'Media';
  date: Date;
  timeString?: string;
  venue: string;
  location: string;
  isVirtual: boolean;
  virtualLink?: string;
  description: string;
  registrationUrl?: string;
  status: 'upcoming' | 'past' | 'cancelled';
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    eventType: {
      type: String,
      enum: ['Book Launch', 'Literary Festival', 'Reading', 'Interview', 'Media'],
      required: true
    },
    date: { type: Date, required: true },
    timeString: { type: String },
    venue: { type: String, required: true },
    location: { type: String, required: true },
    isVirtual: { type: Boolean, default: false },
    virtualLink: { type: String },
    description: { type: String, required: true },
    registrationUrl: { type: String },
    status: {
      type: String,
      enum: ['upcoming', 'past', 'cancelled'],
      default: 'upcoming'
    },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Event = mongoose.model<IEvent>('Event', EventSchema);
