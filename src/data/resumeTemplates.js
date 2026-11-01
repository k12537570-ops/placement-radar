// ATS Analysis, Action Verbs, and Templates for Resume Builder

export const ACTION_VERBS = [
  'Architected', 'Engineered', 'Spearheaded', 'Optimized', 'Automated',
  'Orchestrated', 'Refactored', 'Accelerated', 'Implemented', 'Designed',
  'Streamlined', 'Deployed', 'Formulated', 'Overhauled', 'Scaled',
  'Eliminated', 'Integrated', 'Decoupled', 'Pioneered', 'Constructed'
];

export const WEAK_VERBS = [
  { weak: 'worked on', better: 'Engineered, Architected, or Developed' },
  { weak: 'helped with', better: 'Facilitated, Collaborated on, or Spearheaded' },
  { weak: 'responsible for', better: 'Led, Orchestrated, or Managed' },
  { weak: 'assisted in', better: 'Co-engineered or Accelerated' },
  { weak: 'did', better: 'Executed or Implemented' },
  { weak: 'made', better: 'Created, Built, or Synthesized' },
  { weak: 'tried to', better: 'Initiated, Piloted, or Researched' },
  { weak: 'handled', better: 'Managed, Resolved, or Coordinated' },
  { weak: 'was part of', better: 'Contributed to or Partnered with' },
  { weak: 'utilized', better: 'Leveraged or Employed' }
];

export const ROLE_KEYWORDS = {
  'swe': [
    'data structures', 'algorithms', 'system design', 'multithreading',
    'rest apis', 'sql', 'unit testing', 'git', 'microservices', 'concurrency',
    'oop', 'ci/cd', 'code review', 'debugging', 'scalability'
  ],
  'frontend': [
    'react', 'javascript', 'typescript', 'html5', 'css3', 'responsive design',
    'state management', 'rest apis', 'web performance', 'accessibility', 'a11y',
    'tailwind', 'component lifecycle', 'vite', 'dom manipulation'
  ],
  'backend': [
    'node.js', 'sql', 'dbms', 'rest apis', 'microservices', 'caching',
    'redis', 'database indexing', 'docker', 'system design', 'authentication',
    'postgresql', 'orm', 'concurrency', 'distributed systems'
  ],
  'fullstack': [
    'react', 'node.js', 'sql', 'rest apis', 'javascript', 'typescript',
    'html/css', 'git', 'docker', 'full stack', 'database design',
    'state management', 'ci/cd', 'agile', 'web services'
  ],
  'data-analyst': [
    'sql', 'data analysis', 'data visualization', 'python', 'pandas',
    'statistics', 'dashboards', 'tableau', 'excel', 'etl',
    'eda', 'kpi', 'reporting', 'data cleaning', 'business intelligence'
  ],
  'data-scientist': [
    'machine learning', 'python', 'statistics', 'pandas', 'numpy',
    'scikit-learn', 'deep learning', 'feature engineering', 'model evaluation',
    'regression', 'classification', 'sql', 'data pipeline', 'eda'
  ],
  'devops': [
    'docker', 'kubernetes', 'ci/cd', 'linux', 'bash', 'cloud',
    'aws', 'infrastructure as code', 'terraform', 'monitoring',
    'git', 'automation', 'nginx', 'networking', 'telemetry'
  ],
  'cloud-engineer': [
    'aws', 'gcp', 'cloud computing', 'iam', 's3', 'ec2', 'virtual networks',
    'vpc', 'docker', 'linux', 'terraform', 'security', 'scalability',
    'high availability', 'disaster recovery'
  ],
  'mobile-dev': [
    'react native', 'ios', 'android', 'mobile', 'javascript', 'typescript',
    'rest apis', 'mobile ui', 'offline storage', 'push notifications',
    'state management', 'git', 'lifecycle', 'app store', 'play store'
  ],
  'qa-sdet': [
    'test automation', 'selenium', 'cypress', 'jest', 'rest apis', 'ci/cd',
    'regression testing', 'unit test', 'integration test', 'bug tracking',
    'quality assurance', 'python', 'java', 'sql', 'performance testing'
  ]
};

// Analyze bullet point for weak words & metric presence
export function checkBullet(text = '') {
  if (!text || text.trim().length === 0) {
    return { hasWeak: false, suggestions: [], hasMetric: false };
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

  // Check for quantifiable metrics (percentages, numbers with k/m/x, currency, speed)
  const metricRegex = /(\b\d+(\.\d+)?%|\b\d+x|\$\d+|\b\d+\+?(\s*(ms|s|sec|seconds|users|clients|requests|queries|stars|x|k|m|million|lpa))|\b(reduced|increased|improved|boosted|saved)\s+by\s+\d+)/i;
  const hasMetric = metricRegex.test(text);

  return {
    hasWeak: suggestions.length > 0,
    suggestions,
    hasMetric,
    metricHint: hasMetric ? null : 'Add a measurable metric (e.g. "by 35%", "serving 5,000+ users", "in under 120ms")'
  };
}

// Rule-based ATS Resume Analyzer (Score 0 - 100)
export function analyzeResumeATS(resumeData, targetRoleId = 'swe') {
  if (!resumeData) return { score: 0, breakdown: {}, tips: [] };

  const tips = [];
  let score = 0;

  // 1. Personal & Contact Info (20 pts)
  let contactScore = 0;
  const { personal = {} } = resumeData;
  if (personal.fullName?.trim()) contactScore += 5;
  if (personal.email?.includes('@')) contactScore += 5;
  if (personal.phone?.trim()) contactScore += 4;
  if (personal.github?.trim() || personal.linkedin?.trim()) contactScore += 6;
  else tips.push('Add your LinkedIn or GitHub profile link for recruiters to review your work.');
  score += contactScore;

  // 2. Professional Summary (15 pts)
  let summaryScore = 0;
  const summaryLength = personal.summary ? personal.summary.trim().split(/\s+/).length : 0;
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
  const projects = resumeData.projects || [];
  const experience = resumeData.experience || [];
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

  // Education verification
  const education = resumeData.education || [];
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
    tips: tips.slice(0, 5) // Return top 5 prioritized tips
  };
}

// Default initial starter resume
export const DEFAULT_RESUME = {
  template: 'classic', // 'classic' | 'modern' | 'minimal'
  personal: {
    fullName: 'Alex Vance',
    title: 'Aspiring Software Engineer',
    email: 'alex.vance@campus.edu',
    phone: '+91 98765 43210',
    location: 'Bangalore, India',
    linkedin: 'linkedin.com/in/alexvance',
    github: 'github.com/alexvance',
    portfolio: 'alexvance.dev',
    summary: 'Proactive Computer Science undergraduate with hands-on proficiency in React, Node.js, and Algorithmic problem-solving. Proven track record building high-performance web applications and scalable database schemas. Seeking a fast-paced Software Engineering role.'
  },
  education: [
    {
      id: 'edu-1',
      institution: 'National Institute of Technology',
      degree: 'B.Tech in Computer Science and Engineering',
      score: '8.8 / 10.0 CGPA',
      period: '2022 — 2026',
      location: 'Bangalore'
    }
  ],
  skills: [
    'Data Structures & Algorithms',
    'React & Redux',
    'Node.js / Express',
    'TypeScript',
    'SQL & DBMS',
    'RESTful APIs',
    'Git / GitHub',
    'Docker & Linux',
    'Tailwind CSS'
  ],
  experience: [
    {
      id: 'exp-1',
      role: 'Software Development Intern',
      company: 'NovaTech Cloud Solutions',
      period: 'Jun 2024 — Aug 2024',
      location: 'Remote',
      bullets: [
        'Architected high-throughput REST API endpoints in Node.js, reducing server response latency by 28%.',
        'Implemented Redis caching layer for top 20 database queries, boosting dashboard load times by 40%.',
        'Engineered responsive React interface components following strict WCAG 2.1 accessibility standards.'
      ]
    }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'DevPulse — Real-Time Telemetry & Monitoring Dashboard',
      tech: 'React, TypeScript, WebSocket, Docker, Tailwind CSS',
      link: 'github.com/alexvance/devpulse',
      bullets: [
        'Engineered live streaming dashboard supporting 5,000+ mock server heartbeats using WebSockets.',
        'Optimized client-side DOM rendering with virtualized tables, sustaining a stable 60 FPS under load.',
        'Automated CI/CD build and Docker container deployment workflow via GitHub Actions.'
      ]
    },
    {
      id: 'proj-2',
      title: 'Algoverse — Interactive Algorithm & Data Structure Visualizer',
      tech: 'React, Canvas API, Algorithms, Tailwind',
      link: 'github.com/alexvance/algoverse',
      bullets: [
        'Constructed step-by-step visualizer for Graph DFS/BFS, Dijkstra, and 6 sorting algorithms.',
        'Spearheaded custom speed controls and step-by-step time complexity callouts used by 1,200+ students.',
        'Designed modular state machine to pause, resume, and inspect internal array states.'
      ]
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'Meta Front-End Developer Professional Certificate',
      issuer: 'Coursera / Meta',
      date: '2024'
    },
    {
      id: 'cert-2',
      name: 'SQL & Relational Database Design Specialization',
      issuer: 'HackerRank (5-Star Verified)',
      date: '2023'
    }
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'Global Rank 412 / 18,000+ in LeetCode Biweekly Contest 124'
    },
    {
      id: 'ach-2',
      title: 'Winner — Inter-College Hackathon 2024 (Built offline emergency coordination PWA)'
    }
  ]
};

