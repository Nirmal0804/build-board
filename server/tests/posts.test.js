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
        create: vi.fn(),
      },
      post: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        count: vi.fn(),
      },
      comment: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        delete: vi.fn(),
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

describe('Posts API', () => {
  const token = createTestToken();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/posts', () => {
    it('should fetch posts list with pagination and formatted counts', async () => {
      prisma.post.count.mockResolvedValue(1);
      prisma.post.findMany.mockResolvedValue([
        {
          id: 'post-1',
          title: 'My First Post',
          content: 'Hello world developer post',
          category: 'Projects',
          authorId: 'user-123',
          createdAt: new Date(),
          author: { id: 'user-123', name: 'Test User', avatar: null },
          _count: { comments: 2, likes: 5 },
          likes: [],
        },
      ]);

      const res = await request(app).get('/api/posts');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.posts).toHaveLength(1);
      expect(res.body.data.posts[0].likeCount).toBe(5);
      expect(res.body.data.posts[0].commentCount).toBe(2);
      expect(res.body.data.pagination.total).toBe(1);
    });
  });

  describe('GET /api/posts/:id', () => {
    it('should fetch individual post with author and comments', async () => {
      prisma.post.findUnique.mockResolvedValue({
        id: 'post-1',
        title: 'My First Post',
        content: 'Hello world developer post',
        category: 'Projects',
        authorId: 'user-123',
        createdAt: new Date(),
        author: { id: 'user-123', name: 'Test User', avatar: null, createdAt: new Date() },
        comments: [],
        _count: { comments: 0, likes: 3 },
        likes: [],
      });

      const res = await request(app).get('/api/posts/post-1');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.post.id).toBe('post-1');
      expect(res.body.data.post.title).toBe('My First Post');
    });

    it('should return 404 if post does not exist', async () => {
      prisma.post.findUnique.mockResolvedValue(null);

      const res = await request(app).get('/api/posts/non-existent');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Post not found');
    });
  });

  describe('POST /api/posts', () => {
    it('should reject unauthenticated post creation with 401', async () => {
      const res = await request(app).post('/api/posts').send({
        title: 'Unauthorized post',
        content: 'Content here',
        category: 'Projects',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should create post successfully when authenticated', async () => {
      prisma.post.create.mockResolvedValue({
        id: 'new-post-1',
        title: 'Brand New Post',
        content: 'Detailed description of my open source project',
        category: 'Projects',
        authorId: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
        author: { id: 'user-123', name: 'Test User', avatar: null },
        _count: { comments: 0, likes: 0 },
      });

      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Brand New Post',
          content: 'Detailed description of my open source project',
          category: 'Projects',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.post.title).toBe('Brand New Post');
      expect(res.body.data.post.likeCount).toBe(0);
    });

    it('should reject invalid post data (empty title, invalid category)', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: '',
          content: 'Some valid content',
          category: 'InvalidCategory',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/posts/:id (Authorization)', () => {
    it('should reject edit if user is not the post owner (403)', async () => {
      prisma.post.findUnique.mockResolvedValue({
        id: 'post-1',
        authorId: 'different-user-id',
        title: 'Original Title',
      });

      const res = await request(app)
        .put('/api/posts/post-1')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Hacked Title',
          content: 'New content here',
          category: 'Projects',
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('permission');
    });

    it('should allow owner to update post successfully', async () => {
      prisma.post.findUnique.mockResolvedValue({
        id: 'post-1',
        authorId: 'user-123',
        title: 'Original Title',
      });
      prisma.post.update.mockResolvedValue({
        id: 'post-1',
        authorId: 'user-123',
        title: 'Updated Title',
        content: 'Updated content',
        category: 'Projects',
        _count: { comments: 0, likes: 2 },
      });

      const res = await request(app)
        .put('/api/posts/post-1')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Title',
          content: 'Updated content',
          category: 'Projects',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.post.title).toBe('Updated Title');
    });
  });

  describe('DELETE /api/posts/:id (Authorization)', () => {
    it('should reject delete if user is not the post owner (403)', async () => {
      prisma.post.findUnique.mockResolvedValue({
        id: 'post-1',
        authorId: 'different-user-id',
        title: 'Original Title',
      });

      const res = await request(app)
        .delete('/api/posts/post-1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('permission');
    });

    it('should allow owner to delete post successfully', async () => {
      prisma.post.findUnique.mockResolvedValue({
        id: 'post-1',
        authorId: 'user-123',
        title: 'Original Title',
      });
      prisma.post.delete.mockResolvedValue({ id: 'post-1' });

      const res = await request(app)
        .delete('/api/posts/post-1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.message).toContain('deleted');
    });
  });
});
