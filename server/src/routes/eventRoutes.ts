import { Router } from 'express';
import { eventController } from '../controllers/eventController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Public
router.get('/', eventController.getPublicEvents);

// Admin
router.get('/all', requireAuth, eventController.getAllEvents);
router.post('/', requireAuth, eventController.createEvent);
router.put('/:id', requireAuth, eventController.updateEvent);
router.delete('/:id', requireAuth, eventController.deleteEvent);

export default router;
