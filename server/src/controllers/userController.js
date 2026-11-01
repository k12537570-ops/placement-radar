import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { successResponse, errorResponse, asyncHandler } from '../utils/response.js';
import { clearRefreshTokenCookie } from '../utils/tokens.js';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    college: z.string().nullable().optional(),
    graduationYear: z.string().optional()
  })
});

export const updateSettingsSchema = z.object({
  body: z.object({
    targetRole: z.string().optional(),
    companyMode: z.enum(['product', 'faang', 'startup', 'service']).optional(),
    accent: z.string().optional(),
    mode: z.enum(['light', 'dark']).optional(),
    fontScale: z.number().int().min(80).max(140).optional(),
    reduceMotion: z.boolean().optional(),
    onboardingDone: z.boolean().optional()
  })
});

export const importWorkspaceSchema = z.object({
  body: z.object({
    skills: z.record(z.string(), z.number().min(0).max(5)).optional(),
    confidence: z.record(z.string(), z.boolean()).optional(),
    targetRole: z.string().optional(),
    companyMode: z.string().optional(),
    theme: z.string().optional(),
    accent: z.string().optional(),
    mode: z.string().optional(),
    fontSize: z.string().optional(),
    fontScale: z.number().optional(),
    reduceMotion: z.boolean().optional(),
    resume: z.record(z.string(), z.any()).optional(),
    roadmapWeeks: z.number().optional(),
    roadmapHoursPerDay: z.number().optional()
  })
});

// PATCH /users/profile
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, college, graduationYear } = req.body;

  const updated = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      ...(name && { name: name.trim() }),
      ...(college !== undefined && { college: college ? college.trim() : null }),
      ...(graduationYear && { graduationYear })
    },
    select: {
      id: true,
      name: true,
      email: true,
      college: true,
      graduationYear: true,
      isGuest: true,
      targetRole: true,
      companyMode: true,
      accent: true,
      mode: true,
      fontScale: true,
      reduceMotion: true,
      onboardingDone: true
    }
  });

  return successResponse(res, { user: updated }, 'Profile updated');
});

// PATCH /users/settings
export const updateSettings = asyncHandler(async (req, res) => {
  const updated = await prisma.user.update({
    where: { id: req.user.id },
    data: req.body,
    select: {
      id: true,
      name: true,
      email: true,
      college: true,
      graduationYear: true,
      isGuest: true,
      targetRole: true,
      companyMode: true,
      accent: true,
      mode: true,
      fontScale: true,
      reduceMotion: true,
      onboardingDone: true
    }
  });

  return successResponse(res, { user: updated }, 'Settings updated');
});

// DELETE /users/me
export const deleteAccount = asyncHandler(async (req, res) => {
  await prisma.user.delete({
    where: { id: req.user.id }
  });

  clearRefreshTokenCookie(res);
  return successResponse(res, null, 'Account and all data deleted');
});

// GET /users/export
export const exportWorkspace = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const [user, skillRatings, roadmap, resume, snapshots] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        college: true,
        graduationYear: true,
        targetRole: true,
        companyMode: true,
        accent: true,
        mode: true,
        fontScale: true,
        reduceMotion: true,
        onboardingDone: true,
        createdAt: true
      }
    }),
    prisma.skillRating.findMany({ where: { userId } }),
    prisma.roadmap.findUnique({
      where: { userId },
      include: {
        weeks: {
          include: { tasks: true }
        }
      }
    }),
    prisma.resume.findUnique({ where: { userId } }),
    prisma.snapshot.findMany({
      where: { userId },
      orderBy: { date: 'asc' }
    })
  ]);

  const skillsMap = {};
  const confidenceMap = {};
  skillRatings.forEach(sr => {
    skillsMap[sr.skillId] = sr.level;
    if (sr.liveConfidence) confidenceMap[sr.skillId] = true;
  });

  const parsedResume = resume ? {
    template: resume.template,
    personal: JSON.parse(resume.personal || '{}'),
    summary: resume.summary,
    education: JSON.parse(resume.education || '[]'),
    skills: JSON.parse(resume.skills || '[]'),
    experience: JSON.parse(resume.experience || '[]'),
    projects: JSON.parse(resume.projects || '[]'),
    certifications: JSON.parse(resume.certifications || '[]')
  } : null;

  const exportPayload = {
    version: '2.0.0',
    exportedAt: new Date().toISOString(),
    user,
    skills: skillsMap,
    confidence: confidenceMap,
    targetRole: user.targetRole,
    companyMode: user.companyMode,
    theme: user.accent,
    accent: user.accent,
    mode: user.mode,
    fontScale: user.fontScale,
    reduceMotion: user.reduceMotion,
    resume: parsedResume,
    roadmap: roadmap ? {
      durationWeeks: roadmap.durationWeeks,
      hoursPerDay: roadmap.hoursPerDay,
      streakCurrent: roadmap.streakCurrent,
      streakLongest: roadmap.streakLongest,
      lastActiveDate: roadmap.lastActiveDate,
      weeks: roadmap.weeks.map(w => ({
        weekNumber: w.weekNumber,
        focusSkills: JSON.parse(w.focusSkills || '[]'),
        resources: JSON.parse(w.resources || '[]'),
        completedAt: w.completedAt,
        tasks: w.tasks.map(t => ({
          id: t.id,
          title: t.title,
          done: t.done
        }))
      }))
    } : null,
    snapshots: snapshots.map(s => ({
      date: s.date,
      score: s.readinessScore,
      role: s.role,
      companyMode: s.companyMode
    }))
  };

  return successResponse(res, exportPayload, 'Workspace exported successfully');
});

// POST /users/import
export const importWorkspace = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const payload = req.body;

  await prisma.$transaction(async (tx) => {
    // 1. Update user settings
    await tx.user.update({
      where: { id: userId },
      data: {
        ...(payload.targetRole && { targetRole: payload.targetRole }),
        ...(payload.companyMode && { companyMode: payload.companyMode }),
        ...(payload.accent && { accent: payload.accent }),
        ...(payload.theme && { accent: payload.theme }),
        ...(payload.mode && { mode: payload.mode }),
        ...(payload.fontScale && { fontScale: payload.fontScale }),
        ...(payload.reduceMotion !== undefined && { reduceMotion: payload.reduceMotion })
      }
    });

    // 2. Overwrite skill ratings
    if (payload.skills) {
      await tx.skillRating.deleteMany({ where: { userId } });
      const skillEntries = Object.entries(payload.skills).map(([skillId, level]) => ({
        userId,
        skillId,
        level: Number(level) || 0,
        liveConfidence: Boolean(payload.confidence && payload.confidence[skillId])
      }));

      for (const entry of skillEntries) {
        await tx.skillRating.create({ data: entry });
      }
    }

    // 3. Overwrite resume
    if (payload.resume) {
      const r = payload.resume;
      await tx.resume.upsert({
        where: { userId },
        update: {
          template: r.template || 'classic',
          personal: JSON.stringify(r.personal || {}),
          summary: r.summary || '',
          education: JSON.stringify(r.education || []),
          skills: JSON.stringify(r.skills || []),
          experience: JSON.stringify(r.experience || []),
          projects: JSON.stringify(r.projects || []),
          certifications: JSON.stringify(r.certifications || [])
        },
        create: {
          userId,
          template: r.template || 'classic',
          personal: JSON.stringify(r.personal || {}),
          summary: r.summary || '',
          education: JSON.stringify(r.education || []),
          skills: JSON.stringify(r.skills || []),
          experience: JSON.stringify(r.experience || []),
          projects: JSON.stringify(r.projects || []),
          certifications: JSON.stringify(r.certifications || [])
        }
      });
    }
  });

  return successResponse(res, null, 'Workspace imported successfully');
});

