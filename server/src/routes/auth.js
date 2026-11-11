import { Router } from 'express';
import { z } from 'zod';
import { User, publicUser } from '../models/User.js';
import { issueCode, consumeCode } from '../utils/otp.js';
import { asyncHandler, HttpError } from '../utils/http.js';
import { setSession, clearSession, requireAuth } from '../middleware/auth.js';
import { otpRequestLimiter, otpVerifyLimiter } from '../middleware/rateLimit.js';
import { env } from '../config/env.js';

const router = Router();
const email = z.string().trim().toLowerCase().email('Enter a valid email address.').max(200);

const registerSchema = z.object({ name: z.string().trim().min(2, 'Enter your full name.').max(100), email });
const loginSchema = z.object({ email });
const verifySchema = z.object({ email, code: z.string().trim().regex(/^\d{6}$/, 'Enter the 6-digit code.') });

const SENT = { message: 'If that address can receive a code, one is on its way.' };

// Start registration: store a pending (unverified) reader and email a code
router.post(
  '/register',
  otpRequestLimiter,
  asyncHandler(async (req, res) => {
    const { name, email: addr } = registerSchema.parse(req.body);
    let user = await User.findOne({ email: addr });
    if (!user) user = await User.create({ name, email: addr });
    else if (!user.isVerified) {
      user.name = name;
      await user.save();
    }
    // Already-verified addresses simply receive a sign-in code (never reveals who is registered)
    if (user.status === 'active') await issueCode(addr, user.name);
    res.json(SENT);
  })
);

// Sign in: email a code to an existing, verified reader
router.post(
  '/login',
  otpRequestLimiter,
  asyncHandler(async (req, res) => {
    const { email: addr } = loginSchema.parse(req.body);
    const user = await User.findOne({ email: addr });
    // Admin account can be created on first sign-in by the configured admin email
    if (user && user.status === 'active') await issueCode(addr, user.name);
    else if (!user && env.adminEmail && addr === env.adminEmail) {
      await User.create({ name: env.adminName, email: addr, role: 'admin' });
      await issueCode(addr, env.adminName);
    }
    res.json(SENT);
  })
);

// Verify a code (used by both registration and sign-in) and start a session
router.post(
  '/verify',
  otpVerifyLimiter,
  asyncHandler(async (req, res) => {
    const { email: addr, code } = verifySchema.parse(req.body);
    const user = await User.findOne({ email: addr });
    if (!user || user.status !== 'active') throw new HttpError(400, 'That code is incorrect or has expired. Request a new one and try again.');
    await consumeCode(addr, code);

    user.isVerified = true;
    user.lastLoginAt = new Date();
    if (env.adminEmail && addr === env.adminEmail) user.role = 'admin';
    await user.save();

    setSession(res, user);
    res.json({ user: publicUser(user) });
  })
);

router.post('/logout', (_req, res) => {
  clearSession(res);
  res.json({ message: 'Signed out.' });
});

router.get('/me', (req, res) => res.json({ user: req.user ? publicUser(req.user) : null }));

router.patch(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { name } = z.object({ name: z.string().trim().min(2).max(100) }).parse(req.body);
    req.user.name = name;
    await req.user.save();
    res.json({ user: publicUser(req.user) });
  })
);

router.delete(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    if (req.user.role === 'admin') throw new HttpError(400, 'The administrator account cannot be deleted here.');
    await req.user.deleteOne();
    clearSession(res);
    res.json({ message: 'Your account has been deleted.' });
  })
);

export default router;
