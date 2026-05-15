import type { Prisma, PrismaClient } from '@prisma/client';
import type { RichTextDocument } from '../../types/richText.js';
import { serializeRichTextDocument } from '../../utils/richText.js';
import { withoutUndefined } from '../../utils/object.js';
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
    return this.db.event.create({ data: normalizeRichTextInput(data) as Prisma.EventCreateInput });
  }

  update(id: string, data: EventUpdateInput) {
    return this.db.event.update({
      where: { id },
      data: normalizeRichTextInput(data) as Prisma.EventUpdateInput,
    });
  }

  cancel(id: string) {
    return this.db.event.update({ where: { id }, data: { status: 'cancelled' } });
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
