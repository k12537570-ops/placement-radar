import { SKILLS_DATA } from '../data/skills';
import { ROLES_DATA, COMPANY_MODES } from '../data/roles';

export function getScaledRequirement(baseLevel, companyModeId) {
  const mode = COMPANY_MODES.find(m => m.id === companyModeId) || COMPANY_MODES[0];
  let scaled = Math.round(baseLevel * mode.multiplier);
  return Math.max(1, Math.min(5, scaled));
}

export function calculateReadinessScore(userSkills = {}, targetRoleId = 'software-engineer', companyModeId = 'product', confidenceChecks = {}) {
  const role = ROLES_DATA.find(r => r.id === targetRoleId) || ROLES_DATA[0];
  const requiredSkills = role.requiredSkills || {};

  let totalWeightedScore = 0;
  let totalMaxWeight = 0;

  const weights = {
    'critical': 3.0,
    'important': 2.0,
    'nice-to-have': 1.0
  };

  Object.entries(requiredSkills).forEach(([skillId, req]) => {
    const userLevel = Number(userSkills[skillId] || 0);
    const scaledReq = getScaledRequirement(req.level, companyModeId);
    const weight = weights[req.weight] || 1.5;

    // Coverage ratio between 0 and 1
    let ratio = Math.min(1.0, userLevel / scaledReq);

    // Confidence boost: +10% credit if user marked confidence check and has basic rating
    if (confidenceChecks[skillId] && userLevel > 0) {
      ratio = Math.min(1.0, ratio + 0.1);
    }

    totalWeightedScore += (ratio * weight);
    totalMaxWeight += weight;
  });

  if (totalMaxWeight === 0) return 0;

  const rawScore = (totalWeightedScore / totalMaxWeight) * 100;
  return Math.round(Math.max(0, Math.min(100, rawScore)));
}

export function getScoreVerdict(score) {
  if (score < 45) {
    return {
      text: 'Not ready',
      color: '#DC2626',
      badgeClass: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400',
      description: 'Significant foundational gaps remain before competitive campus interviews.'
    };
  }
  if (score < 66) {
    return {
      text: 'Getting there',
      color: '#D97706',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400',
      description: 'Core concepts in place, but essential frameworks and problem solving require dedicated practice.'
    };
  }
  if (score < 85) {
    return {
      text: 'Almost ready',
      color: '#2563EB',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400',
      description: 'Strong profile matching most role benchmarks. Polishing top gaps will unlock high selection odds.'
    };
  }
  return {
    text: 'Placement-ready',
    color: '#16A34A',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400',
    description: 'Outstanding technical calibration exceeding target company benchmarks!'
  };
}

export function getCategoryRadarData(userSkills = {}, targetRoleId = 'software-engineer', companyModeId = 'product') {
  const role = ROLES_DATA.find(r => r.id === targetRoleId) || ROLES_DATA[0];
  const requiredSkills = role.requiredSkills || {};

  const categories = [
    { key: 'core-cs', label: 'Core CS' },
    { key: 'languages', label: 'Languages' },
    { key: 'web', label: 'Web Dev' },
    { key: 'data', label: 'Data & AI' },
    { key: 'tools', label: 'Tools & DevOps' },
    { key: 'soft-skills', label: 'Soft Skills' }
  ];

  return categories.map(cat => {
    const catSkills = SKILLS_DATA.filter(s => s.category === cat.key);
    
    let userSum = 0;
    let reqSum = 0;
    let count = 0;

    catSkills.forEach(s => {
      const req = requiredSkills[s.id];
      if (req) {
        userSum += Number(userSkills[s.id] || 0);
        reqSum += getScaledRequirement(req.level, companyModeId);
        count++;
      }
    });

    const userAvg = count > 0 ? Number((userSum / count).toFixed(1)) : 0;
    const reqAvg = count > 0 ? Number((reqSum / count).toFixed(1)) : 0;

    return {
      subject: cat.label,
      You: userAvg,
      Required: reqAvg,
      fullMark: 5
    };
  });
}

export function getSkillsRadarData(userSkills = {}, targetRoleId = 'software-engineer', companyModeId = 'product') {
  const role = ROLES_DATA.find(r => r.id === targetRoleId) || ROLES_DATA[0];
  const requiredSkills = role.requiredSkills || {};

  // Top 8-10 most critical/important skills for role
  const skillEntries = Object.entries(requiredSkills)
    .sort((a, b) => (b[1].weight === 'critical' ? 2 : 1) - (a[1].weight === 'critical' ? 2 : 1))
    .slice(0, 8);

  return skillEntries.map(([skillId, req]) => {
    const meta = SKILLS_DATA.find(s => s.id === skillId) || { name: skillId };
    return {
      subject: meta.name,
      You: Number(userSkills[skillId] || 0),
      Required: getScaledRequirement(req.level, companyModeId),
      fullMark: 5
    };
  });
}

export function calculateSkillGaps(userSkills = {}, targetRoleId = 'software-engineer', companyModeId = 'product') {
  const role = ROLES_DATA.find(r => r.id === targetRoleId) || ROLES_DATA[0];
  const requiredSkills = role.requiredSkills || {};

  const gaps = [];

  Object.entries(requiredSkills).forEach(([skillId, req]) => {
    const meta = SKILLS_DATA.find(s => s.id === skillId);
    if (!meta) return;

    const userLevel = Number(userSkills[skillId] || 0);
    const scaledReq = getScaledRequirement(req.level, companyModeId);
    const gap = Math.max(0, scaledReq - userLevel);

    const weightMultipliers = { 'critical': 3, 'important': 2, 'nice-to-have': 1 };
    const weightedGap = gap * (weightMultipliers[req.weight] || 1);

    let priority = 'Low';
    if (gap >= 2 && req.weight === 'critical') priority = 'Critical';
    else if (gap >= 1 && req.weight === 'critical') priority = 'High';
    else if (gap >= 2 || req.weight === 'important') priority = 'Medium';

    gaps.push({
      skillId,
      name: meta.name,
      category: meta.categoryName,
      userLevel,
      requiredLevel: scaledReq,
      gap,
      weightedGap,
      weight: req.weight,
      priority
    });
  });

  return gaps.sort((a, b) => b.weightedGap - a.weightedGap);
}

export function identifyStrengths(userSkills = {}, targetRoleId = 'software-engineer', companyModeId = 'product') {
  const role = ROLES_DATA.find(r => r.id === targetRoleId) || ROLES_DATA[0];
  const requiredSkills = role.requiredSkills || {};

  const strengths = [];

  Object.entries(requiredSkills).forEach(([skillId, req]) => {
    const meta = SKILLS_DATA.find(s => s.id === skillId);
    if (!meta) return;

    const userLevel = Number(userSkills[skillId] || 0);
    const scaledReq = getScaledRequirement(req.level, companyModeId);

    if (userLevel >= scaledReq && userLevel >= 2) {
      strengths.push({
        skillId,
        name: meta.name,
        category: meta.categoryName,
        userLevel,
        requiredLevel: scaledReq,
        surplus: userLevel - scaledReq
      });
    }
  });

  return strengths.sort((a, b) => b.userLevel - a.userLevel);
}

export function compareAllRoles(userSkills = {}, companyModeId = 'product', confidenceChecks = {}) {
  return ROLES_DATA.map(role => {
    const score = calculateReadinessScore(userSkills, role.id, companyModeId, confidenceChecks);
    return {
      roleId: role.id,
      name: role.name,
      badge: role.badge,
      category: role.category,
      tagline: role.tagline,
      score,
      verdict: getScoreVerdict(score)
    };
  }).sort((a, b) => b.score - a.score);
}
