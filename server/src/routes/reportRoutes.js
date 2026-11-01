import { Router } from 'express';
import { getReport, getReportSummary } from '../controllers/reportController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', getReport);
router.get('/summary', getReportSummary);

export default router;

