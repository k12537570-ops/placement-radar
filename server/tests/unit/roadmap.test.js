import { describe, it, expect } from 'vitest';
import { buildRoadmapData, updateStreakCalculation } from '../../src/services/roadmapService.js';

describe('Roadmap Service Unit Tests', () => {
  it('buildRoadmapData generates the requested number of weeks based on target role gaps', () => {
    const gaps = [
      { skillId: 'dsa', name: 'Data Structures', priority: 'Critical' },
      { skillId: 'system-design', name: 'System Design', priority: 'High' }
    ];

    const weeks = buildRoadmapData({
      gaps,
      weeksCount: 4,
      hoursPerDay: 3,
      targetRoleTitle: 'Software Engineer'
    });

    expect(weeks.length).toBe(4);
    expect(weeks[0].weekNumber).toBe(1);
    expect(weeks[0].tasks.length).toBeGreaterThan(0);
    expect(weeks[0].resources.length).toBeGreaterThan(0);
    expect(weeks[0].themeTitle).toBeDefined();
  });

  it('updateStreakCalculation handles first activity and consecutive days', () => {
    const today = new Date().toISOString().slice(0, 10);
    const initial = updateStreakCalculation(null, 0, 0);
    expect(initial.streakCurrent).toBe(1);
    expect(initial.streakLongest).toBe(1);
    expect(initial.lastActiveDate).toBe(today);

    // Same day activity shouldn't increment
    const sameDay = updateStreakCalculation(today, 1, 1);
    expect(sameDay.streakCurrent).toBe(1);
    expect(sameDay.streakLongest).toBe(1);

    // Consecutive day activity increments
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const consecutive = updateStreakCalculation(yesterday, 1, 1);
    expect(consecutive.streakCurrent).toBe(2);
    expect(consecutive.streakLongest).toBe(2);
  });
});

