import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({ url: String, publicId: { type: String, default: '' } }, { _id: false });

const characterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    bookIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book', index: true }],
    portrait: { type: imageSchema, default: null },
    about: { type: String, default: '' },
    personality: [String],
    story: { type: String, default: '' },
    relatedCharacters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Character' }],
    isPublished: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Character = mongoose.model('Character', characterSchema);
