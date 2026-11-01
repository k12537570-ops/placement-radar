import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import {
  hashPassword,
  comparePassword,
  hashToken,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie
} from '../utils/tokens.js';
import { successResponse, errorResponse, asyncHandler } from '../utils/response.js';
import { SKILLS } from '../seed/referenceData.js';

// Starter skills for guest preview
const GUEST_INITIAL_SKILLS = {
  'dsa': { level: 3, liveConfidence: true },
  'algorithms': { level: 2, liveConfidence: false },
  'system-design': { level: 2, liveConfidence: false },
  'os': { level: 2, liveConfidence: false },
  'cn': { level: 2, liveConfidence: false },
  'dbms': { level: 3, liveConfidence: false },
  'python': { level: 3, liveConfidence: true },
  'java': { level: 2, liveConfidence: false },
  'cpp': { level: 1, liveConfidence: false },
  'javascript': { level: 3, liveConfidence: true },
  'sql': { level: 3, liveConfidence: true },
  'html-css': { level: 3, liveConfidence: true },
  'react': { level: 3, liveConfidence: true },
  'nodejs': { level: 2, liveConfidence: false },
  'rest-apis': { level: 3, liveConfidence: false },
  'typescript': { level: 2, liveConfidence: false },
  'statistics': { level: 1, liveConfidence: false },
  'machine-learning': { level: 0, liveConfidence: false },
  'data-analysis': { level: 2, liveConfidence: false },
  'pandas-numpy': { level: 1, liveConfidence: false },
  'data-viz': { level: 2, liveConfidence: false },
  'git-github': { level: 3, liveConfidence: true },
  'docker': { level: 1, liveConfidence: false },
  'linux-cli': { level: 2, liveConfidence: false },
  'cloud': { level: 1, liveConfidence: false },
  'ci-cd': { level: 1, liveConfidence: false },
  'communication': { level: 3, liveConfidence: false },
  'teamwork': { level: 4, liveConfidence: true },
  'problem-solving': { level: 3, liveConfidence: false },
  'time-mgmt': { level: 3, liveConfidence: false }
};

export const signupSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address').toLowerCase(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    college: z.string().optional(),
    graduationYear: z.string().optional()
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address').toLowerCase(),
    password: z.string().min(1, 'Password is required')
  })
});

export const passwordChangeSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters')
  })
});

// Helper: store refresh token in database
async function storeRefreshToken(userId, rawToken) {
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt
    }
  });
}

// POST /auth/signup
export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, college, graduationYear } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return errorResponse(res, 'An account with this email already exists.', null, 409);
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email,
      passwordHash,
      college: college ? college.trim() : null,
      graduationYear: graduationYear || '2026',
      targetRole: 'swe',
      companyMode: 'product',
      onboardingDone: false,
      resume: {
        create: {
          template: 'classic',
          personal: JSON.stringify({
            fullName: name.trim(),
            title: 'Aspiring Software Engineer',
            email: email,
            phone: '',
            location: '',
            linkedin: '',
            github: ''
          }),
          summary: 'Motivated student preparing for placement interviews in Software Engineering.',
          skills: JSON.stringify([]),
          experience: JSON.stringify([]),
          projects: JSON.stringify([]),
          education: JSON.stringify([{
            id: 'edu-1',
            institution: college || 'University',
            degree: 'B.Tech / Bachelor of Science',
            period: `2022 — ${graduationYear || '2026'}`,
            score: ''
          }]),
          certifications: JSON.stringify([])
        }
      }
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
      onboardingDone: true,
      createdAt: true
    }
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await storeRefreshToken(user.id, refreshToken);
  setRefreshTokenCookie(res, refreshToken);

  return successResponse(res, { user, accessToken }, 'Account created successfully', 201);
});

// POST /auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user || !user.passwordHash) {
    return errorResponse(res, 'Invalid email or password', null, 401);
  }

  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) {
    return errorResponse(res, 'Invalid email or password', null, 401);
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    college: user.college,
    graduationYear: user.graduationYear,
    isGuest: user.isGuest,
    targetRole: user.targetRole,
    companyMode: user.companyMode,
    accent: user.accent,
    mode: user.mode,
    fontScale: user.fontScale,
    reduceMotion: user.reduceMotion,
    onboardingDone: user.onboardingDone,
    createdAt: user.createdAt
  };

  const accessToken = generateAccessToken(safeUser);
  const refreshToken = generateRefreshToken(safeUser);

  await storeRefreshToken(user.id, refreshToken);
  setRefreshTokenCookie(res, refreshToken);

  return successResponse(res, { user: safeUser, accessToken }, 'Login successful');
});

// POST /auth/guest
export const loginAsGuest = asyncHandler(async (req, res) => {
  const guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const guestEmail = `${guestId}@placementradar.demo`;
  const guestExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  // Create guest user and seed initial calibrated skills
  const user = await prisma.user.create({
    data: {
      name: 'Guest Student',
      email: guestEmail,
      isGuest: true,
      guestExpiresAt,
      college: 'Demo Tech Institute',
      graduationYear: '2026',
      targetRole: 'swe',
      companyMode: 'product',
      onboardingDone: false,
      skillRatings: {
        create: Object.entries(GUEST_INITIAL_SKILLS).map(([skillId, s]) => ({
          skillId,
          level: s.level,
          liveConfidence: s.liveConfidence
        }))
      },
      resume: {
        create: {
          template: 'classic',
          personal: JSON.stringify({
            fullName: 'Alex Vance',
            title: 'Aspiring Software Engineer',
            email: guestEmail,
            phone: '+91 98765 43210',
            location: 'Bangalore, India',
            linkedin: 'linkedin.com/in/alexvance',
            github: 'github.com/alexvance'
          }),
          summary: 'Proactive Computer Science undergraduate with hands-on proficiency in React, Node.js, and Algorithmic problem-solving.',
          skills: JSON.stringify(['Data Structures', 'Algorithms', 'React', 'Node.js', 'SQL', 'Git/GitHub']),
          experience: JSON.stringify([{
            id: 'exp-1',
            role: 'Software Development Intern',
            company: 'NovaTech Solutions',
            period: 'Jun 2024 — Aug 2024',
            location: 'Remote',
            bullets: ['Architected REST APIs in Node.js, reducing latency by 28%.']
          }]),
          projects: JSON.stringify([{
            id: 'proj-1',
            title: 'DevPulse Telemetry Dashboard',
            tech: 'React, Node.js, Docker',
            link: 'github.com/alexvance/devpulse',
            bullets: ['Engineered live streaming dashboard supporting 5,000+ mock server heartbeats.']
          }]),
          education: JSON.stringify([{
            id: 'edu-1',
            institution: 'National Institute of Technology',
            degree: 'B.Tech in Computer Science',
            period: '2022 — 2026',
            score: '8.8 / 10 CGPA'
          }]),
          certifications: JSON.stringify([{
            id: 'cert-1',
            name: 'Meta Front-End Developer Certificate',
            issuer: 'Coursera / Meta',
            date: '2024'
          }])
        }
      }
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
      onboardingDone: true,
      createdAt: true
    }
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await storeRefreshToken(user.id, refreshToken);
  setRefreshTokenCookie(res, refreshToken);

  return successResponse(res, { user, accessToken }, 'Guest session created', 201);
});

// POST /auth/refresh
export const refreshSession = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return errorResponse(res, 'Refresh token required', null, 401);
  }

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch (err) {
    clearRefreshTokenCookie(res);
    return errorResponse(res, 'Invalid refresh token', null, 401);
  }

  const tokenHash = hashToken(token);
  const storedToken = await prisma.refreshToken.findFirst({
    where: {
      tokenHash,
      userId: payload.userId,
      revokedAt: null,
      expiresAt: { gt: new Date() }
    }
  });

  if (!storedToken) {
    clearRefreshTokenCookie(res);
    return errorResponse(res, 'Refresh token expired or revoked', null, 401);
  }

  // Revoke used refresh token (token rotation)
  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: { revokedAt: new Date() }
  });

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
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
      onboardingDone: true,
      createdAt: true
    }
  });

  if (!user) {
    clearRefreshTokenCookie(res);
    return errorResponse(res, 'User no longer exists', null, 401);
  }

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  await storeRefreshToken(user.id, newRefreshToken);
  setRefreshTokenCookie(res, newRefreshToken);

  return successResponse(res, { user, accessToken: newAccessToken }, 'Session refreshed');
});

// POST /auth/logout
export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    const tokenHash = hashToken(token);
    await prisma.refreshToken.updateMany({
      where: { tokenHash },
      data: { revokedAt: new Date() }
    }).catch(() => {});
  }

  clearRefreshTokenCookie(res);
  return successResponse(res, null, 'Logged out successfully');
});

// GET /auth/me
export const getMe = asyncHandler(async (req, res) => {
  return successResponse(res, { user: req.user });
});

// PATCH /auth/password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (req.user.isGuest) {
    return errorResponse(res, 'Cannot change password on demo guest account', null, 403);
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id }
  });

  if (!user || !user.passwordHash) {
    return errorResponse(res, 'User not found', null, 404);
  }

  const isCurrentValid = await comparePassword(currentPassword, user.passwordHash);
  if (!isCurrentValid) {
    return errorResponse(res, 'Current password does not match', null, 400);
  }

  const newHash = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: req.user.id },
    data: { passwordHash: newHash }
  });

  // Revoke all existing refresh tokens for security
  await prisma.refreshToken.updateMany({
    where: { userId: req.user.id, revokedAt: null },
    data: { revokedAt: new Date() }
  });

  return successResponse(res, null, 'Password updated successfully');
});

