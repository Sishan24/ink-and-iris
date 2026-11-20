import { Router } from 'express';
import { journalController } from '../controllers/journalController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Public
router.get('/', journalController.getAllPosts);
router.get('/:slug', journalController.getPostBySlug);

// Admin
router.post('/', requireAuth, journalController.createPost);
router.put('/:id', requireAuth, journalController.updatePost);
router.delete('/:id', requireAuth, journalController.deletePost);

export default router;
