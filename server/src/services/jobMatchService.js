// Resume vs Job Description Matching Engine

const TECHNICAL_DICTIONARY = [
  'react', 'react.js', 'vue', 'angular', 'node.js', 'nodejs', 'express', 'express.js',
  'python', 'django', 'fastapi', 'flask', 'java', 'spring', 'spring boot', 'c++', 'c#',
  'javascript', 'typescript', 'html', 'css', 'tailwind', 'bootstrap', 'sass',
  'sql', 'postgresql', 'postgres', 'mysql', 'sqlite', 'mongodb', 'redis', 'elasticsearch',
  'docker', 'kubernetes', 'k8s', 'aws', 'gcp', 'azure', 'linux', 'git', 'github', 'ci/cd',
  'rest', 'restful', 'graphql', 'grpc', 'microservices', 'unit testing', 'jest', 'pytest',
  'data structures', 'algorithms', 'system design', 'agile', 'scrum', 'jira',
  'machine learning', 'deep learning', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch'
];

export function analyzeJobMatch(resumeData = {}, jobDescriptionText = '') {
  if (!jobDescriptionText || jobDescriptionText.trim().length === 0) {
    return {
      matchScore: 0,
      matchedKeywords: [],
      missingKeywords: [],
      recommendations: ['Paste a job description to analyze matching alignment.']
    };
  }

  const jobLower = jobDescriptionText.toLowerCase();
  const resumeString = JSON.stringify(resumeData).toLowerCase();

  // 1. Identify target keywords in the Job Description
  const jobKeywords = [];
  TECHNICAL_DICTIONARY.forEach(term => {
    // Regex for word boundary matching
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(jobLower)) {
      jobKeywords.push(term);
    }
  });

  // Also extract capitalized technical terms or standard phrases from job text
  const customMatches = jobDescriptionText.match(/\b([A-Z][a-zA-Z0-9+#]+)\b/g) || [];
  customMatches.forEach(word => {
    const w = word.toLowerCase();
    if (w.length > 2 && !['and', 'for', 'the', 'with', 'you', 'will', 'our', 'team', 'role', 'work'].includes(w)) {
      if (!jobKeywords.includes(w) && TECHNICAL_DICTIONARY.some(t => t.includes(w))) {
        jobKeywords.push(w);
      }
    }
  });

  const uniqueJobKeywords = Array.from(new Set(jobKeywords));

  if (uniqueJobKeywords.length === 0) {
    // Generic fallback keywords
    uniqueJobKeywords.push('problem solving', 'teamwork', 'communication', 'git');
  }

  // 2. Identify matches in resume
  const matched = [];
  const missing = [];

  uniqueJobKeywords.forEach(kw => {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(resumeString)) {
      matched.push(kw);
    } else {
      missing.push(kw);
    }
  });

  // 3. Compute score
  const matchRatio = matched.length / uniqueJobKeywords.length;
  const matchScore = Math.min(100, Math.max(10, Math.round(matchRatio * 100)));

  // 4. Generate actionable bullet recommendations
  const recommendations = [];

  if (missing.length > 0) {
    const topMissing = missing.slice(0, 4).map(s => s.toUpperCase()).join(', ');
    recommendations.push(`High priority: Add explicit mentions of ${topMissing} in your Skills or Experience bullet points.`);
  }

  if (matched.length >= 5) {
    recommendations.push(`Great alignment on core tech stack: ${matched.slice(0, 3).join(', ')} are well represented.`);
  } else {
    recommendations.push(`Expand project descriptions to demonstrate practical application of ${uniqueJobKeywords.slice(0, 3).join(', ')}.`);
  }

  recommendations.push('Ensure bullet points quantify achievements (e.g. "% latency reduction", "user count", "database query optimization").');

  return {
    matchScore,
    matchedKeywords: matched,
    missingKeywords: missing,
    recommendations
  };
}

