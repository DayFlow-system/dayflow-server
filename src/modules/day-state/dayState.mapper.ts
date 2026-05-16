import { parseRichTextDocument } from '../../utils/richText.js';
import type { DayState } from '@prisma/client';

type DayStateWithRichText = DayState & { notesRichText?: string | null };
export function mapDayState(dayState: DayStateWithRichText) {
  return {
    ...dayState,
    date: dayState.date.toISOString().slice(0, 10),
    notesRichText: parseRichTextDocument(dayState.notesRichText ?? null),
    createdAt: dayState.createdAt.toISOString(),
    updatedAt: dayState.updatedAt.toISOString(),
  };
}
