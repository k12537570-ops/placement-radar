import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { successResponse, errorResponse, asyncHandler } from '../utils/response.js';
import { calculateAtsScore, checkBullet } from '../services/resumeService.js';
import { SKILLS } from '../seed/referenceData.js';

export const updateResumeSchema = z.object({
  body: z.object({
    template: z.enum(['classic', 'modern', 'minimal']).optional(),
    personal: z.record(z.string(), z.any()).optional(),
    summary: z.string().optional(),
    education: z.array(z.any()).optional(),
    skills: z.array(z.string()).optional(),
    experience: z.array(z.any()).optional(),
    projects: z.array(z.any()).optional(),
    certifications: z.array(z.any()).optional()
  })
});

export const improveBulletSchema = z.object({
  body: z.object({
    bulletText: z.string().min(1, 'Bullet text is required')
  })
});

function formatResumeData(resume) {
  if (!resume) return null;
  return {
    id: resume.id,
    template: resume.template || 'classic',
    personal: JSON.parse(resume.personal || '{}'),
    summary: resume.summary || '',
    education: JSON.parse(resume.education || '[]'),
    skills: JSON.parse(resume.skills || '[]'),
    experience: JSON.parse(resume.experience || '[]'),
    projects: JSON.parse(resume.projects || '[]'),
    certifications: JSON.parse(resume.certifications || '[]'),
    lastAtsScore: resume.lastAtsScore,
    updatedAt: resume.updatedAt
  };
}

// GET /resume
export const getResume = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  let resume = await prisma.resume.findUnique({
    where: { userId }
  });

  if (!resume) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    resume = await prisma.resume.create({
      data: {
        userId,
        template: 'classic',
        personal: JSON.stringify({
          fullName: user.name,
          title: 'Aspiring Software Engineer',
          email: user.email,
          phone: '',
          location: '',
          linkedin: '',
          github: ''
        }),
        summary: 'Proactive engineering student with strong fundamentals and hands-on project experience.',
        education: JSON.stringify([{
          id: 'edu-1',
          institution: user.college || 'Engineering Institute',
          degree: 'B.Tech in Computer Science',
          period: `2022 — ${user.graduationYear || '2026'}`,
          score: ''
        }]),
        skills: JSON.stringify([]),
        experience: JSON.stringify([]),
        projects: JSON.stringify([]),
        certifications: JSON.stringify([])
      }
    });
  }

  const formatted = formatResumeData(resume);
  const targetRole = req.user.targetRole || 'swe';
  const atsAnalysis = calculateAtsScore(formatted, targetRole);

  return successResponse(res, {
    resume: formatted,
    atsAnalysis
  });
});

// PUT /resume
export const updateResume = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const payload = req.body;
  const targetRole = req.user.targetRole || 'swe';

  // Calculate ATS score
  const atsAnalysis = calculateAtsScore(payload, targetRole);

  const updated = await prisma.resume.upsert({
    where: { userId },
    update: {
      ...(payload.template && { template: payload.template }),
      ...(payload.personal && { personal: JSON.stringify(payload.personal) }),
      ...(payload.summary !== undefined && { summary: payload.summary }),
      ...(payload.education && { education: JSON.stringify(payload.education) }),
      ...(payload.skills && { skills: JSON.stringify(payload.skills) }),
      ...(payload.experience && { experience: JSON.stringify(payload.experience) }),
      ...(payload.projects && { projects: JSON.stringify(payload.projects) }),
      ...(payload.certifications && { certifications: JSON.stringify(payload.certifications) }),
      lastAtsScore: atsAnalysis.score
    },
    create: {
      userId,
      template: payload.template || 'classic',
      personal: JSON.stringify(payload.personal || {}),
      summary: payload.summary || '',
      education: JSON.stringify(payload.education || []),
      skills: JSON.stringify(payload.skills || []),
      experience: JSON.stringify(payload.experience || []),
      projects: JSON.stringify(payload.projects || []),
      certifications: JSON.stringify(payload.certifications || []),
      lastAtsScore: atsAnalysis.score
    }
  });

  const formatted = formatResumeData(updated);

  return successResponse(res, {
    resume: formatted,
    atsAnalysis
  }, 'Resume saved');
});

// POST /resume/sync-skills
export const syncSkillsToResume = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const [ratings, resume] = await Promise.all([
    prisma.skillRating.findMany({
      where: { userId, level: { gte: 3 } }
    }),
    prisma.resume.findUnique({ where: { userId } })
  ]);

  const highSkillsNames = ratings
    .map(r => SKILLS.find(s => s.id === r.skillId)?.name)
    .filter(Boolean);

  const currentSkills = resume ? JSON.parse(resume.skills || '[]') : [];
  const merged = Array.from(new Set([...highSkillsNames, ...currentSkills]));

  const updated = await prisma.resume.upsert({
    where: { userId },
    update: {
      skills: JSON.stringify(merged)
    },
    create: {
      userId,
      skills: JSON.stringify(merged)
    }
  });

  const formatted = formatResumeData(updated);
  const targetRole = req.user.targetRole || 'swe';
  const atsAnalysis = calculateAtsScore(formatted, targetRole);

  return successResponse(res, {
    resume: formatted,
    atsAnalysis,
    syncedCount: highSkillsNames.length
  }, `${highSkillsNames.length} skill(s) synced from calibration`);
});

// POST /resume/ats-score
export const getAtsScore = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const targetRole = req.user.targetRole || 'swe';

  let resumeData = req.body;
  if (!resumeData || Object.keys(resumeData).length === 0) {
    const resumeRecord = await prisma.resume.findUnique({ where: { userId } });
    resumeData = formatResumeData(resumeRecord);
  }

  const analysis = calculateAtsScore(resumeData, targetRole);
  return successResponse(res, { atsAnalysis: analysis });
});

// POST /resume/improve-bullet
export const improveBullet = asyncHandler(async (req, res) => {
  const { bulletText } = req.body;
  const result = checkBullet(bulletText);
  return successResponse(res, result);
});

// POST /resume/job-match
export const matchJobDescription = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { jobTitle = 'Software Engineer', company = '', jobText = '', resume: clientResume } = req.body;

  let resumeData = clientResume;
  if (!resumeData && userId) {
    const resumeRecord = await prisma.resume.findUnique({ where: { userId } });
    resumeData = formatResumeData(resumeRecord) || {};
  } else if (!resumeData) {
    resumeData = {};
  }

  const { analyzeJobMatch } = await import('../services/jobMatchService.js');
  const matchResult = analyzeJobMatch(resumeData, jobText);

  // Persist job match analysis if user is authenticated
  let recordId = 'guest-session';
  if (userId) {
    const record = await prisma.jobMatchAnalysis.create({
      data: {
        userId,
        jobTitle,
        company: company || null,
        jobText,
        matchScore: matchResult.matchScore,
        matchedKeywords: JSON.stringify(matchResult.matchedKeywords),
        missingKeywords: JSON.stringify(matchResult.missingKeywords),
        recommendations: JSON.stringify(matchResult.recommendations)
      }
    });
    recordId = record.id;
  }

  return successResponse(res, {
    id: recordId,
    ...matchResult
  }, 'Job match analysis completed successfully');
});

// POST /resume/parse-text
export const parseResumeText = asyncHandler(async (req, res) => {
  const { rawText = '' } = req.body;

  if (!rawText.trim()) {
    return errorResponse(res, 'Resume text is empty', 400);
  }

  // Extract contact info
  const emailMatch = rawText.match(/[\w.-]+@[\w.-]+\.\w+/);
  const phoneMatch = rawText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const githubMatch = rawText.match(/(github\.com\/[a-zA-Z0-9_-]+)/i);
  const linkedinMatch = rawText.match(/(linkedin\.com\/in\/[a-zA-Z0-9_-]+)/i);

  // Extract detected skills from reference dictionary
  const detectedSkills = [];
  SKILLS.forEach(skill => {
    const escaped = skill.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(rawText)) {
      detectedSkills.push(skill.name);
    }
  });

  return successResponse(res, {
    extracted: {
      email: emailMatch ? emailMatch[0] : '',
      phone: phoneMatch ? phoneMatch[0] : '',
      github: githubMatch ? githubMatch[0] : '',
      linkedin: linkedinMatch ? linkedinMatch[0] : '',
      skills: Array.from(new Set(detectedSkills)),
      wordCount: rawText.split(/\s+/).filter(Boolean).length
    }
  }, 'Resume text parsed successfully');
});

