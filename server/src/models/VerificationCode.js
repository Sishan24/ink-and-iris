import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  codeHash: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

// MongoDB removes the document automatically once expiresAt has passed
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const VerificationCode = mongoose.model('VerificationCode', schema);
