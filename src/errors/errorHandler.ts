import type { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from './AppError.js';
import { ERROR_CODES } from './errorCodes.js';

export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler(
    (error: FastifyError | Error, _request: FastifyRequest, reply: FastifyReply) => {
      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
          error: { code: error.code, message: error.message, details: error.details },
        });
      }

      if (error instanceof ZodError) {
        return reply.status(400).send({
          error: {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: 'Request validation failed',
            details: error.issues,
          },
        });
      }

      if (isFastifyValidationError(error)) {
        return reply.status(400).send({
          error: {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: 'Request validation failed',
            details: error.validation ?? [],
          },
        });
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return reply.status(409).send({
          error: {
            code: ERROR_CODES.CONFLICT,
            message: 'Unique constraint failed',
            details: [error.meta],
          },
        });
      }

      // Keep unexpected error details out of responses while retaining a stable API contract.
      requestLogError(_request, error);
      return reply.status(500).send({
        error: {
          code: ERROR_CODES.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
          details: [],
        },
      });
    },
  );
}

function requestLogError(request: FastifyRequest, error: Error): void {
  request.log.error({ err: error }, 'Unhandled application error');
}

function isFastifyValidationError(error: FastifyError | Error): error is FastifyError {
  return 'validation' in error && Array.isArray((error as FastifyError).validation);
}
