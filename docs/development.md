# Development Guide

This guide covers local development setup, environment variables, database management, running tests, and common developer workflows for BuildBoard.

---

## Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/) (version 18+ or 20+ recommended)
- [npm](https://www.npmjs.com/) (version 9+ or 10+)
- [PostgreSQL](https://www.postgresql.org/) (local service or hosted instance like Supabase / Neon / Docker)

---

## 1. Getting Started

### Clone and Install

Clone your fork of the repository and install all monorepo dependencies from the root:

```bash
# Clone repository
git clone https://github.com/your-username/buildboard.git
cd buildboard

# Install root & workspace dependencies
npm install
```

---

## 2. Environment Configuration

Copy the example environment files for both server and client:

### Backend (`server/.env`)

```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your local database URL and preferred port:

```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/buildboard?schema=public"
JWT_SECRET="buildboard_dev_jwt_secret_key_1234567890"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
```

### Frontend (`client/.env`)

```bash
cd ../client
cp .env.example .env
```

Default content:
```env
VITE_API_URL="http://localhost:5000/api"
```

---

## 3. Database Setup & Seeding

From the `server` directory:

```bash
cd server

# Apply Prisma migrations
npx prisma migrate dev --name init

# Generate the Prisma client
npx prisma generate

# Populate the database with realistic seed data
npx prisma db seed
```

### Seed User Accounts

The seed script creates 5 developer accounts with the password `password123`:

| Name | Email | Default Password |
|------|-------|------------------|
| Alex Rivera | `alex@example.com` | `password123` |
| Sarah Chen | `sarah@example.com` | `password123` |
| Marcus Vance | `marcus@example.com` | `password123` |
| Elena Rostova | `elena@example.com` | `password123` |
| Devon Patel | `devon@example.com` | `password123` |

---

## 4. Running the Application Locally

You can run both client and server simultaneously using workspace scripts:

### From the Root Directory

```bash
# Start backend server
npm run dev:server

# In a second terminal, start frontend client
npm run dev:client
```

- **Frontend application**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **API Health check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 5. Running Tests

BuildBoard uses [Vitest](https://vitest.dev/) for both frontend and backend testing.

```bash
# Run all tests across the monorepo
npm test

# Run frontend tests only
npm run test:client

# Run backend tests only
npm run test:server
```

---

## 6. Code Quality & Linting

We enforce clean, readable JavaScript using ESLint:

```bash
# Run linter across all workspaces
npm run lint
```

---

## 7. Production Build

To test whether the frontend compiles cleanly for production:

```bash
npm run build
```
