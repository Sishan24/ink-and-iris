import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IJournalPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: 'Essays' | 'On Writing' | 'Reflections' | 'Behind the Quill';
  tags: string[];
  readingTimeMinutes: number;
  status: 'draft' | 'published';
  publishedAt?: Date;
  relatedBooks: Types.ObjectId[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const JournalPostSchema = new Schema<IJournalPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    featuredImage: { type: String, required: true },
    category: {
      type: String,
      enum: ['Essays', 'On Writing', 'Reflections', 'Behind the Quill'],
      default: 'Reflections'
    },
    tags: [{ type: String }],
    readingTimeMinutes: { type: Number, default: 5 },
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
    publishedAt: { type: Date, default: Date.now },
    relatedBooks: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
    views: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const JournalPost = mongoose.model<IJournalPost>('JournalPost', JournalPostSchema);
