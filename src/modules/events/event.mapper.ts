import { parseRichTextDocument } from '../../utils/richText.js';
import type { Event } from '@prisma/client';
export function mapEvent(event: Event) {
  return {
    ...event,
    date: event.date.toISOString().slice(0, 10),
    descriptionRichText: parseRichTextDocument(event.descriptionRichText),
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
  };
}
