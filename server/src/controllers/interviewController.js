import { prisma } from '../config/prisma.js';
import { successResponse, errorResponse, asyncHandler } from '../utils/response.js';
import { getQuestionsForRole, evaluateSession, INTERVIEW_QUESTIONS } from '../services/interviewService.js';
import { ROLES } from '../seed/referenceData.js';

// GET /api/v1/interview/questions
export const getInterviewQuestions = asyncHandler(async (req, res) => {
  const roleId = req.query.roleId || req.user.targetRole || 'swe';
  const difficulty = req.query.difficulty || 'intermediate';
  const count = parseInt(req.query.count, 10) || 4;

  const questions = getQuestionsForRole(roleId, difficulty, count);
  return successResponse(res, {
    roleId,
    difficulty,
    totalQuestions: questions.length,
    questions: questions.map(q => ({
      id: q.id,
      text: q.text,
      category: q.category,
      topic: q.topic,
      difficulty: q.difficulty,
      hints: q.hints
    }))
  });
});

// POST /api/v1/interview/evaluate
export const submitInterviewSession = asyncHandler(async (req, res) => {
  const { roleId = 'swe', difficulty = 'intermediate', answers = [] } = req.body;

  // Find role title
  const roleObj = ROLES.find(r => r.id === roleId) || ROLES[0];

  // Pair answers with matching question templates
  const questionsWithAnswers = answers.map(item => {
    const questionObj = INTERVIEW_QUESTIONS.find(q => q.id === item.questionId) || {
      id: item.questionId,
      text: item.questionText || 'Technical Question',
      category: item.category || 'technical',
      topic: item.topic || 'General',
      difficulty: difficulty,
      idealPoints: ['Structured technical problem solving', 'Clarity of communication'],
      rubricKeywords: ['solution', 'design', 'performance']
    };
    return {
      question: questionObj,
      answer: item.answer || ''
    };
  });

  const evaluation = evaluateSession(roleId, difficulty, questionsWithAnswers);

  // Persist interview session & questions in database
  const sessionRecord = await prisma.$transaction(async (tx) => {
    const session = await tx.interviewSession.create({
      data: {
        userId: req.user.id,
        roleId,
        roleTitle: roleObj.title,
        difficulty,
        overallScore: evaluation.overallScore,
        relevanceScore: evaluation.relevanceScore,
        correctnessScore: evaluation.correctnessScore,
        completenessScore: evaluation.completenessScore,
        feedback: evaluation.feedback,
        weakTopics: JSON.stringify(evaluation.weakTopics),
        resources: JSON.stringify(evaluation.resources)
      }
    });

    for (const q of evaluation.evaluatedQuestions) {
      await tx.interviewQuestion.create({
        data: {
          sessionId: session.id,
          questionText: q.questionText,
          category: q.category,
          topic: q.topic,
          difficulty: q.difficulty,
          userAnswer: q.userAnswer,
          score: q.overallScore,
          relevanceScore: q.relevanceScore,
          correctnessScore: q.correctnessScore,
          completenessScore: q.completenessScore,
          feedback: q.feedback,
          keyPointsMissed: JSON.stringify(q.keyPointsMissed),
          idealPoints: JSON.stringify(q.idealPoints)
        }
      });
    }

    return session;
  });

  return successResponse(res, {
    sessionId: sessionRecord.id,
    ...evaluation
  }, 'Interview evaluated and saved successfully', 201);
});

// GET /api/v1/interview/history
export const getInterviewHistory = asyncHandler(async (req, res) => {
  const sessions = await prisma.interviewSession.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      questions: true
    }
  });

  const formatted = sessions.map(s => ({
    id: s.id,
    roleId: s.roleId,
    roleTitle: s.roleTitle,
    difficulty: s.difficulty,
    overallScore: s.overallScore,
    relevanceScore: s.relevanceScore,
    correctnessScore: s.correctnessScore,
    completenessScore: s.completenessScore,
    feedback: s.feedback,
    weakTopics: JSON.parse(s.weakTopics || '[]'),
    resources: JSON.parse(s.resources || '[]'),
    date: s.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    questionsCount: s.questions.length
  }));

  return successResponse(res, formatted);
});

