import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import prisma from '../src/services/prisma.js';

vi.mock('../src/services/prisma.js', () => {
  return {
    default: {
      user: {
        findUnique: vi.fn(),
      },
      post: {
        findMany: vi.fn(),
      },
    },
  };
});

describe('Users API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/users/:id', () => {
    it('should return user profile without password', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-10',
        name: 'Elena Developer',
        avatar: 'https://avatar.url/elena.png',
        createdAt: new Date(),
        _count: {
          posts: 4,
          comments: 7,
        },
      });

      const res = await request(app).get('/api/users/user-10');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.name).toBe('Elena Developer');
      expect(res.body.data.user.postCount).toBe(4);
      expect(res.body.data.user.commentCount).toBe(7);
      expect(res.body.data.user.password).toBeUndefined();
    });

    it('should return 404 if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app).get('/api/users/non-existent');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('User not found');
    });
  });

  describe('GET /api/users/:id/posts', () => {
    it('should return all posts created by the user', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-10' });
      prisma.post.findMany.mockResolvedValue([
        {
          id: 'post-10',
          title: 'Elena Project',
          content: 'Content here',
          category: 'Projects',
          authorId: 'user-10',
          author: { id: 'user-10', name: 'Elena Developer', avatar: null },
          _count: { comments: 2, likes: 3 },
        },
      ]);

      const res = await request(app).get('/api/users/user-10/posts');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.posts).toHaveLength(1);
      expect(res.body.data.posts[0].likeCount).toBe(3);
      expect(res.body.data.posts[0].commentCount).toBe(2);
    });

    it('should return 404 if user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app).get('/api/users/unknown/posts');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
