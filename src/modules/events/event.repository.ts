import type { PrismaClient } from '@prisma/client';
import type { EventCreateInput, EventUpdateInput } from './event.schema.js';
export class EventRepository {
  constructor(private readonly db: PrismaClient) {}
  findMany() {
    return this.db.event.findMany({ orderBy: [{ date: 'asc' }, { startTime: 'asc' }] });
  }
  findById(id: string) {
    return this.db.event.findUnique({ where: { id } });
  }
  findByDate(date: Date) {
    return this.db.event.findMany({ where: { date }, orderBy: [{ startTime: 'asc' }] });
  }
  create(data: EventCreateInput) {
    return this.db.event.create({ data });
  }
  update(id: string, data: EventUpdateInput) {
    return this.db.event.update({ where: { id }, data });
  }
  cancel(id: string) {
    return this.db.event.update({ where: { id }, data: { status: 'cancelled' } });
  }
}
