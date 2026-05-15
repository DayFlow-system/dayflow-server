import cors from '@fastify/cors';
import Fastify from 'fastify';
import { registerSwagger } from './docs/swagger.js';
import { registerErrorHandler } from './errors/errorHandler.js';
import { dayStateRoutes } from './modules/day-state/dayState.routes.js';
import { eventRoutes } from './modules/events/event.routes.js';
import { scheduleRoutes } from './modules/schedule/schedule.routes.js';
import { taskRoutes } from './modules/tasks/task.routes.js';
import { todayRoutes } from './modules/today/today.routes.js';
import { healthRouteSchema } from './docs/routeSchemas.js';
import type { HealthResponse } from './types/api.js';

export function buildApp() {
  const app = Fastify({ logger: false });
  registerErrorHandler(app);
  registerSwagger(app);
  app.register(cors);
  app.get(
    '/health',
    { schema: healthRouteSchema },
    async (): Promise<HealthResponse> => ({ status: 'ok' }),
  );
  app.register(taskRoutes);
  app.register(eventRoutes);
  app.register(scheduleRoutes);
  app.register(dayStateRoutes);
  app.register(todayRoutes);
  return app;
}
