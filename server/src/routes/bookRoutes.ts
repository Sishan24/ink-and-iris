import { Router } from 'express';
import { bookController } from '../controllers/bookController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Public
router.get('/', bookController.getAllBooks);
router.get('/:slug', bookController.getBookBySlug);

// Admin
router.post('/', requireAuth, bookController.createBook);
router.put('/:id', requireAuth, bookController.updateBook);
router.delete('/:id', requireAuth, bookController.deleteBook);

export default router;
