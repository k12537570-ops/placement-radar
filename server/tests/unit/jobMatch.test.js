import { describe, it, expect } from 'vitest';
import { analyzeJobMatch } from '../../src/services/jobMatchService.js';

describe('Job Match Service Unit Tests', () => {
  it('analyzeJobMatch identifies matched and missing technical requirements', () => {
    const resumeData = {
      skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Node.js', 'Git'],
      summary: 'Frontend developer with React and Node experience.',
      experience: [{ bullets: ['Engineered scalable React components with Redux.'] }]
    };

    const jobDescription = `
      We are looking for a Full Stack Software Engineer.
      Requirements:
      - Hands-on proficiency in React and Node.js.
      - Experience with PostgreSQL database and Docker containers.
      - Strong knowledge of Git version control.
    `;

    const result = analyzeJobMatch(resumeData, jobDescription);
    expect(result.matchScore).toBeGreaterThan(0);
    expect(result.matchedKeywords).toContain('react');
    expect(result.matchedKeywords).toContain('node.js');
    expect(result.missingKeywords).toContain('postgresql');
    expect(result.missingKeywords).toContain('docker');
    expect(result.recommendations.length).toBeGreaterThan(0);
  });
});

