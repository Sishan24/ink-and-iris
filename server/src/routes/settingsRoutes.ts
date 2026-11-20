import { Router } from 'express';
import { settingsController } from '../controllers/settingsController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Public
router.get('/', settingsController.getSettings);

// Admin
router.put('/', requireAuth, settingsController.updateSettings);

export default router;
