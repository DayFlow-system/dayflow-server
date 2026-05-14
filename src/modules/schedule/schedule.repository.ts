import type { Prisma, PrismaClient } from '@prisma/client';
import { withoutUndefined } from '../../utils/object.js';
import type { ScheduleCreateInput, ScheduleUpdateInput } from './schedule.schema.js';

export class ScheduleRepository {
  constructor(private readonly db: PrismaClient) {}

  findMany() {
    return this.db.scheduleBlock.findMany({
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
  }

  findById(id: string) {
    return this.db.scheduleBlock.findUnique({ where: { id } });
  }

  findActiveByDay(dayOfWeek: number) {
    return this.db.scheduleBlock.findMany({
      where: { dayOfWeek, status: 'active' },
      orderBy: { startTime: 'asc' },
    });
  }

  create(data: ScheduleCreateInput) {
    return this.db.scheduleBlock.create({
      data: withoutUndefined(data) as Prisma.ScheduleBlockCreateInput,
    });
  }

  update(id: string, data: ScheduleUpdateInput) {
    return this.db.scheduleBlock.update({
      where: { id },
      data: withoutUndefined(data) as Prisma.ScheduleBlockUpdateInput,
    });
  }

  archive(id: string) {
    return this.db.scheduleBlock.update({ where: { id }, data: { status: 'archived' } });
  }
}
