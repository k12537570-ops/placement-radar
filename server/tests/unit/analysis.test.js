import { describe, it, expect } from 'vitest';
import { calculateRoleMatch, simulateWhatIf, compareAllRoles, getAdjustedRequirements } from '../../src/services/analysisService.js';
import { ROLES, COMPANY_MODES, SKILLS } from '../../src/seed/referenceData.js';

describe('Analysis Service Unit Tests', () => {
  it('getAdjustedRequirements adjusts skill expectations based on company mode', () => {
    const productReqs = getAdjustedRequirements('swe', 'product');
    const faangReqs = getAdjustedRequirements('swe', 'faang');

    expect(productReqs).toBeDefined();
    expect(faangReqs).toBeDefined();
    expect(faangReqs.dsa.level).toBeGreaterThanOrEqual(productReqs.dsa.level);
  });

  it('calculateRoleMatch correctly computes readiness score and gap list', () => {
    const userSkills = {
      'dsa': 4,
      'algorithms': 4,
      'system-design': 3,
      'react': 3
    };
    const userConfidence = {
      'dsa': true,
      'algorithms': true,
      'system-design': false,
      'react': false
    };

    const match = calculateRoleMatch(userSkills, userConfidence, 'swe', 'product');
    expect(match).toBeDefined();
    expect(match.readinessScore).toBeGreaterThanOrEqual(0);
    expect(match.readinessScore).toBeLessThanOrEqual(100);
    expect(match.categoryScores).toBeDefined();
    expect(Object.keys(match.categoryScores).length).toBe(6); // 6 categories
    expect(Array.isArray(match.gaps)).toBe(true);
    expect(Array.isArray(match.topGaps)).toBe(true);
    expect(match.verdict).toBeDefined();
  });

  it('simulateWhatIf calculates predicted improvement with simulated skill bumps', () => {
    const userSkills = {
      'dsa': 2,
      'react': 1
    };
    const userConfidence = {};

    const whatIf = simulateWhatIf(userSkills, userConfidence, {
      'dsa': 5,
      'system-design': 4
    }, 'swe', 'product');

    expect(whatIf.simulatedScore).toBeGreaterThanOrEqual(whatIf.baseScore);
    expect(whatIf.scoreDelta).toBe(whatIf.simulatedScore - whatIf.baseScore);
  });

  it('compareAllRoles ranks all 10 roles by readiness', () => {
    const userSkills = {
      'python': 5,
      'statistics': 4,
      'machine-learning': 4,
      'pandas-numpy': 4,
      'data-analysis': 4
    };
    const userConfidence = {
      'python': true,
      'statistics': true
    };

    const comparisons = compareAllRoles(userSkills, userConfidence, 'product');
    expect(comparisons.length).toBe(ROLES.length);
    expect(comparisons[0].readinessScore).toBeGreaterThanOrEqual(comparisons[comparisons.length - 1].readinessScore);

    const ds = comparisons.find(c => c.role.id === 'data-scientist');
    const devops = comparisons.find(c => c.role.id === 'devops');
    expect(ds.readinessScore).toBeGreaterThan(devops.readinessScore);
  });
});

