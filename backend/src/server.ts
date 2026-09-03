import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import { prisma } from './lib/prisma';

const PORT = process.env.PORT || 5000;
const app = createApp();

const startServer = async () => {
  try {
    // Verify database connection on startup
    await prisma.$connect();
    console.log(' Successfully connected to database via Prisma.');

    const server = app.listen(PORT, () => {
      console.log(` Enterprise Performance API server is running on http://localhost:${PORT}`);
      console.log(` Health check available at http://localhost:${PORT}/api/health`);
    });

    const shutdown = async (signal: string) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log('Database disconnected. Process exited.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('Failed to initialize server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();
