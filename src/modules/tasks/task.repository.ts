import type { PrismaClient } from '@prisma/client';
import type { TaskCreateInput, TaskUpdateInput } from './task.schema.js';

export class TaskRepository {
  constructor(private readonly db: PrismaClient) {}

  findMany() {
    return this.db.task.findMany({ orderBy: [{ createdAt: 'desc' }] });
  }

  findById(id: string) {
    return this.db.task.findUnique({ where: { id } });
  }

  create(data: TaskCreateInput) {
    return this.db.task.create({ data });
  }

  update(id: string, data: TaskUpdateInput) {
    return this.db.task.update({ where: { id }, data });
  }

  // Soft delete preserves historical task data for future analytics and regressions.
  archive(id: string) {
    return this.db.task.update({ where: { id }, data: { status: 'archived' } });
  }
}
