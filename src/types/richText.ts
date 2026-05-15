export const RICH_TEXT_BLOCK_TYPES = [
  'paragraph',
  'unordered_list',
  'ordered_list',
  'subtask_link',
] as const;

export interface RichTextMarkSet {
  bold?: boolean | undefined;
  italic?: boolean | undefined;
  underline?: boolean | undefined;
  color?: string | undefined;
}

export interface RichTextTextNode {
  type: 'text';
  text: string;
  marks?: RichTextMarkSet | undefined;
}

export type RichTextInlineNode = RichTextTextNode;

export interface RichTextParagraphBlock {
  type: 'paragraph';
  children: RichTextInlineNode[];
}

export interface RichTextListItem {
  children: RichTextInlineNode[];
  blocks?: RichTextListBlock[] | undefined;
}

export interface RichTextUnorderedListBlock {
  type: 'unordered_list';
  items: RichTextListItem[];
}

export interface RichTextOrderedListBlock {
  type: 'ordered_list';
  items: RichTextListItem[];
}

export interface RichTextSubtaskLinkBlock {
  type: 'subtask_link';
  taskId: string;
  title: string;
}

export type RichTextListBlock = RichTextUnorderedListBlock | RichTextOrderedListBlock;
export type RichTextBlock = RichTextParagraphBlock | RichTextListBlock | RichTextSubtaskLinkBlock;

export interface RichTextDocument {
  version: 1;
  blocks: RichTextBlock[];
}
