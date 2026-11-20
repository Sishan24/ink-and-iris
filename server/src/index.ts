import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import characterRoutes from './routes/characterRoutes.js';
import journalRoutes from './routes/journalRoutes.js';
import letterRoutes from './routes/letterRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database (with memory-server auto-fallback if needed)
await connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static local uploads serving
const uploadsDir = path.resolve(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Ink & Iris Literary API',
    author: 'Ms. Jaya Roy Chowdhury',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/letters', letterRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin', adminRoutes);

// Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`
  ═══════════════════════════════════════════════════════
       ✦ INK & IRIS — DIGITAL LITERARY UNIVERSE ✦
       Author: Ms. Jaya Roy Chowdhury
       Backend server running on http://localhost:${PORT}
  ═══════════════════════════════════════════════════════
  `);
});

export default app;
