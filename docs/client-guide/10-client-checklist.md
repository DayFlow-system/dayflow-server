# 10. Client Completion Checklist

Use this checklist before calling a Dayflow client complete.

## Setup

- [ ] API base URL is configurable.
- [ ] Local backend instructions are documented for client developers.
- [ ] Swagger URL is linked in developer docs.

## API communication

- [ ] All write requests send `Content-Type: application/json`.
- [ ] API wrapper handles non-2xx responses.
- [ ] API wrapper extracts `error.code`, `error.message`, and `error.details`.
- [ ] Network errors are displayed clearly.

## Today dashboard

- [ ] Client loads `GET /today` on startup.
- [ ] Day state is visible.
- [ ] Mandatory events are visually distinct.
- [ ] Deadline tasks are visually distinct.
- [ ] Suggested tasks are separated from planned/deadline tasks.
- [ ] Refresh button exists.

## Tasks

- [ ] List tasks.
- [ ] Create task.
- [ ] Update task.
- [ ] Archive task.
- [ ] Validate priority, enum fields, and dates.
- [ ] Refresh `/today` after mutation.

## Events

- [ ] List events.
- [ ] Create event.
- [ ] Update event.
- [ ] Cancel event.
- [ ] Validate date and time range.
- [ ] Refresh `/today` after mutation.

## Schedule

- [ ] List schedule blocks.
- [ ] Show today's schedule blocks.
- [ ] Create schedule block.
- [ ] Update schedule block.
- [ ] Archive schedule block.
- [ ] Validate dayOfWeek and time range.
- [ ] Refresh `/today` after mutation.

## Day state

- [ ] Load today's state.
- [ ] Update health.
- [ ] Update energy.
- [ ] Update mood.
- [ ] Update notes.
- [ ] Refresh `/today` after mutation.

## Error handling

- [ ] Validation errors appear near forms.
- [ ] Not-found errors trigger refresh or navigation away.
- [ ] Internal errors preserve user input for retry.
- [ ] User sees understandable messages, not raw stack traces.

## Client quality

- [ ] Loading states exist.
- [ ] Empty states exist.
- [ ] Success feedback exists.
- [ ] Destructive actions ask for confirmation.
- [ ] Important enums are displayed as friendly labels.
- [ ] Dates and times are displayed consistently.

## Rich-text checklist

- Render `descriptionRichText` / `notesRichText` when present.
- Keep plain `description` / `notes` synchronized as fallbacks.
- Send rich text as JSON objects, not JSON strings.
- Use `null` to clear rich formatting and omit the field to leave it unchanged.
