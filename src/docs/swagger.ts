import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import type { FastifyInstance } from 'fastify';

type FastifyWithSwagger = FastifyInstance & { swagger: () => unknown };

export function registerSwagger(app: FastifyInstance): void {
  app.register(swagger, {
    openapi: {
      info: {
        title: 'Dayflow API',
        description:
          'API for tasks, events, recurring schedule blocks, day state, and the computed Today dashboard.',
        version: '0.1.0',
      },
      tags: [
        { name: 'Health', description: 'Service health checks' },
        { name: 'Tasks', description: 'Task planning and soft-delete operations' },
        { name: 'Events', description: 'Calendar events and cancellation operations' },
        { name: 'Schedule', description: 'Recurring weekly schedule blocks' },
        { name: 'Day State', description: 'Current day health, energy, mood, and notes' },
        { name: 'Today', description: 'Computed dashboard for what matters today' },
      ],
    },
  });

  app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      deepLinking: true,
      docExpansion: 'list',
    },
  });

  app.get('/openapi.json', {
    schema: {
      tags: ['Health'],
      summary: 'OpenAPI JSON document',
      response: {
        200: { type: 'object', additionalProperties: true },
      },
    },
    handler: async () => (app as FastifyWithSwagger).swagger(),
  });
}
