import { Router } from 'express';
import { deleteComment } from '../controllers/commentController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Delete a comment
router.delete('/:id', requireAuth, deleteComment);

export default router;
