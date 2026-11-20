import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITestimonial extends Document {
  quote: string;
  attribution: string;
  source: 'Author' | 'Critic' | 'Publication' | 'Reader';
  bookReferenced?: Types.ObjectId;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    quote: { type: String, required: true },
    attribution: { type: String, required: true, trim: true },
    source: {
      type: String,
      enum: ['Author', 'Critic', 'Publication', 'Reader'],
      default: 'Critic'
    },
    bookReferenced: { type: Schema.Types.ObjectId, ref: 'Book' },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Testimonial = mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
