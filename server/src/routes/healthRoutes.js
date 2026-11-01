import { Router } from 'express';
import { prisma } from '../config/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return successResponse(res, {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected (SQLite)'
    }, 'Server is healthy');
  } catch (err) {
    return errorResponse(res, 'Database connection error', err.message, 503);
  }
});

export default router;

