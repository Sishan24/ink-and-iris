import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

export const uploadService = {
  isCloudinaryConfigured,

  async uploadFile(filePath: string, folder: string = 'ink-and-iris'): Promise<{
    url: string;
    publicId?: string;
    sizeBytes: number;
    format: string;
    isCloudinary: boolean;
  }> {
    const stats = fs.statSync(filePath);
    const ext = path.extname(filePath).replace('.', '');

    if (isCloudinaryConfigured) {
      try {
        const result = await cloudinary.uploader.upload(filePath, {
          folder,
          resource_type: 'auto'
        });

        // Clean up temp file
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        return {
          url: result.secure_url,
          publicId: result.public_id,
          sizeBytes: result.bytes || stats.size,
          format: result.format || ext,
          isCloudinary: true
        };
      } catch (err) {
        console.warn('Cloudinary upload error, keeping local file:', err);
      }
    }

    // Local file fallback
    const filename = path.basename(filePath);
    const localUrl = `/uploads/${filename}`;

    return {
      url: localUrl,
      sizeBytes: stats.size,
      format: ext,
      isCloudinary: false
    };
  }
};
