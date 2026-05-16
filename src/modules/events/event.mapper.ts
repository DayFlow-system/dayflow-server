import { parseRichTextDocument } from '../../utils/richText.js';
import type { Event } from '@prisma/client';

type EventWithRichText = Event & { descriptionRichText?: string | null };
export function mapEvent(event: EventWithRichText) {
  return {
    ...event,
    date: event.date.toISOString().slice(0, 10),
    descriptionRichText: parseRichTextDocument(event.descriptionRichText ?? null),
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
  };
}
