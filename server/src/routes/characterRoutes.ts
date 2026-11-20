import { Router } from 'express';
import { characterController } from '../controllers/characterController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Public
router.get('/network', characterController.getRelationshipNetwork);
router.get('/', characterController.getAllCharacters);
router.get('/:slug', characterController.getCharacterBySlug);

// Admin
router.post('/', requireAuth, characterController.createCharacter);
router.put('/:id', requireAuth, characterController.updateCharacter);
router.delete('/:id', requireAuth, characterController.deleteCharacter);

export default router;
