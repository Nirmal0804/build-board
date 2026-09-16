import prisma from '../services/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { validatePostInput } from '../utils/validators.js';

export const getPosts = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;

    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNumber - 1) * limitNumber;

    const where = {};

    if (category && category !== 'All') {
      where.category = category;
    }

    if (search && search.trim().length > 0) {
      where.title = {
        contains: search.trim(),
        mode: 'insensitive',
      };
    }

    const [total, posts] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        skip,
        take: limitNumber,
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
          likes: req.user?.id
            ? {
                where: { userId: req.user.id },
                select: { id: true },
              }
            : false,
        },
      }),
    ]);

    const formattedPosts = posts.map((post) => {
      const isLiked = req.user?.id ? Boolean(post.likes && post.likes.length > 0) : false;
      const postData = { ...post };
      delete postData.likes;
      return {
        ...postData,
        likeCount: post._count.likes,
        commentCount: post._count.comments,
        isLiked,
      };
    });

    return sendSuccess(res, {
      posts: formattedPosts,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            createdAt: true,
          },
        },
        comments: {
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
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        likes: req.user?.id
          ? {
              where: { userId: req.user.id },
              select: { id: true },
            }
          : false,
      },
    });

    if (!post) {
      return sendError(res, 'Post not found', 404);
    }

    const isLiked = req.user?.id ? Boolean(post.likes && post.likes.length > 0) : false;
    const postData = { ...post };
    delete postData.likes;

    return sendSuccess(res, {
      post: {
        ...postData,
        likeCount: post._count.likes,
        commentCount: post._count.comments,
        isLiked,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;

    const validationErrors = validatePostInput({ title, content, category });
    if (validationErrors.length > 0) {
      return sendError(res, validationErrors[0], 400);
    }

    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        category,
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
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    return sendSuccess(
      res,
      {
        post: {
          ...post,
          likeCount: 0,
          commentCount: 0,
          isLiked: false,
        },
      },
      201
    );
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return sendError(res, 'Post not found', 404);
    }

    // Ownership check
    if (post.authorId !== req.user.id) {
      return sendError(res, 'You do not have permission to edit this post', 403);
    }

    const validationErrors = validatePostInput({ title, content, category });
    if (validationErrors.length > 0) {
      return sendError(res, validationErrors[0], 400);
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title: title.trim(),
        content: content.trim(),
        category,
      },
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

    return sendSuccess(res, {
      post: {
        ...updatedPost,
        likeCount: updatedPost._count.likes,
        commentCount: updatedPost._count.comments,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return sendError(res, 'Post not found', 404);
    }

    // Ownership check
    if (post.authorId !== req.user.id) {
      return sendError(res, 'You do not have permission to delete this post', 403);
    }

    await prisma.post.delete({
      where: { id },
    });

    return sendSuccess(res, { message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};
