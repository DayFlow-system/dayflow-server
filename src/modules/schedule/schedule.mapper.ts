import type { ScheduleBlock } from '@prisma/client';
export function mapScheduleBlock(block: ScheduleBlock) {
  return {
    ...block,
    createdAt: block.createdAt.toISOString(),
    updatedAt: block.updatedAt.toISOString(),
  };
}
