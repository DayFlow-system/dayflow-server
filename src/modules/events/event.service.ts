import { Prisma } from '@prisma/client';
import { AppError } from '../../errors/AppError.js';
import { ERROR_CODES } from '../../errors/errorCodes.js';
import type { EventCreateInput, EventUpdateInput } from './event.schema.js';
import { mapEvent } from './event.mapper.js';
import type { EventRepository } from './event.repository.js';
export class EventService {
  constructor(private readonly repository: EventRepository) {}
  async list() {
    return (await this.repository.findMany()).map(mapEvent);
  }
  async get(id: string) {
    const event = await this.repository.findById(id);
    if (!event) throw new AppError(ERROR_CODES.NOT_FOUND, 'Event not found', 404);
    return mapEvent(event);
  }
  async create(data: EventCreateInput) {
    return mapEvent(await this.repository.create(data));
  }
  async update(id: string, data: EventUpdateInput) {
    try {
      return mapEvent(await this.repository.update(id, data));
    } catch (e) {
      missing(e);
    }
  }
  async cancel(id: string) {
    try {
      return mapEvent(await this.repository.cancel(id));
    } catch (e) {
      missing(e);
    }
  }
}
function missing(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025')
    throw new AppError(ERROR_CODES.NOT_FOUND, 'Event not found', 404);
  throw error;
}
