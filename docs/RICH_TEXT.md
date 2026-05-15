# Rich Text Formatting

Dayflow stores user-facing formatted text on the server instead of asking clients to flatten it into plain strings.

## Where rich text is accepted

The API keeps the original plain-text fields for simple clients and adds rich-text companion fields for editors that support formatting:

| Entity        | Plain fallback | Rich formatted field  |
| ------------- | -------------- | --------------------- |
| Task          | `description`  | `descriptionRichText` |
| Event         | `description`  | `descriptionRichText` |
| ScheduleBlock | `description`  | `descriptionRichText` |
| DayState      | `notes`        | `notesRichText`       |

Clients may send either or both. The plain field is useful for search, previews, notifications, and very simple clients. The rich field is the canonical place to preserve formatting.

## Document shape

Rich text fields are JSON documents:

```json
{
  "version": 1,
  "blocks": [
    {
      "type": "paragraph",
      "children": [
        { "type": "text", "text": "Important", "marks": { "bold": true, "color": "warning" } }
      ]
    }
  ]
}
```

Supported block types:

- `paragraph` — inline text nodes.
- `unordered_list` — list items with inline text, plus optional nested list blocks.
- `ordered_list` — list items with inline text, plus optional nested list blocks.
- `subtask_link` — a reference to another task by `taskId` with a display `title`.

Supported inline marks:

- `bold: true`
- `italic: true`
- `underline: true`
- `color: "#f00"`, `color: "#ff0000"`, or a short UI token such as `warning`

Unknown properties are rejected so clients can detect accidental schema drift early.

## Storage behavior

Prisma persists each rich document as a JSON string in SQLite. API responses parse that stored JSON back into an object, so clients do not need to stringify or parse manually.

Legacy plain-text values are still safe: if the server ever reads a non-JSON rich-text value from storage, it returns a version-1 paragraph containing that text.

## Client guidance

- Preserve `version` when editing and sending rich text back.
- Render unknown future versions read-only until the client is upgraded.
- Keep the plain fallback synchronized when possible, for example by storing a text-only projection of the rich document in `description` or `notes`.
- Use `null` to clear a rich-text field and omit the field in `PATCH` requests when it should remain unchanged.
