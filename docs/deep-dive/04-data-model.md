# 04. Data Model

The data model is defined in `prisma/schema.prisma`. SQLite is used for local persistence.

## Why SQLite

SQLite is simple for local development:

- no separate database server;
- database is just a file;
- easy to reset;
- good enough for a personal planning product.

The repository pattern keeps database access isolated, so moving to PostgreSQL later would mostly affect Prisma configuration and migrations.

## Task

A Task is an actionable item.

Important fields:

- `status` — lifecycle state;
- `type` — category;
- `priority` — importance from 1 to 5;
- `deadline` — due date;
- `plannedDate` — date intentionally planned for work;
- `lastDoneAt` — useful for routines;
- `energyRequired` — low, medium, or high;
- `healthRule` — whether the task is allowed when sick.

Inactive statuses:

```text
done, skipped, archived
```

Inactive tasks do not appear in active Today logic.

Task can appear in:

- `deadlineTasks` when `deadline <= today`;
- `plannedTasks` when `plannedDate = today`;
- `suggestedTasks` after filtering and sorting.

## Event

An Event is a dated calendar item.

Important fields:

- `date`;
- `startTime`;
- `endTime`;
- `status`;
- `importance`;
- `location`.

Today logic uses events in two ways:

- `importance = mandatory` → `mandatoryEvents`;
- `status = planned` → `plannedEvents`.

Events are soft-deleted by setting `status = cancelled`.

## ScheduleBlock

A ScheduleBlock is a recurring weekly template.

Important fields:

- `dayOfWeek` from 1 to 7;
- `startTime`;
- `endTime`;
- `type`;
- `status`;
- `importance`.

Only blocks with `status = active` and matching the current weekday are returned by `/schedule/today` and used in Today dashboard.

## DayState

DayState stores the user's state for a specific date.

Fields:

- `date` — unique;
- `health` — `healthy`, `slightly_sick`, or `sick`;
- `energy` — `low`, `medium`, or `high`;
- `mood` — optional score from 1 to 5;
- `notes` — optional free text.

If today's DayState does not exist, the API creates it automatically:

```json
{
  "health": "healthy",
  "energy": "medium"
}
```

## Why enum-like fields are strings

The Prisma schema stores enum-like values as `String`, while Zod validates the allowed values. This makes early iteration easier because enum lists can change without database enum migrations.

A future stable version could replace those fields with real Prisma enums.

## Why soft delete

Soft delete preserves history:

- Task delete → `status = archived`;
- Event delete → `status = cancelled`;
- Schedule delete → `status = archived`.

This helps with future analytics, undo features, and debugging.

## Indexes

The schema adds indexes for fields that are commonly queried:

- task status;
- task deadline;
- task plannedDate;
- event date;
- event status;
- schedule dayOfWeek;
- schedule status.

Indexes are small now, but they document query intent and help as data grows.
