import { prisma } from '../config/prisma.js';
import { successResponse, errorResponse, asyncHandler } from '../utils/response.js';
import { VERIFICATION_TOPICS, getAssessmentQuestions, evaluateAssessment } from '../services/verificationService.js';

// GET /api/v1/verify/topics
export const getVerificationTopics = asyncHandler(async (req, res) => {
  return successResponse(res, VERIFICATION_TOPICS);
});

// GET /api/v1/verify/quiz
export const getQuizQuestions = asyncHandler(async (req, res) => {
  const topicId = req.query.topicId || 'dsa';
  const difficulty = req.query.difficulty || 'intermediate';
  const count = parseInt(req.query.count, 10) || 5;

  const questions = getAssessmentQuestions(topicId, difficulty, count);
  return successResponse(res, {
    topicId,
    difficulty,
    totalQuestions: questions.length,
    questions
  });
});

// POST /api/v1/verify/submit
export const submitAssessment = asyncHandler(async (req, res) => {
  const { topicId = 'dsa', difficulty = 'intermediate', answers = {}, timeSpentSeconds = 0 } = req.body;

  const result = evaluateAssessment(topicId, difficulty, answers, timeSpentSeconds);

  // Persist assessment result in database
  const record = await prisma.skillVerification.create({
    data: {
      userId: req.user.id,
      topic: topicId,
      difficulty,
      score: result.score,
      totalQuestions: result.totalQuestions,
      correctAnswers: result.correctAnswers,
      timeSpentSeconds,
      passed: result.passed,
      assessmentType: 'mcq',
      detailedResults: JSON.stringify(result.detailedResults)
    }
  });

  return successResponse(res, {
    id: record.id,
    ...result
  }, 'Assessment submitted and verified successfully', 201);
});

// GET /api/v1/verify/history
export const getVerificationHistory = asyncHandler(async (req, res) => {
  const history = await prisma.skillVerification.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    take: 15
  });

  // Also fetch self-assessed ratings for side-by-side comparison
  const ratings = await prisma.skillRating.findMany({
    where: { userId: req.user.id }
  });

  const ratingMap = {};
  ratings.forEach(r => {
    ratingMap[r.skillId] = r.level;
  });

  const formatted = history.map(item => ({
    id: item.id,
    topic: item.topic,
    difficulty: item.difficulty,
    score: item.score,
    totalQuestions: item.totalQuestions,
    correctAnswers: item.correctAnswers,
    timeSpentSeconds: item.timeSpentSeconds,
    passed: item.passed,
    date: item.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    detailedResults: JSON.parse(item.detailedResults || '[]')
  }));

  return successResponse(res, {
    history: formatted,
    selfRatings: ratingMap
  });
});

