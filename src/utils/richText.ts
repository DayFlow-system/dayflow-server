import { z } from 'zod';
import type { RichTextDocument, RichTextListItem, RichTextListBlock } from '../types/richText.js';

const colorSchema = z
  .string()
  .regex(
    /^(#[0-9a-fA-F]{3}|#[0-9a-fA-F]{6}|[a-zA-Z][a-zA-Z0-9_-]{0,31})$/,
    'Color must be a hex color or a short color token',
  );

const marksSchema = z
  .object({
    bold: z.boolean().optional(),
    italic: z.boolean().optional(),
    underline: z.boolean().optional(),
    color: colorSchema.optional(),
  })
  .strict();

const inlineTextSchema = z
  .object({
    type: z.literal('text'),
    text: z.string(),
    marks: marksSchema.optional(),
  })
  .strict();

const inlineNodeSchema = inlineTextSchema;

const paragraphBlockSchema = z
  .object({
    type: z.literal('paragraph'),
    children: z.array(inlineNodeSchema),
  })
  .strict();

const subtaskLinkBlockSchema = z
  .object({
    type: z.literal('subtask_link'),
    taskId: z.string().uuid(),
    title: z.string().trim().min(1),
  })
  .strict();

const listItemSchema: z.ZodType<RichTextListItem> = z.lazy(() =>
  z
    .object({
      children: z.array(inlineNodeSchema),
      blocks: z.array(richTextListBlockSchema).optional(),
    })
    .strict(),
);

const unorderedListBlockSchema = z
  .object({
    type: z.literal('unordered_list'),
    items: z.array(listItemSchema),
  })
  .strict();

const orderedListBlockSchema = z
  .object({
    type: z.literal('ordered_list'),
    items: z.array(listItemSchema),
  })
  .strict();

const richTextListBlockSchema: z.ZodType<RichTextListBlock> = z.union([
  unorderedListBlockSchema,
  orderedListBlockSchema,
]);

export const richTextBlockSchema = z.union([
  paragraphBlockSchema,
  unorderedListBlockSchema,
  orderedListBlockSchema,
  subtaskLinkBlockSchema,
]);

export const richTextDocumentSchema: z.ZodType<RichTextDocument> = z
  .object({
    version: z.literal(1),
    blocks: z.array(richTextBlockSchema),
  })
  .strict();

export const optionalRichTextDocumentSchema = richTextDocumentSchema.optional().nullable();

export function serializeRichTextDocument(
  body: RichTextDocument | null | undefined,
): string | null | undefined {
  if (body === undefined || body === null) return body;
  return JSON.stringify(body);
}

export function parseRichTextDocument(body: string | null): RichTextDocument | null {
  if (body === null) return null;

  try {
    return richTextDocumentSchema.parse(JSON.parse(body));
  } catch {
    return {
      version: 1,
      blocks: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text: body }],
        },
      ],
    };
  }
}

export function createEmptyRichTextDocument(): RichTextDocument {
  return { version: 1, blocks: [] };
}
