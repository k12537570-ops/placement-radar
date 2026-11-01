import { SKILL_RESOURCES } from '../seed/referenceData.js';

export function buildRoadmapData({ gaps = [], weeksCount = 8, hoursPerDay = 3, targetRoleTitle = 'Software Engineer' }) {
  const prioritizedGaps = gaps.length > 0
    ? gaps.map(g => g.skillId)
    : ['dsa', 'algorithms', 'system-design', 'dbms', 'git-github', 'communication'];

  const uniqueSkills = Array.from(new Set([
    ...prioritizedGaps,
    'dsa', 'algorithms', 'system-design', 'dbms', 'git-github', 'communication', 'problem-solving'
  ]));

  const weeks = [];
  const hoursPerWeek = hoursPerDay * 6;

  for (let i = 0; i < weeksCount; i++) {
    const skillIndex = i % uniqueSkills.length;
    const skillId = uniqueSkills[skillIndex];
    const skillInfo = SKILL_RESOURCES[skillId] || {
      title: skillId.toUpperCase(),
      resources: [{ name: 'Documentation & Tutorials', url: 'https://devdocs.io', platform: 'Docs' }],
      taskTemplates: ['Read documentation and build a mini project', 'Practice 5 relevant problems']
    };

    const isReviewWeek = (i + 1) % 4 === 0;
    const weekNumber = i + 1;
    
    let themeTitle = `${skillInfo.title} Mastery & Drill`;
    let goalDescription = `Master high-frequency ${skillInfo.title} concepts tested in ${targetRoleTitle} technical interviews. Target: ${hoursPerWeek} study hours.`;
    
    if (isReviewWeek) {
      themeTitle = `Sprint Review, Mock Interviews & ${skillInfo.title}`;
      goalDescription = `Consolidate past weeks' learning, take a timed mock assessment, and reinforce ${skillInfo.title} weak spots.`;
    }

    const tasks = (skillInfo.taskTemplates || []).map((t, idx) => ({
      title: t,
      estimatedHours: Math.round(hoursPerWeek / (skillInfo.taskTemplates.length || 1)),
      done: false
    }));

    if (isReviewWeek) {
      tasks.push({
        title: `Complete a 90-minute timed mock interview / test under real placement conditions`,
        estimatedHours: 3,
        done: false
      });
    }

    weeks.push({
      weekNumber,
      skillId,
      skillTitle: skillInfo.title,
      themeTitle,
      goal: goalDescription,
      resources: skillInfo.resources || [],
      tasks,
      targetHours: hoursPerWeek
    });
  }

  return weeks;
}

export function updateStreakCalculation(lastActiveDate, currentStreak = 0, longestStreak = 0) {
  const today = new Date().toISOString().split('T')[0];
  
  if (lastActiveDate === today) {
    return {
      streakCurrent: currentStreak,
      streakLongest: longestStreak,
      lastActiveDate: today
    };
  }

  if (!lastActiveDate) {
    return {
      streakCurrent: 1,
      streakLongest: Math.max(1, longestStreak),
      lastActiveDate: today
    };
  }

  const last = new Date(lastActiveDate);
  const now = new Date(today);
  const diffDays = Math.round((now - last) / (1000 * 60 * 60 * 24));

  let newCurrent = 1;
  if (diffDays === 1) {
    newCurrent = currentStreak + 1;
  }

  return {
    streakCurrent: newCurrent,
    streakLongest: Math.max(newCurrent, longestStreak),
    lastActiveDate: today
  };
}

