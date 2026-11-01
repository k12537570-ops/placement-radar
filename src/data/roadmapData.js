// Curated resource library for all 30 skills with free, high-quality platforms:
// freeCodeCamp, NeetCode, MDN, CS50, roadmap.sh, GeeksforGeeks, official docs

export const ROADMAP_STAGES = [
  {
    id: 1,
    tier: 'Stage 1',
    name: 'Beginner / Core CS Foundations',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    description: 'Master core computer science fundamentals, data structure memory layouts, algorithmic problem solving, and version control discipline.',
    milestoneProject: {
      title: 'In-Memory Key-Value Store & Multi-Threaded Task Runner',
      description: 'Build an in-memory key-value database in your core language (C++, Java, or Python) supporting TTL expiration, mutex locks, and disk snapshot persistence.',
      deliverables: [
        'GitHub repository with conventional commit history',
        'Unit test suite testing concurrency race conditions (>80% coverage)',
        'Technical README with benchmark read/write latency numbers'
      ]
    }
  },
  {
    id: 2,
    tier: 'Stage 2',
    name: 'Intermediate / Frameworks & Modern Tooling',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    description: 'Build full-stack proficiency with modern frameworks, RESTful API contract design, relational database indexing, and containerization.',
    milestoneProject: {
      title: 'Production Full-Stack Application with JWT & Cloud DB',
      description: 'Develop an end-to-end multi-tenant application with secure authentication, transactional SQL queries, responsive design, and Docker containerization.',
      deliverables: [
        'Live deployed web application with test credentials',
        'OpenAPI / Swagger documentation for all REST endpoints',
        'Multi-stage Dockerfile and docker-compose.yml configuration'
      ]
    }
  },
  {
    id: 3,
    tier: 'Stage 3',
    name: 'Advanced / System Architecture & Placement Drills',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    description: 'Tackle distributed system trade-offs, caching strategies, CI/CD automated deployments, and timed technical mock interviews.',
    milestoneProject: {
      title: 'High-Throughput Distributed Rate Limiter & Event Pipeline',
      description: 'Architect a distributed sliding-window counter rate limiter and event logging pipeline using Redis, message queues, and horizontal worker scaling.',
      deliverables: [
        'High-level architecture diagram detailing failure modes and CAP theorem trade-offs',
        'K6 / Artillery load test report verifying 1,000+ RPS sustained throughput',
        '1-page Technical Design RFC defending database and caching choices'
      ]
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

// Generate week-by-week roadmap based on top gaps, duration (4/8/12/16 weeks), and daily hours
export function generateRoadmap({ gaps = [], weeksCount = 8, hoursPerDay = 3, targetRoleTitle = 'Software Engineer' }) {
  // If user has no gaps or few gaps, supplement with core placement skills
  const prioritizedGaps = gaps.length > 0 ? gaps.map(g => g.skillId) : ['dsa', 'algorithms', 'system-design', 'dbms', 'git-github', 'communication'];
  
  // Unique skill list in priority order
  const uniqueSkills = Array.from(new Set([
    ...prioritizedGaps,
    'dsa', 'algorithms', 'system-design', 'dbms', 'git-github', 'communication', 'problem-solving'
  ]));

  const weeks = [];
  const hoursPerWeek = hoursPerDay * 6; // Assuming 6 days/week

  const stage1End = Math.max(1, Math.ceil(weeksCount / 3));
  const stage2End = Math.max(stage1End + 1, Math.ceil((2 * weeksCount) / 3));

  for (let i = 0; i < weeksCount; i++) {
    const weekNumber = i + 1;
    let stageId = 1;
    if (weekNumber > stage2End) {
      stageId = 3;
    } else if (weekNumber > stage1End) {
      stageId = 2;
    }

    const skillIndex = i % uniqueSkills.length;
    const skillId = uniqueSkills[skillIndex];
    const skillInfo = SKILL_RESOURCES[skillId] || {
      title: skillId.toUpperCase(),
      resources: [{ name: 'Documentation & Tutorials', url: 'https://devdocs.io', platform: 'Docs' }],
      taskTemplates: ['Read documentation and build a mini project', 'Practice 5 relevant problems']
    };

    const isReviewWeek = (i + 1) % 4 === 0;
    
    let themeTitle = `${skillInfo.title} Mastery & Drill`;
    let goalDescription = `Master high-frequency ${skillInfo.title} concepts tested in ${targetRoleTitle} technical interviews. Target: ${hoursPerWeek} study hours.`;
    
    if (isReviewWeek) {
      themeTitle = `Sprint Review, Mock Interviews & ${skillInfo.title}`;
      goalDescription = `Consolidate past weeks' learning, take a timed mock assessment, and reinforce ${skillInfo.title} weak spots.`;
    }

    const tasks = (skillInfo.taskTemplates || []).map((t, idx) => ({
      id: `w${weekNumber}-t${idx + 1}`,
      text: t,
      estimatedHours: Math.round(hoursPerWeek / (skillInfo.taskTemplates.length || 1)),
      completed: false
    }));

    if (isReviewWeek) {
      tasks.push({
        id: `w${weekNumber}-mock`,
        text: `Complete a 90-minute timed mock interview / test under real placement conditions`,
        estimatedHours: 3,
        completed: false
      });
    }

    weeks.push({
      weekNumber,
      stageId,
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

