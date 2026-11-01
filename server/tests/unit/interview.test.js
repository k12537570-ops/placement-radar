import { describe, it, expect } from 'vitest';
import { getQuestionsForRole, evaluateInterviewAnswer, evaluateSession } from '../../src/services/interviewService.js';

describe('Interview Service Unit Tests', () => {
  it('getQuestionsForRole returns role-aligned interview questions', () => {
    const questions = getQuestionsForRole('swe', 'intermediate', 3);
    expect(questions.length).toBe(3);
    expect(questions[0].text).toBeDefined();
    expect(questions[0].topic).toBeDefined();
    expect(questions[0].idealPoints.length).toBeGreaterThan(0);
  });

  it('evaluateInterviewAnswer scores brief answers with low completeness', () => {
    const question = {
      text: 'Explain processes and threads.',
      idealPoints: ['Isolated address space', 'Shared memory', 'Context switch overhead'],
      rubricKeywords: ['address space', 'memory', 'context switch']
    };

    const briefResult = evaluateInterviewAnswer(question, 'they are different');
    expect(briefResult.overallScore).toBeLessThan(30);
    expect(briefResult.keyPointsMissed.length).toBeGreaterThan(0);
  });

  it('evaluateInterviewAnswer recognizes technical concepts and awards high score', () => {
    const question = {
      text: 'Explain processes and threads.',
      idealPoints: ['Isolated address space', 'Shared memory', 'Context switch overhead'],
      rubricKeywords: ['address space', 'shared memory', 'context switch']
    };

    const detailedAnswer = 'A process is an independent execution unit with its own virtual address space, file descriptors, and system resources. In contrast, threads exist within a parent process and share its heap and shared memory space while maintaining their own registers and execution stack. Context switch overhead is much lower between threads because page tables do not need to be reloaded into the CPU MMU.';
    const result = evaluateInterviewAnswer(question, detailedAnswer);

    expect(result.overallScore).toBeGreaterThanOrEqual(75);
    expect(result.relevanceScore).toBeGreaterThanOrEqual(70);
    expect(result.correctnessScore).toBeGreaterThanOrEqual(70);
    expect(result.feedback).toContain('depth');
  });

  it('evaluateSession aggregates overall performance and surfaces weak topics', () => {
    const items = [
      {
        question: {
          text: 'Explain arrays and linked lists',
          topic: 'Data Structures',
          idealPoints: ['contiguous memory', 'pointers'],
          rubricKeywords: ['contiguous', 'pointer']
        },
        answer: 'Arrays are contiguous blocks in RAM allowing O(1) random access while linked lists use node pointers.'
      },
      {
        question: {
          text: 'Explain Redis distributed caching',
          topic: 'System Design',
          idealPoints: ['cluster', 'cache stampede mutex'],
          rubricKeywords: ['cache stampede', 'mutex', 'redis']
        },
        answer: 'i do not know much about this topic'
      }
    ];

    const sessionResult = evaluateSession('swe', 'intermediate', items);
    expect(sessionResult.overallScore).toBeGreaterThan(0);
    expect(sessionResult.evaluatedQuestions.length).toBe(2);
    expect(sessionResult.weakTopics).toContain('System Design');
    expect(sessionResult.resources.length).toBeGreaterThan(0);
  });
});

