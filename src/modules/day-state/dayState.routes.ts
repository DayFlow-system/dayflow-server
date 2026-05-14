import type { FastifyInstance } from 'fastify';
import { prisma } from '../../db/prisma.js';
import { dayStateRouteSchemas } from '../../docs/routeSchemas.js';
import { getTodayDate } from '../../utils/date.js';
import { DayStateRepository } from './dayState.repository.js';
import { dayStatePutSchema } from './dayState.schema.js';
import { DayStateService } from './dayState.service.js';
export async function dayStateRoutes(app: FastifyInstance): Promise<void> {
  const service = new DayStateService(new DayStateRepository(prisma));
  app.get('/day-state/today', { schema: dayStateRouteSchemas.today }, async () =>
    service.getOrCreateToday(getTodayDate()),
  );
  app.put('/day-state/today', { schema: dayStateRouteSchemas.putToday }, async (request) =>
    service.putToday(getTodayDate(), dayStatePutSchema.parse(request.body)),
  );
}
