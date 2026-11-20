import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/dashboard-stats', requireAuth, adminController.getDashboardStats);

export default router;
