import { describe, it, expect } from 'vitest';
import { getAssessmentQuestions, evaluateAssessment, VERIFICATION_TOPICS } from '../../src/services/verificationService.js';

describe('Verification Service Unit Tests', () => {
  it('VERIFICATION_TOPICS lists valid technical domains', () => {
    expect(VERIFICATION_TOPICS.length).toBeGreaterThanOrEqual(8);
    const dsa = VERIFICATION_TOPICS.find(t => t.id === 'dsa');
    expect(dsa).toBeDefined();
  });

  it('getAssessmentQuestions strips out correct answers to prevent client leakage', () => {
    const questions = getAssessmentQuestions('dsa', 'intermediate', 4);
    expect(questions.length).toBe(4);
    expect(questions[0].id).toBeDefined();
    expect(questions[0].question).toBeDefined();
    expect(questions[0].options.length).toBe(4);
    expect(questions[0].correctAnswer).toBeUndefined();
    expect(questions[0].explanation).toBeUndefined();
  });

  it('evaluateAssessment accurately grades user answers and calculates percentage', () => {
    const userAnswers = {
      'dsa-1': 1, // correct O(log n)
      'dsa-2': 2, // correct Queue
      'dsa-3': 0, // incorrect (correct is 1)
      'dsa-4': 1, // correct O(log n)
      'dsa-5': 0  // correct 12
    };

    const evaluation = evaluateAssessment('dsa', 'intermediate', userAnswers, 120);
    expect(evaluation.totalQuestions).toBe(5);
    expect(evaluation.correctAnswers).toBe(4);
    expect(evaluation.score).toBe(80);
    expect(evaluation.passed).toBe(true);
    expect(evaluation.detailedResults.length).toBe(5);
    expect(evaluation.detailedResults[0].explanation).toBeDefined();
  });
});

