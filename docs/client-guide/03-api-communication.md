# 03. API Communication Rules

## Base URL

Local development:

```text
http://localhost:3000
```

All endpoint paths in this guide are relative to that base URL.

## Content type

For `POST`, `PATCH`, and `PUT`, always send JSON:

```http
Content-Type: application/json
```

## Date format

Use date-only strings:

```text
YYYY-MM-DD
```

Example:

```json
{ "plannedDate": "2026-05-14" }
```

## Time format

Use 24-hour `HH:mm`:

```text
09:00
15:30
23:59
```

If `startTime` and `endTime` are both present, `endTime` must be later.

## IDs

Path IDs are UUID strings:

```text
/tasks/00000000-0000-4000-8000-000000000001
```

The client should not invent permanent IDs. Use IDs returned by the API after create requests.

## Response style

Successful responses are JSON objects or arrays.

Error responses always use:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": []
  }
}
```

## Error codes

The client should handle at least:

- `VALIDATION_ERROR` — user input is invalid;
- `NOT_FOUND` — item no longer exists or wrong ID was used;
- `BAD_REQUEST` — request is logically invalid;
- `CONFLICT` — unique constraint or data conflict;
- `INTERNAL_SERVER_ERROR` — server bug or unexpected failure.

## Recommended client API wrapper

Every client should centralize HTTP calls in one module.

Pseudo-code:

```ts
const API_BASE_URL = 'http://localhost:3000';

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw data.error;
  }

  return data;
}
```

## Mutation rule

After any mutation, refresh affected lists and `/today`.

Mutation endpoints:

- `POST /tasks`;
- `PATCH /tasks/:id`;
- `DELETE /tasks/:id`;
- `POST /events`;
- `PATCH /events/:id`;
- `DELETE /events/:id`;
- `POST /schedule`;
- `PATCH /schedule/:id`;
- `DELETE /schedule/:id`;
- `PUT /day-state/today`.
