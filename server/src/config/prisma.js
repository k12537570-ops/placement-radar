import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

// If running on Vercel with SQLite, ensure database is located in writable /tmp
if (process.env.VERCEL && (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith('file:'))) {
  const tmpDbPath = '/tmp/dev.db';
  if (!fs.existsSync(tmpDbPath)) {
    const candidatePaths = [
      path.resolve(process.cwd(), 'prisma/dev.db'),
      path.resolve(process.cwd(), 'server/prisma/dev.db'),
      path.resolve(process.cwd(), 'dev.db'),
      path.resolve(process.cwd(), '../prisma/dev.db')
    ];
    for (const candidate of candidatePaths) {
      if (fs.existsSync(candidate)) {
        try {
          fs.copyFileSync(candidate, tmpDbPath);
          console.log(`[Vercel SQLite] Seeded database copied to ${tmpDbPath}`);
          break;
        } catch (e) {
          console.warn('[Vercel SQLite] Could not copy database to /tmp:', e);
        }
      }
    }
  }
  process.env.DATABASE_URL = `file:${tmpDbPath}`;
}

export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
});

// Enable SQLite foreign keys on initialization
async function initPrisma() {
  try {
    await prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON;');
  } catch (err) {
    console.error('Error enabling SQLite foreign keys:', err);
  }
}

initPrisma();


