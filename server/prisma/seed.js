import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding BuildBoard database...');

  // Clean existing records in reverse order of dependencies
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const defaultPassword = await bcrypt.hash('password123', 10);

  // 1. Seed Users (5 users)
  console.log('Creating users...');
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Alex Rivera',
        email: 'alex@example.com',
        password: defaultPassword,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Sarah Chen',
        email: 'sarah@example.com',
        password: defaultPassword,
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Marcus Vance',
        email: 'marcus@example.com',
        password: defaultPassword,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Elena Rostova',
        email: 'elena@example.com',
        password: defaultPassword,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Devon Patel',
        email: 'devon@example.com',
        password: defaultPassword,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      },
    }),
  ]);

  const [alex, sarah, marcus, elena, devon] = users;

  // 2. Seed Posts (12 posts across all 4 categories)
  console.log('Creating posts...');
  const posts = await Promise.all([
    // Projects
    prisma.post.create({
      data: {
        title: 'I built my first React dashboard with real-time GitHub metrics',
        content:
          'Over the past two weekends, I built a personal analytics dashboard that pulls commit statistics and pull request activity directly from the GitHub REST API. I focused on zero-dependency CSS layout with CSS grid and lightweight charts using SVG primitives. Would love feedback on accessibility and responsive mobile views!',
        category: 'Projects',
        authorId: alex.id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'DevPulse: An open-source CLI for monitoring local Docker containers',
        content:
          'Tired of switching between Docker Desktop and terminal windows, I created DevPulse, a fast terminal UI built with Node.js and Ink. It displays real-time CPU, RAM, and log streams for running containers. Check it out and let me know what integrations you would like to see next!',
        category: 'Projects',
        authorId: marcus.id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Showcase: Minimalist markdown note-taker with offline sync',
        content:
          'Just released v1.0 of Notesync! Built using React, IndexedDB for offline persistence, and Web Workers to parse complex markdown previews without blocking the main UI thread. Would appreciate thoughts on conflict resolution strategies when syncing across multiple devices.',
        category: 'Projects',
        authorId: elena.id,
      },
    }),

    // Help
    prisma.post.create({
      data: {
        title: 'How should I structure my Express API for large scale?',
        content:
          'Our team is transitioning our prototype Express backend to a production service. Currently, routes and query logic are combined in controllers. What is the community consensus on splitting services vs repositories in pure JavaScript projects without overcomplicating things for newcomers?',
        category: 'Help',
        authorId: sarah.id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Troubleshooting CORS issues with cookies across subdomains in Vite + Express',
        content:
          'I am encountering intermittent "credentials flag is true but Access-Control-Allow-Credentials is missing" errors in Chrome when testing locally between localhost:5173 and localhost:5000. Here are my CORS options: { origin: true, credentials: true }. Any suggestions on cookie SameSite configurations?',
        category: 'Help',
        authorId: devon.id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Database connection pooling best practices with PostgreSQL and Prisma',
        content:
          'We are noticing our database max_connections limit getting hit during spike traffic on serverless environments. Does configuring pgBouncer or connection_limit in the DATABASE_URL query string make a tangible difference in latency for read-heavy workloads?',
        category: 'Help',
        authorId: alex.id,
      },
    }),

    // Learning
    prisma.post.create({
      data: {
        title: 'Best resources for mastering SQL joins and index optimization in 2025',
        content:
          'I compiled my top 5 free interactive resources that took me from basic SELECT statements to understanding EXPLAIN ANALYZE, B-Tree indices, and window functions. Here are the links, interactive sandboxes, and books that gave me the "aha" moment.',
        category: 'Learning',
        authorId: elena.id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'How I deployed my first full-stack application on Ubuntu VPS from scratch',
        content:
          'A comprehensive step-by-step walkthrough covering SSH key generation, UFW firewall configuration, setting up systemd service units for Node.js, NGINX reverse proxy with SSL certificate via Let’s Encrypt, and automated GitHub Action deployment hooks.',
        category: 'Learning',
        authorId: marcus.id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Demystifying React 19 Actions and Optimistic UI updates',
        content:
          'A deep dive into how useActionState and useOptimistic work under the hood without external state management libraries. Includes an interactive code example comparing traditional useState + useEffect handling versus native form actions.',
        category: 'Learning',
        authorId: sarah.id,
      },
    }),

    // Opportunities
    prisma.post.create({
      data: {
        title: 'Looking for teammates for the upcoming Global AI Open Source Hackathon',
        content:
          'We have a team of two (one backend/infra developer and one frontend designer) and we are looking for another developer with experience in vector databases or API integrations to join us for the 48-hour virtual hackathon next weekend. Let us connect!',
        category: 'Opportunities',
        authorId: devon.id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Open Source Mentorship Program: Call for Mentees & First-time Contributors',
        content:
          'Our open-source developer tooling organization is hosting a 4-week structured mentorship program starting next month. If you have been looking for guided help to make your first meaningful pull request in Node.js or React, apply today!',
        category: 'Opportunities',
        authorId: alex.id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Summer of Code project ideas list announced — call for contributors',
        content:
          'We just published our list of 10 community-vetted beginner and intermediate project proposals for Summer of Code. Review the issue tracker, introduce yourself in the discussion threads, and start collaborating on proposals.',
        category: 'Opportunities',
        authorId: elena.id,
      },
    }),
  ]);

  // 3. Seed Comments (15 comments)
  console.log('Creating comments...');
  await Promise.all([
    prisma.comment.create({
      data: {
        content: 'Awesome work Alex! The charts look super crisp and loading time is virtually instant.',
        authorId: sarah.id,
        postId: posts[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Did you consider adding dark mode toggle? That would be really handy for late night tracking.',
        authorId: marcus.id,
        postId: posts[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Terminal UIs with Ink are so enjoyable to build. Starred the repo!',
        authorId: devon.id,
        postId: posts[1].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'In our team, separating a service layer between controllers and database models worked wonders.',
        authorId: marcus.id,
        postId: posts[3].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Keep controllers purely responsible for HTTP parsing and status codes. Business logic belongs in services.',
        authorId: elena.id,
        postId: posts[3].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Make sure your Access-Control-Allow-Origin is not set to "*" when credentials are true.',
        authorId: sarah.id,
        postId: posts[4].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Use Prisma connection pooling URL format with PgBouncer if running serverless. It fixes connection exhaustion.',
        authorId: marcus.id,
        postId: posts[5].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Bookmarking this list! The SQL window functions tutorial was exactly what I needed.',
        authorId: alex.id,
        postId: posts[6].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Great guide Marcus! Setting up systemd units properly saved my sanity multiple times.',
        authorId: devon.id,
        postId: posts[7].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Very clear explanation of optimistic UI. Excited to try this in my next project.',
        authorId: alex.id,
        postId: posts[8].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'I would love to join your hackathon team! I have built several projects with pgvector.',
        authorId: sarah.id,
        postId: posts[9].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Sent you a message with my GitHub profile. Let us make this happen!',
        authorId: elena.id,
        postId: posts[9].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'This mentorship program sounds fantastic for someone like me looking to learn real CI workflows.',
        authorId: devon.id,
        postId: posts[10].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'I will be reviewing the proposal ideas this evening. Thanks for organizing this!',
        authorId: marcus.id,
        postId: posts[11].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Count me in for the Summer of Code discussions!',
        authorId: alex.id,
        postId: posts[11].id,
      },
    }),
  ]);

  // 4. Seed Likes (realistic likes distribution)
  console.log('Creating likes...');
  await Promise.all([
    prisma.like.create({ data: { userId: sarah.id, postId: posts[0].id } }),
    prisma.like.create({ data: { userId: marcus.id, postId: posts[0].id } }),
    prisma.like.create({ data: { userId: elena.id, postId: posts[0].id } }),
    prisma.like.create({ data: { userId: alex.id, postId: posts[1].id } }),
    prisma.like.create({ data: { userId: devon.id, postId: posts[1].id } }),
    prisma.like.create({ data: { userId: sarah.id, postId: posts[2].id } }),
    prisma.like.create({ data: { userId: elena.id, postId: posts[3].id } }),
    prisma.like.create({ data: { userId: alex.id, postId: posts[3].id } }),
    prisma.like.create({ data: { userId: marcus.id, postId: posts[4].id } }),
    prisma.like.create({ data: { userId: devon.id, postId: posts[5].id } }),
    prisma.like.create({ data: { userId: alex.id, postId: posts[6].id } }),
    prisma.like.create({ data: { userId: sarah.id, postId: posts[6].id } }),
    prisma.like.create({ data: { userId: devon.id, postId: posts[7].id } }),
    prisma.like.create({ data: { userId: elena.id, postId: posts[8].id } }),
    prisma.like.create({ data: { userId: sarah.id, postId: posts[9].id } }),
    prisma.like.create({ data: { userId: alex.id, postId: posts[9].id } }),
    prisma.like.create({ data: { userId: marcus.id, postId: posts[10].id } }),
    prisma.like.create({ data: { userId: devon.id, postId: posts[11].id } }),
  ]);

  console.log('✅ Database seeded successfully!');
  console.log('Test accounts (password: password123):');
  console.log(' - alex@example.com');
  console.log(' - sarah@example.com');
  console.log(' - marcus@example.com');
  console.log(' - elena@example.com');
  console.log(' - devon@example.com');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
