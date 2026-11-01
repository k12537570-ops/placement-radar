import { Router } from 'express';
import {
  signup,
  login,
  loginAsGuest,
  refreshSession,
  logout,
  getMe,
  changePassword,
  signupSchema,
  loginSchema,
  passwordChangeSchema
} from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/signup', authLimiter, validate(signupSchema), signup);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/guest', authLimiter, loginAsGuest);
router.post('/refresh', refreshSession);
router.post('/logout', logout);
router.get('/me', requireAuth, getMe);
router.patch('/password', requireAuth, validate(passwordChangeSchema), changePassword);

export default router;

