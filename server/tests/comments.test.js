import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import prisma from '../src/services/prisma.js';

vi.mock('../src/services/prisma.js', () => {
  return {
    default: {
      user: {
        findUnique: vi.fn(),
      },
      post: {
        findUnique: vi.fn(),
      },
      comment: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        delete: vi.fn(),
      },
    },
  };
});

const JWT_SECRET = process.env.JWT_SECRET || 'buildboard_dev_jwt_secret_key_1234567890';

const createTestToken = (user = { id: 'user-123', email: 'test@example.com', name: 'Test User' }) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
};

describe('Comments API', () => {
  const token = createTestToken();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/posts/:id/comments', () => {
    it('should return comments for a post', async () => {
      prisma.post.findUnique.mockResolvedValue({ id: 'post-1' });
      prisma.comment.findMany.mockResolvedValue([
        {
          id: 'comment-1',
          content: 'Insightful guide!',
          postId: 'post-1',
          authorId: 'user-2',
          createdAt: new Date(),
          author: { id: 'user-2', name: 'Commenter', avatar: null },
        },
      ]);

      const res = await request(app).get('/api/posts/post-1/comments');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.comments).toHaveLength(1);
      expect(res.body.data.comments[0].content).toBe('Insightful guide!');
    });

    it('should return 404 if post does not exist', async () => {
      prisma.post.findUnique.mockResolvedValue(null);

      const res = await request(app).get('/api/posts/non-existent/comments');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/posts/:id/comments', () => {
    it('should allow authenticated user to add a comment', async () => {
      prisma.post.findUnique.mockResolvedValue({ id: 'post-1' });
      prisma.comment.create.mockResolvedValue({
        id: 'comment-1',
        content: 'Great insight, thanks for sharing!',
        postId: 'post-1',
        authorId: 'user-123',
        createdAt: new Date(),
        author: { id: 'user-123', name: 'Test User', avatar: null },
      });

      const res = await request(app)
        .post('/api/posts/post-1/comments')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Great insight, thanks for sharing!' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.comment.content).toBe('Great insight, thanks for sharing!');
    });

    it('should reject comment with empty content', async () => {
      const res = await request(app)
        .post('/api/posts/post-1/comments')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: '' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/comments/:id (Authorization)', () => {
    it('should reject delete if user is not comment author (403)', async () => {
      prisma.comment.findUnique.mockResolvedValue({
        id: 'comment-1',
        authorId: 'different-user',
        content: 'Comment text',
      });

      const res = await request(app)
        .delete('/api/comments/comment-1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('permission');
    });

    it('should allow author to delete comment', async () => {
      prisma.comment.findUnique.mockResolvedValue({
        id: 'comment-1',
        authorId: 'user-123',
        content: 'Comment text',
      });
      prisma.comment.delete.mockResolvedValue({ id: 'comment-1' });

      const res = await request(app)
        .delete('/api/comments/comment-1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.message).toBe('Comment deleted successfully');
    });
  });
});
