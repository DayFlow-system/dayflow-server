import type { FastifyInstance } from 'fastify';
import { prisma } from '../../db/prisma.js';
import { taskRouteSchemas } from '../../docs/routeSchemas.js';
import { uuidParamSchema } from '../../utils/validation.js';
import { taskCreateSchema, taskUpdateSchema } from './task.schema.js';
import { TaskRepository } from './task.repository.js';
import { TaskService } from './task.service.js';

export async function taskRoutes(app: FastifyInstance): Promise<void> {
  const service = new TaskService(new TaskRepository(prisma));
  app.get('/tasks', { schema: taskRouteSchemas.list }, async () => service.list());
  app.get('/tasks/:id', { schema: taskRouteSchemas.get }, async (request) =>
    service.get(uuidParamSchema.parse(request.params).id),
  );
  app.post('/tasks', { schema: taskRouteSchemas.create }, async (request, reply) =>
    reply.status(201).send(await service.create(taskCreateSchema.parse(request.body))),
  );
  app.patch('/tasks/:id', { schema: taskRouteSchemas.update }, async (request) =>
    service.update(uuidParamSchema.parse(request.params).id, taskUpdateSchema.parse(request.body)),
  );
  app.delete('/tasks/:id', { schema: taskRouteSchemas.archive }, async (request) =>
    service.archive(uuidParamSchema.parse(request.params).id),
  );
}
