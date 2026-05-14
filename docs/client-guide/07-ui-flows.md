# 07. UI Flows

This guide describes screens and flows for an ideal client.

## Screen 1: Today dashboard

Primary endpoint:

```text
GET /today
```

Recommended layout:

1. Header with current date.
2. Day state editor: health, energy, mood.
3. Mandatory events.
4. Planned events.
5. Schedule blocks.
6. Deadline tasks.
7. Planned tasks.
8. Suggested tasks.

Actions:

- mark task done;
- skip task;
- start task;
- open task details;
- update day state;
- refresh dashboard.

## Screen 2: Task manager

Endpoints:

- `GET /tasks`;
- `POST /tasks`;
- `PATCH /tasks/:id`;
- `DELETE /tasks/:id`.

Features:

- list tasks;
- filter by status/type;
- create task;
- edit task;
- archive task;
- quick status change.

## Screen 3: Event manager

Endpoints:

- `GET /events`;
- `POST /events`;
- `PATCH /events/:id`;
- `DELETE /events/:id`.

Features:

- calendar/day list;
- create event;
- edit event;
- cancel event;
- highlight mandatory events.

## Screen 4: Schedule manager

Endpoints:

- `GET /schedule`;
- `GET /schedule/today`;
- `POST /schedule`;
- `PATCH /schedule/:id`;
- `DELETE /schedule/:id`.

Features:

- weekly view Monday–Sunday;
- create recurring block;
- pause/archive block;
- show active blocks differently from paused blocks.

## Screen 5: Day state editor

Endpoints:

- `GET /day-state/today`;
- `PUT /day-state/today`.

Features:

- quick health selector;
- quick energy selector;
- mood slider 1–5;
- notes textarea.

After saving, refresh `/today`.

## Telegram bot flow

Good commands:

- `/today` — show dashboard summary;
- `/state low` — set low energy;
- `/sick` — set health to sick;
- `/task Buy milk` — create quick task;
- `/done <taskId>` — mark task done.

Telegram should show fewer details than Web/PWA and focus on quick actions.

## Desktop app flow

A desktop app can mirror the Web/PWA screens but add:

- tray shortcut;
- always-on-top Today panel;
- keyboard shortcuts;
- local notifications for mandatory events.
