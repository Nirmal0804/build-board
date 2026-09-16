import prisma from '../services/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { validateCommentInput } from '../utils/validators.js';

export const getCommentsByPost = async (req, res, next) => {
  try {
    const { id: postId } = req.params;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!post) {
      return sendError(res, 'Post not found', 404);
    }

    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return sendSuccess(res, { comments });
  } catch (error) {
    next(error);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const { content } = req.body;

    const validationErrors = validateCommentInput({ content });
    if (validationErrors.length > 0) {
      return sendError(res, validationErrors[0], 400);
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!post) {
      return sendError(res, 'Post not found', 404);
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        postId,
        authorId: req.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return sendSuccess(res, { comment }, 201);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return sendError(res, 'Comment not found', 404);
    }

    // Ownership check: only comment author can delete
    if (comment.authorId !== req.user.id) {
      return sendError(res, 'You do not have permission to delete this comment', 403);
    }

    await prisma.comment.delete({
      where: { id },
    });

    return sendSuccess(res, { message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};
