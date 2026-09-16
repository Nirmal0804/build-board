import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import prisma from '../src/services/prisma.js';

// Mock prisma
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

describe('Authentication API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should successfully register a new user', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 'user-1',
        name: 'Jane Doe',
        email: 'jane@example.com',
        avatar: 'https://avatar.url',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await request(app).post('/api/auth/register').send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('jane@example.com');
      expect(res.body.data.token).toBeDefined();
    });

    it('should reject registration if email already exists', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'existing-id',
        email: 'jane@example.com',
      });

      const res = await request(app).post('/api/auth/register').send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already exists');
    });

    it('should reject registration with invalid email or short password', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Jane Doe',
        email: 'invalid-email',
        password: '123',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const hashedPassword = await bcrypt.hash('secret123', 10);
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-2',
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        avatar: 'https://avatar.url',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await request(app).post('/api/auth/login').send({
        email: 'john@example.com',
        password: 'secret123',
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe('john@example.com');
      // Password must never be returned
      expect(res.body.data.user.password).toBeUndefined();
    });

    it('should reject login with wrong password', async () => {
      const hashedPassword = await bcrypt.hash('correctPassword', 10);
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-2',
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
      });

      const res = await request(app).post('/api/auth/login').send({
        email: 'john@example.com',
        password: 'wrongPassword',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid email or password');
    });

    it('should reject login if user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app).post('/api/auth/login').send({
        email: 'unknown@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user data when authenticated', async () => {
      const token = jwt.sign(
        { id: 'user-me', email: 'me@example.com', name: 'Me Developer' },
        process.env.JWT_SECRET || 'buildboard_dev_jwt_secret_key_1234567890',
        { expiresIn: '1h' }
      );

      prisma.user.findUnique.mockResolvedValue({
        id: 'user-me',
        name: 'Me Developer',
        email: 'me@example.com',
        avatar: 'https://avatar.url/me.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.id).toBe('user-me');
      expect(res.body.data.user.email).toBe('me@example.com');
    });

    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
