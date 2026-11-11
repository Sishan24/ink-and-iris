import 'dotenv/config';

const isProd = process.env.NODE_ENV === 'production';

function need(key, devFallback) {
  const value = process.env[key];
  if (value) return value;
  if (isProd) throw new Error(`Missing required environment variable: ${key}`);
  return devFallback;
}

export const env = {
  isProd,
  port: Number(process.env.PORT) || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: need('MONGODB_URI', 'mongodb://127.0.0.1:27017/golden-glades'),
  jwtSecret: need('JWT_SECRET', 'dev-only-secret-do-not-use-in-production'),
  adminEmail: (process.env.ADMIN_EMAIL || '').trim().toLowerCase(),
  adminName: process.env.ADMIN_NAME || 'Jaya Roy Chowdhury',
  authorNotifyEmail: (process.env.AUTHOR_NOTIFY_EMAIL || process.env.ADMIN_EMAIL || '').trim(),
  resendKey: process.env.RESEND_API_KEY || '',
  emailFrom: process.env.EMAIL_FROM || 'Through the Golden Glades <onboarding@resend.dev>',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
};
