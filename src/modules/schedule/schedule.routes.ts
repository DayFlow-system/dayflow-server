import type { FastifyInstance } from 'fastify';
import { prisma } from '../../db/prisma.js';
import { scheduleRouteSchemas } from '../../docs/routeSchemas.js';
import { uuidParamSchema } from '../../utils/validation.js';
import { ScheduleRepository } from './schedule.repository.js';
import { scheduleCreateSchema, scheduleUpdateSchema } from './schedule.schema.js';
import { ScheduleService } from './schedule.service.js';
export async function scheduleRoutes(app: FastifyInstance): Promise<void> {
  const service = new ScheduleService(new ScheduleRepository(prisma));
  app.get('/schedule', { schema: scheduleRouteSchemas.list }, async () => service.list());
  app.get('/schedule/today', { schema: scheduleRouteSchemas.today }, async () => service.today());
  app.get('/schedule/:id', { schema: scheduleRouteSchemas.get }, async (request) =>
    service.get(uuidParamSchema.parse(request.params).id),
  );
  app.post('/schedule', { schema: scheduleRouteSchemas.create }, async (request, reply) =>
    reply.status(201).send(await service.create(scheduleCreateSchema.parse(request.body))),
  );
  app.patch('/schedule/:id', { schema: scheduleRouteSchemas.update }, async (request) =>
    service.update(
      uuidParamSchema.parse(request.params).id,
      scheduleUpdateSchema.parse(request.body),
    ),
  );
  app.delete('/schedule/:id', { schema: scheduleRouteSchemas.archive }, async (request) =>
    service.archive(uuidParamSchema.parse(request.params).id),
  );
}
