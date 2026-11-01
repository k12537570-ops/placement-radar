import { errorResponse } from '../utils/response.js';
import { env } from '../config/env.js';

export function notFoundHandler(req, res) {
  return errorResponse(res, `Route not found: ${req.method} ${req.originalUrl}`, null, 404);
}

export function errorHandler(err, req, res, next) {
  // If response headers already sent, delegate to default express handler
  if (res.headersSent) {
    return next(err);
  }

  // Handle JSON parsing error
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return errorResponse(res, 'Malformed JSON in request body', null, 400);
  }

  // Handle Prisma unique constraint error
  if (err.code === 'P2002') {
    const target = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'field';
    return errorResponse(res, `A record with this ${target} already exists`, null, 409);
  }

  // Handle Prisma record not found error
  if (err.code === 'P2025') {
    return errorResponse(res, 'Requested resource not found', null, 404);
  }

  // Handle JWT error
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Authentication token is invalid or expired', null, 401);
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';
  const errors = env.NODE_ENV === 'development' ? err.stack : null;

  if (statusCode === 500 && env.NODE_ENV !== 'test') {
    console.error('Unhandled Server Error:', err);
  }

  return errorResponse(res, message, errors, statusCode);
}

