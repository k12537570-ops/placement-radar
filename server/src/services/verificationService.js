// Skill Verification & Technical Assessment Bank

export const VERIFICATION_TOPICS = [
  { id: 'dsa', name: 'Data Structures & Algorithms', icon: 'Code', questionsCount: 15 },
  { id: 'python', name: 'Python Programming', icon: 'Terminal', questionsCount: 15 },
  { id: 'java', name: 'Java & JVM', icon: 'Cpu', questionsCount: 15 },
  { id: 'cpp', name: 'C++ Systems', icon: 'Zap', questionsCount: 12 },
  { id: 'dbms-sql', name: 'DBMS & SQL', icon: 'Database', questionsCount: 15 },
  { id: 'oop', name: 'Object-Oriented Programming', icon: 'Box', questionsCount: 12 },
  { id: 'os', name: 'Operating Systems', icon: 'Layers', questionsCount: 12 },
  { id: 'cn', name: 'Computer Networks', icon: 'Globe', questionsCount: 12 },
  { id: 'web-react', name: 'Modern Web & React', icon: 'Layout', questionsCount: 15 }
];

export const QUESTION_BANK = {
  'dsa': [
    {
      id: 'dsa-1',
      question: 'What is the worst-case time complexity of searching for an element in a balanced Binary Search Tree (AVL or Red-Black Tree)?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctAnswer: 1,
      explanation: 'Balanced BSTs guarantee maximum tree height bounded by O(log n), ensuring worst-case search, insertion, and deletion are all O(log n).'
    },
    {
      id: 'dsa-2',
      question: 'Which data structure is primarily used to implement Breadth-First Search (BFS) on a graph?',
      options: ['Stack', 'Priority Queue', 'Queue (FIFO)', 'Disjoint Set (Union-Find)'],
      correctAnswer: 2,
      explanation: 'BFS explores vertices level by level, requiring a FIFO Queue to process vertices in the exact order they were discovered.'
    },
    {
      id: 'dsa-3',
      question: 'In the Floyd-Warshall algorithm for All-Pairs Shortest Paths, what is the overall time complexity for a graph with V vertices?',
      options: ['O(V^2)', 'O(V^3)', 'O(V log V)', 'O(E log V)'],
      correctAnswer: 1,
      explanation: 'Floyd-Warshall executes three nested loops from 1 to V, resulting in an O(V^3) time complexity.'
    },
    {
      id: 'dsa-4',
      question: 'What is the auxiliary space complexity of an in-place QuickSort implementation when using recursion?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctAnswer: 1,
      explanation: 'While QuickSort partitions elements in-place without auxiliary arrays, the recursive call stack consumes O(log n) space in the average case.'
    },
    {
      id: 'dsa-5',
      question: 'What is the result of evaluating the postfix expression: "5 3 + 2 * 4 -" ?',
      options: ['12', '16', '14', '8'],
      correctAnswer: 0,
      explanation: '(5 + 3) = 8; then 8 * 2 = 16; then 16 - 4 = 12.'
    }
  ],
  'python': [
    {
      id: 'py-1',
      question: 'What is the output of `bool([])`, `bool([0])`, and `bool((0,))` in Python?',
      options: [
        'False, False, False',
        'False, True, True',
        'False, False, True',
        'True, True, True'
      ],
      correctAnswer: 1,
      explanation: 'An empty list `[]` evaluates to False (falsy). Non-empty collections `[0]` and `(0,)` have a length > 0, so both evaluate to True.'
    },
    {
      id: 'py-2',
      question: 'What is the Global Interpreter Lock (GIL) in CPython?',
      options: [
        'A lock that prevents multiple Python scripts from executing on the same CPU socket',
        'A mutex that allows only one native thread to hold the Python interpreter lock at any moment',
        'A security sandbox that disables file system writes in production',
        'A compiler flag that turns dynamic Python into static C bytecode'
      ],
      correctAnswer: 1,
      explanation: 'The GIL is a mutex protecting access to Python objects, preventing multiple threads from executing Python bytecodes simultaneously in CPython.'
    },
    {
      id: 'py-3',
      question: 'What is the time complexity of checking membership `item in collection` for a Python `dict` vs a Python `list` on average?',
      options: [
        'List: O(1), Dict: O(n)',
        'List: O(n), Dict: O(1)',
        'List: O(log n), Dict: O(1)',
        'List: O(1), Dict: O(1)'
      ],
      correctAnswer: 1,
      explanation: 'Python dicts are implemented as hash tables with O(1) average lookup. Python lists require linear O(n) traversal.'
    },
    {
      id: 'py-4',
      question: 'What does the `@functools.wraps(func)` decorator do when authoring a custom decorator?',
      options: [
        'Optimizes execution by compiling to C',
        'Preserves original function name, docstring, and metadata',
        'Caches return values automatically like memoization',
        'Forces the decorated function to execute asynchronously'
      ],
      correctAnswer: 1,
      explanation: 'Without `@functools.wraps`, decorated functions lose their original `__name__` and `__doc__`, taking on the wrapper name instead.'
    },
    {
      id: 'py-5',
      question: 'What is the primary difference between `[x for x in data]` (list comprehension) and `(x for x in data)` (generator expression)?',
      options: [
        'List comprehension executes lazily; generator evaluates eagerly',
        'List comprehension creates the full list in memory; generator produces values on-demand with O(1) memory',
        'Generators can only be used with numbers',
        'List comprehensions cannot be iterated more than once'
      ],
      correctAnswer: 1,
      explanation: 'Generators yield items one by one lazily with minimal memory footprint, whereas list comprehensions allocate all elements upfront.'
    }
  ],
  'dbms-sql': [
    {
      id: 'sql-1',
      question: 'Which ACID property ensures that once a database transaction commits, its changes survive system crashes or power outages?',
      options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
      correctAnswer: 3,
      explanation: 'Durability guarantees that committed data is permanently written to non-volatile storage (WAL / journal) and survives crashes.'
    },
    {
      id: 'sql-2',
      question: 'What happens when you execute a `LEFT JOIN` and there is no matching row on the right table?',
      options: [
        'The query aborts with an integrity constraint violation',
        'The row from the left table is omitted from results',
        'The row from the left table is returned with NULL values for all right table columns',
        'The query hangs until a timeout occurs'
      ],
      correctAnswer: 2,
      explanation: 'LEFT JOIN keeps all rows from the left table; unmatched rows on the right produce NULL in right-table columns.'
    },
    {
      id: 'sql-3',
      question: 'What is a "Phantom Read" in database isolation levels, and which ANSI isolation level prevents it?',
      options: [
        'Reading uncommitted data; prevented by Read Committed',
        'A transaction re-reads a range of rows and finds new rows inserted by another committed transaction; prevented by Serializable',
        'Modifying data that was already deleted; prevented by Repeatable Read',
        'Deadlock detection occurring during table locking'
      ],
      correctAnswer: 1,
      explanation: 'Phantom reads happen when range queries see new rows inserted by concurrent transactions. The Serializable level eliminates phantom reads.'
    },
    {
      id: 'sql-4',
      question: 'What is the primary function of a Database Write-Ahead Log (WAL)?',
      options: [
        'To store client query logs for audit and billing purposes',
        'To append transaction operations before applying changes to data pages, ensuring crash recovery and durability',
        'To automatically generate indexes on slow queries',
        'To compress database backup dumps'
      ],
      correctAnswer: 1,
      explanation: 'WAL ensures atomic and durable writes: changes are logged sequentially to disk before buffer pages are modified.'
    },
    {
      id: 'sql-5',
      question: 'Which Normal Form eliminates transitive dependencies between non-prime attributes and candidate keys?',
      options: ['1NF', '2NF', '3NF', 'BCNF'],
      correctAnswer: 2,
      explanation: '3NF requires that every non-prime attribute is non-transitively dependent on every candidate key.'
    }
  ],
  'web-react': [
    {
      id: 'web-1',
      question: 'What does the `useCallback` hook in React actually memoize?',
      options: [
        'The calculated return value of a pure function',
        'The function instance itself across component re-renders',
        'The DOM element reference',
        'The global Redux/Zustand store snapshot'
      ],
      correctAnswer: 1,
      explanation: '`useCallback` caches a function definition between renders, only re-creating it when dependencies change.'
    },
    {
      id: 'web-2',
      question: 'What is the purpose of the HTTP `Content-Security-Policy` (CSP) response header?',
      options: [
        'Enables gzip/brotli compression on REST responses',
        'Restricts which scripts, styles, and origins can be executed in the browser, mitigating XSS and data injection',
        'Sets maximum request payload sizes for file uploads',
        'Forces client browsers to store cookies for 30 days'
      ],
      correctAnswer: 1,
      explanation: 'CSP mitigates Cross-Site Scripting (XSS) and data packet injection by declaring approved sources of dynamic executable content.'
    },
    {
      id: 'web-3',
      question: 'In modern CSS, what is the key difference between `rem` and `em` units?',
      options: [
        '`rem` is relative to the root `<html>` font-size; `em` is relative to the font-size of the current parent element',
        '`rem` can only be used on padding and margins',
        '`em` is fixed to 16px always',
        '`rem` changes with browser viewport width'
      ],
      correctAnswer: 0,
      explanation: '`rem` (root em) always scales off `:root` font-size, avoiding compounding calculation issues found in nested `em` elements.'
    },
    {
      id: 'web-4',
      question: 'What is an HTTP Preflight `OPTIONS` request in CORS, and when is it triggered?',
      options: [
        'It is sent before every single GET request without exception',
        'It is sent by browsers before "non-simple" cross-origin requests (e.g. methods like PUT/DELETE or custom headers like Authorization)',
        'It is an SSL handshake diagnostic test',
        'It tests DNS resolution speed'
      ],
      correctAnswer: 1,
      explanation: 'Browsers automatically issue an OPTIONS preflight to verify that the target server permits the method and headers before sending the actual request.'
    },
    {
      id: 'web-5',
      question: 'What problem does React 18 Concurrent Rendering solve?',
      options: [
        'It allows JavaScript to run on multiple CPU cores in the browser',
        'It makes rendering interruptible, allowing urgent user interactions (typing/clicking) to take priority over heavy background renders',
        'It replaces the Virtual DOM with WebAssembly',
        'It eliminates the need for useEffect hooks'
      ],
      correctAnswer: 1,
      explanation: 'Concurrent React can pause and resume rendering to ensure UI responsiveness during heavy DOM transitions.'
    }
  ]
};

// Fallback generator for topics not explicitly listed in static bank
function generateFallbackQuestions(topic = 'General') {
  return [
    {
      id: `${topic.toLowerCase()}-1`,
      question: `In ${topic}, what is the fundamental principle of encapsulation and loose coupling?`,
      options: [
        'Hiding internal implementation details and exposing minimal stable interfaces',
        'Making all internal member variables public for zero-copy access',
        'Executing all code in a single global namespace',
        'Eliminating the need for type safety'
      ],
      correctAnswer: 0,
      explanation: 'Encapsulation restricts direct access to internal state and couples components via clean public contracts.'
    },
    {
      id: `${topic.toLowerCase()}-2`,
      question: `What is the primary advantage of automated regression testing during continuous integration (CI)?`,
      options: [
        'Guarantees 100% bug-free software in production',
        'Catches regressions early in development before deployment to production environments',
        'Eliminates the need for code reviews',
        'Decreases total build artifact sizes'
      ],
      correctAnswer: 1,
      explanation: 'Automated CI test suites verify that newly committed features do not break existing functionality.'
    },
    {
      id: `${topic.toLowerCase()}-3`,
      question: `When designing high-throughput distributed systems in ${topic}, why is idempotency important for API endpoints?`,
      options: [
        'It reduces the amount of memory consumed by the database',
        'It ensures that repeated retries of the same network request produce the exact same result without duplicate side-effects',
        'It forces all requests to run synchronously',
        'It encrypts payloads using asymmetric cryptographic keys'
      ],
      correctAnswer: 1,
      explanation: 'Idempotency enables safe retries over unreliable networks without creating duplicate records or double charges.'
    }
  ];
}

export function getAssessmentQuestions(topicId = 'dsa', difficulty = 'intermediate', count = 5) {
  const bank = QUESTION_BANK[topicId] || generateFallbackQuestions(topicId);
  return bank.slice(0, count).map(q => ({
    id: q.id,
    question: q.question,
    options: q.options
  }));
}

export function evaluateAssessment(topicId, difficulty, userAnswers = {}, timeSpentSeconds = 0) {
  const bank = QUESTION_BANK[topicId] || generateFallbackQuestions(topicId);
  let correctCount = 0;
  const detailedResults = [];

  bank.forEach((q, index) => {
    const selectedAnswer = userAnswers[q.id] !== undefined ? Number(userAnswers[q.id]) : -1;
    const isCorrect = selectedAnswer === q.correctAnswer;
    if (isCorrect) correctCount += 1;

    detailedResults.push({
      id: q.id,
      question: q.question,
      options: q.options,
      selectedAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation
    });
  });

  const total = bank.length;
  const score = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const passed = score >= 60;

  return {
    score,
    totalQuestions: total,
    correctAnswers: correctCount,
    timeSpentSeconds,
    passed,
    detailedResults
  };
}

