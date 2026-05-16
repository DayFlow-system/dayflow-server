import { parseRichTextDocument } from '../../utils/richText.js';
import type { ScheduleBlock } from '@prisma/client';

type ScheduleBlockWithRichText = ScheduleBlock & { descriptionRichText?: string | null };
export function mapScheduleBlock(block: ScheduleBlockWithRichText) {
  return {
    ...block,
    descriptionRichText: parseRichTextDocument(block.descriptionRichText ?? null),
    createdAt: block.createdAt.toISOString(),
    updatedAt: block.updatedAt.toISOString(),
  };
}
