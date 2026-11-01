import { SKILLS, SKILL_CATEGORIES, ROLES, COMPANY_MODES } from '../seed/referenceData.js';

const WEIGHT_VALUES = {
  'critical': 3,
  'important': 2,
  'nice-to-have': 1,
  'optional': 0.5
};

export function getAdjustedRequirements(roleId = 'swe', companyMode = 'product') {
  const role = ROLES.find(r => r.id === roleId) || ROLES[0];
  const mode = COMPANY_MODES.find(m => m.id === companyMode) || COMPANY_MODES[0];
  
  const adjusted = {};
  for (const [skillId, req] of Object.entries(role.requirements)) {
    let scaledLevel = req.level;
    
    if (companyMode === 'faang') {
      if (['dsa', 'algorithms', 'system-design', 'os'].includes(skillId)) {
        scaledLevel = Math.min(5, req.level + 1);
      } else if (req.level > 0) {
        scaledLevel = Math.min(5, Math.ceil(req.level * 1.15));
      }
    } else if (companyMode === 'startup') {
      if (['react', 'javascript', 'nodejs', 'docker', 'git-github', 'rest-apis'].includes(skillId)) {
        scaledLevel = Math.min(5, req.level + 1);
      } else if (['os', 'cn'].includes(skillId) && req.level > 2) {
        scaledLevel = Math.max(1, req.level - 1);
      }
    } else if (companyMode === 'service') {
      if (['communication', 'teamwork'].includes(skillId)) {
        scaledLevel = Math.min(5, req.level + 1);
      } else if (req.level > 2) {
        scaledLevel = Math.max(1, Math.round(req.level * 0.85));
      }
    }
    
    adjusted[skillId] = {
      level: scaledLevel,
      weight: req.weight
    };
  }
  return adjusted;
}

export function calculateRoleMatch(userSkills = {}, userConfidence = {}, roleId = 'swe', companyMode = 'product') {
  const adjustedReqs = getAdjustedRequirements(roleId, companyMode);
  
  let totalWeightedTarget = 0;
  let totalWeightedScore = 0;
  const gaps = [];
  const strengths = [];
  const skillsAnalysis = {};
  
  for (const [skillId, req] of Object.entries(adjustedReqs)) {
    const targetLevel = req.level;
    const weightVal = WEIGHT_VALUES[req.weight] || 1;
    const userLevel = Number(userSkills[skillId]) || 0;
    const isConfident = Boolean(userConfidence[skillId]);
    
    // Confidence multiplier: 1.05x bonus if confident, 0.95x discount if not verified live
    const effectiveUserLevel = isConfident 
      ? Math.min(5, userLevel * 1.05) 
      : (userLevel > 2 ? userLevel * 0.95 : userLevel);
    
    const cappedScore = Math.min(targetLevel, effectiveUserLevel);
    totalWeightedScore += (cappedScore * weightVal);
    totalWeightedTarget += (targetLevel * weightVal);
    
    const rawGap = Math.max(0, targetLevel - userLevel);
    
    let priority = 'On Track';
    if (rawGap > 0 && targetLevel > 0) {
      if (req.weight === 'critical' && rawGap >= 2) priority = 'Critical';
      else if (req.weight === 'critical' || rawGap >= 2) priority = 'High';
      else if (req.weight === 'important') priority = 'Medium';
      else priority = 'Low';

      gaps.push({
        skillId,
        userLevel,
        targetLevel,
        rawGap,
        weight: req.weight,
        weightVal,
        weightedGap: rawGap * weightVal,
        priority,
        isConfident
      });
    } else if (userLevel >= targetLevel && targetLevel > 0) {
      strengths.push({
        skillId,
        userLevel,
        targetLevel,
        weight: req.weight,
        weightVal,
        surplus: userLevel - targetLevel,
        isConfident
      });
    }

    skillsAnalysis[skillId] = {
      userLevel,
      targetLevel,
      rawGap,
      priority,
      weight: req.weight,
      isConfident
    };
  }
  
  const readinessScore = totalWeightedTarget > 0 
    ? Math.round((totalWeightedScore / totalWeightedTarget) * 100) 
    : 0;
  
  gaps.sort((a, b) => b.weightedGap - a.weightedGap);
  strengths.sort((a, b) => (b.userLevel * b.weightVal) - (a.userLevel * a.weightVal));
  
  let verdict = 'Not ready';
  let verdictColor = 'text-red-600 dark:text-red-400';
  let verdictBadge = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  let verdictDesc = 'Significant gaps in critical skills. Focus on core requirements before applying.';
  
  if (readinessScore >= 85) {
    verdict = 'Placement-ready';
    verdictColor = 'text-emerald-600 dark:text-emerald-400';
    verdictBadge = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
    verdictDesc = 'Exceptional alignment! You meet or exceed industry requirements for this role.';
  } else if (readinessScore >= 66) {
    verdict = 'Almost ready';
    verdictColor = 'text-blue-600 dark:text-blue-400';
    verdictBadge = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    verdictDesc = 'Strong foundation. Polish your top 3-4 gaps and you will clear technical screens.';
  } else if (readinessScore >= 40) {
    verdict = 'Getting there';
    verdictColor = 'text-amber-600 dark:text-amber-400';
    verdictBadge = 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
    verdictDesc = 'Promising start. Follow the generated roadmap to bridge high-priority gaps.';
  }

  // Compute 6 Category Averages
  const categoryScores = {};
  const activeCategories = SKILL_CATEGORIES.filter(c => c.id !== 'all');
  activeCategories.forEach((cat) => {
    const catSkills = SKILLS.filter(s => s.category === cat.id);
    let uSum = 0;
    let rSum = 0;
    catSkills.forEach(s => {
      uSum += Number(userSkills[s.id]) || 0;
      rSum += adjustedReqs[s.id]?.level || 0;
    });
    categoryScores[cat.id] = {
      id: cat.id,
      name: cat.name,
      you: Number((uSum / catSkills.length).toFixed(1)),
      required: Number((rSum / catSkills.length).toFixed(1))
    };
  });
  
  return {
    readinessScore,
    verdict,
    verdictColor,
    verdictBadge,
    verdictDesc,
    categoryScores,
    skillsAnalysis,
    gaps,
    strengths,
    topGaps: gaps.slice(0, 5),
    totalGaps: gaps.length,
    criticalGaps: gaps.filter(g => g.priority === 'Critical').length
  };
}

export function simulateWhatIf(userSkills = {}, userConfidence = {}, overrides = {}, roleId = 'swe', companyMode = 'product') {
  const baseMatch = calculateRoleMatch(userSkills, userConfidence, roleId, companyMode);
  const simulatedSkills = { ...userSkills, ...overrides };
  const simulatedMatch = calculateRoleMatch(simulatedSkills, userConfidence, roleId, companyMode);
  
  return {
    baseScore: baseMatch.readinessScore,
    simulatedScore: simulatedMatch.readinessScore,
    scoreDelta: simulatedMatch.readinessScore - baseMatch.readinessScore,
    simulatedMatch
  };
}

export function compareAllRoles(userSkills = {}, userConfidence = {}, companyMode = 'product') {
  return ROLES.map(role => {
    const match = calculateRoleMatch(userSkills, userConfidence, role.id, companyMode);
    return {
      role: {
        id: role.id,
        title: role.title,
        subtitle: role.subtitle,
        icon: role.icon,
        category: role.category,
        salaryRange: role.salaryRange,
        marketDemand: role.marketDemand,
        topSkills: role.topSkills
      },
      readinessScore: match.readinessScore,
      verdict: match.verdict,
      criticalGaps: match.criticalGaps,
      totalGaps: match.totalGaps
    };
  }).sort((a, b) => b.readinessScore - a.readinessScore);
}

