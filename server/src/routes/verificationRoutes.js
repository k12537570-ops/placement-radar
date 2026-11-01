import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getVerificationTopics,
  getQuizQuestions,
  submitAssessment,
  getVerificationHistory
} from '../controllers/verificationController.js';

const router = Router();

router.use(requireAuth);

router.get('/topics', getVerificationTopics);
router.get('/quiz', getQuizQuestions);
router.post('/submit', submitAssessment);
router.get('/history', getVerificationHistory);

export default router;

