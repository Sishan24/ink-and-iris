import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({ url: String, publicId: { type: String, default: '' } }, { _id: false });

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    subtitle: { type: String, default: '' },
    tagline: { type: String, default: '' },
    synopsis: { type: String, default: '' },
    coverImage: { type: imageSchema, default: null },
    publisher: { type: String, default: '' },
    publishedOn: { type: String, default: '' }, // free text, e.g. "December 2022"
    isbn: { type: String, default: '' },
    pages: { type: Number, default: null },
    genres: [String],
    themes: [String],
    amazonUrl: { type: String, default: '' },
    otherLinks: [{ _id: false, label: String, url: String }],
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

bookSchema.index({ isPublished: 1, order: 1 });

export const Book = mongoose.model('Book', bookSchema);
