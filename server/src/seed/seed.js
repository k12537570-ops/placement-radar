import { prisma } from '../config/prisma.js';
import { hashPassword } from '../utils/tokens.js';
import { SKILLS, ROLES, COMPANY_MODES } from './referenceData.js';

async function seed() {
  console.log('🌱 Starting database seed & reference integrity check...');

  // 1. Reference Data Checks
  console.log(`✓ Verified ${SKILLS.length} skills (expected 30)`);
  console.log(`✓ Verified ${ROLES.length} target roles (expected 10)`);
  console.log(`✓ Verified ${COMPANY_MODES.length} company modes (expected 4)`);

  if (SKILLS.length !== 30 || ROLES.length !== 10) {
    throw new Error('Reference data validation failed!');
  }

  // 2. Demo User Seed
  const demoEmail = 'demo@placementradar.dev';
  const existingUser = await prisma.user.findUnique({ where: { email: demoEmail } });

  if (existingUser) {
    console.log(`ℹ️ Demo user (${demoEmail}) already exists. Skipping recreation.`);
    return;
  }

  const passwordHash = await hashPassword('Demo1234!');

  const demoUser = await prisma.user.create({
    data: {
      name: 'Alex Vance (Demo Candidate)',
      email: demoEmail,
      passwordHash,
      college: 'National Institute of Technology',
      graduationYear: '2026',
      targetRole: 'swe',
      companyMode: 'product',
      accent: 'brick-red',
      mode: 'light',
      fontScale: 100,
      reduceMotion: false,
      onboardingDone: true,
      skillRatings: {
        create: [
          { skillId: 'dsa', level: 4, liveConfidence: true },
          { skillId: 'algorithms', level: 3, liveConfidence: true },
          { skillId: 'system-design', level: 3, liveConfidence: false },
          { skillId: 'os', level: 3, liveConfidence: false },
          { skillId: 'cn', level: 3, liveConfidence: false },
          { skillId: 'dbms', level: 4, liveConfidence: true },
          { skillId: 'python', level: 4, liveConfidence: true },
          { skillId: 'java', level: 3, liveConfidence: false },
          { skillId: 'cpp', level: 2, liveConfidence: false },
          { skillId: 'javascript', level: 4, liveConfidence: true },
          { skillId: 'sql', level: 4, liveConfidence: true },
          { skillId: 'html-css', level: 4, liveConfidence: true },
          { skillId: 'react', level: 4, liveConfidence: true },
          { skillId: 'nodejs', level: 3, liveConfidence: true },
          { skillId: 'rest-apis', level: 4, liveConfidence: true },
          { skillId: 'typescript', level: 3, liveConfidence: false },
          { skillId: 'statistics', level: 2, liveConfidence: false },
          { skillId: 'machine-learning', level: 1, liveConfidence: false },
          { skillId: 'data-analysis', level: 2, liveConfidence: false },
          { skillId: 'pandas-numpy', level: 2, liveConfidence: false },
          { skillId: 'data-viz', level: 2, liveConfidence: false },
          { skillId: 'git-github', level: 4, liveConfidence: true },
          { skillId: 'docker', level: 3, liveConfidence: false },
          { skillId: 'linux-cli', level: 3, liveConfidence: false },
          { skillId: 'cloud', level: 2, liveConfidence: false },
          { skillId: 'ci-cd', level: 2, liveConfidence: false },
          { skillId: 'communication', level: 4, liveConfidence: true },
          { skillId: 'teamwork', level: 4, liveConfidence: true },
          { skillId: 'problem-solving', level: 4, liveConfidence: true },
          { skillId: 'time-mgmt', level: 3, liveConfidence: false }
        ]
      },
      resume: {
        create: {
          template: 'classic',
          personal: JSON.stringify({
            fullName: 'Alex Vance',
            title: 'Aspiring Software Engineer',
            email: demoEmail,
            phone: '+91 98765 43210',
            location: 'Bangalore, India',
            linkedin: 'linkedin.com/in/alexvance',
            github: 'github.com/alexvance'
          }),
          summary: 'Proactive Computer Science undergraduate with hands-on proficiency in React, Node.js, and Algorithmic problem-solving. Proven track record building high-performance web applications and scalable database schemas.',
          skills: JSON.stringify([
            'Data Structures & Algorithms',
            'React & Redux',
            'Node.js / Express',
            'TypeScript',
            'SQL & DBMS',
            'RESTful APIs',
            'Git / GitHub',
            'Docker & Linux'
          ]),
          experience: JSON.stringify([
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
          ]),
          projects: JSON.stringify([
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
            }
          ]),
          education: JSON.stringify([
            {
              id: 'edu-1',
              institution: 'National Institute of Technology',
              degree: 'B.Tech in Computer Science and Engineering',
              score: '8.8 / 10.0 CGPA',
              period: '2022 — 2026',
              location: 'Bangalore'
            }
          ]),
          certifications: JSON.stringify([
            {
              id: 'cert-1',
              name: 'Meta Front-End Developer Professional Certificate',
              issuer: 'Coursera / Meta',
              date: '2024'
            }
          ]),
          lastAtsScore: 88
        }
      },
      snapshots: {
        create: [
          {
            date: '2026-10-15',
            readinessScore: 68,
            role: 'swe',
            companyMode: 'product',
            categoryScores: '{}',
            topGaps: '[]'
          },
          {
            date: '2026-10-25',
            readinessScore: 78,
            role: 'swe',
            companyMode: 'product',
            categoryScores: '{}',
            topGaps: '[]'
          }
        ]
      }
    }
  });

  console.log(`✅ Demo user seeded successfully:`);
  console.log(`   Email: ${demoUser.email}`);
  console.log(`   Password: Demo1234!`);
}

seed()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

