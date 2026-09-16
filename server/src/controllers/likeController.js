import prisma from '../services/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const likePost = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user.id;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!post) {
      return sendError(res, 'Post not found', 404);
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      const count = await prisma.like.count({ where: { postId } });
      return sendSuccess(res, {
        liked: true,
        likeCount: count,
        message: 'Post is already liked',
      });
    }

    await prisma.like.create({
      data: {
        userId,
        postId,
      },
    });

    const likeCount = await prisma.like.count({ where: { postId } });

    return sendSuccess(res, {
      liked: true,
      likeCount,
    });
  } catch (error) {
    next(error);
  }
};

export const unlikePost = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user.id;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!post) {
      return sendError(res, 'Post not found', 404);
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
    }

    const likeCount = await prisma.like.count({ where: { postId } });

    return sendSuccess(res, {
      liked: false,
      likeCount,
    });
  } catch (error) {
    next(error);
  }
};
