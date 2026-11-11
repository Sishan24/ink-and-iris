import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env.js';
import { HttpError } from './http.js';

const { cloudName, apiKey, apiSecret } = env.cloudinary;
export const cloudinaryReady = Boolean(cloudName && apiKey && apiSecret);
if (cloudinaryReady) cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });

export function uploadImage(buffer, folder) {
  if (!cloudinaryReady) {
    throw new HttpError(503, 'Image uploads are not set up yet. Add the Cloudinary keys to the server .env file.');
  }
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: `golden-glades/${folder}`, resource_type: 'image' }, (err, result) =>
        err ? reject(err) : resolve({ url: result.secure_url, publicId: result.public_id })
      )
      .end(buffer);
  });
}

export async function deleteImage(image) {
  if (!cloudinaryReady || !image?.publicId) return;
  try {
    await cloudinary.uploader.destroy(image.publicId);
  } catch (e) {
    console.warn('Could not delete image', image.publicId, e.message);
  }
}
