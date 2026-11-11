import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from './config/env.js';
import { loadUser } from './middleware/auth.js';
import { globalLimiter } from './middleware/rateLimit.js';
import { notFound, errorHandler } from './middleware/error.js';
import authRoutes from './routes/auth.js';
import publicRoutes from './routes/public.js';
import readerRoutes from './routes/reader.js';
import adminRoutes from './routes/admin.js';

const app = express();

app.set('trust proxy', 1); // behind Render's / Vercel's proxy
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());
if (!env.isProd) app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api', globalLimiter, loadUser);
app.use('/api/auth', authRoutes);
app.use('/api/reader', readerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', publicRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
