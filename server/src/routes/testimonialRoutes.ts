import { Router } from 'express';
import { testimonialController } from '../controllers/testimonialController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Public
router.get('/public', testimonialController.getPublicTestimonials);

// Admin
router.get('/', requireAuth, testimonialController.getAllTestimonials);
router.post('/', requireAuth, testimonialController.createTestimonial);
router.put('/:id', requireAuth, testimonialController.updateTestimonial);
router.delete('/:id', requireAuth, testimonialController.deleteTestimonial);

export default router;
