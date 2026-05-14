import type { FastifyInstance } from 'fastify';
import { prisma } from '../../db/prisma.js';
import { uuidParamSchema } from '../../utils/validation.js';
import { taskCreateSchema, taskUpdateSchema } from './task.schema.js';
import { TaskRepository } from './task.repository.js';
import { TaskService } from './task.service.js';

export async function taskRoutes(app: FastifyInstance): Promise<void> {
  const service = new TaskService(new TaskRepository(prisma));
  app.get('/tasks', async () => service.list());
  app.get('/tasks/:id', async (request) => service.get(uuidParamSchema.parse(request.params).id));
  app.post('/tasks', async (request, reply) =>
    reply.status(201).send(await service.create(taskCreateSchema.parse(request.body))),
  );
  app.patch('/tasks/:id', async (request) =>
    service.update(uuidParamSchema.parse(request.params).id, taskUpdateSchema.parse(request.body)),
  );
  app.delete('/tasks/:id', async (request) =>
    service.archive(uuidParamSchema.parse(request.params).id),
  );
}
