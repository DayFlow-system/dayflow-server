import type { FastifyInstance } from 'fastify';
import { prisma } from '../../db/prisma.js';
import { todayRouteSchema } from '../../docs/routeSchemas.js';
import { buildTodayDashboard } from './today.service.js';
export async function todayRoutes(app: FastifyInstance): Promise<void> {
  app.get('/today', { schema: todayRouteSchema }, async () => buildTodayDashboard(prisma));
}
