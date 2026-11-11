import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { HttpError } from '../utils/http.js';

export const COOKIE = 'gg_session';

export function setSession(res, user) {
  const days = user.role === 'admin' ? 1 : 7; // admins sign in again every day
  const token = jwt.sign({ sub: user.id }, env.jwtSecret, { expiresIn: `${days}d` });
  res.cookie(COOKIE, token, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: 'lax',
    maxAge: days * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

export const clearSession = (res) => res.clearCookie(COOKIE, { path: '/' });

/** Attaches req.user when a valid session cookie is present. Never blocks. */
export async function loadUser(req, _res, next) {
  const token = req.cookies?.[COOKIE];
  if (token) {
    try {
      const { sub } = jwt.verify(token, env.jwtSecret);
      const user = await User.findById(sub);
      if (user && user.isVerified && user.status === 'active') req.user = user;
    } catch {
      /* invalid or expired token: treat as signed out */
    }
  }
  next();
}

export const requireAuth = (req, _res, next) =>
  req.user ? next() : next(new HttpError(401, 'Please sign in to continue.'));

export const requireAdmin = (req, _res, next) => {
  if (!req.user) return next(new HttpError(401, 'Please sign in to continue.'));
  if (req.user.role !== 'admin') return next(new HttpError(403, 'This area is only for the site administrator.'));
  next();
};
