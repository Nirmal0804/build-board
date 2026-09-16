# BuildBoard

> **Build. Share. Learn.**

BuildBoard is an open-source community platform for developers to discover community posts, share projects, ask technical questions, discover opportunities, and learn together.

Designed with a clean, beginner-friendly architecture, BuildBoard welcomes contributions from first-time open-source contributors through GitHub Issues and Pull Requests.

---

## Features

- **Community Discussions**: Discover posts shared by developers worldwide.
- **Categorized Feed**: Filter discussions by **Projects**, **Help**, **Learning**, and **Opportunities**.
- **Post Search**: Instant search by post title combined with category filtering.
- **User Authentication**: Secure JWT-based registration and login with bcrypt password hashing.
- **Full CRUD for Posts**: Create, read, edit, and delete discussions with ownership protection.
- **Interactive Discussions**: Add comments and join conversations.
- **Like Interactions**: Show appreciation for insightful community posts.
- **User Profiles**: View author bios, join dates, and published posts.
- **Accessible & Responsive UI**: Clean, modern interface supporting mobile, tablet, and desktop screens.

---

## Tech Stack

### Frontend
- **React 18** — Component-driven UI library
- **Vite** — Fast frontend build tool and dev server
- **React Router v6** — Client-side routing
- **Vanilla CSS** — Custom design system without heavy framework overhead
- **Axios** — HTTP client with interceptors for auth tokens and error formatting
- **Vitest & React Testing Library** — Component and integration testing

### Backend
- **Node.js & Express.js** — Fast, unopinionated REST API
- **Prisma ORM** — Modern database toolkit and migrations
- **PostgreSQL** — Relational database
- **JSON Web Tokens (JWT)** — Stateless authentication
- **bcryptjs** — Secure password hashing
- **Supertest & Vitest** — API endpoint integration testing

### Quality & Tooling
- **ESLint** — Code style and error linting
- **GitHub Actions** — Continuous Integration for testing, linting, and building

---

## Project Structure

```
buildboard/
├── client/                 # React frontend
│   ├── public/             # Static public assets
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, PostCard, Modal, etc.)
│   │   ├── context/        # Global AuthContext provider
│   │   ├── hooks/          # Custom hooks (useAuth)
│   │   ├── pages/          # Page routes (Home, Explore, PostDetail, Profile, etc.)
│   │   ├── services/       # Axios API client and domain services
│   │   ├── utils/          # Helpers (formatDate, constants)
│   │   ├── App.jsx         # App router & layout
│   │   ├── main.jsx        # React DOM entry point
│   │   └── index.css       # Design tokens & responsive styles
│   ├── tests/              # Frontend component test suites
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Express backend REST API
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema definitions
│   │   └── seed.js         # Realistic developer seed data
│   ├── src/
│   │   ├── controllers/    # Request handlers for auth, posts, comments, likes, users
│   │   ├── middleware/     # Auth checks, error handling, validation
│   │   ├── routes/         # REST API endpoint definitions
│   │   ├── services/       # Prisma client singleton
│   │   ├── utils/          # Standard response formatters & input validators
│   │   ├── app.js          # Express app configuration
│   │   └── server.js       # Server listener entry point
│   ├── tests/              # Backend integration test suites
│   └── package.json
│
├── .github/
│   ├── ISSUE_TEMPLATE/     # Structured GitHub issue templates
│   ├── workflows/          # CI pipeline definitions
│   ├── pull_request_template.md
│   └── CODEOWNERS
│
├── docs/                   # Extended project documentation
│   ├── architecture.md     # Architecture overview and data-flow diagrams
│   ├── development.md      # Detailed developer setup instructions
│   └── good-first-issues.md # 20 beginner-friendly tasks
│
├── README.md               # Project overview & quickstart
├── CONTRIBUTING.md          # Contribution guidelines
├── CODE_OF_CONDUCT.md     # Contributor covenant
├── LICENSE                 # MIT License
├── CHANGELOG.md            # Release history
├── package.json            # Monorepo workspace configuration
└── .gitignore
```

---

## Getting Started

### Prerequisites
- **Node.js**: v18 or v20+
- **npm**: v9 or v10+
- **PostgreSQL**: Local instance or cloud database URL

### 1. Installation

Clone the repository and install dependencies for all workspaces:

```bash
git clone https://github.com/Nirmal0804/build-board.git
cd build-board
npm install
```

### 2. Environment Variables

Create `.env` files from the provided examples:

```bash
# Server environment variables
cp server/.env.example server/.env

# Client environment variables
cp client/.env.example client/.env
```

**Backend (`server/.env`)**:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/buildboard?schema=public"
JWT_SECRET="super_secret_buildboard_jwt_key_development_only"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
```

**Frontend (`client/.env`)**:
```env
VITE_API_URL="http://localhost:5000/api"
```

### 3. Database Setup & Seeding

Run migrations and populate the database with realistic developer seed posts:

```bash
cd server
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed
cd ..
```

*Default development credentials (password: `password123`):*
- `alex@example.com`
- `sarah@example.com`
- `marcus@example.com`
- `elena@example.com`
- `devon@example.com`

### 4. Running Locally

Start both client and server from the root directory:

```bash
# Terminal 1: Backend server (http://localhost:5000)
npm run dev:server

# Terminal 2: Frontend client (http://localhost:5173)
npm run dev:client
```

---

## Testing & Code Quality

BuildBoard includes automated testing and strict linting across the monorepo:

```bash
# Run all tests (frontend and backend)
npm test

# Run frontend tests
npm run test:client

# Run backend tests
npm run test:server

# Run linter across all workspaces
npm run lint

# Build frontend production bundle
npm run build
```

---

## Good First Issues

Looking to make your first open-source contribution? Check out our curated list of beginner tasks in [docs/good-first-issues.md](docs/good-first-issues.md), including:

- 🎨 **Issue #1**: Add missing favicon
- 🏷️ **Issue #5 & #6**: Add post title and content character counters
- 👁️ **Issue #10**: Add password visibility toggle
- 🗑️ **Issue #12**: Add delete confirmation modal
- 🕒 **Issue #13**: Improve timestamp formatting with relative time
- 🧪 **Issue #17 & #19**: Add validator boundary tests and PostCard tests

---

## Roadmap

- [x] Monorepo structure with React client and Express API
- [x] Prisma database models for User, Post, Comment, Like
- [x] JWT authentication & bcrypt password hashing
- [x] Category filtering and title search
- [x] Full responsive layout for mobile and desktop
- [x] Comprehensive test suites and GitHub Actions CI
- [ ] Relative time formatting (`2 hours ago`)
- [ ] User bookmarking / saving posts
- [ ] Dark mode theme toggle
- [ ] Markdown preview in post content editor

---

## Contributing

Please review [CONTRIBUTING.md](CONTRIBUTING.md) before submitting pull requests. All contributors are expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

---

## License

This project is licensed under the [MIT License](LICENSE).
