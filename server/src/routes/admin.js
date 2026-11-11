import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { Book } from '../models/Book.js';
import { Character } from '../models/Character.js';
import { Message } from '../models/Message.js';
import { User } from '../models/User.js';
import { SiteContent, getContent } from '../models/SiteContent.js';
import { asyncHandler, HttpError, uniqueSlug, escapeRegex } from '../utils/http.js';
import { uploadImage, deleteImage } from '../utils/cloudinary.js';
import { sendEmail, replyEmail } from '../utils/email.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();
router.use(requireAdmin);

// ---------- shared schema pieces ----------
const image = z.object({ url: z.string().url(), publicId: z.string().optional().default('') }).nullable().optional();
const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');
const text = (max, def = '') => z.string().trim().max(max).optional().default(def);
const tags = z.array(z.string().trim().min(1).max(60)).max(15).optional().default([]);
const optUrl = z.union([z.literal(''), z.string().trim().url('Enter a full link starting with https://')]).optional().default('');

const pageParams = (req) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  return { page, limit, skip: (page - 1) * limit };
};

// ---------- Overview ----------
router.get(
  '/stats',
  asyncHandler(async (_req, res) => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const sixMonthsAgo = new Date(startOfMonth);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

    const readerFilter = { role: 'reader', isVerified: true };
    const [totalReaders, newThisMonth, publishedBooks, totalBooks, characters, unreadMessages, monthly, recentMessages] =
      await Promise.all([
        User.countDocuments(readerFilter),
        User.countDocuments({ ...readerFilter, createdAt: { $gte: startOfMonth } }),
        Book.countDocuments({ isPublished: true }),
        Book.countDocuments(),
        Character.countDocuments(),
        Message.countDocuments({ status: 'unread' }),
        User.aggregate([
          { $match: { ...readerFilter, createdAt: { $gte: sixMonthsAgo } } },
          { $group: { _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } }, count: { $sum: 1 } } },
        ]),
        Message.find().sort({ createdAt: -1 }).limit(5).select('name subject status createdAt').lean(),
      ]);

    // Fill every one of the last 6 months, including months with zero sign-ups
    const series = [];
    for (let i = 0; i < 6; i += 1) {
      const d = new Date(sixMonthsAgo);
      d.setMonth(d.getMonth() + i);
      const hit = monthly.find((x) => x._id.y === d.getFullYear() && x._id.m === d.getMonth() + 1);
      series.push({ label: d.toLocaleString('en', { month: 'short' }), year: d.getFullYear(), count: hit?.count || 0 });
    }
    res.json({ totalReaders, newThisMonth, publishedBooks, totalBooks, characters, unreadMessages, series, recentMessages });
  })
);

// ---------- Readers ----------
router.get(
  '/readers',
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = pageParams(req);
    const filter = { role: 'reader' };
    if (req.query.q) {
      const rx = new RegExp(escapeRegex(String(req.query.q).slice(0, 60)), 'i');
      filter.$or = [{ name: rx }, { email: rx }];
    }
    const [total, readers] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).select('name email isVerified status createdAt lastLoginAt').lean(),
    ]);
    res.json({ readers, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
  })
);

router.patch(
  '/readers/:id',
  asyncHandler(async (req, res) => {
    const { status } = z.object({ status: z.enum(['active', 'suspended']) }).parse(req.body);
    const user = await User.findOneAndUpdate({ _id: req.params.id, role: 'reader' }, { status }, { new: true }).select('name email isVerified status createdAt lastLoginAt');
    if (!user) throw new HttpError(404, 'Reader not found.');
    res.json({ reader: user });
  })
);

// ---------- Books ----------
const bookSchema = z.object({
  title: z.string().trim().min(1, 'Add the book title.').max(200),
  subtitle: text(200),
  tagline: text(300),
  synopsis: text(6000),
  coverImage: image,
  publisher: text(120),
  publishedOn: text(60),
  isbn: text(30),
  pages: z.coerce.number().int().min(0).max(5000).nullable().optional(),
  genres: tags,
  themes: tags,
  amazonUrl: optUrl,
  otherLinks: z.array(z.object({ label: z.string().trim().min(1).max(40), url: z.string().trim().url() })).max(8).optional().default([]),
  isPublished: z.boolean().optional().default(false),
  isFeatured: z.boolean().optional().default(false),
  order: z.coerce.number().int().optional().default(0),
});

router.get(
  '/books',
  asyncHandler(async (_req, res) => {
    res.json({ books: await Book.find().sort({ order: 1, createdAt: -1 }).lean() });
  })
);

router.post(
  '/books',
  asyncHandler(async (req, res) => {
    const data = bookSchema.parse(req.body);
    const book = await Book.create({ ...data, slug: await uniqueSlug(Book, data.title) });
    if (book.isFeatured) await Book.updateMany({ _id: { $ne: book._id } }, { isFeatured: false });
    res.status(201).json({ book });
  })
);

router.put(
  '/books/:id',
  asyncHandler(async (req, res) => {
    const data = bookSchema.parse(req.body);
    const book = await Book.findById(req.params.id);
    if (!book) throw new HttpError(404, 'Book not found.');
    if (book.title !== data.title) book.slug = await uniqueSlug(Book, data.title, book._id);
    if (book.coverImage?.publicId && book.coverImage.publicId !== data.coverImage?.publicId) await deleteImage(book.coverImage);
    book.set(data);
    await book.save();
    if (book.isFeatured) await Book.updateMany({ _id: { $ne: book._id } }, { isFeatured: false });
    res.json({ book });
  })
);

router.delete(
  '/books/:id',
  asyncHandler(async (req, res) => {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) throw new HttpError(404, 'Book not found.');
    await Character.updateMany({ bookIds: book._id }, { $pull: { bookIds: book._id } });
    await User.updateMany({}, { $pull: { booksExplored: book._id } });
    await deleteImage(book.coverImage);
    res.json({ message: 'Book deleted.' });
  })
);

// ---------- Characters ----------
const characterSchema = z.object({
  name: z.string().trim().min(1, 'Add the character’s name.').max(120),
  bookIds: z.array(objectId).max(20).optional().default([]),
  portrait: image,
  about: text(3000),
  personality: tags,
  story: text(6000),
  relatedCharacters: z.array(objectId).max(30).optional().default([]),
  isPublished: z.boolean().optional().default(false),
  order: z.coerce.number().int().optional().default(0),
});

router.get(
  '/characters',
  asyncHandler(async (_req, res) => {
    res.json({ characters: await Character.find().sort({ order: 1, name: 1 }).populate('bookIds', 'title slug').lean() });
  })
);

router.post(
  '/characters',
  asyncHandler(async (req, res) => {
    const data = characterSchema.parse(req.body);
    res.status(201).json({ character: await Character.create({ ...data, slug: await uniqueSlug(Character, data.name) }) });
  })
);

router.put(
  '/characters/:id',
  asyncHandler(async (req, res) => {
    const data = characterSchema.parse(req.body);
    const c = await Character.findById(req.params.id);
    if (!c) throw new HttpError(404, 'Character not found.');
    if (c.name !== data.name) c.slug = await uniqueSlug(Character, data.name, c._id);
    if (c.portrait?.publicId && c.portrait.publicId !== data.portrait?.publicId) await deleteImage(c.portrait);
    data.relatedCharacters = data.relatedCharacters.filter((id) => id !== String(c._id));
    c.set(data);
    await c.save();
    res.json({ character: c });
  })
);

router.delete(
  '/characters/:id',
  asyncHandler(async (req, res) => {
    const c = await Character.findByIdAndDelete(req.params.id);
    if (!c) throw new HttpError(404, 'Character not found.');
    await Character.updateMany({ relatedCharacters: c._id }, { $pull: { relatedCharacters: c._id } });
    await User.updateMany({}, { $pull: { favouriteCharacters: c._id } });
    await deleteImage(c.portrait);
    res.json({ message: 'Character deleted.' });
  })
);

// ---------- Messages ----------
router.get(
  '/messages',
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = pageParams(req);
    const filter = {};
    if (['unread', 'read', 'replied', 'archived'].includes(req.query.status)) filter.status = req.query.status;
    else filter.status = { $ne: 'archived' }; // archived messages only appear when asked for
    const [total, messages] = await Promise.all([
      Message.countDocuments(filter),
      Message.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).select('-ip -__v').lean(),
    ]);
    res.json({ messages, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
  })
);

router.patch(
  '/messages/:id',
  asyncHandler(async (req, res) => {
    const { status } = z.object({ status: z.enum(['unread', 'read', 'replied', 'archived']) }).parse(req.body);
    const m = await Message.findByIdAndUpdate(req.params.id, { status }, { new: true }).select('-ip -__v');
    if (!m) throw new HttpError(404, 'Message not found.');
    res.json({ message: m });
  })
);

router.post(
  '/messages/:id/reply',
  asyncHandler(async (req, res) => {
    const { body } = z.object({ body: z.string().trim().min(2, 'Write your reply first.').max(5000) }).parse(req.body);
    const m = await Message.findById(req.params.id);
    if (!m) throw new HttpError(404, 'Message not found.');
    await sendEmail({ to: m.email, ...replyEmail({ name: m.name, body, original: m }) });
    m.status = 'replied';
    m.repliedAt = new Date();
    await m.save();
    res.json({ message: m });
  })
);

router.delete(
  '/messages/:id',
  asyncHandler(async (req, res) => {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted.' });
  })
);

// ---------- Website content ----------
const contentSchema = z.object({
  hero: z.object({ kicker: text(80), title: text(120), tagline: text(200), intro: text(400) }),
  authorNote: z.object({ heading: text(120), body: text(1500) }),
  authorProfile: z.object({
    name: text(120),
    role: text(120),
    statement: text(300),
    bio: text(8000),
    journey: text(8000),
    approach: text(5000),
    photo: image,
    quote: z.object({ text: text(600), attribution: text(120) }),
  }),
  quotes: z.array(z.object({ text: z.string().trim().min(1).max(600), attribution: text(120) })).max(20),
  instagramUrl: optUrl,
  contactEmail: z.union([z.literal(''), z.string().trim().email()]).optional().default(''),
});

router.get(
  '/content',
  asyncHandler(async (_req, res) => {
    res.json({ content: (await getContent()).toObject() });
  })
);

router.put(
  '/content',
  asyncHandler(async (req, res) => {
    const data = contentSchema.parse(req.body);
    const current = await getContent();
    const oldPhoto = current.authorProfile?.photo;
    if (oldPhoto?.publicId && oldPhoto.publicId !== data.authorProfile.photo?.publicId) await deleteImage(oldPhoto);
    const updated = await SiteContent.findOneAndUpdate({ key: 'main' }, { $set: data }, { new: true });
    res.json({ content: updated });
  })
);

// ---------- Image upload ----------
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) =>
    ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)
      ? cb(null, true)
      : cb(new HttpError(400, 'Please upload a JPG, PNG or WebP image.')),
});

router.post(
  '/upload',
  upload.single('image'),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new HttpError(400, 'Choose an image to upload.');
    const folder = ['covers', 'portraits', 'author'].includes(req.body.folder) ? req.body.folder : 'misc';
    res.status(201).json({ image: await uploadImage(req.file.buffer, folder) });
  })
);

export default router;
