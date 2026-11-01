import { Router } from 'express';
import {
  getSkills,
  updateSingleSkill,
  updateBulkSkills,
  resetSkills,
  updateSingleSkillSchema,
  updateBulkSkillsSchema
} from '../controllers/skillController.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', getSkills);
router.put('/bulk', validate(updateBulkSkillsSchema), updateBulkSkills);
router.put('/:skillId', validate(updateSingleSkillSchema), updateSingleSkill);
router.delete('/', resetSkills);

export default router;

