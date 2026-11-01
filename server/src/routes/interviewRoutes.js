import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getInterviewQuestions,
  submitInterviewSession,
  getInterviewHistory
} from '../controllers/interviewController.js';

const router = Router();

router.use(requireAuth);

router.get('/questions', getInterviewQuestions);
router.post('/evaluate', submitInterviewSession);
router.get('/history', getInterviewHistory);

export default router;

