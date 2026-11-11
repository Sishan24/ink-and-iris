import { ZodError } from 'zod';
import { env } from '../config/env.js';

export const notFound = (req, res) => res.status(404).json({ message: `No route for ${req.method} ${req.originalUrl}` });

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err instanceof ZodError) {
    const fields = {};
    err.issues.forEach((i) => {
      fields[i.path.join('.') || '_'] = i.message;
    });
    return res.status(400).json({ message: Object.values(fields)[0] || 'Please check the form and try again.', fields });
  }
  if (err?.code === 11000) return res.status(409).json({ message: 'That value is already in use.' });
  if (err?.name === 'CastError') return res.status(400).json({ message: 'That id is not valid.' });
  if (err?.name === 'MulterError') return res.status(400).json({ message: err.message });

  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    message: status >= 500 && env.isProd ? 'Something went wrong on our side. Please try again.' : err.message,
  });
}
