import { z } from 'zod';
import { parseDateOnly } from './date.js';
import { HH_MM_PATTERN, isEndAfterStart } from './time.js';

export const uuidParamSchema = z.object({ id: z.string().uuid() });
export const dateOnlySchema = z.string().transform((value, ctx) => {
  try {
    return parseDateOnly(value);
  } catch (error) {
    ctx.addIssue({
      code: 'custom',
      message: error instanceof Error ? error.message : 'Invalid date',
    });
    return z.NEVER;
  }
});
export const optionalDateOnlySchema = dateOnlySchema.optional().nullable();
export const timeSchema = z.string().regex(HH_MM_PATTERN, 'Time must use HH:mm format');

export function validateTimeRange<T extends { startTime?: string | null; endTime?: string | null }>(
  value: T,
  ctx: z.RefinementCtx,
): void {
  if (value.startTime && value.endTime && !isEndAfterStart(value.startTime, value.endTime)) {
    ctx.addIssue({ code: 'custom', path: ['endTime'], message: 'endTime must be after startTime' });
  }
}
