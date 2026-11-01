import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { successResponse, errorResponse, asyncHandler } from '../utils/response.js';
import { ROLES, COMPANY_MODES } from '../seed/referenceData.js';
import { compareAllRoles } from '../services/analysisService.js';

export const updateRoleSchema = z.object({
  body: z.object({
    targetRole: z.string().optional(),
    companyMode: z.enum(['product', 'faang', 'startup', 'service']).optional()
  })
});

// GET /role
export const getRole = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { targetRole: true, companyMode: true }
  });

  const roleObj = ROLES.find(r => r.id === user.targetRole) || ROLES[0];
  const modeObj = COMPANY_MODES.find(m => m.id === user.companyMode) || COMPANY_MODES[0];

  return successResponse(res, {
    targetRole: user.targetRole || 'swe',
    companyMode: user.companyMode || 'product',
    role: roleObj,
    companyModeInfo: modeObj
  });
});

// PUT /role
export const updateRole = asyncHandler(async (req, res) => {
  const { targetRole, companyMode } = req.body;

  const updated = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      ...(targetRole && { targetRole }),
      ...(companyMode && { companyMode })
    },
    select: { targetRole: true, companyMode: true }
  });

  const roleObj = ROLES.find(r => r.id === updated.targetRole) || ROLES[0];
  const modeObj = COMPANY_MODES.find(m => m.id === updated.companyMode) || COMPANY_MODES[0];

  return successResponse(res, {
    targetRole: updated.targetRole,
    companyMode: updated.companyMode,
    role: roleObj,
    companyModeInfo: modeObj
  }, 'Target role updated');
});

// GET /role/compare
export const compareRoles = asyncHandler(async (req, res) => {
  const ratings = await prisma.skillRating.findMany({
    where: { userId: req.user.id }
  });

  const skillsMap = {};
  const confidenceMap = {};
  ratings.forEach(r => {
    skillsMap[r.skillId] = r.level;
    if (r.liveConfidence) confidenceMap[r.skillId] = true;
  });

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { companyMode: true }
  });

  const comparisons = compareAllRoles(skillsMap, confidenceMap, user.companyMode || 'product');

  return successResponse(res, { comparisons });
});

