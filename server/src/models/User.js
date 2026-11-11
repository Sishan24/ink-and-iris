import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: { type: String, enum: ['reader', 'admin'], default: 'reader' },
    isVerified: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
    lastLoginAt: Date,
    booksExplored: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    favouriteCharacters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Character' }],
  },
  { timestamps: true }
);

userSchema.index({ role: 1, createdAt: -1 });

export const User = mongoose.model('User', userSchema);

export const publicUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  createdAt: u.createdAt,
});
