import { Router } from 'express';
import {
  generateRoadmap,
  getRoadmap,
  toggleTask,
  updateRoadmapSettings,
  logPomodoroSession,
  generateRoadmapSchema,
  updateRoadmapSettingsSchema,
  logPomodoroSchema
} from '../controllers/roadmapController.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', getRoadmap);
router.post('/generate', validate(generateRoadmapSchema), generateRoadmap);
router.patch('/tasks/:taskId', toggleTask);
router.patch('/settings', validate(updateRoadmapSettingsSchema), updateRoadmapSettings);
router.post('/pomodoro', validate(logPomodoroSchema), logPomodoroSession);

export default router;

