import { buildApp } from './app.js';
import { config } from './config.js';
import { prisma } from './db/prisma.js';

const app = buildApp();

try {
  await app.listen({ host: config.HOST, port: config.PORT });
} catch (error) {
  app.log.error(error);
  await prisma.$disconnect();
  process.exit(1);
}

const shutdown = async () => {
  await app.close();
  await prisma.$disconnect();
};

process.on('SIGINT', () => void shutdown());
process.on('SIGTERM', () => void shutdown());
