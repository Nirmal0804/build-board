import { Router } from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/postController.js';
import {
  getCommentsByPost,
  createComment,
} from '../controllers/commentController.js';
import { likePost, unlikePost } from '../controllers/likeController.js';
import { requireAuth, optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Post CRUD
router.get('/', optionalAuth, getPosts);
router.get('/:id', optionalAuth, getPostById);
router.post('/', requireAuth, createPost);
router.put('/:id', requireAuth, updatePost);
router.delete('/:id', requireAuth, deletePost);

// Comments nested under post
router.get('/:id/comments', getCommentsByPost);
router.post('/:id/comments', requireAuth, createComment);

// Likes nested under post
router.post('/:id/like', requireAuth, likePost);
router.delete('/:id/like', requireAuth, unlikePost);

export default router;
