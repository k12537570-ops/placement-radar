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

export const SKILL_LEVEL_DESCRIPTIONS = [
  'No knowledge or exposure',
  'Basic concept known, cannot build independently',
  'Can write simple code with documentation/Google',
  'Comfortable with common patterns and debugging',
  'Deep understanding, can architect and optimize',
  'Mastery, handles edge cases and scale effortlessly'
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
