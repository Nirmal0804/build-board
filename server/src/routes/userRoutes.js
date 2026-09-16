import { Router } from 'express';
import { getUserProfile, getUserPosts } from '../controllers/userController.js';

const router = Router();

router.get('/:id', getUserProfile);
router.get('/:id/posts', getUserPosts);

export default router;
