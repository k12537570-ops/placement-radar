import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { successResponse, errorResponse, asyncHandler } from '../utils/response.js';
import { calculateRoleMatch } from '../services/analysisService.js';

export const updateSingleSkillSchema = z.object({
  params: z.object({
    skillId: z.string().min(1)
  }),
  body: z.object({
    level: z.number().int().min(0).max(5).optional(),
    liveConfidence: z.boolean().optional()
  })
});

export const updateBulkSkillsSchema = z.object({
  body: z.object({
    skills: z.record(z.string(), z.number().min(0).max(5)),
    confidence: z.record(z.string(), z.boolean()).optional()
  })
});

// Helper to auto-upsert today's snapshot on skill changes
async function autoUpsertTodaySnapshot(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { targetRole: true, companyMode: true }
    });
    if (!user) return;

    const ratings = await prisma.skillRating.findMany({ where: { userId } });
    const skillsMap = {};
    const confMap = {};
    ratings.forEach(r => {
      skillsMap[r.skillId] = r.level;
      if (r.liveConfidence) confMap[r.skillId] = true;
    });

    const match = calculateRoleMatch(skillsMap, confMap, user.targetRole || 'swe', user.companyMode || 'product');
    const today = new Date().toISOString().split('T')[0];

    await prisma.snapshot.upsert({
      where: {
        userId_date: {
          userId,
          date: today
        }
      },
      update: {
        readinessScore: match.readinessScore,
        role: user.targetRole || 'swe',
        companyMode: user.companyMode || 'product',
        categoryScores: JSON.stringify(match.categoryScores),
        topGaps: JSON.stringify(match.topGaps)
      },
      create: {
        userId,
        date: today,
        readinessScore: match.readinessScore,
        role: user.targetRole || 'swe',
        companyMode: user.companyMode || 'product',
        categoryScores: JSON.stringify(match.categoryScores),
        topGaps: JSON.stringify(match.topGaps)
      }
    });
  } catch (err) {
    console.error('Error auto-upserting snapshot:', err);
  }
}

// GET /skills
export const getSkills = asyncHandler(async (req, res) => {
  const ratings = await prisma.skillRating.findMany({
    where: { userId: req.user.id }
  });

  const skillsMap = {};
  const confidenceMap = {};
  ratings.forEach(r => {
    skillsMap[r.skillId] = r.level;
    if (r.liveConfidence) confidenceMap[r.skillId] = true;
  });

  const calibratedCount = Object.values(skillsMap).filter(l => l > 0).length;

  return successResponse(res, {
    skills: skillsMap,
    confidence: confidenceMap,
    calibratedCount
  });
});

// PUT /skills/:skillId
export const updateSingleSkill = asyncHandler(async (req, res) => {
  const { skillId } = req.params;
  const { level, liveConfidence } = req.body;

  const existing = await prisma.skillRating.findUnique({
    where: {
      userId_skillId: {
        userId: req.user.id,
        skillId
      }
    }
  });

  const updated = await prisma.skillRating.upsert({
    where: {
      userId_skillId: {
        userId: req.user.id,
        skillId
      }
    },
    update: {
      ...(level !== undefined && { level }),
      ...(liveConfidence !== undefined && { liveConfidence })
    },
    create: {
      userId: req.user.id,
      skillId,
      level: level !== undefined ? level : 0,
      liveConfidence: liveConfidence !== undefined ? liveConfidence : false
    }
  });

  autoUpsertTodaySnapshot(req.user.id);

  return successResponse(res, { skill: updated }, 'Skill updated');
});

// PUT /skills/bulk
export const updateBulkSkills = asyncHandler(async (req, res) => {
  const { skills, confidence = {} } = req.body;
  const userId = req.user.id;

  await prisma.$transaction(async (tx) => {
    for (const [skillId, level] of Object.entries(skills)) {
      await tx.skillRating.upsert({
        where: {
          userId_skillId: {
            userId,
            skillId
          }
        },
        update: {
          level: Number(level) || 0,
          ...(confidence[skillId] !== undefined && { liveConfidence: Boolean(confidence[skillId]) })
        },
        create: {
          userId,
          skillId,
          level: Number(level) || 0,
          liveConfidence: Boolean(confidence[skillId])
        }
      });
    }
  });

  autoUpsertTodaySnapshot(userId);

  return successResponse(res, null, 'Skills calibrated successfully');
});

// DELETE /skills (Reset all)
export const resetSkills = asyncHandler(async (req, res) => {
  await prisma.skillRating.deleteMany({
    where: { userId: req.user.id }
  });

  autoUpsertTodaySnapshot(req.user.id);

  return successResponse(res, null, 'All skill ratings reset to 0');
});

