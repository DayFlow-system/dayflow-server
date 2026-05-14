# 08. Client Validation and Error Handling

The backend validates everything. The client should still validate forms to give faster feedback.

## Client-side validation rules

### Common

- `title` cannot be empty.
- Dates must be `YYYY-MM-DD`.
- Times must be `HH:mm`.
- If `startTime` and `endTime` are present, `endTime` must be later.
- UUID path IDs must come from API responses.

### Task form

Validate:

- `priority` between 1 and 5;
- `status` is one of allowed task statuses;
- `type` is one of allowed task types;
- `energyRequired` is `low`, `medium`, or `high`;
- `healthRule` is one of allowed health rules.

### Event form

Validate:

- `date` is required;
- `importance` is allowed;
- `status` is allowed;
- time range is valid.

### Schedule form

Validate:

- `dayOfWeek` between 1 and 7;
- `startTime` is required;
- `endTime` is after `startTime` if present.

### Day state form

Validate:

- `health` is allowed;
- `energy` is allowed;
- `mood` is empty/null or 1–5.

## API error shape

All API errors look like:

```ts
type ApiError = {
  code: 'VALIDATION_ERROR' | 'NOT_FOUND' | 'BAD_REQUEST' | 'CONFLICT' | 'INTERNAL_SERVER_ERROR';
  message: string;
  details: unknown[];
};
```

The raw response wraps it:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": []
  }
}
```

## How to display errors

### `VALIDATION_ERROR`

Show near the form. If `details` contains field paths, attach messages to fields. Otherwise show the main message.

### `NOT_FOUND`

Show a message like:

```text
This item no longer exists. Refreshing data...
```

Then refresh the relevant list.

### `CONFLICT`

Show a message that the data conflicts with an existing record. For DayState this is unlikely because the backend uses upsert.

### `INTERNAL_SERVER_ERROR`

Show a generic message and keep the user's form data so they can retry.

## Retry behavior

- Retry network failures manually with a button.
- Do not automatically retry validation errors.
- For internal errors, one retry is acceptable.

## Offline behavior

Offline support is not required for the first client. If added later, queue mutations carefully and refresh `/today` after reconnect.
