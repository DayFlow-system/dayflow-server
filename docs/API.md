# API

Base URL: `http://localhost:3000`.

Interactive Swagger UI: `http://localhost:3000/docs`.

OpenAPI JSON: `http://localhost:3000/openapi.json`.

## How to send requests

All write requests use JSON:

```http
Content-Type: application/json
```

Dates use `YYYY-MM-DD`. Times use `HH:mm` in 24-hour format. IDs in `/:id` paths are UUID strings.

PowerShell examples use `Invoke-RestMethod`. You can also test the same endpoints manually in Swagger UI at `/docs`.

## Common rules

- `title` is required for tasks, events, and schedule blocks and cannot be empty.
- `priority` is an integer from `1` to `5`.
- `dayOfWeek` is an integer from `1` to `7`, where `1 = Monday` and `7 = Sunday`.
- `startTime` and `endTime` must use `HH:mm`; if both are present, `endTime` must be later than `startTime`.
- `deadline`, `plannedDate`, `lastDoneAt`, event `date`, and day-state `date` use `YYYY-MM-DD`.
- `PATCH` bodies may contain only the fields you want to change.
- Formatted text is saved in rich-text companion fields: `descriptionRichText` for tasks/events/schedule blocks and `notesRichText` for day state. Plain `description` and `notes` remain available as fallback text.
- Delete endpoints are soft deletes: tasks become `archived`, events become `cancelled`, and schedule blocks become `archived`.

## Rich text formatting

Tasks, events, and schedule blocks accept `descriptionRichText`; day state accepts `notesRichText`. These fields preserve bold, italic, underline, color, unordered lists, ordered lists, and task-link blocks as versioned JSON. See [`RICH_TEXT.md`](RICH_TEXT.md) for the complete contract.

Example value:

```json
{
  "version": 1,
  "blocks": [
    {
      "type": "paragraph",
      "children": [
        { "type": "text", "text": "Read chapter 3", "marks": { "bold": true, "color": "focus" } }
      ]
    }
  ]
}
```

Use `null` to clear a rich-text field. Omit the field in `PATCH` requests to keep the existing formatting unchanged.

## Health

### `GET /health`

Checks that the server is running.

**Request body:** none.

**Example**

```powershell
Invoke-RestMethod -Method GET -Uri http://localhost:3000/health
```

**Response**

```json
{ "status": "ok" }
```

## Tasks

Tasks represent actionable items. Archived tasks stay in the database for history but are excluded from active Today logic.

### Fields and allowed values

| Field                 | Format / values                                         | Required on create | Notes                                                 |
| --------------------- | ------------------------------------------------------- | ------------------ | ----------------------------------------------------- |
| `title`               | non-empty string                                        | yes                | Main task name.                                       |
| `description`         | string or `null`                                        | no                 | Plain-text fallback details.                          |
| `descriptionRichText` | rich-text document or `null`                            | no                 | Preserves task detail formatting.                     |
| `status`              | `planned`, `in_progress`, `done`, `skipped`, `archived` | no                 | Defaults to `planned`.                                |
| `type`                | `task`, `study`, `health`, `routine`, `fun`, `admin`    | no                 | Defaults to `task`.                                   |
| `priority`            | integer `1..5`                                          | no                 | Defaults to `3`; higher is more important.            |
| `deadline`            | `YYYY-MM-DD` or `null`                                  | no                 | Tasks due today or earlier appear in `deadlineTasks`. |
| `plannedDate`         | `YYYY-MM-DD` or `null`                                  | no                 | Tasks planned today appear in `plannedTasks`.         |
| `lastDoneAt`          | `YYYY-MM-DD` or `null`                                  | no                 | Useful for routines/history.                          |
| `energyRequired`      | `low`, `medium`, `high`                                 | no                 | Defaults to `medium`; used by Today suggestions.      |
| `healthRule`          | `always`, `skip_if_sick`, `only_if_healthy`             | no                 | Defaults to `always`; used by Today suggestions.      |

### Endpoints

- `GET /tasks` — list tasks.
- `GET /tasks/:id` — get one task by UUID.
- `POST /tasks` — create task.
- `PATCH /tasks/:id` — update selected fields.
- `DELETE /tasks/:id` — soft delete by setting `status = "archived"`.

### Create task example

```powershell
$body = @{
  title = "Read TypeScript chapter"
  description = "Focus on strict typing"
  descriptionRichText = @{
    version = 1
    blocks = @(
      @{
        type = "paragraph"
        children = @(@{ type = "text"; text = "Focus on strict typing"; marks = @{ bold = $true } })
      }
    )
  }
  type = "study"
  priority = 4
  deadline = "2026-05-20"
  plannedDate = "2026-05-14"
  energyRequired = "medium"
  healthRule = "always"
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Method POST -Uri http://localhost:3000/tasks -ContentType "application/json" -Body $body
```

### Update task example

```powershell
$taskId = "00000000-0000-4000-8000-000000000001"
$body = @{ status = "in_progress"; priority = 5 } | ConvertTo-Json -Depth 10

Invoke-RestMethod -Method PATCH -Uri "http://localhost:3000/tasks/$taskId" -ContentType "application/json" -Body $body
```

### Archive task example

```powershell
$taskId = "00000000-0000-4000-8000-000000000001"
Invoke-RestMethod -Method DELETE -Uri "http://localhost:3000/tasks/$taskId"
```

## Events

Events represent dated calendar items. Cancelled events stay in the database.

### Fields and allowed values

| Field                 | Format / values                      | Required on create | Notes                                            |
| --------------------- | ------------------------------------ | ------------------ | ------------------------------------------------ |
| `title`               | non-empty string                     | yes                | Event name.                                      |
| `description`         | string or `null`                     | no                 | Plain-text fallback details.                     |
| `descriptionRichText` | rich-text document or `null`         | no                 | Preserves event detail formatting.               |
| `date`                | `YYYY-MM-DD`                         | yes                | Event date.                                      |
| `startTime`           | `HH:mm` or `null`                    | no                 | Optional start time.                             |
| `endTime`             | `HH:mm` or `null`                    | no                 | Must be after `startTime` when both are present. |
| `status`              | `planned`, `done`, `cancelled`       | no                 | Defaults to `planned`.                           |
| `importance`          | `low`, `medium`, `high`, `mandatory` | no                 | `mandatory` events appear in `mandatoryEvents`.  |
| `location`            | string or `null`                     | no                 | Optional location.                               |

### Endpoints

- `GET /events` — list events.
- `GET /events/:id` — get one event by UUID.
- `POST /events` — create event.
- `PATCH /events/:id` — update selected fields.
- `DELETE /events/:id` — soft delete by setting `status = "cancelled"`.

### Create event example

```powershell
$body = @{
  title = "Doctor appointment"
  date = "2026-05-14"
  startTime = "15:00"
  endTime = "16:00"
  importance = "mandatory"
  location = "Clinic"
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Method POST -Uri http://localhost:3000/events -ContentType "application/json" -Body $body
```

### Cancel event example

```powershell
$eventId = "00000000-0000-4000-8000-000000000002"
Invoke-RestMethod -Method DELETE -Uri "http://localhost:3000/events/$eventId"
```

## Schedule

Schedule blocks represent recurring weekly blocks or templates.

### Fields and allowed values

| Field                 | Format / values                                                     | Required on create | Notes                                             |
| --------------------- | ------------------------------------------------------------------- | ------------------ | ------------------------------------------------- |
| `title`               | non-empty string                                                    | yes                | Block name.                                       |
| `description`         | string or `null`                                                    | no                 | Plain-text fallback details.                      |
| `descriptionRichText` | rich-text document or `null`                                        | no                 | Preserves schedule detail formatting.             |
| `dayOfWeek`           | integer `1..7`                                                      | yes                | `1 = Monday`, `7 = Sunday`.                       |
| `startTime`           | `HH:mm`                                                             | yes                | Start time.                                       |
| `endTime`             | `HH:mm` or `null`                                                   | no                 | Must be after `startTime` when present.           |
| `type`                | `study`, `work`, `health`, `routine`, `admin`, `free_time`, `other` | no                 | Defaults to `other`.                              |
| `status`              | `active`, `paused`, `archived`                                      | no                 | Only `active` blocks appear in `/schedule/today`. |
| `importance`          | `low`, `medium`, `high`, `mandatory`                                | no                 | Used to describe block importance.                |
| `location`            | string or `null`                                                    | no                 | Optional location.                                |

### Endpoints

- `GET /schedule` — list schedule blocks.
- `GET /schedule/today` — list active blocks for the current weekday.
- `GET /schedule/:id` — get one schedule block by UUID.
- `POST /schedule` — create schedule block.
- `PATCH /schedule/:id` — update selected fields.
- `DELETE /schedule/:id` — soft delete by setting `status = "archived"`.

### Create schedule block example

```powershell
$body = @{
  title = "Morning study"
  dayOfWeek = 4
  startTime = "09:00"
  endTime = "11:00"
  type = "study"
  importance = "high"
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Method POST -Uri http://localhost:3000/schedule -ContentType "application/json" -Body $body
```

### Get today's schedule example

```powershell
Invoke-RestMethod -Method GET -Uri http://localhost:3000/schedule/today
```

## Day State

Day State stores your health, energy, mood, and notes for today. If today's record does not exist, `GET /day-state/today` creates it automatically with `health = "healthy"` and `energy = "medium"`.

### Fields and allowed values

| Field           | Format / values                    | Required on update | Notes                                  |
| --------------- | ---------------------------------- | ------------------ | -------------------------------------- |
| `health`        | `healthy`, `slightly_sick`, `sick` | no                 | Affects Today task filtering.          |
| `energy`        | `low`, `medium`, `high`            | no                 | Affects Today task filtering/sorting.  |
| `mood`          | integer `1..5` or `null`           | no                 | Optional mood score.                   |
| `notes`         | string or `null`                   | no                 | Plain-text fallback notes for the day. |
| `notesRichText` | rich-text document or `null`       | no                 | Preserves day-note formatting.         |

### Endpoints

- `GET /day-state/today` — get or auto-create today's state.
- `PUT /day-state/today` — replace/update today's state.

### Update day state example

```powershell
$body = @{
  health = "slightly_sick"
  energy = "low"
  mood = 3
  notes = "Need lighter tasks today"
  notesRichText = @{
    version = 1
    blocks = @(
      @{
        type = "paragraph"
        children = @(@{ type = "text"; text = "Need lighter tasks today"; marks = @{ color = "warning" } })
      }
    )
  }
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Method PUT -Uri http://localhost:3000/day-state/today -ContentType "application/json" -Body $body
```

## Today

`GET /today` returns the calculated dashboard for the current date.

### Response sections

| Field             | Meaning                                                                    |
| ----------------- | -------------------------------------------------------------------------- |
| `date`            | Current date as `YYYY-MM-DD`.                                              |
| `dayState`        | Today's health/energy/mood/notes.                                          |
| `mandatoryEvents` | Today's events with `importance = "mandatory"`.                            |
| `plannedEvents`   | Today's events with `status = "planned"`.                                  |
| `scheduleBlocks`  | Active schedule blocks for current weekday.                                |
| `deadlineTasks`   | Active tasks with `deadline` today or earlier.                             |
| `plannedTasks`    | Active tasks with `plannedDate` today.                                     |
| `suggestedTasks`  | Up to 10 active tasks after duplicate removal and health/energy filtering. |

### Today rules

- Excludes tasks with `status` of `done`, `skipped`, or `archived`.
- Does not duplicate tasks already shown in `deadlineTasks` or `plannedTasks`.
- If health is `sick`, excludes `skip_if_sick` and `only_if_healthy` tasks.
- If health is `slightly_sick`, excludes `only_if_healthy` tasks.
- If energy is `low`, suggested tasks only include `low` energy tasks.
- If energy is `medium`, suggested tasks include `low` and `medium` tasks before high-energy work.
- Sorts by `priority DESC`, nearest deadline, then energy compatibility.

### Get Today dashboard example

```powershell
Invoke-RestMethod -Method GET -Uri http://localhost:3000/today
```

## Errors

All endpoints return the common error shape described in `docs/ERRORS.md`.

Example validation error:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": []
  }
}
```
