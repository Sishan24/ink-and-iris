import { Router } from 'express';
import { letterController } from '../controllers/letterController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Public
router.post('/', letterController.submitLetter);
router.get('/public', letterController.getPublicLetters);

// Admin
router.get('/', requireAuth, letterController.getAllLetters);
router.put('/:id/status', requireAuth, letterController.updateLetterStatus);
router.post('/:id/reply', requireAuth, letterController.replyToLetter);
router.delete('/:id', requireAuth, letterController.deleteLetter);

export default router;
