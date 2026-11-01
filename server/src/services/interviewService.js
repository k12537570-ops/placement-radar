// AI-Powered Mock Interview Question Bank & Transparent NLP Evaluation Service

export const INTERVIEW_QUESTIONS = [
  // 1. Software Engineer / Core CS
  {
    id: 'swe-tech-1',
    roleId: 'swe',
    difficulty: 'beginner',
    category: 'technical',
    topic: 'Data Structures',
    text: 'What is the difference between an Array and a Linked List in memory, and how do their access and insertion time complexities compare?',
    idealPoints: [
      'Arrays allocate contiguous memory blocks; Linked Lists use non-contiguous nodes with pointer references',
      'Array random access is O(1) via index arithmetic; Linked List access is O(n) requiring sequential traversal',
      'Insertion at the beginning: O(n) for Array due to element shifting, O(1) for Linked List by updating head pointer',
      'Memory overhead: Linked list nodes consume extra memory per element for storing pointers'
    ],
    rubricKeywords: ['contiguous', 'pointer', 'O(1)', 'O(n)', 'index', 'traversal', 'overhead', 'shifting'],
    hints: 'Contrast contiguous vs node-based memory layout and element shifting vs pointer rewiring.'
  },
  {
    id: 'swe-tech-2',
    roleId: 'swe',
    difficulty: 'intermediate',
    category: 'technical',
    topic: 'Concurrency & OS',
    text: 'Explain the difference between a Process and a Thread. What is a Deadlock, and what are Coffman’s four conditions required for it to occur?',
    idealPoints: [
      'A process is an isolated execution environment with its own address space; threads share the memory space of their parent process',
      'Context switching between processes is heavier due to memory page table swaps; thread switching is lightweight',
      'A deadlock occurs when two or more threads/processes are permanently blocked waiting for resources held by each other',
      'Coffman 4 conditions: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait'
    ],
    rubricKeywords: ['address space', 'shared memory', 'context switch', 'mutual exclusion', 'hold and wait', 'no preemption', 'circular wait'],
    hints: 'Detail virtual address space isolation, lightweight thread switching, and name all 4 conditions.'
  },
  {
    id: 'swe-sys-1',
    roleId: 'swe',
    difficulty: 'advanced',
    category: 'system-design',
    topic: 'System Design',
    text: 'How would you design a distributed caching layer (like Redis) for a high-traffic e-commerce checkout system? How do you prevent cache stampede and stale data?',
    idealPoints: [
      'Use distributed caching (Redis cluster) with consistent hashing to partition cache keys across multiple nodes',
      'Cache invalidation strategies: Cache-aside (lazy loading) with write-through or write-invalidation on database updates',
      'Cache Stampede mitigation: Mutex locks (probabilistic early expiration / XFetch) so only one worker queries the DB on cache miss',
      'Consistency guarantees: Set appropriate TTLs and publish change events via message queue (Kafka/Redis PubSub)'
    ],
    rubricKeywords: ['redis', 'consistent hashing', 'cache-aside', 'cache stampede', 'mutex', 'ttl', 'write-through', 'invalidation'],
    hints: 'Mention cache topology, invalidation policies, TTL, and locking on miss to prevent stampede.'
  },
  {
    id: 'swe-hr-1',
    roleId: 'swe',
    difficulty: 'intermediate',
    category: 'behavioral',
    topic: 'Teamwork & Conflict',
    text: 'Describe a situation where you had a strong technical disagreement with a teammate or lead regarding architecture or code style. How did you resolve it?',
    idealPoints: [
      'Structured using STAR framework (Situation, Task, Action, Result)',
      'Focused objectively on engineering trade-offs, benchmarks, and data rather than personal opinions',
      'Actively listened to the opposing perspective and sought common ground or prototyped both options',
      'Successfully delivered the project with team alignment, documenting the decision as an ADR (Architecture Decision Record)'
    ],
    rubricKeywords: ['trade-off', 'benchmark', 'data', 'listen', 'compromise', 'prototype', 'alignment', 'decision record'],
    hints: 'Use the STAR technique and explain how technical benchmarks or user impact resolved the debate.'
  },

  // 2. Frontend Engineer
  {
    id: 'fe-tech-1',
    roleId: 'frontend',
    difficulty: 'beginner',
    category: 'technical',
    topic: 'React & DOM',
    text: 'How does React’s Virtual DOM and Reconciliation algorithm (Fiber) work, and why are unique keys crucial when rendering lists?',
    idealPoints: [
      'Virtual DOM is a lightweight in-memory representation of real DOM nodes',
      'React creates a new Virtual DOM tree on state change and runs a diffing algorithm against the previous tree',
      'Fiber engine performs incremental rendering and priority-based interruptible updates',
      'Unique keys allow React to track which list items changed, moved, or deleted, preventing unnecessary re-renders of the entire subtree'
    ],
    rubricKeywords: ['virtual dom', 'diffing', 'fiber', 'reconciliation', 'keys', 're-render', 'in-memory', 'real dom'],
    hints: 'Explain diffing heuristics, in-memory tree comparison, and how keys prevent element recreation.'
  },
  {
    id: 'fe-tech-2',
    roleId: 'frontend',
    difficulty: 'intermediate',
    category: 'technical',
    topic: 'Web Performance',
    text: 'What strategies and browser metrics do you use to optimize Core Web Vitals (LCP, FID/INP, and CLS) in a modern web application?',
    idealPoints: [
      'Largest Contentful Paint (LCP): Preload hero images, use WebP/AVIF, CDN caching, and eliminate render-blocking CSS/JS',
      'Interaction to Next Paint (INP) / FID: Code splitting, defer heavy scripts, offload expensive calculations to Web Workers',
      'Cumulative Layout Shift (CLS): Set explicit width/height or aspect-ratio on images/iframes, reserve space for dynamic ads/fonts',
      'Modern techniques: Tree-shaking, lazy-loading routes, and critical CSS inlining'
    ],
    rubricKeywords: ['lcp', 'inp', 'fid', 'cls', 'code splitting', 'preload', 'lazy-loading', 'aspect-ratio', 'web workers'],
    hints: 'Break down each metric (LCP, INP, CLS) and provide exact engineering mitigations for each.'
  },
  {
    id: 'fe-hr-1',
    roleId: 'frontend',
    difficulty: 'intermediate',
    category: 'behavioral',
    topic: 'Product & UX Collaboration',
    text: 'How do you handle a scenario where a product manager requests a feature deadline that compromises web accessibility (a11y) or mobile performance?',
    idealPoints: [
      'Acknowledge the business deadline while communicating the tangible risks (legal compliance, SEO penalty, user bounce rate)',
      'Propose a staged MVP delivery: launch core accessible functional flow on time, defer non-critical visual enhancements',
      'Use automated testing tools (Lighthouse, axe-core) to provide empirical data on performance and accessibility regressions',
      'Foster constructive collaboration by treating accessibility as a fundamental user requirement, not an optional bonus'
    ],
    rubricKeywords: ['accessibility', 'a11y', 'mvp', 'trade-off', 'lighthouse', 'compromise', 'deadline', 'user experience'],
    hints: 'Demonstrate balance between business velocity and non-negotiable software quality standards.'
  },

  // 3. Backend Engineer
  {
    id: 'be-tech-1',
    roleId: 'backend',
    difficulty: 'intermediate',
    category: 'technical',
    topic: 'Databases & Indexing',
    text: 'How do B-Tree and Hash indexes work in relational databases (PostgreSQL/MySQL)? In what situations does an index actually degrade query performance?',
    idealPoints: [
      'B-Tree indexes maintain a balanced multi-way search tree supporting O(log n) lookups, range scans, and ORDER BY queries',
      'Hash indexes map keys to buckets using a hash function, providing O(1) equality lookups but zero support for range queries',
      'Performance degradation occurs during heavy INSERT/UPDATE/DELETE operations because every index must be synchronously updated',
      'Degradation also happens on low-cardinality columns (e.g. boolean flags) where table scan is faster than index pointer lookup'
    ],
    rubricKeywords: ['b-tree', 'hash index', 'range scan', 'o(log n)', 'cardinality', 'write overhead', 'table scan', 'equality'],
    hints: 'Contrast range scans vs equality searches, write amplification, and index selectivity/cardinality.'
  },
  {
    id: 'be-tech-2',
    roleId: 'backend',
    difficulty: 'advanced',
    category: 'system-design',
    topic: 'Distributed Systems',
    text: 'Explain the CAP Theorem and how database systems like Cassandra, MongoDB, and PostgreSQL position themselves across Consistency, Availability, and Partition Tolerance.',
    idealPoints: [
      'In any asynchronous distributed network, partitions (P) are inevitable; systems must trade off Consistency (C) vs Availability (A)',
      'Consistency (CP): Every read receives the most recent write or an error (e.g. MongoDB primary, HBase)',
      'Availability (AP): Every non-failing node returns a response, but it may contain stale data (e.g. Apache Cassandra, DynamoDB)',
      'PACELC Theorem extension: When there is a partition choose A or C, Else (E) trade off Latency (L) versus Consistency (C)'
    ],
    rubricKeywords: ['cap theorem', 'partition tolerance', 'consistency', 'availability', 'cassandra', 'eventual consistency', 'pacelc'],
    hints: 'Mention why P is unavoidable on networks and distinguish CP (MongoDB) from AP (Cassandra).'
  },

  // 4. Full Stack Engineer
  {
    id: 'fs-tech-1',
    roleId: 'fullstack',
    difficulty: 'intermediate',
    category: 'technical',
    topic: 'Security & Auth',
    text: 'Compare Session-based authentication with Cookies vs Stateless JWT Authentication. How do you protect against CSRF and XSS attacks in both?',
    idealPoints: [
      'Session auth stores session state on server (Redis/DB) and a session ID in a cookie; JWT encodes claims inside a signed token',
      'XSS Protection: Store tokens in httpOnly, Secure cookies to prevent malicious JavaScript from reading the credentials',
      'CSRF Protection: Use SameSite=Lax/Strict cookie attributes, and verify custom anti-CSRF headers or tokens on mutation requests',
      'Token Revocation: JWT is stateless so revocation requires a token blacklist or refresh token rotation stored in the DB'
    ],
    rubricKeywords: ['jwt', 'httponly', 'csrf', 'xss', 'samesite', 'refresh token', 'revocation', 'stateless', 'session'],
    hints: 'Discuss token storage vulnerabilities (localStorage vs httpOnly cookie) and defense mechanisms.'
  },

  // 5. Data Analyst & Data Scientist
  {
    id: 'da-tech-1',
    roleId: 'data-analyst',
    difficulty: 'intermediate',
    category: 'technical',
    topic: 'SQL & Window Functions',
    text: 'Explain the difference between ROW_NUMBER(), RANK(), and DENSE_RANK() in SQL with a practical example. When would you use a CTE vs a Subquery?',
    idealPoints: [
      'ROW_NUMBER() assigns a unique sequential integer to each row regardless of duplicates (1, 2, 3, 4)',
      'RANK() assigns identical ranks to ties and skips subsequent numbers (1, 2, 2, 4)',
      'DENSE_RANK() assigns identical ranks to ties without skipping subsequent numbers (1, 2, 2, 3)',
      'Common Table Expressions (CTEs) improve readability, can be referenced multiple times, and support recursive hierarchy queries'
    ],
    rubricKeywords: ['row_number', 'rank', 'dense_rank', 'ties', 'gap', 'cte', 'subquery', 'partition by', 'order by'],
    hints: 'Show how ties are handled with numerical examples (e.g. scores 100, 90, 90, 80).'
  },
  {
    id: 'ds-tech-1',
    roleId: 'data-scientist',
    difficulty: 'intermediate',
    category: 'technical',
    topic: 'Machine Learning',
    text: 'What is the Bias-Variance tradeoff, and how do Regularization techniques (L1 Lasso vs L2 Ridge) mitigate overfitting in regression models?',
    idealPoints: [
      'High bias causes underfitting (oversimplified model); High variance causes overfitting (model models noise in training data)',
      'Regularization adds a penalty term to the loss function to constrain model parameter magnitudes',
      'L1 Regularization (Lasso) adds absolute coefficient values (|w|), driving irrelevant feature weights to zero for feature selection',
      'L2 Regularization (Ridge) adds squared coefficient values (w^2), shrinking weights smoothly towards zero without full sparsity'
    ],
    rubricKeywords: ['bias', 'variance', 'overfitting', 'underfitting', 'regularization', 'lasso', 'ridge', 'l1', 'l2', 'sparsity'],
    hints: 'Contrast weight shrinkage vs absolute zero feature elimination.'
  },

  // 6. Cybersecurity
  {
    id: 'sec-tech-1',
    roleId: 'cybersecurity',
    difficulty: 'intermediate',
    category: 'technical',
    topic: 'Network & Web Security',
    text: 'Explain how a SQL Injection (SQLi) attack occurs and how Prepared Statements with Parameterized Queries completely prevent it. How does this differ from input sanitization?',
    idealPoints: [
      'SQL Injection occurs when untrusted user input is directly concatenated into a dynamic SQL query string, altering the execution logic',
      'Parameterized Queries pre-compile the SQL statement structure on the database engine separately from the data values',
      'The database treats parameters strictly as literal values rather than executable code commands, neutralizing malicious payloads',
      'Input sanitization (blacklist/escaping) is fragile because novel bypass encodings can slip through parser filters'
    ],
    rubricKeywords: ['sql injection', 'parameterized queries', 'prepared statements', 'pre-compile', 'concatenation', 'sanitization', 'bypass'],
    hints: 'Explain the compile phase of SQL queries and why treating parameters strictly as literals guarantees security.'
  }
];

// Helper: Get question set for target role and difficulty
export function getQuestionsForRole(roleId = 'swe', difficulty = 'intermediate', count = 4) {
  // 1. Direct role matches
  let matches = INTERVIEW_QUESTIONS.filter(q => q.roleId === roleId);

  // 2. If fewer than requested, include SWE / general questions
  if (matches.length < count) {
    const general = INTERVIEW_QUESTIONS.filter(q => q.roleId === 'swe' && !matches.some(m => m.id === q.id));
    matches = [...matches, ...general];
  }

  // 3. Filter or order by difficulty preference
  const sorted = [...matches].sort((a, b) => {
    if (a.difficulty === difficulty && b.difficulty !== difficulty) return -1;
    if (b.difficulty === difficulty && a.difficulty !== difficulty) return 1;
    return 0;
  });

  return sorted.slice(0, count);
}

// Pure NLP/Rule-based evaluation algorithm (transparent, explainable, zero fake AI claims)
export function evaluateInterviewAnswer(question, userAnswer = '') {
  const cleanAnswer = (userAnswer || '').trim();
  const lowerAnswer = cleanAnswer.toLowerCase();
  const words = cleanAnswer.split(/\s+/).filter(Boolean);

  if (words.length < 15) {
    return {
      relevanceScore: 20,
      correctnessScore: 20,
      completenessScore: 15,
      overallScore: 18,
      feedback: 'The answer is too brief. Technical interviewers expect thorough structured explanations detailing mechanism, trade-offs, and examples.',
      keyPointsMissed: question.idealPoints.slice(0, 3),
      idealPoints: question.idealPoints
    };
  }

  // 1. Keyword Rubric Match
  let matchedKeywords = 0;
  const rubric = question.rubricKeywords || [];
  rubric.forEach(kw => {
    if (lowerAnswer.includes(kw.toLowerCase())) {
      matchedKeywords += 1;
    }
  });
  const keywordRatio = rubric.length > 0 ? (matchedKeywords / rubric.length) : 0.5;

  // 2. Ideal Points Coverage
  const missedPoints = [];
  const coveredPoints = [];

  (question.idealPoints || []).forEach(point => {
    // Check if key words of the point are present in the answer
    const pointKeywords = point.toLowerCase().split(/\s+/).filter(w => w.length > 4);
    const matchCount = pointKeywords.filter(w => lowerAnswer.includes(w)).length;
    const ratio = pointKeywords.length > 0 ? (matchCount / pointKeywords.length) : 0;

    if (ratio >= 0.35) {
      coveredPoints.push(point);
    } else {
      missedPoints.push(point);
    }
  });

  // 3. Compute Metrics
  // Relevance: topical keyword alignment + appropriate length
  const lengthBonus = Math.min(25, Math.round((words.length / 80) * 25));
  const relevanceScore = Math.min(100, Math.max(30, Math.round(keywordRatio * 75 + lengthBonus)));

  // Correctness: coverage of core points
  const pointsCoverageRatio = (question.idealPoints && question.idealPoints.length > 0)
    ? (coveredPoints.length / question.idealPoints.length)
    : 0.5;
  const correctnessScore = Math.min(100, Math.max(25, Math.round(pointsCoverageRatio * 70 + keywordRatio * 30)));

  // Completeness: structured answer, detailed explanation
  let completenessScore = Math.min(100, Math.max(20, Math.round((words.length >= 60 ? 80 : (words.length / 60) * 80) + (coveredPoints.length >= 2 ? 20 : 10))));

  // Overall Score
  const overallScore = Math.round(relevanceScore * 0.35 + correctnessScore * 0.40 + completenessScore * 0.25);

  // Constructive Feedback
  let feedback = '';
  if (overallScore >= 80) {
    feedback = 'Excellent technical depth! You demonstrated clear command of the concepts, appropriate terminology, and structured reasoning.';
  } else if (overallScore >= 60) {
    feedback = 'Good foundation. You understood the premise but missed some critical nuances and trade-off details expected in senior engineering rounds.';
  } else {
    feedback = 'Needs improvement. Focus on mastering the underlying computer science fundamentals and practice explaining concepts using standard terminology.';
  }

  return {
    relevanceScore,
    correctnessScore,
    completenessScore,
    overallScore,
    feedback,
    keyPointsMissed: missedPoints,
    idealPoints: question.idealPoints || []
  };
}

// Evaluate complete interview session
export function evaluateSession(roleId, difficulty, questionsWithAnswers = []) {
  if (questionsWithAnswers.length === 0) {
    return {
      overallScore: 0,
      relevanceScore: 0,
      correctnessScore: 0,
      completenessScore: 0,
      evaluatedQuestions: [],
      weakTopics: [],
      resources: [],
      feedback: 'No answers submitted.'
    };
  }

  const evaluatedQuestions = [];
  let sumOverall = 0;
  let sumRel = 0;
  let sumCorr = 0;
  let sumComp = 0;
  const topicScores = {};

  questionsWithAnswers.forEach(item => {
    const evalResult = evaluateInterviewAnswer(item.question, item.answer);
    evaluatedQuestions.push({
      questionText: item.question.text,
      category: item.question.category,
      topic: item.question.topic,
      difficulty: item.question.difficulty,
      userAnswer: item.answer || '',
      ...evalResult
    });

    sumOverall += evalResult.overallScore;
    sumRel += evalResult.relevanceScore;
    sumCorr += evalResult.correctnessScore;
    sumComp += evalResult.completenessScore;

    const topic = item.question.topic || 'General';
    if (!topicScores[topic]) topicScores[topic] = [];
    topicScores[topic].push(evalResult.overallScore);
  });

  const count = questionsWithAnswers.length;
  const overallScore = Math.round(sumOverall / count);
  const relevanceScore = Math.round(sumRel / count);
  const correctnessScore = Math.round(sumCorr / count);
  const completenessScore = Math.round(sumComp / count);

  // Find topics with average score < 70
  const weakTopics = Object.entries(topicScores)
    .filter(([_, scores]) => {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      return avg < 72;
    })
    .map(([topic]) => topic);

  // Curate targeted resources for identified weak topics
  const resourceDirectory = {
    'Data Structures': [
      { title: 'NeetCode Core Data Structures Series', url: 'https://neetcode.io/roadmap', platform: 'NeetCode' },
      { title: 'Visualgo Algorithm & Data Structure Visualizer', url: 'https://visualgo.net', platform: 'Interactive' }
    ],
    'Concurrency & OS': [
      { title: 'OSTEP: Operating Systems Three Easy Pieces', url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/', platform: 'Book' },
      { title: 'Concurrency in Practice Notes', url: 'https://github.com/donnemartin/system-design-primer', platform: 'GitHub' }
    ],
    'System Design': [
      { title: 'The System Design Primer (Open Source)', url: 'https://github.com/donnemartin/system-design-primer', platform: 'GitHub' },
      { title: 'ByteByteGo System Design Foundations', url: 'https://bytebytego.com', platform: 'Guide' }
    ],
    'React & DOM': [
      { title: 'React Documentation - Thinking in React', url: 'https://react.dev/learn', platform: 'Official Docs' },
      { title: 'Virtual DOM & Fiber Architecture Explained', url: 'https://github.com/acdlite/react-fiber-architecture', platform: 'Architecture' }
    ],
    'Databases & Indexing': [
      { title: 'Use The Index, Luke! - SQL Indexing Guide', url: 'https://use-the-index-luke.com', platform: 'Interactive' },
      { title: 'PostgreSQL Internals & Query Optimizer', url: 'https://www.postgresql.org/docs/current/performance-tips.html', platform: 'Docs' }
    ],
    'Security & Auth': [
      { title: 'OWASP Top 10 Web Application Security', url: 'https://owasp.org/Top10/', platform: 'OWASP' },
      { title: 'JWT Handbook & Best Security Practices', url: 'https://auth0.com/resources/ebooks/jwt-handbook', platform: 'Handbook' }
    ]
  };

  const curatedResources = [];
  weakTopics.forEach(t => {
    if (resourceDirectory[t]) {
      curatedResources.push(...resourceDirectory[t]);
    }
  });

  // Default resources if no weak topics
  if (curatedResources.length === 0) {
    curatedResources.push(
      { title: 'Technical Interview Handbook', url: 'https://www.techinterviewhandbook.org', platform: 'Curated' },
      { title: 'NeetCode Practice Roadmap', url: 'https://neetcode.io', platform: 'Practice' }
    );
  }

  let sessionFeedback = '';
  if (overallScore >= 80) {
    sessionFeedback = 'Strong Performance: Your responses demonstrate strong placement readiness. Keep maintaining precision and practicing timed mock rounds.';
  } else if (overallScore >= 60) {
    sessionFeedback = 'Moderate Alignment: You have the fundamental concepts right but need deeper technical rigor on trade-offs and edge cases.';
  } else {
    sessionFeedback = 'Significant Gaps: Work through the recommended study modules for your weak topics before scheduling high-stakes interviews.';
  }

  return {
    overallScore,
    relevanceScore,
    correctnessScore,
    completenessScore,
    evaluatedQuestions,
    weakTopics,
    resources: curatedResources.slice(0, 4),
    feedback: sessionFeedback
  };
}

