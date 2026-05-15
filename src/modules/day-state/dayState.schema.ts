import { z } from 'zod';
import { optionalRichTextDocumentSchema } from '../../utils/richText.js';
import { ENERGY_LEVELS, HEALTH_LEVELS } from '../../types/common.js';
export const dayStatePutSchema = z.object({
  health: z.enum(HEALTH_LEVELS).default('healthy'),
  energy: z.enum(ENERGY_LEVELS).default('medium'),
  mood: z.number().int().min(1).max(5).optional().nullable(),
  notes: z.string().trim().optional().nullable(),
  notesRichText: optionalRichTextDocumentSchema,
});
export type DayStatePutInput = z.infer<typeof dayStatePutSchema>;
