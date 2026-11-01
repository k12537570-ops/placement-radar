import { verifyAccessToken } from '../utils/tokens.js';
import { prisma } from '../config/prisma.js';
import { errorResponse } from '../utils/response.js';

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Authentication required', null, 401);
    }

    const token = authHeader.split(' ')[1];
    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch (err) {
      return errorResponse(res, 'Invalid or expired access token', null, 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        college: true,
        graduationYear: true,
        isGuest: true,
        guestExpiresAt: true,
        targetRole: true,
        companyMode: true,
        accent: true,
        mode: true,
        fontScale: true,
        reduceMotion: true,
        onboardingDone: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return errorResponse(res, 'User no longer exists', null, 401);
    }

    // Check if guest user expired
    if (user.isGuest && user.guestExpiresAt && new Date() > new Date(user.guestExpiresAt)) {
      await prisma.user.delete({ where: { id: user.id } }).catch(() => {});
      return errorResponse(res, 'Guest session expired', null, 401);
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch (err) {
      req.user = null;
      return next();
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        college: true,
        graduationYear: true,
        isGuest: true,
        guestExpiresAt: true,
        targetRole: true,
        companyMode: true,
        accent: true,
        mode: true,
        fontScale: true,
        reduceMotion: true,
        onboardingDone: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (user && user.isGuest && user.guestExpiresAt && new Date() > new Date(user.guestExpiresAt)) {
      await prisma.user.delete({ where: { id: user.id } }).catch(() => {});
      req.user = null;
      return next();
    }

    req.user = user || null;
    next();
  } catch (err) {
    req.user = null;
    next();
  }
}

