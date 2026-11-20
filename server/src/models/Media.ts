import mongoose, { Document, Schema } from 'mongoose';

export interface IMedia extends Document {
  url: string;
  publicId?: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  folder?: string;
  isCloudinary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    url: { type: String, required: true },
    publicId: { type: String },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
    folder: { type: String, default: 'general' },
    isCloudinary: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Media = mongoose.model<IMedia>('Media', MediaSchema);
