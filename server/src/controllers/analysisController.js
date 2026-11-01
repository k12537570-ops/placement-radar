import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { successResponse, errorResponse, asyncHandler } from '../utils/response.js';
import { calculateRoleMatch, simulateWhatIf } from '../services/analysisService.js';
import { ROLES, COMPANY_MODES } from '../seed/referenceData.js';

export const whatIfSchema = z.object({
  body: z.object({
    overrides: z.record(z.string(), z.number().min(0).max(5))
  })
});

// GET /analysis
export const getAnalysis = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const [user, ratings] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { targetRole: true, companyMode: true }
    }),
    prisma.skillRating.findMany({ where: { userId } })
  ]);

  const skillsMap = {};
  const confMap = {};
  ratings.forEach(r => {
    skillsMap[r.skillId] = r.level;
    if (r.liveConfidence) confMap[r.skillId] = true;
  });

  const targetRole = user.targetRole || 'swe';
  const companyMode = user.companyMode || 'product';

  const analysis = calculateRoleMatch(skillsMap, confMap, targetRole, companyMode);
  const roleObj = ROLES.find(r => r.id === targetRole) || ROLES[0];
  const modeObj = COMPANY_MODES.find(m => m.id === companyMode) || COMPANY_MODES[0];

  return successResponse(res, {
    analysis,
    role: roleObj,
    companyMode: modeObj
  });
});

// POST /analysis/what-if
export const postWhatIf = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { overrides } = req.body;

  const [user, ratings] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { targetRole: true, companyMode: true }
    }),
    prisma.skillRating.findMany({ where: { userId } })
  ]);

  const skillsMap = {};
  const confMap = {};
  ratings.forEach(r => {
    skillsMap[r.skillId] = r.level;
    if (r.liveConfidence) confMap[r.skillId] = true;
  });

  const targetRole = user.targetRole || 'swe';
  const companyMode = user.companyMode || 'product';

  const simulation = simulateWhatIf(skillsMap, confMap, overrides, targetRole, companyMode);

  return successResponse(res, simulation);
});

// POST /analysis/snapshot
export const createSnapshot = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().split('T')[0];

  const [user, ratings] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { targetRole: true, companyMode: true }
    }),
    prisma.skillRating.findMany({ where: { userId } })
  ]);

  const skillsMap = {};
  const confMap = {};
  ratings.forEach(r => {
    skillsMap[r.skillId] = r.level;
    if (r.liveConfidence) confMap[r.skillId] = true;
  });

  const targetRole = user.targetRole || 'swe';
  const companyMode = user.companyMode || 'product';

  const match = calculateRoleMatch(skillsMap, confMap, targetRole, companyMode);

  const snapshot = await prisma.snapshot.upsert({
    where: {
      userId_date: {
        userId,
        date: today
      }
    },
    update: {
      readinessScore: match.readinessScore,
      role: targetRole,
      companyMode,
      categoryScores: JSON.stringify(match.categoryScores),
      topGaps: JSON.stringify(match.topGaps)
    },
    create: {
      userId,
      date: today,
      readinessScore: match.readinessScore,
      role: targetRole,
      companyMode,
      categoryScores: JSON.stringify(match.categoryScores),
      topGaps: JSON.stringify(match.topGaps)
    }
  });

  return successResponse(res, { snapshot }, 'Snapshot recorded');
});

// GET /analysis/history
export const getHistory = asyncHandler(async (req, res) => {
  const snapshots = await prisma.snapshot.findMany({
    where: { userId: req.user.id },
    orderBy: { date: 'asc' },
    select: {
      id: true,
      date: true,
      readinessScore: true,
      role: true,
      companyMode: true,
      createdAt: true
    }
  });

  const formatted = snapshots.map(s => {
    const d = new Date(s.date);
    return {
      id: s.id,
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      rawDate: s.date,
      score: s.readinessScore,
      role: s.role,
      companyMode: s.companyMode
    };
  });

  return successResponse(res, { history: formatted });
});

