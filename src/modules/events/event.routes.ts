import type { FastifyInstance } from 'fastify';
import { prisma } from '../../db/prisma.js';
import { uuidParamSchema } from '../../utils/validation.js';
import { eventCreateSchema, eventUpdateSchema } from './event.schema.js';
import { EventRepository } from './event.repository.js';
import { EventService } from './event.service.js';
export async function eventRoutes(app: FastifyInstance): Promise<void> {
  const service = new EventService(new EventRepository(prisma));
  app.get('/events', async () => service.list());
  app.get('/events/:id', async (request) => service.get(uuidParamSchema.parse(request.params).id));
  app.post('/events', async (request, reply) =>
    reply.status(201).send(await service.create(eventCreateSchema.parse(request.body))),
  );
  app.patch('/events/:id', async (request) =>
    service.update(uuidParamSchema.parse(request.params).id, eventUpdateSchema.parse(request.body)),
  );
  app.delete('/events/:id', async (request) =>
    service.cancel(uuidParamSchema.parse(request.params).id),
  );
}
