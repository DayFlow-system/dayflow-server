import { describe, expect, it } from 'vitest';
import {
  parseRichTextDocument,
  richTextDocumentSchema,
  serializeRichTextDocument,
} from '../../src/utils/richText.js';

const richTextDocument = {
  version: 1,
  blocks: [
    {
      type: 'paragraph',
      children: [
        { type: 'text', text: 'Important ', marks: { bold: true, color: '#f00' } },
        { type: 'text', text: 'note', marks: { italic: true, underline: true } },
      ],
    },
    {
      type: 'unordered_list',
      items: [{ children: [{ type: 'text', text: 'Checklist item' }] }],
    },
  ],
} as const;

describe('rich text utils', () => {
  it('validates and round-trips formatted documents', () => {
    const parsed = richTextDocumentSchema.parse(richTextDocument);
    expect(parseRichTextDocument(serializeRichTextDocument(parsed)!)).toEqual(parsed);
  });

  it('wraps legacy plain text into a paragraph document', () => {
    expect(parseRichTextDocument('plain text')).toEqual({
      version: 1,
      blocks: [{ type: 'paragraph', children: [{ type: 'text', text: 'plain text' }] }],
    });
  });
});
