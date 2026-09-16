import { sendError } from '../utils/response.js';

/**
 * Handle 404 for undefined routes
 */
export const notFoundHandler = (req, res, _next) => {
  return sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
};

/**
 * Centralized global error handling middleware
 */
export const errorHandler = (err, req, res, _next) => {
  // Log error for developers
  if (process.env.NODE_ENV !== 'test') {
    console.error('Centralized Error Handler:', err);
  }

  // Handle JSON parsing errors in body
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return sendError(res, 'Invalid JSON payload received', 400);
  }

  // Prisma unique constraint violation (P2002)
  if (err.code === 'P2002') {
    const target = err.meta?.target ? ` (${err.meta.target})` : '';
    return sendError(res, `A record with this field already exists${target}`, 409);
  }

  // Prisma record not found (P2025)
  if (err.code === 'P2025') {
    return sendError(res, 'Requested record was not found', 404);
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.isOperational || statusCode < 500 ? err.message : 'An unexpected server error occurred';

  return sendError(res, message, statusCode);
};
