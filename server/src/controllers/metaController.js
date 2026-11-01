import { SKILLS, SKILL_CATEGORIES, SKILL_LEVEL_LABELS, ROLES, COMPANY_MODES } from '../seed/referenceData.js';
import { successResponse } from '../utils/response.js';

export function getSkills(req, res) {
  return successResponse(res, {
    skills: SKILLS,
    categories: SKILL_CATEGORIES,
    levelLabels: SKILL_LEVEL_LABELS
  });
}

export function getRoles(req, res) {
  return successResponse(res, {
    roles: ROLES
  });
}

export function getCompanyModes(req, res) {
  return successResponse(res, {
    companyModes: COMPANY_MODES
  });
}

