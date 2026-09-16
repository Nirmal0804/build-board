import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import prisma from '../src/services/prisma.js';

vi.mock('../src/services/prisma.js', () => {
  return {
    default: {
      post: {
        findUnique: vi.fn(),
      },
      like: {
        findUnique: vi.fn(),
        create: vi.fn(),
        delete: vi.fn(),
        count: vi.fn(),
      },
    },
  };
});

const JWT_SECRET = process.env.JWT_SECRET || 'buildboard_dev_jwt_secret_key_1234567890';

const createTestToken = (user = { id: 'user-123', email: 'test@example.com', name: 'Test User' }) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
};

describe('Likes API', () => {
  const token = createTestToken();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/posts/:id/like', () => {
    it('should allow authenticated user to like a post', async () => {
      prisma.post.findUnique.mockResolvedValue({ id: 'post-1' });
      prisma.like.findUnique.mockResolvedValue(null);
      prisma.like.create.mockResolvedValue({ id: 'like-1', userId: 'user-123', postId: 'post-1' });
      prisma.like.count.mockResolvedValue(1);

      const res = await request(app)
        .post('/api/posts/post-1/like')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.liked).toBe(true);
      expect(res.body.data.likeCount).toBe(1);
    });

    it('should reject unauthenticated like request with 401', async () => {
      const res = await request(app).post('/api/posts/post-1/like');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 404 if post does not exist', async () => {
      prisma.post.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/posts/non-existent/like')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/posts/:id/like', () => {
    it('should allow authenticated user to unlike a post', async () => {
      prisma.post.findUnique.mockResolvedValue({ id: 'post-1' });
      prisma.like.findUnique.mockResolvedValue({ id: 'like-1', userId: 'user-123', postId: 'post-1' });
      prisma.like.delete.mockResolvedValue({ id: 'like-1' });
      prisma.like.count.mockResolvedValue(0);

      const res = await request(app)
        .delete('/api/posts/post-1/like')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.liked).toBe(false);
      expect(res.body.data.likeCount).toBe(0);
    });
  });
});
