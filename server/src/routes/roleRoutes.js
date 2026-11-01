import { Router } from 'express';
import { getRole, updateRole, compareRoles, updateRoleSchema } from '../controllers/roleController.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', getRole);
router.put('/', validate(updateRoleSchema), updateRole);
router.get('/compare', compareRoles);

export default router;

