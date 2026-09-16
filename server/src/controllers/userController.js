import prisma from '../services/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
    });

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    return sendSuccess(res, {
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        createdAt: user.createdAt,
        postCount: user._count.posts,
        commentCount: user._count.comments,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserPosts = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    const posts = await prisma.post.findMany({
      where: { authorId: id },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    const formattedPosts = posts.map((post) => ({
      ...post,
      likeCount: post._count.likes,
      commentCount: post._count.comments,
    }));

    return sendSuccess(res, { posts: formattedPosts });
  } catch (error) {
    next(error);
  }
};
