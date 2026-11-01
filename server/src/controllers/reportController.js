import { prisma } from '../config/prisma.js';
import { successResponse, asyncHandler } from '../utils/response.js';
import { calculateRoleMatch } from '../services/analysisService.js';
import { SKILLS, ROLES, COMPANY_MODES } from '../seed/referenceData.js';

export const getReport = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const [user, ratings, roadmap, snapshots] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        college: true,
        graduationYear: true,
        targetRole: true,
        companyMode: true
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
    prisma.snapshot.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
      take: 15
    })
  ]);

  const skillsMap = {};
  const confMap = {};
  ratings.forEach(r => {
    skillsMap[r.skillId] = r.level;
    if (r.liveConfidence) confMap[r.skillId] = true;
  });

  const targetRole = user.targetRole || 'swe';
  const companyMode = user.companyMode || 'product';

  const roleObj = ROLES.find(r => r.id === targetRole) || ROLES[0];
  const modeObj = COMPANY_MODES.find(m => m.id === companyMode) || COMPANY_MODES[0];
  const match = calculateRoleMatch(skillsMap, confMap, targetRole, companyMode);

  // Roadmap metrics
  let totalTasks = 0;
  let completedTasks = 0;
  if (roadmap && roadmap.weeks) {
    roadmap.weeks.forEach(w => {
      w.tasks.forEach(t => {
        totalTasks++;
        if (t.done) completedTasks++;
      });
    });
  }
  const roadmapCompletion = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Auto-Generated Next 30 Days Action Plan (3 x 10-day sprints)
  const topGaps = match.gaps.slice(0, 3);
  const actionPlan = [];

  if (topGaps[0]) {
    const s = SKILLS.find(sk => sk.id === topGaps[0].skillId);
    actionPlan.push({
      days: 'Days 1 — 10',
      title: `Bridge Critical Gap: ${s?.name}`,
      detail: `Focus on core fundamentals and complete 3 practical drills. Target moving from level ${topGaps[0].userLevel} to ${topGaps[0].targetLevel}.`
    });
  }

  if (topGaps[1]) {
    const s = SKILLS.find(sk => sk.id === topGaps[1].skillId);
    actionPlan.push({
      days: 'Days 11 — 20',
      title: `Reinforce Secondary Gap: ${s?.name}`,
      detail: `Study curated documentation and solve high-frequency interview questions in 30-minute timed sprint blocks.`
    });
  }

  if (topGaps[2]) {
    const s = SKILLS.find(sk => sk.id === topGaps[2].skillId);
    actionPlan.push({
      days: 'Days 21 — 27',
      title: `Build Hands-On Feature: ${s?.name}`,
      detail: `Integrate this skill directly into your resume project repository and document the engineering trade-offs.`
    });
  }

  actionPlan.push({
    days: 'Days 28 — 30',
    title: 'Mock Interview & ATS Resume Calibration',
    detail: 'Complete a timed technical assessment and synchronize verified skill ratings to your resume.'
  });

  return successResponse(res, {
    candidate: {
      name: user.name,
      email: user.email,
      college: user.college || 'Engineering Institute',
      graduationYear: user.graduationYear || '2026'
    },
    targetRole: roleObj,
    companyMode: modeObj,
    match,
    roadmapProgress: {
      totalTasks,
      completedTasks,
      percentage: roadmapCompletion,
      streak: roadmap ? roadmap.streakCurrent : 0
    },
    actionPlan,
    history: snapshots.map(s => ({
      date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      rawDate: s.date,
      score: s.readinessScore,
      role: s.role,
      companyMode: s.companyMode
    }))
  });
});

export const getReportSummary = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const [user, ratings, roadmap] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, targetRole: true, companyMode: true }
    }),
    prisma.skillRating.findMany({ where: { userId } }),
    prisma.roadmap.findUnique({ where: { userId } })
  ]);

  const skillsMap = {};
  const confMap = {};
  ratings.forEach(r => {
    skillsMap[r.skillId] = r.level;
    if (r.liveConfidence) confMap[r.skillId] = true;
  });

  const targetRole = user.targetRole || 'swe';
  const roleObj = ROLES.find(r => r.id === targetRole) || ROLES[0];
  const modeObj = COMPANY_MODES.find(m => m.id === user.companyMode) || COMPANY_MODES[0];
  const match = calculateRoleMatch(skillsMap, confMap, targetRole, user.companyMode || 'product');

  const topStrengths = match.strengths.slice(0, 3)
    .map(s => SKILLS.find(sk => sk.id === s.skillId)?.name)
    .filter(Boolean)
    .join(', ') || 'Foundational competencies';

  const topGaps = match.gaps.slice(0, 3)
    .map(g => `${SKILLS.find(sk => sk.id === g.skillId)?.name} (-${g.rawGap})`)
    .filter(Boolean)
    .join(', ') || 'None';

  const summaryMarkdown = `🎯 **PLACEMENT RADAR REPORT SUMMARY**
- **Candidate**: ${user.name}
- **Target Role**: ${roleObj.title} (${modeObj.name})
- **Readiness Score**: ${match.readinessScore}/100 [${match.verdict}]
- **Key Strengths**: ${topStrengths}
- **Priority Deficits**: ${topGaps}
- **Study Streak**: ${roadmap ? roadmap.streakCurrent : 0} Days Active 🔥
*Generated via PLACEMENT RADAR — Readiness & Gap Studio*`;

  return successResponse(res, { summary: summaryMarkdown });
});

