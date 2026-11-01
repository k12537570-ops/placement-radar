import { app } from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/prisma.js';
import { initGuestCleanupJob } from './jobs/guestCleanup.js';

const PORT = process.env.PORT || env.PORT || 5000;

export const server = app.listen(PORT, () => {
  console.log(`🚀 Placement Radar Server running in ${env.NODE_ENV || 'production'} mode on port ${PORT}`);
  console.log(`📡 Health Check available at: http://localhost:${PORT}/api/v1/health`);

  // Initialize background jobs
  initGuestCleanupJob();
});

// Graceful shutdown
async function gracefulShutdown(signal) {
  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
  if (server && server.close) {
    server.close(async () => {
      try {
        await prisma.$disconnect();
        console.log('✅ SQLite database disconnected.');
        process.exit(0);
      } catch (err) {
        console.error('Error disconnecting database:', err);
        process.exit(1);
      }
    });
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;

