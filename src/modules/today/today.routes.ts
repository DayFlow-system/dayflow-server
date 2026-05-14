import type { FastifyInstance } from 'fastify';
import { prisma } from '../../db/prisma.js';
import { buildTodayDashboard } from './today.service.js';
export async function todayRoutes(app: FastifyInstance): Promise<void> {
  app.get('/today', async () => buildTodayDashboard(prisma));
}
