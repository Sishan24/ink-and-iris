import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPurchaseLink {
  store: string;
  url: string;
}

export interface IExcerpt {
  title: string;
  text: string;
}

export interface IBook extends Document {
  title: string;
  slug: string;
  subtitle?: string;
  coverImage: string;
  galleryImages: string[];
  synopsis: string;
  genre: string;
  themes: string[];
  publicationDate?: Date;
  publisher?: string;
  isbn?: string;
  pageCount?: number;
  status: 'published' | 'coming_soon' | 'work_in_progress' | 'archived';
  purchaseLinks: IPurchaseLink[];
  authorNotes?: string;
  excerpts: IExcerpt[];
  associatedCharacters: Types.ObjectId[];
  featured: boolean;
  readingGuideUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    subtitle: { type: String, trim: true },
    coverImage: { type: String, required: true },
    galleryImages: [{ type: String }],
    synopsis: { type: String, required: true },
    genre: { type: String, required: true },
    themes: [{ type: String }],
    publicationDate: { type: Date },
    publisher: { type: String },
    isbn: { type: String },
    pageCount: { type: Number },
    status: {
      type: String,
      enum: ['published', 'coming_soon', 'work_in_progress', 'archived'],
      default: 'published'
    },
    purchaseLinks: [
      {
        store: { type: String, required: true },
        url: { type: String, required: true }
      }
    ],
    authorNotes: { type: String },
    excerpts: [
      {
        title: { type: String, required: true },
        text: { type: String, required: true }
      }
    ],
    associatedCharacters: [{ type: Schema.Types.ObjectId, ref: 'Character' }],
    featured: { type: Boolean, default: false },
    readingGuideUrl: { type: String }
  },
  { timestamps: true }
);

export const Book = mongoose.model<IBook>('Book', BookSchema);
