import { Router } from 'express';
import {
  getAnalysis,
  postWhatIf,
  createSnapshot,
  getHistory,
  whatIfSchema
} from '../controllers/analysisController.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', getAnalysis);
router.post('/what-if', validate(whatIfSchema), postWhatIf);
router.post('/snapshot', createSnapshot);
router.get('/history', getHistory);

export default router;

