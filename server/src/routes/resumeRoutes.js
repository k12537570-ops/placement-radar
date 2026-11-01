import { Router } from 'express';
import {
  getResume,
  updateResume,
  syncSkillsToResume,
  getAtsScore,
  improveBullet,
  matchJobDescription,
  parseResumeText,
  updateResumeSchema,
  improveBulletSchema
} from '../controllers/resumeController.js';
import { validate } from '../middleware/validate.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = Router();

// Public / Guest-friendly resume tools
router.post('/parse-text', parseResumeText);
router.post('/improve-bullet', validate(improveBulletSchema), improveBullet);
router.post('/job-match', optionalAuth, matchJobDescription);

// User-bound persistence routes
router.use(requireAuth);
router.get('/', getResume);
router.put('/', validate(updateResumeSchema), updateResume);
router.post('/sync-skills', syncSkillsToResume);
router.post('/ats-score', getAtsScore);

export default router;

