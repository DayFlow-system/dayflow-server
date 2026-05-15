import { parseRichTextDocument } from '../../utils/richText.js';
import type { ScheduleBlock } from '@prisma/client';
export function mapScheduleBlock(block: ScheduleBlock) {
  return {
    ...block,
    descriptionRichText: parseRichTextDocument(block.descriptionRichText),
    createdAt: block.createdAt.toISOString(),
    updatedAt: block.updatedAt.toISOString(),
  };
}
