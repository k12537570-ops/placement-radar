export const SKILL_RESOURCES = {
  'dsa': {
    title: 'Data Structures Mastery',
    task: 'Implement an LRU Cache from scratch with Doubly Linked List and Hash Map with O(1) operations.',
    resources: [
      { name: 'NeetCode DSA Roadmap', url: 'https://neetcode.io/roadmap', provider: 'NeetCode' },
      { name: 'CS50 Intro to Computer Science', url: 'https://cs50.harvard.edu/x/', provider: 'Harvard University' }
    ]
  },
  'algorithms': {
    title: 'Algorithmic Problem Solving',
    task: 'Solve 10 classic Medium LeetCode problems covering Dynamic Programming and Graph BFS/DFS.',
    resources: [
      { name: 'Algorithms & Data Structures in JS/Python', url: 'https://www.freecodecamp.org/learn', provider: 'freeCodeCamp' },
      { name: 'GeeksforGeeks Top 50 Interview Algorithms', url: 'https://www.geeksforgeeks.org/top-algorithms-and-data-structures-for-competitive-programming/', provider: 'GeeksforGeeks' }
    ]
  },
  'system-design': {
    title: 'High-Scale Distributed Systems',
    task: 'Draft a full architecture diagram for a URL Shortener or Twitter Feed handling 10,000 writes/sec.',
    resources: [
      { name: 'System Design Primer (Open Source)', url: 'https://github.com/donnemartin/system-design-primer', provider: 'GitHub' },
      { name: 'System Design Full Course', url: 'https://www.youtube.com/watch?v=m8Icp_Cid5o', provider: 'freeCodeCamp' }
    ]
  },
  'operating-systems': {
    title: 'Operating Systems & Concurrency',
    task: 'Write a multi-threaded producer-consumer program managing shared buffer with mutex locks and condition variables.',
    resources: [
      { name: 'Operating Systems: Three Easy Pieces (Free Book)', url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/', provider: 'Univ of Wisconsin' },
      { name: 'Linux Kernel & Process Internals', url: 'https://www.geeksforgeeks.org/operating-systems/', provider: 'GeeksforGeeks' }
    ]
  },
  'computer-networks': {
    title: 'Computer Networks & Protocols',
    task: 'Capture and inspect HTTP/2 frames, TLS handshakes, and TCP SYN/ACK sequences using Wireshark or Curl -v.',
    resources: [
      { name: 'Computer Networking: A Top-Down Approach Notes', url: 'https://roadmap.sh/computer-science', provider: 'roadmap.sh' },
      { name: 'HTTP & WebSockets Deep Dive', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP', provider: 'MDN Web Docs' }
    ]
  },
  'dbms': {
    title: 'Relational DBMS & Query Optimization',
    task: 'Design an e-commerce schema up to 3rd Normal Form and optimize 3 queries using B-Tree EXPLAIN ANALYZE.',
    resources: [
      { name: 'Use The Index, Luke! (SQL Indexing Guide)', url: 'https://use-the-index-luke.com/', provider: 'Markus Winand' },
      { name: 'Relational Database Certification', url: 'https://www.freecodecamp.org/learn/relational-database/', provider: 'freeCodeCamp' }
    ]
  },
  'python': {
    title: 'Idiomatic & Asynchronous Python',
    task: 'Build a concurrent web scraper using asyncio, aiohttp, and context managers.',
    resources: [
      { name: 'Python for Everybody Specialization', url: 'https://www.py4e.com/', provider: 'Py4E / Michigan' },
      { name: 'Official Python 3 Tutorial', url: 'https://docs.python.org/3/tutorial/', provider: 'Python.org' }
    ]
  },
  'java': {
    title: 'Modern Java & OOP Architecture',
    task: 'Build a RESTful CRUD service with Java 17, Spring Boot 3, and Spring Data JPA.',
    resources: [
      { name: 'Java Programming Masterclass Guides', url: 'https://dev.java/learn/', provider: 'Oracle Dev' },
      { name: 'Spring Boot Official Quickstart', url: 'https://spring.io/quickstart', provider: 'VMware Spring' }
    ]
  },
  'cpp': {
    title: 'Modern C++ & Memory Safety',
    task: 'Construct a custom vector container with dynamic resizing, smart pointers (std::unique_ptr), and move semantics.',
    resources: [
      { name: 'LearnCpp.com Interactive Tutorials', url: 'https://www.learncpp.com/', provider: 'LearnCpp' },
      { name: 'C++ Reference & STL Documentation', url: 'https://en.cppreference.com/', provider: 'cppreference' }
    ]
  },
  'javascript': {
    title: 'Advanced JavaScript & Event Loop',
    task: 'Implement a custom Promise polyfill including Promise.all and Promise.race methods from scratch.',
    resources: [
      { name: 'The Modern JavaScript Tutorial', url: 'https://javascript.info/', provider: 'javascript.info' },
      { name: 'JavaScript Deep Dive & Web APIs', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', provider: 'MDN Web Docs' }
    ]
  },
  'sql': {
    title: 'Advanced SQL & Analytics Queries',
    task: 'Write queries using window functions (ROW_NUMBER, DENSE_RANK, LAG/LEAD) to calculate user cohort retention.',
    resources: [
      { name: 'SQLBolt - Interactive SQL Exercises', url: 'https://sqlbolt.com/', provider: 'SQLBolt' },
      { name: 'PostgreSQL Tutorial & Exercises', url: 'https://www.postgresqltutorial.com/', provider: 'PostgreSQL Tutorial' }
    ]
  },
  'html-css': {
    title: 'Modern CSS Layouts & Accessibility',
    task: 'Build a responsive Holy Grail layout with pure CSS Grid and WCAG AAA color contrast compliance.',
    resources: [
      { name: 'Responsive Web Design Certification', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/', provider: 'freeCodeCamp' },
      { name: 'Every Layout - Modular CSS', url: 'https://every-layout.dev/', provider: 'Heydon Pickering' }
    ]
  },
  'react': {
    title: 'React Production State & Architecture',
    task: 'Develop a data-grid component featuring client-side search, debounced filtering, and custom useFetch hook.',
    resources: [
      { name: 'Official React Documentation', url: 'https://react.dev/learn', provider: 'React Team' },
      { name: 'Full Stack Open: Deep Dive Into React', url: 'https://fullstackopen.com/en/part1', provider: 'Univ of Helsinki' }
    ]
  },
  'nodejs': {
    title: 'Node.js & Express Microservices',
    task: 'Author a JWT authentication server with bcrypt password hashing, refresh tokens, and rate limiting middleware.',
    resources: [
      { name: 'Backend Development & APIs Certification', url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/', provider: 'freeCodeCamp' },
      { name: 'Node.js Official Documentation & Guides', url: 'https://nodejs.org/en/learn', provider: 'Node.js' }
    ]
  },
  'rest-apis': {
    title: 'RESTful API Architecture & Contracts',
    task: 'Publish an OpenAPI 3.0 (Swagger) specification defining full request/response schemas with error structures.',
    resources: [
      { name: 'REST API Architectural Design Best Practices', url: 'https://roadmap.sh/api-design', provider: 'roadmap.sh' },
      { name: 'Microsoft REST API Guidelines', url: 'https://github.com/microsoft/api-guidelines', provider: 'Microsoft' }
    ]
  },
  'typescript': {
    title: 'Type-Safe Engineering with TypeScript',
    task: 'Refactor a legacy vanilla JS utility into TypeScript using strict types, discriminated unions, and mapped types.',
    resources: [
      { name: 'Total TypeScript Beginner Tutorials', url: 'https://www.totaltypescript.com/tutorials/beginners-typescript', provider: 'Matt Pocock' },
      { name: 'TypeScript Handbook Official Guide', url: 'https://www.typescriptlang.org/docs/handbook/intro.html', provider: 'Microsoft' }
    ]
  },
  'statistics': {
    title: 'Practical Statistics for Engineering',
    task: 'Run an A/B test simulation in Python calculating p-value and confidence intervals to validate button conversion.',
    resources: [
      { name: 'Khan Academy Statistics & Probability', url: 'https://www.khanacademy.org/math/statistics-probability', provider: 'Khan Academy' },
      { name: 'Seeing Theory: Visual Intro to Probability', url: 'https://seeing-theory.brown.edu/', provider: 'Brown University' }
    ]
  },
  'machine-learning': {
    title: 'Applied Machine Learning Foundations',
    task: 'Train and evaluate Random Forest and Logistic Regression models on a customer churn dataset with cross-validation.',
    resources: [
      { name: 'Machine Learning Course by Andrew Ng (Audit)', url: 'https://www.coursera.org/specializations/machine-learning-introduction', provider: 'Coursera / DeepLearning.AI' },
      { name: 'Scikit-Learn Official MOOC', url: 'https://inria.github.io/scikit-learn-mooc/', provider: 'Inria' }
    ]
  },
  'data-analysis': {
    title: 'Exploratory Data Analysis (EDA)',
    task: 'Conduct a comprehensive exploratory data analysis on a Kaggle dataset, uncovering anomalies and correlation matrices.',
    resources: [
      { name: 'Data Analysis with Python Certification', url: 'https://www.freecodecamp.org/learn/data-analysis-with-python/', provider: 'freeCodeCamp' },
      { name: 'Google Data Analytics Certificate Resources', url: 'https://grow.google/certificates/data-analytics/', provider: 'Google' }
    ]
  },
  'pandas-numpy': {
    title: 'High-Performance Data Wrangling',
    task: 'Replace 5 slow Python for-loops with vectorized NumPy broadcasting operations, benchmarking execution speedups.',
    resources: [
      { name: '10 Minutes to Pandas Official Guide', url: 'https://pandas.pydata.org/docs/user_guide/10min.html', provider: 'Pandas Team' },
      { name: 'NumPy Illustrated: Visual Guide to NumPy', url: 'https://betterprogramming.pub/numpy-illustrated-the-visual-guide-to-numpy-3b1d4976de1d', provider: 'Lev Maximov' }
    ]
  },
  'data-viz': {
    title: 'Interactive Visualizations & Dashboards',
    task: 'Build a multi-metric dashboard in Recharts / Matplotlib featuring synced tooltips, filters, and color palettes.',
    resources: [
      { name: 'Data Visualization with D3 and React', url: 'https://www.freecodecamp.org/learn/data-visualization/', provider: 'freeCodeCamp' },
      { name: 'Storytelling with Data Best Practices', url: 'https://www.storytellingwithdata.com/chart-guide', provider: 'Cole Knaflic' }
    ]
  },
  'git-github': {
    title: 'Git Collaboration & Workflow Rigour',
    task: 'Simulate resolving a 3-way merge conflict via CLI interactive rebase and sign commits with GPG.',
    resources: [
      { name: 'Pro Git Book (Complete & Free)', url: 'https://git-scm.com/book/en/v2', provider: 'Git-SCM' },
      { name: 'Learn Git Branching (Interactive Sandbox)', url: 'https://learngitbranching.js.org/', provider: 'Learn Git' }
    ]
  },
  'docker': {
    title: 'Containerization & Docker Orchestration',
    task: 'Write a multi-stage Dockerfile for a React + Node app, reducing image size from 900MB to under 75MB.',
    resources: [
      { name: 'Docker Curriculum for Beginners', url: 'https://docker-curriculum.com/', provider: 'Docker Curriculum' },
      { name: 'Docker Official Getting Started Lab', url: 'https://docs.docker.com/get-started/', provider: 'Docker Docs' }
    ]
  },
  'linux-cli': {
    title: 'Linux Shell Mastery & Automation',
    task: 'Write a Bash maintenance script that archives log files older than 7 days and monitors disk usage alerts.',
    resources: [
      { name: 'The Missing Semester of Your CS Education', url: 'https://missing.csail.mit.edu/', provider: 'MIT CSAIL' },
      { name: 'Linux Journey - CLI Mastery', url: 'https://linuxjourney.com/', provider: 'Linux Journey' }
    ]
  },
  'cloud': {
    title: 'Cloud Infrastructure & Serverless',
    task: 'Deploy a static frontend on S3/CloudFront and an AWS Lambda function triggered by an API Gateway endpoint.',
    resources: [
      { name: 'AWS Cloud Practitioner Essentials (Free)', url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials', provider: 'AWS' },
      { name: 'Cloud Engineering Roadmap', url: 'https://roadmap.sh/devops', provider: 'roadmap.sh' }
    ]
  },
  'ci-cd': {
    title: 'Automated CI/CD Pipelines',
    task: 'Set up a GitHub Actions workflow that runs linter, tests, builds Docker image, and reports test coverage on PRs.',
    resources: [
      { name: 'GitHub Actions Quickstart Guide', url: 'https://docs.github.com/en/actions/quickstart', provider: 'GitHub Docs' },
      { name: 'Continuous Integration with GitHub Actions', url: 'https://www.freecodecamp.org/news/learn-github-actions-in-one-hour/', provider: 'freeCodeCamp' }
    ]
  },
  'communication': {
    title: 'Clear Technical Communication',
    task: 'Author a 1-page Design Document (RFC) explaining the tradeoffs between SQL vs NoSQL for a messaging app.',
    resources: [
      { name: 'Google Technical Writing One & Two', url: 'https://developers.google.com/tech-writing', provider: 'Google Developers' },
      { name: 'How to Write a Great Pull Request Description', url: 'https://github.blog/2015-01-21-how-to-write-the-perfect-pull-request/', provider: 'GitHub Blog' }
    ]
  },
  'teamwork': {
    title: 'Agile Teamwork & Code Review Empathy',
    task: 'Conduct a thorough, respectful code review on an open-source GitHub pull request with constructive suggestions.',
    resources: [
      { name: 'Google Engineering Practices: Code Review Guide', url: 'https://google.github.io/eng-practices/review/', provider: 'Google' },
      { name: 'Atlassian Agile Coach Tutorials', url: 'https://www.atlassian.com/agile', provider: 'Atlassian' }
    ]
  },
  'problem-solving': {
    title: 'Structured Debugging & Root Cause Analysis',
    task: 'Perform a 5-Whys root cause analysis on a simulated production incident and write a postmortem document.',
    resources: [
      { name: 'Google SRE: Being on-call & Postmortem Culture', url: 'https://sre.google/sre-book/postmortem-culture/', provider: 'Google SRE' },
      { name: 'Systematic Debugging Principles', url: 'https://mitpress.mit.edu/9780262534437/why-programs-fail/', provider: 'MIT Press' }
    ]
  },
  'time-management': {
    title: 'Sprint Planning & Deep Work Habits',
    task: 'Plan a 2-week personal sprint breaking an ambitious portfolio project into 4-hour story point deliverables.',
    resources: [
      { name: 'Pomodoro Technique & Deep Work Fundamentals', url: 'https://todoist.com/productivity-methods/pomodoro-technique', provider: 'Todoist' },
      { name: 'Scrum Guide & Estimation Frameworks', url: 'https://scrumguides.org/scrum-guide.html', provider: 'Scrum.org' }
    ]
  }
};
