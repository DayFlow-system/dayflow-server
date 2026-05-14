import { Prisma } from '@prisma/client';
import { AppError } from '../../errors/AppError.js';
import { ERROR_CODES } from '../../errors/errorCodes.js';
import { getCurrentDayOfWeek } from '../../utils/date.js';
import { mapScheduleBlock } from './schedule.mapper.js';
import type { ScheduleRepository } from './schedule.repository.js';
import type { ScheduleCreateInput, ScheduleUpdateInput } from './schedule.schema.js';
export class ScheduleService {
  constructor(private readonly repository: ScheduleRepository) {}
  async list() {
    return (await this.repository.findMany()).map(mapScheduleBlock);
  }
  async today(now = new Date()) {
    return (await this.repository.findActiveByDay(getCurrentDayOfWeek(now))).map(mapScheduleBlock);
  }
  async get(id: string) {
    const block = await this.repository.findById(id);
    if (!block) throw new AppError(ERROR_CODES.NOT_FOUND, 'Schedule block not found', 404);
    return mapScheduleBlock(block);
  }
  async create(data: ScheduleCreateInput) {
    return mapScheduleBlock(await this.repository.create(data));
  }
  async update(id: string, data: ScheduleUpdateInput) {
    try {
      return mapScheduleBlock(await this.repository.update(id, data));
    } catch (e) {
      missing(e);
    }
  }
  async archive(id: string) {
    try {
      return mapScheduleBlock(await this.repository.archive(id));
    } catch (e) {
      missing(e);
    }
  }
}
function missing(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025')
    throw new AppError(ERROR_CODES.NOT_FOUND, 'Schedule block not found', 404);
  throw error;
}
