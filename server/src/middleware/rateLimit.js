import rateLimit from 'express-rate-limit';

const make = (windowMs, limit, message, keyGenerator) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    ...(keyGenerator ? { keyGenerator } : {}),
    message: { message },
  });

export const globalLimiter = make(15 * 60 * 1000, 600, 'Too many requests. Please slow down and try again shortly.');

// Asking for codes: 5 per 15 minutes per email address and IP (stops code-bombing a mailbox)
export const otpRequestLimiter = make(
  15 * 60 * 1000,
  5,
  'Too many code requests. Please wait a few minutes before trying again.',
  (req) => `${req.ip}:${String(req.body?.email || '').toLowerCase()}`
);

// Guessing codes: 10 per 15 minutes per email address and IP
export const otpVerifyLimiter = make(
  15 * 60 * 1000,
  10,
  'Too many attempts. Please request a new code in a few minutes.',
  (req) => `${req.ip}:${String(req.body?.email || '').toLowerCase()}`
);

export const messageLimiter = make(60 * 60 * 1000, 5, 'You have sent several messages recently. Please try again later.');
