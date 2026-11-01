import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { successResponse, errorResponse, asyncHandler } from '../utils/response.js';
import { buildRoadmapData, updateStreakCalculation } from '../services/roadmapService.js';
import { calculateRoleMatch } from '../services/analysisService.js';
import { ROLES } from '../seed/referenceData.js';

export const generateRoadmapSchema = z.object({
  body: z.object({
    durationWeeks: z.union([z.literal(4), z.literal(8), z.literal(12), z.literal(16)]).default(8),
    hoursPerDay: z.number().int().min(1).max(8).default(3)
  })
});

export const updateRoadmapSettingsSchema = z.object({
  body: z.object({
    durationWeeks: z.union([z.literal(4), z.literal(8), z.literal(12), z.literal(16)]).optional(),
    hoursPerDay: z.number().int().min(1).max(8).optional()
  })
});

export const logPomodoroSchema = z.object({
  body: z.object({
    type: z.enum(['focus', 'break']).default('focus'),
    durationMin: z.number().int().min(1).max(180).default(25)
  })
});

// POST /roadmap/generate
export const generateRoadmap = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { durationWeeks = 8, hoursPerDay = 3 } = req.body;

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
  const roleObj = ROLES.find(r => r.id === targetRole) || ROLES[0];
  const match = calculateRoleMatch(skillsMap, confMap, targetRole, user.companyMode || 'product');

  const generatedWeeks = buildRoadmapData({
    gaps: match.gaps,
    weeksCount: durationWeeks,
    hoursPerDay,
    targetRoleTitle: roleObj.title
  });

  // Transaction: delete old roadmap and insert new one with weeks and tasks
  const createdRoadmap = await prisma.$transaction(async (tx) => {
    await tx.roadmap.deleteMany({ where: { userId } });

    const newRoadmap = await tx.roadmap.create({
      data: {
        userId,
        durationWeeks,
        hoursPerDay,
        streakCurrent: 1,
        streakLongest: 1,
        lastActiveDate: new Date().toISOString().split('T')[0]
      }
    });

    for (const week of generatedWeeks) {
      const createdWeek = await tx.roadmapWeek.create({
        data: {
          roadmapId: newRoadmap.id,
          weekNumber: week.weekNumber,
          focusSkills: JSON.stringify([week.skillId]),
          resources: JSON.stringify(week.resources)
        }
      });

      for (const task of week.tasks) {
        await tx.roadmapTask.create({
          data: {
            weekId: createdWeek.id,
            title: task.title,
            done: false
          }
        });
      }
    }

    return tx.roadmap.findUnique({
      where: { id: newRoadmap.id },
      include: {
        weeks: {
          include: {
            tasks: true
          },
          orderBy: { weekNumber: 'asc' }
        }
      }
    });
  });

  return successResponse(res, { roadmap: formatRoadmapResponse(createdRoadmap) }, 'Roadmap generated', 201);
});

// Helper: format roadmap database model to frontend-friendly structure
function formatRoadmapResponse(roadmap) {
  if (!roadmap) return null;

  return {
    id: roadmap.id,
    durationWeeks: roadmap.durationWeeks,
    hoursPerDay: roadmap.hoursPerDay,
    streak: {
      count: roadmap.streakCurrent,
      longest: roadmap.streakLongest,
      lastActiveDate: roadmap.lastActiveDate
    },
    weeks: (roadmap.weeks || []).map(w => ({
      id: w.id,
      weekNumber: w.weekNumber,
      focusSkills: JSON.parse(w.focusSkills || '[]'),
      resources: JSON.parse(w.resources || '[]'),
      completedAt: w.completedAt,
      isCompleted: w.tasks.length > 0 && w.tasks.every(t => t.done),
      tasks: (w.tasks || []).map(t => ({
        id: t.id,
        title: t.title,
        done: t.done,
        doneAt: t.doneAt
      }))
    }))
  };
}

// GET /roadmap
export const getRoadmap = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  let roadmap = await prisma.roadmap.findUnique({
    where: { userId },
    include: {
      weeks: {
        include: {
          tasks: true
        },
        orderBy: { weekNumber: 'asc' }
      }
    }
  });

  // If user doesn't have a roadmap yet, auto-generate initial 8-week roadmap
  if (!roadmap) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { targetRole: true, companyMode: true }
    });
    const ratings = await prisma.skillRating.findMany({ where: { userId } });
    const skillsMap = {};
    const confMap = {};
    ratings.forEach(r => {
      skillsMap[r.skillId] = r.level;
      if (r.liveConfidence) confMap[r.skillId] = true;
    });

    const targetRole = user?.targetRole || 'swe';
    const roleObj = ROLES.find(r => r.id === targetRole) || ROLES[0];
    const match = calculateRoleMatch(skillsMap, confMap, targetRole, user?.companyMode || 'product');

    const generatedWeeks = buildRoadmapData({
      gaps: match.gaps,
      weeksCount: 8,
      hoursPerDay: 3,
      targetRoleTitle: roleObj.title
    });

    roadmap = await prisma.$transaction(async (tx) => {
      const newR = await tx.roadmap.create({
        data: {
          userId,
          durationWeeks: 8,
          hoursPerDay: 3,
          streakCurrent: 1,
          streakLongest: 1,
          lastActiveDate: new Date().toISOString().split('T')[0]
        }
      });

      for (const week of generatedWeeks) {
        const createdWeek = await tx.roadmapWeek.create({
          data: {
            roadmapId: newR.id,
            weekNumber: week.weekNumber,
            focusSkills: JSON.stringify([week.skillId]),
            resources: JSON.stringify(week.resources)
          }
        });

        for (const task of week.tasks) {
          await tx.roadmapTask.create({
            data: {
              weekId: createdWeek.id,
              title: task.title,
              done: false
            }
          });
        }
      }

      return tx.roadmap.findUnique({
        where: { id: newR.id },
        include: {
          weeks: {
            include: { tasks: true },
            orderBy: { weekNumber: 'asc' }
          }
        }
      });
    });
  }

  return successResponse(res, { roadmap: formatRoadmapResponse(roadmap) });
});

// PATCH /roadmap/tasks/:taskId
export const toggleTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user.id;

  const task = await prisma.roadmapTask.findUnique({
    where: { id: taskId },
    include: {
      week: {
        include: {
          roadmap: true
        }
      }
    }
  });

  if (!task || task.week.roadmap.userId !== userId) {
    return errorResponse(res, 'Task not found', null, 404);
  }

  const nextDone = !task.done;
  const updatedTask = await prisma.roadmapTask.update({
    where: { id: taskId },
    data: {
      done: nextDone,
      doneAt: nextDone ? new Date() : null
    }
  });

  // Check if all tasks in this week are now done
  const allWeekTasks = await prisma.roadmapTask.findMany({
    where: { weekId: task.weekId }
  });
  const isWeekCompleted = allWeekTasks.length > 0 && allWeekTasks.every(t => t.id === taskId ? nextDone : t.done);

  if (isWeekCompleted) {
    await prisma.roadmapWeek.update({
      where: { id: task.weekId },
      data: { completedAt: new Date() }
    });
  } else {
    await prisma.roadmapWeek.update({
      where: { id: task.weekId },
      data: { completedAt: null }
    });
  }

  // Update streak if completing a task
  let streakInfo = null;
  if (nextDone) {
    const currentRoadmap = task.week.roadmap;
    const streakCalc = updateStreakCalculation(
      currentRoadmap.lastActiveDate,
      currentRoadmap.streakCurrent,
      currentRoadmap.streakLongest
    );

    await prisma.roadmap.update({
      where: { id: currentRoadmap.id },
      data: {
        streakCurrent: streakCalc.streakCurrent,
        streakLongest: streakCalc.streakLongest,
        lastActiveDate: streakCalc.lastActiveDate
      }
    });

    streakInfo = streakCalc;
  }

  return successResponse(res, {
    task: updatedTask,
    weekCompleted: isWeekCompleted && nextDone, // triggers confetti on frontend
    streak: streakInfo
  }, 'Task updated');
});

// PATCH /roadmap/settings
export const updateRoadmapSettings = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { durationWeeks, hoursPerDay } = req.body;

  const updated = await prisma.roadmap.update({
    where: { userId },
    data: {
      ...(durationWeeks && { durationWeeks }),
      ...(hoursPerDay && { hoursPerDay })
    },
    include: {
      weeks: {
        include: { tasks: true },
        orderBy: { weekNumber: 'asc' }
      }
    }
  });

  return successResponse(res, { roadmap: formatRoadmapResponse(updated) }, 'Roadmap settings updated');
});

// POST /roadmap/pomodoro
export const logPomodoroSession = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { type = 'focus', durationMin = 25 } = req.body;

  const session = await prisma.pomodoroSession.create({
    data: {
      userId,
      type,
      durationMin
    }
  });

  return successResponse(res, { session }, 'Pomodoro session recorded', 201);
});

