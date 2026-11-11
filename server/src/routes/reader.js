import { Router } from 'express';
import { Book } from '../models/Book.js';
import { Character } from '../models/Character.js';
import { User } from '../models/User.js';
import { asyncHandler, HttpError } from '../utils/http.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get(
  '/dashboard',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
      .populate({ path: 'booksExplored', match: { isPublished: true }, select: 'title slug coverImage tagline' })
      .populate({ path: 'favouriteCharacters', match: { isPublished: true }, select: 'name slug portrait' });
    res.json({
      booksExplored: user.booksExplored,
      favouriteCharacters: user.favouriteCharacters,
      memberSince: user.createdAt,
    });
  })
);

router.post(
  '/explored/:slug',
  asyncHandler(async (req, res) => {
    const book = await Book.findOne({ slug: req.params.slug, isPublished: true }).select('_id');
    if (!book) throw new HttpError(404, 'We could not find that book.');
    await User.updateOne({ _id: req.user._id }, { $addToSet: { booksExplored: book._id } });
    res.json({ ok: true });
  })
);

router.get(
  '/favourites',
  asyncHandler(async (req, res) => {
    res.json({ ids: req.user.favouriteCharacters.map(String) });
  })
);

router.post(
  '/favourites/:slug',
  asyncHandler(async (req, res) => {
    const c = await Character.findOne({ slug: req.params.slug, isPublished: true }).select('_id');
    if (!c) throw new HttpError(404, 'We could not find that character.');
    const has = req.user.favouriteCharacters.some((id) => id.equals(c._id));
    await User.updateOne(
      { _id: req.user._id },
      has ? { $pull: { favouriteCharacters: c._id } } : { $addToSet: { favouriteCharacters: c._id } }
    );
    res.json({ favourite: !has });
  })
);

export default router;
