import { ACTION_VERBS, WEAK_VERBS, ROLE_KEYWORDS } from '../seed/referenceData.js';

export function checkBullet(text = '') {
  if (!text || text.trim().length === 0) {
    return { hasWeak: false, suggestions: [], hasMetric: false, metricHint: null };
  }

  const lower = text.toLowerCase();
  const suggestions = [];

  for (const item of WEAK_VERBS) {
    if (lower.includes(item.weak)) {
      suggestions.push({
        weak: item.weak,
        better: item.better
      });
    }
  }

  const metricRegex = /(\b\d+(\.\d+)?%|\b\d+x|\$\d+|\b\d+\+?(\s*(ms|s|sec|seconds|users|clients|requests|queries|stars|x|k|m|million|lpa))|\b(reduced|increased|improved|boosted|saved)\s+by\s+\d+)/i;
  const hasMetric = metricRegex.test(text);

  return {
    hasWeak: suggestions.length > 0,
    suggestions,
    hasMetric,
    metricHint: hasMetric ? null : 'Add a measurable metric (e.g. "by 35%", "serving 5,000+ users", "in under 120ms")'
  };
}

export function calculateAtsScore(resumeData = {}, targetRoleId = 'swe') {
  const tips = [];
  let score = 0;

  // 1. Personal & Contact Info (20 pts)
  let contactScore = 0;
  const personal = resumeData.personal || {};
  if (personal.fullName?.trim()) contactScore += 5;
  if (personal.email?.includes('@')) contactScore += 5;
  if (personal.phone?.trim()) contactScore += 4;
  if (personal.github?.trim() || personal.linkedin?.trim()) contactScore += 6;
  else tips.push('Add your LinkedIn or GitHub profile link for recruiters to review your work.');
  score += contactScore;

  // 2. Professional Summary (15 pts)
  let summaryScore = 0;
  const summaryLength = resumeData.summary ? resumeData.summary.trim().split(/\s+/).length : 0;
  if (summaryLength >= 25 && summaryLength <= 80) {
    summaryScore = 15;
  } else if (summaryLength > 0 && summaryLength < 25) {
    summaryScore = 8;
    tips.push('Expand your Professional Summary to 30–60 words focusing on your primary tech stack.');
  } else if (summaryLength > 80) {
    summaryScore = 10;
    tips.push('Keep your Professional Summary concise (under 70 words) for quick ATS scanning.');
  } else {
    tips.push('Add a 2–3 sentence professional summary highlighting your career target and core stack.');
  }
  score += summaryScore;

  // 3. Technical Skills Depth (20 pts)
  let skillsScore = 0;
  const skillsList = Array.isArray(resumeData.skills) ? resumeData.skills : [];
  if (skillsList.length >= 8) {
    skillsScore = 20;
  } else if (skillsList.length >= 4) {
    skillsScore = 12;
    tips.push(`Include at least 8 key technical skills (currently ${skillsList.length}).`);
  } else {
    tips.push('Sync or add more technical skills from your calibrated skills page.');
  }
  score += skillsScore;

  // 4. Role-specific Keywords Alignment (20 pts)
  const targetKeywords = ROLE_KEYWORDS[targetRoleId] || ROLE_KEYWORDS['swe'];
  const fullResumeText = JSON.stringify(resumeData).toLowerCase();
  
  const matchedKeywords = targetKeywords.filter(kw => fullResumeText.includes(kw.toLowerCase()));
  const keywordRatio = matchedKeywords.length / targetKeywords.length;
  const keywordScore = Math.min(20, Math.round(keywordRatio * 25));
  score += keywordScore;

  if (keywordRatio < 0.4) {
    const missingTop3 = targetKeywords.filter(kw => !fullResumeText.includes(kw.toLowerCase())).slice(0, 3);
    tips.push(`ATS keyword density is low for target role. Consider adding terms like: ${missingTop3.join(', ')}.`);
  }

  // 5. Quantifiable Impact & Action Verbs in Projects/Experience (25 pts)
  let impactScore = 0;
  const projects = Array.isArray(resumeData.projects) ? resumeData.projects : [];
  const experience = Array.isArray(resumeData.experience) ? resumeData.experience : [];
  const allBullets = [
    ...projects.flatMap(p => p.bullets || []),
    ...experience.flatMap(e => e.bullets || [])
  ];

  if (allBullets.length > 0) {
    let bulletsWithMetrics = 0;
    let bulletsWithActionVerbs = 0;

    for (const b of allBullets) {
      const check = checkBullet(b);
      if (check.hasMetric) bulletsWithMetrics++;
      
      const firstWord = b.trim().split(/\s+/)[0];
      if (ACTION_VERBS.some(av => av.toLowerCase() === firstWord?.toLowerCase())) {
        bulletsWithActionVerbs++;
      }
    }

    const metricRatio = bulletsWithMetrics / allBullets.length;
    const actionRatio = bulletsWithActionVerbs / allBullets.length;

    impactScore += Math.min(13, Math.round(metricRatio * 13) + (bulletsWithMetrics > 0 ? 3 : 0));
    impactScore += Math.min(12, Math.round(actionRatio * 12) + (bulletsWithActionVerbs > 0 ? 3 : 0));

    if (metricRatio < 0.4) {
      tips.push('Quantify your results! Include metrics (e.g. "% improvement", "response time", "user count") in your bullets.');
    }
    if (actionRatio < 0.4) {
      tips.push('Start your bullet points with strong power action verbs (e.g. "Architected", "Engineered", "Optimized").');
    }
  } else {
    tips.push('Add at least 2 detailed projects or experiences with bullet points describing your technical contribution.');
  }
  score += Math.min(25, impactScore);

  const education = Array.isArray(resumeData.education) ? resumeData.education : [];
  if (education.length === 0) {
    tips.push('Add your degree, college name, and graduation year under Education.');
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    breakdown: {
      contact: { score: contactScore, max: 20 },
      summary: { score: summaryScore, max: 15 },
      skills: { score: skillsScore, max: 20 },
      keywords: { score: keywordScore, max: 20, matched: matchedKeywords.length, total: targetKeywords.length },
      impact: { score: Math.min(25, impactScore), max: 25 }
    },
    tips: tips.slice(0, 5)
  };
}

