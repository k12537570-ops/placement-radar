import { Router } from 'express';
import { getSkills, getRoles, getCompanyModes } from '../controllers/metaController.js';

const router = Router();

router.get('/skills', getSkills);
router.get('/roles', getRoles);
router.get('/company-modes', getCompanyModes);

export default router;

