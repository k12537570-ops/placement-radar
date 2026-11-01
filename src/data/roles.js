// 10 Industry Job Roles with 30 skills requirements & weights
// Weights: critical (weight 3), important (weight 2), nice-to-have (weight 1), optional (weight 0)

export const COMPANY_MODES = [
  {
    id: 'product',
    name: 'Product-based (Baseline)',
    tagline: 'Swiggy, Razorpay, Atlassian, Uber',
    description: 'Balanced mix of strong DSA, modern system design, and practical framework depth.',
    multiplier: 1.0,
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
  },
  {
    id: 'faang',
    name: 'FAANG-level (Top Tier)',
    tagline: 'Google, Meta, Amazon, Microsoft, Apple',
    description: 'High bar on advanced DSA, DP, Graphs, Concurrency, and large-scale System Design.',
    multiplier: 1.25,
    badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
  },
  {
    id: 'startup',
    name: 'Early / Growth Startup',
    tagline: 'Y Combinator & High-growth series A/B',
    description: 'Prioritizes rapid shipping, modern web stacks, Docker, CI/CD, and fast self-learning.',
    multiplier: 1.05,
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
  },
  {
    id: 'service',
    name: 'Service-based MNC',
    tagline: 'TCS, Infosys, Wipro, Cognizant, Accenture',
    description: 'Emphasis on aptitude, core CS fundamentals, Java/Python, and clear communication.',
    multiplier: 0.85,
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
  }
];

export const ROLES = [
  {
    id: 'swe',
    title: 'Software Engineer',
    subtitle: 'Core Systems & Generalist Developer',
    icon: 'Code2',
    category: 'Engineering',
    salaryRange: '₹8 - 25 LPA',
    marketDemand: 'Very High',
    description: 'Builds reliable software systems, implements complex algorithms, writes unit-tested clean code, and designs scalable backend architecture.',
    topSkills: ['Data Structures', 'Algorithms', 'System Design', 'DBMS', 'Git/GitHub'],
    requirements: {
      'dsa': { level: 4, weight: 'critical' },
      'algorithms': { level: 4, weight: 'critical' },
      'system-design': { level: 3, weight: 'important' },
      'os': { level: 3, weight: 'important' },
      'cn': { level: 3, weight: 'important' },
      'dbms': { level: 4, weight: 'critical' },
      'python': { level: 3, weight: 'important' },
      'java': { level: 3, weight: 'important' },
      'cpp': { level: 3, weight: 'nice-to-have' },
      'javascript': { level: 2, weight: 'nice-to-have' },
      'sql': { level: 4, weight: 'critical' },
      'html-css': { level: 1, weight: 'optional' },
      'react': { level: 1, weight: 'optional' },
      'nodejs': { level: 2, weight: 'nice-to-have' },
      'rest-apis': { level: 3, weight: 'important' },
      'typescript': { level: 2, weight: 'optional' },
      'statistics': { level: 1, weight: 'optional' },
      'machine-learning': { level: 1, weight: 'optional' },
      'data-analysis': { level: 2, weight: 'optional' },
      'pandas-numpy': { level: 1, weight: 'optional' },
      'data-viz': { level: 1, weight: 'optional' },
      'git-github': { level: 4, weight: 'critical' },
      'docker': { level: 2, weight: 'nice-to-have' },
      'linux-cli': { level: 3, weight: 'important' },
      'cloud': { level: 2, weight: 'nice-to-have' },
      'ci-cd': { level: 2, weight: 'nice-to-have' },
      'communication': { level: 3, weight: 'important' },
      'teamwork': { level: 4, weight: 'important' },
      'problem-solving': { level: 4, weight: 'critical' },
      'time-mgmt': { level: 3, weight: 'important' }
    }
  },
  {
    id: 'frontend',
    title: 'Frontend Engineer',
    subtitle: 'UI/UX & Client Applications',
    icon: 'Layout',
    category: 'Web',
    salaryRange: '₹7 - 22 LPA',
    marketDemand: 'High',
    description: 'Creates responsive, accessible, interactive web interfaces using React, modern CSS, and state management while maintaining 60fps performance.',
    topSkills: ['React', 'JavaScript', 'TypeScript', 'HTML/CSS', 'REST APIs'],
    requirements: {
      'dsa': { level: 3, weight: 'important' },
      'algorithms': { level: 3, weight: 'important' },
      'system-design': { level: 2, weight: 'nice-to-have' },
      'os': { level: 2, weight: 'optional' },
      'cn': { level: 3, weight: 'important' },
      'dbms': { level: 2, weight: 'optional' },
      'python': { level: 1, weight: 'optional' },
      'java': { level: 1, weight: 'optional' },
      'cpp': { level: 1, weight: 'optional' },
      'javascript': { level: 5, weight: 'critical' },
      'sql': { level: 1, weight: 'optional' },
      'html-css': { level: 5, weight: 'critical' },
      'react': { level: 5, weight: 'critical' },
      'nodejs': { level: 3, weight: 'important' },
      'rest-apis': { level: 4, weight: 'critical' },
      'typescript': { level: 4, weight: 'critical' },
      'statistics': { level: 1, weight: 'optional' },
      'machine-learning': { level: 0, weight: 'optional' },
      'data-analysis': { level: 1, weight: 'optional' },
      'pandas-numpy': { level: 0, weight: 'optional' },
      'data-viz': { level: 3, weight: 'nice-to-have' },
      'git-github': { level: 4, weight: 'critical' },
      'docker': { level: 2, weight: 'nice-to-have' },
      'linux-cli': { level: 2, weight: 'nice-to-have' },
      'cloud': { level: 2, weight: 'nice-to-have' },
      'ci-cd': { level: 3, weight: 'important' },
      'communication': { level: 4, weight: 'important' },
      'teamwork': { level: 4, weight: 'important' },
      'problem-solving': { level: 4, weight: 'critical' },
      'time-mgmt': { level: 3, weight: 'important' }
    }
  },
  {
    id: 'backend',
    title: 'Backend Engineer',
    subtitle: 'APIs, Databases & Server Architecture',
    icon: 'Server',
    category: 'Engineering',
    salaryRange: '₹8 - 26 LPA',
    marketDemand: 'Very High',
    description: 'Designs high-concurrency microservices, robust relational & NoSQL schemas, asynchronous task queues, and secure REST/gRPC endpoints.',
    topSkills: ['Node.js / Java', 'DBMS & SQL', 'System Design', 'REST APIs', 'Docker'],
    requirements: {
      'dsa': { level: 4, weight: 'critical' },
      'algorithms': { level: 4, weight: 'critical' },
      'system-design': { level: 4, weight: 'critical' },
      'os': { level: 4, weight: 'critical' },
      'cn': { level: 4, weight: 'critical' },
      'dbms': { level: 5, weight: 'critical' },
      'python': { level: 3, weight: 'important' },
      'java': { level: 4, weight: 'important' },
      'cpp': { level: 2, weight: 'optional' },
      'javascript': { level: 4, weight: 'important' },
      'sql': { level: 5, weight: 'critical' },
      'html-css': { level: 1, weight: 'optional' },
      'react': { level: 1, weight: 'optional' },
      'nodejs': { level: 5, weight: 'critical' },
      'rest-apis': { level: 5, weight: 'critical' },
      'typescript': { level: 4, weight: 'important' },
      'statistics': { level: 1, weight: 'optional' },
      'machine-learning': { level: 1, weight: 'optional' },
      'data-analysis': { level: 2, weight: 'nice-to-have' },
      'pandas-numpy': { level: 1, weight: 'optional' },
      'data-viz': { level: 1, weight: 'optional' },
      'git-github': { level: 4, weight: 'critical' },
      'docker': { level: 4, weight: 'important' },
      'linux-cli': { level: 4, weight: 'critical' },
      'cloud': { level: 3, weight: 'important' },
      'ci-cd': { level: 3, weight: 'important' },
      'communication': { level: 3, weight: 'important' },
      'teamwork': { level: 4, weight: 'important' },
      'problem-solving': { level: 5, weight: 'critical' },
      'time-mgmt': { level: 3, weight: 'important' }
    }
  },
  {
    id: 'fullstack',
    title: 'Full Stack Engineer',
    subtitle: 'End-to-End Application Delivery',
    icon: 'Layers',
    category: 'Engineering',
    salaryRange: '₹8 - 24 LPA',
    marketDemand: 'Very High',
    description: 'Bridges frontend UX and backend architecture, seamlessly building end-to-end features from UI state to database persistence.',
    topSkills: ['React', 'Node.js', 'DBMS', 'REST APIs', 'Git/GitHub'],
    requirements: {
      'dsa': { level: 3, weight: 'important' },
      'algorithms': { level: 3, weight: 'important' },
      'system-design': { level: 3, weight: 'important' },
      'os': { level: 3, weight: 'nice-to-have' },
      'cn': { level: 3, weight: 'important' },
      'dbms': { level: 4, weight: 'critical' },
      'python': { level: 3, weight: 'nice-to-have' },
      'java': { level: 2, weight: 'optional' },
      'cpp': { level: 1, weight: 'optional' },
      'javascript': { level: 5, weight: 'critical' },
      'sql': { level: 4, weight: 'critical' },
      'html-css': { level: 4, weight: 'critical' },
      'react': { level: 4, weight: 'critical' },
      'nodejs': { level: 4, weight: 'critical' },
      'rest-apis': { level: 5, weight: 'critical' },
      'typescript': { level: 4, weight: 'important' },
      'statistics': { level: 1, weight: 'optional' },
      'machine-learning': { level: 1, weight: 'optional' },
      'data-analysis': { level: 2, weight: 'nice-to-have' },
      'pandas-numpy': { level: 1, weight: 'optional' },
      'data-viz': { level: 2, weight: 'nice-to-have' },
      'git-github': { level: 4, weight: 'critical' },
      'docker': { level: 3, weight: 'important' },
      'linux-cli': { level: 3, weight: 'important' },
      'cloud': { level: 3, weight: 'important' },
      'ci-cd': { level: 3, weight: 'important' },
      'communication': { level: 4, weight: 'important' },
      'teamwork': { level: 4, weight: 'important' },
      'problem-solving': { level: 4, weight: 'critical' },
      'time-mgmt': { level: 4, weight: 'important' }
    }
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    subtitle: 'Insights, Metrics & BI Dashboards',
    icon: 'BarChart3',
    category: 'Data',
    salaryRange: '₹6 - 16 LPA',
    marketDemand: 'High',
    description: 'Extracts, transforms, and analyzes large datasets to uncover trends, build KPI dashboards, and deliver actionable business intelligence.',
    topSkills: ['SQL', 'Data Analysis', 'Data Visualization', 'Python', 'Statistics'],
    requirements: {
      'dsa': { level: 2, weight: 'nice-to-have' },
      'algorithms': { level: 2, weight: 'nice-to-have' },
      'system-design': { level: 1, weight: 'optional' },
      'os': { level: 1, weight: 'optional' },
      'cn': { level: 1, weight: 'optional' },
      'dbms': { level: 4, weight: 'critical' },
      'python': { level: 4, weight: 'critical' },
      'java': { level: 1, weight: 'optional' },
      'cpp': { level: 1, weight: 'optional' },
      'javascript': { level: 1, weight: 'optional' },
      'sql': { level: 5, weight: 'critical' },
      'html-css': { level: 1, weight: 'optional' },
      'react': { level: 0, weight: 'optional' },
      'nodejs': { level: 0, weight: 'optional' },
      'rest-apis': { level: 2, weight: 'nice-to-have' },
      'typescript': { level: 0, weight: 'optional' },
      'statistics': { level: 4, weight: 'critical' },
      'machine-learning': { level: 2, weight: 'nice-to-have' },
      'data-analysis': { level: 5, weight: 'critical' },
      'pandas-numpy': { level: 4, weight: 'critical' },
      'data-viz': { level: 5, weight: 'critical' },
      'git-github': { level: 3, weight: 'important' },
      'docker': { level: 1, weight: 'optional' },
      'linux-cli': { level: 2, weight: 'nice-to-have' },
      'cloud': { level: 2, weight: 'nice-to-have' },
      'ci-cd': { level: 1, weight: 'optional' },
      'communication': { level: 5, weight: 'critical' },
      'teamwork': { level: 4, weight: 'important' },
      'problem-solving': { level: 4, weight: 'critical' },
      'time-mgmt': { level: 3, weight: 'important' }
    }
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist / ML Engineer',
    subtitle: 'Predictive Modeling & Applied AI',
    icon: 'Cpu',
    category: 'Data',
    salaryRange: '₹9 - 28 LPA',
    marketDemand: 'High',
    description: 'Develops mathematical models, fine-tunes deep neural networks, engineers domain features, and deploys scalable inference pipelines.',
    topSkills: ['Machine Learning', 'Python', 'Statistics', 'Pandas/NumPy', 'DSA'],
    requirements: {
      'dsa': { level: 4, weight: 'critical' },
      'algorithms': { level: 4, weight: 'critical' },
      'system-design': { level: 3, weight: 'important' },
      'os': { level: 2, weight: 'nice-to-have' },
      'cn': { level: 2, weight: 'nice-to-have' },
      'dbms': { level: 4, weight: 'important' },
      'python': { level: 5, weight: 'critical' },
      'java': { level: 2, weight: 'optional' },
      'cpp': { level: 2, weight: 'nice-to-have' },
      'javascript': { level: 1, weight: 'optional' },
      'sql': { level: 4, weight: 'critical' },
      'html-css': { level: 1, weight: 'optional' },
      'react': { level: 1, weight: 'optional' },
      'nodejs': { level: 1, weight: 'optional' },
      'rest-apis': { level: 3, weight: 'important' },
      'typescript': { level: 1, weight: 'optional' },
      'statistics': { level: 5, weight: 'critical' },
      'machine-learning': { level: 5, weight: 'critical' },
      'data-analysis': { level: 4, weight: 'critical' },
      'pandas-numpy': { level: 5, weight: 'critical' },
      'data-viz': { level: 4, weight: 'important' },
      'git-github': { level: 4, weight: 'important' },
      'docker': { level: 3, weight: 'important' },
      'linux-cli': { level: 3, weight: 'important' },
      'cloud': { level: 3, weight: 'important' },
      'ci-cd': { level: 2, weight: 'nice-to-have' },
      'communication': { level: 4, weight: 'important' },
      'teamwork': { level: 4, weight: 'important' },
      'problem-solving': { level: 5, weight: 'critical' },
      'time-mgmt': { level: 3, weight: 'important' }
    }
  },
  {
    id: 'devops',
    title: 'DevOps Engineer',
    subtitle: 'Infrastructure, CI/CD & Reliability',
    icon: 'Terminal',
    category: 'Operations',
    salaryRange: '₹8 - 25 LPA',
    marketDemand: 'Very High',
    description: 'Automates deployments, provisions infrastructure as code, secures container clusters, and monitors telemetry metrics for zero downtime.',
    topSkills: ['Docker', 'Linux/CLI', 'CI/CD', 'Cloud (AWS/GCP)', 'Computer Networks'],
    requirements: {
      'dsa': { level: 2, weight: 'nice-to-have' },
      'algorithms': { level: 2, weight: 'nice-to-have' },
      'system-design': { level: 4, weight: 'critical' },
      'os': { level: 5, weight: 'critical' },
      'cn': { level: 5, weight: 'critical' },
      'dbms': { level: 3, weight: 'important' },
      'python': { level: 4, weight: 'important' },
      'java': { level: 1, weight: 'optional' },
      'cpp': { level: 1, weight: 'optional' },
      'javascript': { level: 2, weight: 'optional' },
      'sql': { level: 3, weight: 'important' },
      'html-css': { level: 1, weight: 'optional' },
      'react': { level: 0, weight: 'optional' },
      'nodejs': { level: 2, weight: 'nice-to-have' },
      'rest-apis': { level: 3, weight: 'important' },
      'typescript': { level: 2, weight: 'optional' },
      'statistics': { level: 1, weight: 'optional' },
      'machine-learning': { level: 1, weight: 'optional' },
      'data-analysis': { level: 2, weight: 'optional' },
      'pandas-numpy': { level: 1, weight: 'optional' },
      'data-viz': { level: 2, weight: 'nice-to-have' },
      'git-github': { level: 5, weight: 'critical' },
      'docker': { level: 5, weight: 'critical' },
      'linux-cli': { level: 5, weight: 'critical' },
      'cloud': { level: 5, weight: 'critical' },
      'ci-cd': { level: 5, weight: 'critical' },
      'communication': { level: 3, weight: 'important' },
      'teamwork': { level: 4, weight: 'important' },
      'problem-solving': { level: 4, weight: 'critical' },
      'time-mgmt': { level: 4, weight: 'important' }
    }
  },
  {
    id: 'cloud-engineer',
    title: 'Cloud Engineer',
    subtitle: 'Cloud Architecture & Multi-tenant Platforms',
    icon: 'Cloud',
    category: 'Operations',
    salaryRange: '₹8 - 24 LPA',
    marketDemand: 'High',
    description: 'Designs, secures, and maintains cloud compute, storage, virtual networks, IAM policies, and cost-effective cloud services across AWS/GCP.',
    topSkills: ['Cloud (AWS/GCP)', 'Computer Networks', 'Linux/CLI', 'System Design', 'Docker'],
    requirements: {
      'dsa': { level: 2, weight: 'nice-to-have' },
      'algorithms': { level: 2, weight: 'nice-to-have' },
      'system-design': { level: 4, weight: 'critical' },
      'os': { level: 4, weight: 'critical' },
      'cn': { level: 5, weight: 'critical' },
      'dbms': { level: 3, weight: 'important' },
      'python': { level: 3, weight: 'important' },
      'java': { level: 2, weight: 'optional' },
      'cpp': { level: 1, weight: 'optional' },
      'javascript': { level: 2, weight: 'optional' },
      'sql': { level: 3, weight: 'important' },
      'html-css': { level: 1, weight: 'optional' },
      'react': { level: 0, weight: 'optional' },
      'nodejs': { level: 2, weight: 'nice-to-have' },
      'rest-apis': { level: 3, weight: 'important' },
      'typescript': { level: 2, weight: 'optional' },
      'statistics': { level: 1, weight: 'optional' },
      'machine-learning': { level: 1, weight: 'optional' },
      'data-analysis': { level: 1, weight: 'optional' },
      'pandas-numpy': { level: 1, weight: 'optional' },
      'data-viz': { level: 2, weight: 'optional' },
      'git-github': { level: 4, weight: 'important' },
      'docker': { level: 4, weight: 'critical' },
      'linux-cli': { level: 5, weight: 'critical' },
      'cloud': { level: 5, weight: 'critical' },
      'ci-cd': { level: 4, weight: 'critical' },
      'communication': { level: 3, weight: 'important' },
      'teamwork': { level: 4, weight: 'important' },
      'problem-solving': { level: 4, weight: 'critical' },
      'time-mgmt': { level: 3, weight: 'important' }
    }
  },
  {
    id: 'mobile-dev',
    title: 'Mobile App Developer',
    subtitle: 'iOS, Android & Cross-Platform Apps',
    icon: 'Smartphone',
    category: 'Web',
    salaryRange: '₹7 - 20 LPA',
    marketDemand: 'Moderate to High',
    description: 'Engineers intuitive, battery-efficient mobile applications using native toolkits or React Native, handling offline storage and mobile APIs.',
    topSkills: ['React / Native', 'JavaScript / TypeScript', 'REST APIs', 'DSA', 'Git/GitHub'],
    requirements: {
      'dsa': { level: 3, weight: 'important' },
      'algorithms': { level: 3, weight: 'important' },
      'system-design': { level: 2, weight: 'nice-to-have' },
      'os': { level: 3, weight: 'important' },
      'cn': { level: 3, weight: 'important' },
      'dbms': { level: 3, weight: 'important' },
      'python': { level: 1, weight: 'optional' },
      'java': { level: 4, weight: 'important' },
      'cpp': { level: 2, weight: 'optional' },
      'javascript': { level: 4, weight: 'critical' },
      'sql': { level: 3, weight: 'important' },
      'html-css': { level: 3, weight: 'nice-to-have' },
      'react': { level: 5, weight: 'critical' },
      'nodejs': { level: 2, weight: 'nice-to-have' },
      'rest-apis': { level: 5, weight: 'critical' },
      'typescript': { level: 4, weight: 'critical' },
      'statistics': { level: 1, weight: 'optional' },
      'machine-learning': { level: 1, weight: 'optional' },
      'data-analysis': { level: 1, weight: 'optional' },
      'pandas-numpy': { level: 0, weight: 'optional' },
      'data-viz': { level: 2, weight: 'optional' },
      'git-github': { level: 4, weight: 'critical' },
      'docker': { level: 2, weight: 'nice-to-have' },
      'linux-cli': { level: 2, weight: 'nice-to-have' },
      'cloud': { level: 2, weight: 'nice-to-have' },
      'ci-cd': { level: 3, weight: 'important' },
      'communication': { level: 3, weight: 'important' },
      'teamwork': { level: 4, weight: 'important' },
      'problem-solving': { level: 4, weight: 'critical' },
      'time-mgmt': { level: 3, weight: 'important' }
    }
  },
  {
    id: 'qa-sdet',
    title: 'QA / SDET Engineer',
    subtitle: 'Test Automation & Quality Engineering',
    icon: 'ShieldCheck',
    category: 'Engineering',
    salaryRange: '₹6 - 18 LPA',
    marketDemand: 'High',
    description: 'Writes test automation frameworks, regression test suites, performance benchmarks, and builds quality gates in deployment pipelines.',
    topSkills: ['Java / Python', 'CI/CD', 'REST APIs', 'DBMS', 'Linux/CLI'],
    requirements: {
      'dsa': { level: 3, weight: 'important' },
      'algorithms': { level: 3, weight: 'important' },
      'system-design': { level: 2, weight: 'nice-to-have' },
      'os': { level: 3, weight: 'important' },
      'cn': { level: 3, weight: 'important' },
      'dbms': { level: 4, weight: 'critical' },
      'python': { level: 4, weight: 'critical' },
      'java': { level: 4, weight: 'critical' },
      'cpp': { level: 1, weight: 'optional' },
      'javascript': { level: 3, weight: 'important' },
      'sql': { level: 4, weight: 'critical' },
      'html-css': { level: 2, weight: 'nice-to-have' },
      'react': { level: 2, weight: 'optional' },
      'nodejs': { level: 2, weight: 'nice-to-have' },
      'rest-apis': { level: 5, weight: 'critical' },
      'typescript': { level: 2, weight: 'nice-to-have' },
      'statistics': { level: 2, weight: 'nice-to-have' },
      'machine-learning': { level: 1, weight: 'optional' },
      'data-analysis': { level: 2, weight: 'nice-to-have' },
      'pandas-numpy': { level: 1, weight: 'optional' },
      'data-viz': { level: 1, weight: 'optional' },
      'git-github': { level: 4, weight: 'critical' },
      'docker': { level: 3, weight: 'important' },
      'linux-cli': { level: 4, weight: 'important' },
      'cloud': { level: 2, weight: 'nice-to-have' },
      'ci-cd': { level: 5, weight: 'critical' },
      'communication': { level: 4, weight: 'important' },
      'teamwork': { level: 4, weight: 'important' },
      'problem-solving': { level: 4, weight: 'critical' },
      'time-mgmt': { level: 3, weight: 'important' }
    }
  }
];

// Helper: Get requirements adjusted by company mode
export function getAdjustedRequirements(roleId, companyMode = 'product') {
  const role = ROLES.find(r => r.id === roleId) || ROLES[0];
  const mode = COMPANY_MODES.find(m => m.id === companyMode) || COMPANY_MODES[0];
  
  const adjusted = {};
  for (const [skillId, req] of Object.entries(role.requirements)) {
    let scaledLevel = req.level;
    
    if (companyMode === 'faang') {
      // In FAANG, core CS & DSA are pushed to maximum
      if (['dsa', 'algorithms', 'system-design', 'os'].includes(skillId)) {
        scaledLevel = Math.min(5, req.level + 1);
      } else if (req.level > 0) {
        scaledLevel = Math.min(5, Math.ceil(req.level * 1.15));
      }
    } else if (companyMode === 'startup') {
      // In startups, web & practical tooling are prioritized
      if (['react', 'javascript', 'nodejs', 'docker', 'git-github', 'rest-apis'].includes(skillId)) {
        scaledLevel = Math.min(5, req.level + 1);
      } else if (['os', 'cn'].includes(skillId) && req.level > 2) {
        scaledLevel = Math.max(1, req.level - 1);
      }
    } else if (companyMode === 'service') {
      // In service-based, aptitude & communication are valued, niche tools relaxed
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

const WEIGHT_VALUES = {
  'critical': 3,
  'important': 2,
  'nice-to-have': 1,
  'optional': 0.5
};

// Calculate match percentage and readiness score
export function calculateRoleMatch(userSkills = {}, userConfidence = {}, roleId = 'swe', companyMode = 'product') {
  const adjustedReqs = getAdjustedRequirements(roleId, companyMode);
  
  let totalWeightedTarget = 0;
  let totalWeightedScore = 0;
  let gaps = [];
  let strengths = [];
  
  for (const [skillId, req] of Object.entries(adjustedReqs)) {
    const targetLevel = req.level;
    const weightVal = WEIGHT_VALUES[req.weight] || 1;
    const userLevel = Number(userSkills[skillId]) || 0;
    const isConfident = Boolean(userConfidence[skillId]);
    
    // Confidence multiplier: 1.05x bonus if confident, 0.95x slight discount if not verified live
    const effectiveUserLevel = isConfident 
      ? Math.min(5, userLevel * 1.05) 
      : (userLevel > 2 ? userLevel * 0.95 : userLevel);
    
    // Score contribution
    const cappedScore = Math.min(targetLevel, effectiveUserLevel);
    totalWeightedScore += (cappedScore * weightVal);
    totalWeightedTarget += (targetLevel * weightVal);
    
    const rawGap = Math.max(0, targetLevel - userLevel);
    
    if (rawGap > 0 && targetLevel > 0) {
      let priority = 'Low';
      if (req.weight === 'critical' && rawGap >= 2) priority = 'Critical';
      else if (req.weight === 'critical' || rawGap >= 2) priority = 'High';
      else if (req.weight === 'important') priority = 'Medium';
      
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
        surplus: userLevel - targetLevel,
        isConfident
      });
    }
  }
  
  // Readiness score between 0 and 100
  const readinessScore = totalWeightedTarget > 0 
    ? Math.round((totalWeightedScore / totalWeightedTarget) * 100) 
    : 0;
  
  // Sorted gaps: highest weighted gap first
  gaps.sort((a, b) => b.weightedGap - a.weightedGap);
  
  // Sorted strengths: highest userLevel & weight first
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
  
  return {
    readinessScore,
    verdict,
    verdictColor,
    verdictBadge,
    verdictDesc,
    gaps,
    strengths,
    totalGaps: gaps.length,
    criticalGaps: gaps.filter(g => g.priority === 'Critical').length
  };
}
