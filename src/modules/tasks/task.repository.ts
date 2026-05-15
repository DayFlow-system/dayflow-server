import type { Prisma, PrismaClient } from '@prisma/client';
import type { RichTextDocument } from '../../types/richText.js';
import { serializeRichTextDocument } from '../../utils/richText.js';
import { withoutUndefined } from '../../utils/object.js';
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
    return this.db.task.create({ data: normalizeRichTextInput(data) as Prisma.TaskCreateInput });
  }

  update(id: string, data: TaskUpdateInput) {
    return this.db.task.update({
      where: { id },
      data: normalizeRichTextInput(data) as Prisma.TaskUpdateInput,
    });
  }

  // Soft delete preserves historical task data for future analytics and regressions.
  archive(id: string) {
    return this.db.task.update({ where: { id }, data: { status: 'archived' } });
  }
}

function normalizeRichTextInput<T extends { descriptionRichText?: unknown }>(data: T) {
  return withoutUndefined({
    ...data,
    descriptionRichText: serializeRichTextDocument(
      data.descriptionRichText as RichTextDocument | null | undefined,
    ),
  });
}
