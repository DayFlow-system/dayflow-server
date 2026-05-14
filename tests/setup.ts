import { beforeEach, afterAll } from 'vitest';
import { prisma } from '../src/db/prisma.js';

beforeEach(async () => {
  await prisma.task.deleteMany();
  await prisma.event.deleteMany();
  await prisma.scheduleBlock.deleteMany();
  await prisma.dayState.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
