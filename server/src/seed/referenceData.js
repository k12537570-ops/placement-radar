// Static reference data for skills, roles, company modes, resources, and ATS evaluation

export const SKILL_CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'core-cs', name: 'Core CS' },
  { id: 'languages', name: 'Languages' },
  { id: 'web', name: 'Web' },
  { id: 'data', name: 'Data' },
  { id: 'tools', name: 'Tools' },
  { id: 'soft-skills', name: 'Soft Skills' }
];

export const SKILL_LEVEL_LABELS = [
  'None',
  'Beginner',
  'Basic',
  'Intermediate',
  'Advanced',
  'Expert'
];

export const SKILLS = [
  // Core CS (6)
  {
    id: 'dsa',
    name: 'Data Structures',
    category: 'core-cs',
    categoryName: 'Core CS',
    description: 'Arrays, trees, graphs, heaps, hash tables and their fundamental operations.'
  },
  {
    id: 'algorithms',
    name: 'Algorithms',
    category: 'core-cs',
    categoryName: 'Core CS',
    description: 'Sorting, searching, recursion, dynamic programming, and greedy algorithms.'
  },
  {
    id: 'system-design',
    name: 'System Design',
    category: 'core-cs',
    categoryName: 'Core CS',
    description: 'Scalability, microservices, load balancing, caching, and database sharding.'
  },
  {
    id: 'os',
    name: 'Operating Systems',
    category: 'core-cs',
    categoryName: 'Core CS',
    description: 'Process management, threads, concurrency, deadlocks, and memory virtualization.'
  },
  {
    id: 'cn',
    name: 'Computer Networks',
    category: 'core-cs',
    categoryName: 'Core CS',
    description: 'OSI model, TCP/IP, DNS, HTTP/HTTPS, sockets, and network protocols.'
  },
  {
    id: 'dbms',
    name: 'DBMS',
    category: 'core-cs',
    categoryName: 'Core CS',
    description: 'Relational modeling, normalization, indexing, ACID transactions, and SQL optimization.'
  },

  // Languages (5)
  {
    id: 'python',
    name: 'Python',
    category: 'languages',
    categoryName: 'Languages',
    description: 'Data structures, OOP, list comprehensions, generators, and async programming.'
  },
  {
    id: 'java',
    name: 'Java',
    category: 'languages',
    categoryName: 'Languages',
    description: 'OOP principles, collections framework, multithreading, and JVM internals.'
  },
  {
    id: 'cpp',
    name: 'C++',
    category: 'languages',
    categoryName: 'Languages',
    description: 'Pointers, memory management, STL containers, and modern C++ features.'
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'languages',
    categoryName: 'Languages',
    description: 'ES6+, closures, prototypes, event loop, promises, and DOM manipulation.'
  },
  {
    id: 'sql',
    name: 'SQL',
    category: 'languages',
    categoryName: 'Languages',
    description: 'Complex joins, subqueries, aggregations, window functions, and schema design.'
  },

  // Web (5)
  {
    id: 'html-css',
    name: 'HTML/CSS',
    category: 'web',
    categoryName: 'Web',
    description: 'Semantic markup, flexbox, CSS grid, responsiveness, and accessibility (a11y).'
  },
  {
    id: 'react',
    name: 'React',
    category: 'web',
    categoryName: 'Web',
    description: 'Components, hooks, state management, lifecycle, memoization, and virtual DOM.'
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'web',
    categoryName: 'Web',
    description: 'Event-driven runtime, Express/Fastify, RESTful APIs, and middleware pipelines.'
  },
  {
    id: 'rest-apis',
    name: 'REST APIs',
    category: 'web',
    categoryName: 'Web',
    description: 'RESTful architectural principles, HTTP status codes, auth, and API versioning.'
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'web',
    categoryName: 'Web',
    description: 'Types, interfaces, generics, type narrowing, and strict compile safety.'
  },

  // Data (5)
  {
    id: 'statistics',
    name: 'Statistics',
    category: 'data',
    categoryName: 'Data',
    description: 'Probability distributions, hypothesis testing, p-values, and regression.'
  },
  {
    id: 'machine-learning',
    name: 'Machine Learning',
    category: 'data',
    categoryName: 'Data',
    description: 'Supervised/unsupervised algorithms, evaluation metrics, and feature engineering.'
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    category: 'data',
    categoryName: 'Data',
    description: 'Data cleaning, exploratory data analysis (EDA), pattern recognition, and insights.'
  },
  {
    id: 'pandas-numpy',
    name: 'Pandas/NumPy',
    category: 'data',
    categoryName: 'Data',
    description: 'Vectorized operations, DataFrames, groupbys, reshaping, and numerical computing.'
  },
  {
    id: 'data-viz',
    name: 'Data Visualization',
    category: 'data',
    categoryName: 'Data',
    description: 'Chart selection, storytelling with data, Matplotlib/Seaborn, and dashboards.'
  },

  // Tools (5)
  {
    id: 'git-github',
    name: 'Git/GitHub',
    category: 'tools',
    categoryName: 'Tools',
    description: 'Branching, merging, rebasing, pull requests, resolving merge conflicts, and workflows.'
  },
  {
    id: 'docker',
    name: 'Docker',
    category: 'tools',
    categoryName: 'Tools',
    description: 'Containerization, Dockerfile best practices, multi-stage builds, and Compose.'
  },
  {
    id: 'linux-cli',
    name: 'Linux/CLI',
    category: 'tools',
    categoryName: 'Tools',
    description: 'Bash scripting, file permissions, process monitoring, piping, and SSH.'
  },
  {
    id: 'cloud',
    name: 'Cloud (AWS/GCP)',
    category: 'tools',
    categoryName: 'Tools',
    description: 'Core compute (EC2/VMs), storage (S3/Cloud Storage), IAM, and serverless.'
  },
  {
    id: 'ci-cd',
    name: 'CI/CD',
    category: 'tools',
    categoryName: 'Tools',
    description: 'Automated testing pipelines, GitHub Actions, build artifacts, and deployment automation.'
  },

  // Soft skills (4)
  {
    id: 'communication',
    name: 'Communication',
    category: 'soft-skills',
    categoryName: 'Soft Skills',
    description: 'Clear articulation of ideas, active listening, and technical documentation.'
  },
  {
    id: 'teamwork',
    name: 'Teamwork',
    category: 'soft-skills',
    categoryName: 'Soft Skills',
    description: 'Collaborative problem solving, code reviews, empathy, and cross-functional sync.'
  },
  {
    id: 'problem-solving',
    name: 'Problem Solving',
    category: 'soft-skills',
    categoryName: 'Soft Skills',
    description: 'Breaking down ambiguous problems, structured thinking, and root-cause analysis.'
  },
  {
    id: 'time-mgmt',
    name: 'Time Management',
    category: 'soft-skills',
    categoryName: 'Soft Skills',
    description: 'Prioritization, estimation, managing deadlines, and deep-work habits.'
  }
];

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

export const SKILL_RESOURCES = {
  'dsa': {
    title: 'Data Structures',
    resources: [
      { name: 'NeetCode 150 - Core Data Structures', url: 'https://neetcode.io/practice', platform: 'NeetCode' },
      { name: 'roadmap.sh/datastructures', url: 'https://roadmap.sh/datastructures-and-algorithms', platform: 'roadmap.sh' },
      { name: 'GeeksforGeeks - Data Structures Mastery', url: 'https://www.geeksforgeeks.org/data-structures/', platform: 'GeeksforGeeks' }
    ],
    taskTemplates: [
      'Implement an LRU Cache from scratch with Doubly Linked List and Hash Map',
      'Solve 5 medium Binary Search Tree and Graph traversal problems on LeetCode/NeetCode',
      'Construct a Min-Heap / Priority Queue and explain heapify time complexity'
    ]
  },
  'algorithms': {
    title: 'Algorithms',
    resources: [
      { name: 'NeetCode Dynamic Programming Roadmap', url: 'https://neetcode.io', platform: 'NeetCode' },
      { name: 'CS50x - Algorithms & Asymptotic Complexity', url: 'https://cs50.harvard.edu/x/', platform: 'CS50' },
      { name: 'freeCodeCamp - Algorithms and Data Structures', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', platform: 'freeCodeCamp' }
    ],
    taskTemplates: [
      'Write memoized and iterative tabulation solutions for 0/1 Knapsack & Longest Common Subsequence',
      'Implement Dijkstra and Floyd-Warshall shortest path algorithms with complexity analysis',
      'Practice 4 Greedy and Two-Pointer placement interview questions'
    ]
  },
  'system-design': {
    title: 'System Design',
    resources: [
      { name: 'System Design Primer (GitHub)', url: 'https://github.com/donnemartin/system-design-primer', platform: 'GitHub' },
      { name: 'roadmap.sh/system-design', url: 'https://roadmap.sh/system-design', platform: 'roadmap.sh' },
      { name: 'ByteByteGo - High Level Architecture Notes', url: 'https://bytebytego.com/', platform: 'ByteByteGo' }
    ],
    taskTemplates: [
      'Design a URL Shortener (TinyURL) handling 100M daily writes with consistent hashing & Redis cache',
      'Draft an end-to-end architecture diagram for a Chat App with WebSockets, Kafka, and Redis Pub/Sub',
      'Compare database sharding strategies vs read-replicas for e-commerce scale'
    ]
  },
  'os': {
    title: 'Operating Systems',
    resources: [
      { name: 'CS50 - Memory, Processes & Pointers', url: 'https://cs50.harvard.edu/x/', platform: 'CS50' },
      { name: 'GeeksforGeeks - Operating Systems Tutorial', url: 'https://www.geeksforgeeks.org/operating-systems/', platform: 'GeeksforGeeks' },
      { name: 'OSTEP - Operating Systems: Three Easy Pieces', url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/', platform: 'Official Book' }
    ],
    taskTemplates: [
      'Write a multi-threaded program demonstrating race conditions, mutex locks, and semaphores',
      'Explain virtual memory page replacement algorithms (LRU, Clock) and page fault penalties',
      'Diagram CPU scheduling algorithms (Round Robin, SRTF) with Gantt charts and turnaround times'
    ]
  },
  'cn': {
    title: 'Computer Networks',
    resources: [
      { name: 'Kurose & Ross - Computer Networking Online', url: 'https://www-net.cs.umass.edu/kurose_ross/', platform: 'Docs' },
      { name: 'GeeksforGeeks - Computer Network Notes', url: 'https://www.geeksforgeeks.org/computer-network-tutorials/', platform: 'GeeksforGeeks' },
      { name: 'roadmap.sh/backend (Networking Section)', url: 'https://roadmap.sh/backend', platform: 'roadmap.sh' }
    ],
    taskTemplates: [
      'Capture and inspect TCP 3-way handshake and TLS 1.3 key exchange using Wireshark or curl',
      'Build a simple multi-client TCP echo server using socket programming',
      'Walk through what happens step-by-step from typing google.com to page render (DNS, ARP, TCP, TLS, HTTP)'
    ]
  },
  'dbms': {
    title: 'DBMS & Database Design',
    resources: [
      { name: 'Use The Index, Luke (SQL Indexing Guide)', url: 'https://use-the-index-luke.com/', platform: 'Official Guide' },
      { name: 'GeeksforGeeks - DBMS Fundamentals & Normalization', url: 'https://www.geeksforgeeks.org/dbms/', platform: 'GeeksforGeeks' },
      { name: 'roadmap.sh/postgresql-dba', url: 'https://roadmap.sh/postgresql-dba', platform: 'roadmap.sh' }
    ],
    taskTemplates: [
      'Normalize an unnormalized e-commerce order schema from 1NF up to BCNF with ER diagram',
      'Run EXPLAIN ANALYZE on a query with 500k rows; optimize it using B-tree composite indexing',
      'Explain ACID properties and compare isolation levels (Read Committed vs Serializable) with dirty reads'
    ]
  },
  'python': {
    title: 'Python',
    resources: [
      { name: 'Official Python Tutorial & Docs', url: 'https://docs.python.org/3/tutorial/', platform: 'Official Docs' },
      { name: 'freeCodeCamp - Scientific Computing with Python', url: 'https://www.freecodecamp.org/learn/scientific-computing-with-python/', platform: 'freeCodeCamp' },
      { name: 'roadmap.sh/python', url: 'https://roadmap.sh/python', platform: 'roadmap.sh' }
    ],
    taskTemplates: [
      'Build a multithreaded / async web crawler using asyncio, aiohttp, and BeautifulSoup',
      'Implement custom decorators, generator pipelines, and context managers using `__enter__` and `__exit__`',
      'Refactor an OOP project using Python dataclasses, type hints, and unittest suite'
    ]
  },
  'java': {
    title: 'Java',
    resources: [
      { name: 'Dev.java - Official Java Developer Portal', url: 'https://dev.java/', platform: 'Official Docs' },
      { name: 'GeeksforGeeks - Java Collections Framework', url: 'https://www.geeksforgeeks.org/collections-in-java-2/', platform: 'GeeksforGeeks' },
      { name: 'roadmap.sh/java', url: 'https://roadmap.sh/java', platform: 'roadmap.sh' }
    ],
    taskTemplates: [
      'Implement thread-safe Producer-Consumer pattern using Java BlockingQueue and Executors',
      'Build a REST microservice with Spring Boot, Spring Data JPA, and H2 database',
      'Solve 5 interview questions on HashMap internal hashing mechanism and collision handling'
    ]
  },
  'cpp': {
    title: 'C++',
    resources: [
      { name: 'LearnCpp.com - Complete Modern C++ Guide', url: 'https://www.learncpp.com/', platform: 'Guide' },
      { name: 'cppreference.com - Standard C++ Reference', url: 'https://en.cppreference.com/', platform: 'Official Reference' }
    ],
    taskTemplates: [
      'Implement custom Smart Pointers (`unique_ptr` and `shared_ptr`) with reference counting',
      'Build a custom vector container with template metaprogramming, dynamic reallocation, and iterators',
      'Demonstrate move semantics, rvalue references (`&&`), and `std::move` performance gains'
    ]
  },
  'javascript': {
    title: 'JavaScript',
    resources: [
      { name: 'MDN Web Docs - JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', platform: 'MDN' },
      { name: 'javascript.info - The Modern JavaScript Tutorial', url: 'https://javascript.info/', platform: 'Guide' },
      { name: 'freeCodeCamp - ES6 & Asynchronous JavaScript', url: 'https://www.freecodecamp.org/learn/', platform: 'freeCodeCamp' }
    ],
    taskTemplates: [
      'Recreate `Promise.all` and `Promise.race` from scratch using callbacks and native Promises',
      'Explain Event Loop microtask vs macrotask execution order through 5 tricky interview snippets',
      'Implement debounce and throttle utility functions with unit tests'
    ]
  },
  'sql': {
    title: 'SQL',
    resources: [
      { name: 'SQLZoo Interactive Tutorial', url: 'https://sqlzoo.net/', platform: 'Interactive' },
      { name: 'PostgreSQL Official Documentation', url: 'https://www.postgresql.org/docs/', platform: 'Official Docs' },
      { name: 'Mode Analytics - Advanced SQL Tutorial', url: 'https://mode.com/sql-tutorial/', platform: 'Guide' }
    ],
    taskTemplates: [
      'Write window function queries using `ROW_NUMBER()`, `DENSE_RANK()`, and `LAG()` over partitions',
      'Solve top 5 SQL interview queries: second highest salary, cumulative revenue sum, consecutive logins',
      'Design complex CTE (Common Table Expressions) and self-joins for hierarchical tree data'
    ]
  },
  'html-css': {
    title: 'HTML/CSS',
    resources: [
      { name: 'MDN Web Docs - CSS Layout (Flexbox & Grid)', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS', platform: 'MDN' },
      { name: 'CSS Tricks - A Complete Guide to Flexbox & Grid', url: 'https://css-tricks.com/', platform: 'CSS-Tricks' },
      { name: 'freeCodeCamp - Responsive Web Design', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/', platform: 'freeCodeCamp' }
    ],
    taskTemplates: [
      'Build a responsive 12-column dashboard layout without UI libraries using CSS Grid and Flexbox',
      'Audit an existing web page for WCAG AA compliance (contrast, keyboard navigation, aria-roles)',
      'Create smooth CSS keyframe micro-animations with 60fps GPU acceleration'
    ]
  },
  'react': {
    title: 'React',
    resources: [
      { name: 'React.dev - The Official React Documentation', url: 'https://react.dev/', platform: 'Official Docs' },
      { name: 'roadmap.sh/react', url: 'https://roadmap.sh/react', platform: 'roadmap.sh' },
      { name: 'Epic React Articles by Kent C. Dodds', url: 'https://kentcdodds.com/blog', platform: 'Guide' }
    ],
    taskTemplates: [
      'Build a custom `useFetch` hook with caching, abort controller cleanup, and retry mechanisms',
      'Optimize a sluggish table of 2,000 rows using React virtualization and memoization (`useMemo`, `useCallback`)',
      'Construct a nested state management workflow with Context API and Reducer pattern'
    ]
  },
  'nodejs': {
    title: 'Node.js',
    resources: [
      { name: 'Node.js Official Documentation', url: 'https://nodejs.org/en/docs/', platform: 'Official Docs' },
      { name: 'roadmap.sh/nodejs', url: 'https://roadmap.sh/nodejs', platform: 'roadmap.sh' },
      { name: 'freeCodeCamp - Back End Development and APIs', url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/', platform: 'freeCodeCamp' }
    ],
    taskTemplates: [
      'Build a production-ready Express REST API with JWT authentication, rate limiting, and centralized error handling',
      'Create a file-processing worker thread stream pipeline that parses 100MB CSV files without memory spikes',
      'Implement health check, graceful shutdown, and structured logging with Pino or Winston'
    ]
  },
  'rest-apis': {
    title: 'REST APIs',
    resources: [
      { name: 'MDN HTTP Protocols & REST Best Practices', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP', platform: 'MDN' },
      { name: 'roadmap.sh/api-design', url: 'https://roadmap.sh/api-design', platform: 'roadmap.sh' }
    ],
    taskTemplates: [
      'Draft an OpenAPI / Swagger 3.0 specification for an e-commerce checkout workflow with pagination & filtering',
      'Implement idempotent API endpoints using `Idempotency-Key` headers in database transactions',
      'Write end-to-end API test suites using Postman / Newman or Supertest'
    ]
  },
  'typescript': {
    title: 'TypeScript',
    resources: [
      { name: 'TypeScript Handbook (Official)', url: 'https://www.typescriptlang.org/docs/handbook/', platform: 'Official Docs' },
      { name: 'Total TypeScript by Matt Pocock', url: 'https://www.totaltypescript.com/', platform: 'Tutorials' }
    ],
    taskTemplates: [
      'Write reusable generic utility types (`Pick`, `Omit`, `DeepPartial`, and conditional `infer` types)',
      'Migrate a legacy JavaScript project module to strict TypeScript with zero `any` types',
      'Implement discriminated unions and exhaustive type checking with `never` guard'
    ]
  },
  'statistics': {
    title: 'Statistics',
    resources: [
      { name: 'Khan Academy - Statistics & Probability', url: 'https://www.khanacademy.org/math/statistics-probability', platform: 'Khan Academy' },
      { name: 'StatQuest with Josh Starmer', url: 'https://statquest.org/', platform: 'YouTube/Guide' }
    ],
    taskTemplates: [
      'Run an A/B test analysis in Python calculating z-scores, p-values, and statistical power',
      'Explain Central Limit Theorem and simulate sampling distributions with Matplotlib',
      'Compute Pearson correlation vs Spearman rank correlation on non-linear datasets'
    ]
  },
  'machine-learning': {
    title: 'Machine Learning',
    resources: [
      { name: 'Scikit-Learn Official User Guide', url: 'https://scikit-learn.org/stable/user_guide.html', platform: 'Official Docs' },
      { name: 'Fast.ai - Practical Deep Learning', url: 'https://course.fast.ai/', platform: 'Fast.ai' },
      { name: 'roadmap.sh/ai-data-scientist', url: 'https://roadmap.sh/ai-data-scientist', platform: 'roadmap.sh' }
    ],
    taskTemplates: [
      'Train and evaluate Random Forest vs XGBoost classifier on an imbalanced dataset with ROC-AUC & F1 score',
      'Build a complete preprocessing Pipeline with one-hot encoding, feature scaling, and cross-validation',
      'Deploy the trained ML model with FastAPI and test real-time inference latency'
    ]
  },
  'data-analysis': {
    title: 'Data Analysis',
    resources: [
      { name: 'Kaggle Micro-courses: Data Cleaning & EDA', url: 'https://www.kaggle.com/learn', platform: 'Kaggle' },
      { name: 'freeCodeCamp - Data Analysis with Python', url: 'https://www.freecodecamp.org/learn/data-analysis-with-python/', platform: 'freeCodeCamp' }
    ],
    taskTemplates: [
      'Conduct an end-to-end Exploratory Data Analysis (EDA) on a real-world dataset identifying missing values and anomalies',
      'Calculate customer cohort retention rates and lifetime value (LTV) metrics',
      'Synthesize 3 actionable business recommendations backed by data charts in an executive summary'
    ]
  },
  'pandas-numpy': {
    title: 'Pandas / NumPy',
    resources: [
      { name: 'Pandas Official 10-Minute Guide', url: 'https://pandas.pydata.org/docs/user_guide/10min.html', platform: 'Official Docs' },
      { name: 'NumPy Official Quickstart Tutorial', url: 'https://numpy.org/doc/stable/user/quickstart.html', platform: 'Official Docs' }
    ],
    taskTemplates: [
      'Perform multi-index aggregation and unstacking operations on financial timeseries',
      'Optimize a slow loop by replacing row-iteration with NumPy vectorized matrix operations for 50x speedup',
      'Handle dirty dates, regex text cleaning, and categorical conversions in Pandas'
    ]
  },
  'data-viz': {
    title: 'Data Visualization',
    resources: [
      { name: 'Seaborn Official Gallery & Tutorial', url: 'https://seaborn.pydata.org/tutorial.html', platform: 'Official Docs' },
      { name: 'The Data Visualisation Catalogue', url: 'https://datavizcatalogue.com/', platform: 'Reference' }
    ],
    taskTemplates: [
      'Design an interactive dashboard using Plotly / Recharts depicting trends and distribution breakdowns',
      'Choose and defend correct chart selections (avoiding bad 3D charts, deceptive truncated axes)',
      'Create annotated heatmaps, boxplots, and violin plots to communicate variance clearly'
    ]
  },
  'git-github': {
    title: 'Git & GitHub',
    resources: [
      { name: 'Pro Git Book (Official & Free)', url: 'https://git-scm.com/book/en/v2', platform: 'Official Book' },
      { name: 'Learn Git Branching (Interactive Sandbox)', url: 'https://learngitbranching.js.org/', platform: 'Interactive' },
      { name: 'GitHub Skills Tutorials', url: 'https://skills.github.com/', platform: 'GitHub' }
    ],
    taskTemplates: [
      'Execute interactive rebase (`git rebase -i`), squash commits, and resolve merge conflicts cleanly',
      'Set up Git hooks (pre-commit, commit-msg) using Husky or native scripts for linting and formatting',
      'Create a polished Pull Request with clear description, screenshots, and linked issue tickets'
    ]
  },
  'docker': {
    title: 'Docker & Containers',
    resources: [
      { name: 'Docker Official Getting Started Guide', url: 'https://docs.docker.com/get-started/', platform: 'Official Docs' },
      { name: 'roadmap.sh/docker', url: 'https://roadmap.sh/docker', platform: 'roadmap.sh' }
    ],
    taskTemplates: [
      'Write a multi-stage Dockerfile for a Node/Go/Python app reducing image size below 100MB',
      'Orchestrate a multi-container environment with `docker-compose.yml` (App + Postgres + Redis + Nginx)',
      'Inspect container resource usage, bind mounts vs volumes, and bridge network troubleshooting'
    ]
  },
  'linux-cli': {
    title: 'Linux & Bash Scripting',
    resources: [
      { name: 'Linux Journey - Structured Interactive Lessons', url: 'https://linuxjourney.com/', platform: 'Guide' },
      { name: 'The Linux Command Line by William Shotts', url: 'https://linuxcommand.org/tlcl.php', platform: 'Book' }
    ],
    taskTemplates: [
      'Write a robust Bash shell script with error handling (`set -euo pipefail`), flags parsing, and logging',
      'Master command-line text processing pipelines combining `grep`, `awk`, `sed`, `sort`, and `uniq`',
      'Configure systemd service unit file, cron automation, and SSH key authentication'
    ]
  },
  'cloud': {
    title: 'Cloud (AWS / GCP)',
    resources: [
      { name: 'AWS Skill Builder Free Digital Training', url: 'https://explore.skillbuilder.aws/', platform: 'AWS' },
      { name: 'Google Cloud Training Modules', url: 'https://cloud.google.com/training', platform: 'Google Cloud' },
      { name: 'roadmap.sh/aws', url: 'https://roadmap.sh/aws', platform: 'roadmap.sh' }
    ],
    taskTemplates: [
      'Deploy a containerized application to AWS ECS or GCP Cloud Run with HTTPS and custom domain',
      'Configure least-privilege IAM roles, security groups, and S3 bucket bucket policies',
      'Build a serverless event trigger using AWS Lambda / Cloud Functions responding to storage uploads'
    ]
  },
  'ci-cd': {
    title: 'CI/CD Pipelines',
    resources: [
      { name: 'GitHub Actions Documentation', url: 'https://docs.github.com/en/actions', platform: 'Official Docs' },
      { name: 'roadmap.sh/devops (CI/CD section)', url: 'https://roadmap.sh/devops', platform: 'roadmap.sh' }
    ],
    taskTemplates: [
      'Create a GitHub Actions workflow that runs linter, tests, and security scans on pull request',
      'Set up automatic semantic version tagging and Docker image publishing to GitHub Container Registry',
      'Implement deployment stage with environment secrets and rollbacks on failure'
    ]
  },
  'communication': {
    title: 'Communication',
    resources: [
      { name: 'Google Technical Writing Course', url: 'https://developers.google.com/tech-writing', platform: 'Google' },
      { name: 'Harvard Business Review - Communicating Technical Ideas', url: 'https://hbr.org/', platform: 'Articles' }
    ],
    taskTemplates: [
      'Draft a 1-page Technical Design Document (RFC) proposing an architectural decision with pros/cons',
      'Record a 3-minute video explaining a complex project trade-off to a non-technical interviewer',
      'Conduct a mock behavioral interview practicing the STAR method (Situation, Task, Action, Result)'
    ]
  },
  'teamwork': {
    title: 'Teamwork & Collaboration',
    resources: [
      { name: 'Google Guide: Understand Team Effectiveness', url: 'https://rework.withgoogle.com/guides/understanding-team-effectiveness/', platform: 'Google re:Work' },
      { name: 'Conventional Commits Standard', url: 'https://www.conventionalcommits.org/', platform: 'Standard' }
    ],
    taskTemplates: [
      'Perform a thorough and empathetic code review on a peer pull request highlighting improvements',
      'Establish team branching guidelines, issue templates, and commit message conventions',
      'Facilitate a sprint retrospective session identifying keep/stop/start action items'
    ]
  },
  'problem-solving': {
    title: 'Structured Problem Solving',
    resources: [
      { name: 'McKinsey 7-Step Problem Solving Framework', url: 'https://www.mckinsey.com/capabilities/strategy-and-corporate-finance/our-insights', platform: 'Framework' },
      { name: 'How to Solve It by George Pólya (Summary)', url: 'https://en.wikipedia.org/wiki/How_to_Solve_It', platform: 'Classic' }
    ],
    taskTemplates: [
      'Deconstruct an ambiguous production incident using the 5 Whys and Fishbone diagram root-cause analysis',
      'Map out state machine edge cases and boundary conditions before writing a line of implementation',
      'Timebox and document algorithmic trade-offs (space vs time) for 3 complex interview scenarios'
    ]
  },
  'time-mgmt': {
    title: 'Time & Focus Management',
    resources: [
      { name: 'Deep Work Principles by Cal Newport', url: 'https://calnewport.com/books/deep-work/', platform: 'Concepts' },
      { name: 'Pomodoro Technique Official Guide', url: 'https://francescocirillo.com/products/the-pomodoro-technique', platform: 'Technique' }
    ],
    taskTemplates: [
      'Plan a 2-week study sprint breaking goals into daily 90-minute deep-work focus blocks',
      'Apply the Eisenhower Matrix to prioritize interview prep topics over non-urgent distractions',
      'Log and eliminate top 3 digital distractions for 5 consecutive study days'
    ]
  }
};

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

