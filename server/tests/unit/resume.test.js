import { describe, it, expect } from 'vitest';
import { calculateAtsScore, checkBullet } from '../../src/services/resumeService.js';

describe('Resume Service Unit Tests', () => {
  it('calculateAtsScore evaluates sections, keywords, metrics and role fit', () => {
    const resume = {
      personal: { fullName: 'Alex Johnson', email: 'alex@example.com', phone: '+123456789', github: 'github.com/alex' },
      summary: 'Experienced Full Stack Engineer with strong proficiency in React, Node.js and TypeScript building scalable systems.',
      education: [{ degree: 'B.S. Computer Science', school: 'State University', year: '2025' }],
      skills: ['React', 'Node.js', 'TypeScript', 'SQL', 'Git', 'Data Structures', 'Algorithms'],
      experience: [{
        company: 'Tech Corp',
        role: 'Software Intern',
        bullets: ['Architected REST APIs reducing query latency by 45% using Redis caching.']
      }],
      projects: [{
        name: 'Placement Radar',
        bullets: ['Engineered full-stack analytics dashboard serving 1000 users.']
      }],
      certifications: ['AWS Certified Cloud Practitioner']
    };

    const result = calculateAtsScore(resume, 'swe');
    expect(result.score).toBeGreaterThan(60);
    expect(result.breakdown).toBeDefined();
    expect(result.breakdown.contact.score).toBeGreaterThan(0);
    expect(Array.isArray(result.tips)).toBe(true);
  });

  it('checkBullet provides XYZ formula diagnostics and improvements', () => {
    const weakBullet = 'worked on website and helped team';
    const weakCheck = checkBullet(weakBullet);
    expect(weakCheck.hasWeak).toBe(true);
    expect(weakCheck.hasMetric).toBe(false);

    const strongBullet = 'Architected responsive UI components, improving page load speed by 35%.';
    const strongCheck = checkBullet(strongBullet);
    expect(strongCheck.hasWeak).toBe(false);
    expect(strongCheck.hasMetric).toBe(true);
  });
});

