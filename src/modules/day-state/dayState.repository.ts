import type { Prisma, PrismaClient } from '@prisma/client';
import type { RichTextDocument } from '../../types/richText.js';
import { serializeRichTextDocument } from '../../utils/richText.js';
import { withoutUndefined } from '../../utils/object.js';
import type { DayStatePutInput } from './dayState.schema.js';

export class DayStateRepository {
  constructor(private readonly db: PrismaClient) {}

  findByDate(date: Date) {
    return this.db.dayState.findUnique({ where: { date } });
  }

  upsert(date: Date, data: DayStatePutInput) {
    return this.db.dayState.upsert({
      where: { date },
      create: { date, ...normalizeRichTextInput(data) } as Prisma.DayStateCreateInput,
      update: normalizeRichTextInput(data) as Prisma.DayStateUpdateInput,
    });
  }

  createDefault(date: Date) {
    return this.db.dayState.create({ data: { date, health: 'healthy', energy: 'medium' } });
  }

  deleteAll() {
    return this.db.dayState.deleteMany();
  }
}

function normalizeRichTextInput<T extends { notesRichText?: unknown }>(data: T) {
  return withoutUndefined({
    ...data,
    notesRichText: serializeRichTextDocument(
      data.notesRichText as RichTextDocument | null | undefined,
    ),
  });
}
