import { Router } from 'express';
import { mediaController } from '../controllers/mediaController.js';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.post('/upload', requireAuth, upload.single('file'), mediaController.uploadFile);
router.get('/', requireAuth, mediaController.getAllMedia);
router.delete('/:id', requireAuth, mediaController.deleteMedia);

export default router;
