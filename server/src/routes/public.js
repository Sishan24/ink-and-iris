import { Router } from 'express';
import { z } from 'zod';
import { Book } from '../models/Book.js';
import { Character } from '../models/Character.js';
import { Message } from '../models/Message.js';
import { getContent } from '../models/SiteContent.js';
import { asyncHandler, HttpError, escapeRegex } from '../utils/http.js';
import { sendEmail, newMessageEmail } from '../utils/email.js';
import { messageLimiter } from '../middleware/rateLimit.js';
import { env } from '../config/env.js';

const router = Router();

// ---------- Site content ----------
router.get(
  '/content',
  asyncHandler(async (_req, res) => {
    const c = (await getContent()).toObject();
    delete c.contactEmail; // private
    delete c._id;
    delete c.__v;
    res.json({ content: c });
  })
);

// ---------- Books ----------
router.get(
  '/books',
  asyncHandler(async (_req, res) => {
    const books = await Book.find({ isPublished: true }).sort({ order: 1, createdAt: -1 }).select('-__v').lean();
    res.json({ books });
  })
);

router.get(
  '/books/:slug',
  asyncHandler(async (req, res) => {
    const book = await Book.findOne({ slug: req.params.slug, isPublished: true }).select('-__v').lean();
    if (!book) throw new HttpError(404, 'We could not find that book.');
    const [characters, others] = await Promise.all([
      Character.find({ bookIds: book._id, isPublished: true }).sort({ order: 1, name: 1 }).select('name slug portrait about').lean(),
      Book.find({ _id: { $ne: book._id }, isPublished: true })
        .sort({ order: 1, createdAt: -1 })
        .limit(6)
        .select('title slug coverImage tagline')
        .lean(),
    ]);
    res.json({ book, characters, others });
  })
);

// ---------- Characters ----------
router.get(
  '/characters',
  asyncHandler(async (req, res) => {
    const filter = { isPublished: true };
    if (req.query.book) {
      const book = await Book.findOne({ slug: String(req.query.book) }).select('_id');
      filter.bookIds = book ? book._id : null;
    }
    const characters = await Character.find(filter)
      .sort({ order: 1, name: 1 })
      .populate('bookIds', 'title slug')
      .select('name slug portrait about bookIds')
      .lean();
    res.json({ characters });
  })
);

router.get(
  '/characters/:slug',
  asyncHandler(async (req, res) => {
    const character = await Character.findOne({ slug: req.params.slug, isPublished: true })
      .populate('bookIds', 'title slug coverImage')
      .populate({ path: 'relatedCharacters', match: { isPublished: true }, select: 'name slug portrait' })
      .select('-__v')
      .lean();
    if (!character) throw new HttpError(404, 'We could not find that character.');
    res.json({ character });
  })
);

// ---------- Search ----------
router.get(
  '/search',
  asyncHandler(async (req, res) => {
    const q = String(req.query.q || '').trim().slice(0, 60);
    if (q.length < 2) return res.json({ books: [], characters: [] });
    const rx = new RegExp(escapeRegex(q), 'i');
    const [books, characters] = await Promise.all([
      Book.find({ isPublished: true, $or: [{ title: rx }, { tagline: rx }, { synopsis: rx }] }).limit(5).select('title slug coverImage').lean(),
      Character.find({ isPublished: true, $or: [{ name: rx }, { about: rx }] }).limit(5).select('name slug portrait').lean(),
    ]);
    res.json({ books, characters });
  })
);

// ---------- Speak to the Author ----------
const messageSchema = z.object({
  name: z.string().trim().min(1, 'Please tell us your name.').max(100),
  email: z.string().trim().toLowerCase().email('Enter a valid email address.'),
  subject: z.string().trim().min(1, 'Please add a subject.').max(150),
  message: z.string().trim().min(10, 'Your message is a little short. Please write at least a sentence.').max(5000),
  website: z.string().optional(), // honeypot: real visitors never fill this in
});

router.post(
  '/messages',
  messageLimiter,
  asyncHandler(async (req, res) => {
    const data = messageSchema.parse(req.body);
    const ok = { message: 'Thank you. Your message has been sent to the author.' };
    if (data.website) return res.json(ok); // bot: pretend success, store nothing

    const saved = await Message.create({ ...data, ip: req.ip });
    try {
      const content = await getContent();
      const to = content.contactEmail || env.authorNotifyEmail;
      if (to) await sendEmail({ to, replyTo: saved.email, ...newMessageEmail(saved) });
    } catch (e) {
      console.error('Author notification failed (message is still saved):', e.message);
    }
    res.status(201).json(ok);
  })
);

export default router;
