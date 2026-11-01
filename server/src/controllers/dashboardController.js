import { prisma } from '../config/prisma.js';
import { successResponse, errorResponse, asyncHandler } from '../utils/response.js';
import { calculateRoleMatch } from '../services/analysisService.js';
import { calculateAtsScore } from '../services/resumeService.js';
import { ROLES, COMPANY_MODES, SKILLS } from '../seed/referenceData.js';

export const getDashboardOverview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const targetRole = req.user.targetRole || 'swe';
  const companyMode = req.user.companyMode || 'product';

  const roleObj = ROLES.find(r => r.id === targetRole) || ROLES[0];
  const modeObj = COMPANY_MODES.find(m => m.id === companyMode) || COMPANY_MODES[0];

  // Parallel database queries for all dashboard components
  const [
    userRatings,
    roadmap,
    resumeRecord,
    snapshots,
    latestInterview,
    skillVerifications,
    latestJobMatch
  ] = await Promise.all([
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
      orderBy: { date: 'asc' },
      take: 10
    }),
    prisma.interviewSession.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.skillVerification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.jobMatchAnalysis.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
  ]);

  // Construct user skills object & confidence map
  const skillsMap = {};
  const confidenceMap = {};
  userRatings.forEach(r => {
    skillsMap[r.skillId] = r.level;
    confidenceMap[r.skillId] = r.liveConfidence;
  });

  // Calculate dynamic role match & readiness score
  const matchAnalysis = calculateRoleMatch(skillsMap, confidenceMap, targetRole, companyMode);

  // Resume ATS analysis
  let resumeData = null;
  let atsScore = 0;
  if (resumeRecord) {
    resumeData = {
      template: resumeRecord.template,
      personal: JSON.parse(resumeRecord.personal || '{}'),
      summary: resumeRecord.summary,
      education: JSON.parse(resumeRecord.education || '[]'),
      skills: JSON.parse(resumeRecord.skills || '[]'),
      experience: JSON.parse(resumeRecord.experience || '[]'),
      projects: JSON.parse(resumeRecord.projects || '[]'),
      certifications: JSON.parse(resumeRecord.certifications || '[]')
    };
    const ats = calculateAtsScore(resumeData, targetRole);
    atsScore = ats.score;
  }

  // Roadmap metrics
  let totalTasks = 0;
  let completedTasksCount = 0;
  if (roadmap && roadmap.weeks) {
    roadmap.weeks.forEach(w => {
      if (w.tasks) {
        totalTasks += w.tasks.length;
        completedTasksCount += w.tasks.filter(t => t.done).length;
      }
    });
  }
  const roadmapProgress = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  // Verification average score
  let avgVerifiedScore = null;
  if (skillVerifications.length > 0) {
    const sum = skillVerifications.reduce((acc, curr) => acc + curr.score, 0);
    avgVerifiedScore = Math.round(sum / skillVerifications.length);
  }

  // Build Recent Activities Timeline
  const activities = [];
  if (userRatings.length > 0) {
    activities.push({
      id: 'act-skills',
      type: 'skills',
      title: 'Skills Calibrated',
      description: `${userRatings.filter(r => r.level > 0).length} of 30 industry skills calibrated.`,
      timestamp: userRatings[0]?.updatedAt || new Date()
    });
  }
  if (latestInterview) {
    activities.push({
      id: 'act-interview',
      type: 'interview',
      title: 'Mock Interview Completed',
      description: `Scored ${latestInterview.overallScore}% in ${latestInterview.roleTitle} interview.`,
      timestamp: latestInterview.createdAt
    });
  }
  if (skillVerifications.length > 0) {
    const latestVerify = skillVerifications[0];
    activities.push({
      id: 'act-verify',
      type: 'verification',
      title: 'Technical Assessment Taken',
      description: `${latestVerify.topic.toUpperCase()} test completed with ${latestVerify.score}%.`,
      timestamp: latestVerify.createdAt
    });
  }
  if (latestJobMatch) {
    activities.push({
      id: 'act-match',
      type: 'resume',
      title: 'Job Match Evaluated',
      description: `Analyzed resume alignment for ${latestJobMatch.jobTitle}: ${latestJobMatch.matchScore}% match.`,
      timestamp: latestJobMatch.createdAt
    });
  }

  // Sort activities by timestamp
  activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return successResponse(res, {
    user: {
      name: req.user.name,
      email: req.user.email,
      targetRole: roleObj.title,
      targetRoleId: roleObj.id,
      companyMode: modeObj.name,
      college: req.user.college,
      graduationYear: req.user.graduationYear
    },
    metrics: {
      readinessScore: matchAnalysis.readinessScore,
      verdict: matchAnalysis.verdict,
      verdictBadge: matchAnalysis.verdictBadge,
      calibratedSkillsCount: Object.values(skillsMap).filter(v => v > 0).length,
      atsScore,
      jobMatchScore: latestJobMatch ? latestJobMatch.matchScore : null,
      interviewScore: latestInterview ? latestInterview.overallScore : null,
      verifiedScore: avgVerifiedScore,
      roadmapProgress,
      streakCount: roadmap?.streakCurrent || 0
    },
    radarData: Object.values(matchAnalysis.categoryScores),
    topGaps: matchAnalysis.topGaps,
    strengths: matchAnalysis.strengths.slice(0, 4),
    scoreHistory: snapshots.map(s => ({
      date: s.date,
      score: s.readinessScore
    })),
    recentActivities: activities.slice(0, 5),
    verificationsSummary: skillVerifications.slice(0, 4).map(v => ({
      id: v.id,
      topic: v.topic,
      difficulty: v.difficulty,
      score: v.score,
      passed: v.passed
    }))
  });
});

