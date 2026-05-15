import { parseRichTextDocument } from '../../utils/richText.js';
import type { DayState } from '@prisma/client';
export function mapDayState(dayState: DayState) {
  return {
    ...dayState,
    date: dayState.date.toISOString().slice(0, 10),
    notesRichText: parseRichTextDocument(dayState.notesRichText),
    createdAt: dayState.createdAt.toISOString(),
    updatedAt: dayState.updatedAt.toISOString(),
  };
}
