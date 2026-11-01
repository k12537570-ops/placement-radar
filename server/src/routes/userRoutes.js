import { Router } from 'express';
import {
  updateProfile,
  updateSettings,
  deleteAccount,
  exportWorkspace,
  importWorkspace,
  updateProfileSchema,
  updateSettingsSchema,
  importWorkspaceSchema
} from '../controllers/userController.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.patch('/profile', validate(updateProfileSchema), updateProfile);
router.patch('/settings', validate(updateSettingsSchema), updateSettings);
router.delete('/me', deleteAccount);
router.get('/export', exportWorkspace);
router.post('/import', validate(importWorkspaceSchema), importWorkspace);

export default router;

