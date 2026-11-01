import cron from 'node-cron';
import { prisma } from '../config/prisma.js';

export async function cleanupExpiredGuests() {
  try {
    const now = new Date();
    const result = await prisma.user.deleteMany({
      where: {
        isGuest: true,
        guestExpiresAt: {
          lt: now
        }
      }
    });
    if (result.count > 0) {
      console.log(`🧹 Cleaned up ${result.count} expired guest user(s) and cascaded their data.`);
    }
  } catch (err) {
    console.error('Error during expired guest cleanup:', err);
  }
}

export function initGuestCleanupJob() {
  // Run once immediately on server startup
  cleanupExpiredGuests();

  // Run daily at midnight (00:00)
  cron.schedule('0 0 * * *', () => {
    cleanupExpiredGuests();
  });
}

