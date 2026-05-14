# 01. Client Goals

A Dayflow client is any interface that talks to Dayflow Server. It can be a Web/PWA app, Telegram bot, desktop app, mobile app, CLI, or automation script.

## Primary goal

The client must help the user answer:

> What should I do today?

The most important endpoint is:

```text
GET /today
```

A good client should make the Today dashboard easy to understand and act on.

## Secondary goals

The client should also let the user manage the source data that powers Today:

- create and update tasks;
- create and update events;
- create and update recurring schedule blocks;
- update today's health, energy, mood, and notes;
- archive/cancel items without permanently deleting history.

## Product mental model

The backend is not just a database wrapper. It computes a decision-support dashboard.

The client should treat these as different UI concepts:

- **source data** — tasks, events, schedule blocks, day state;
- **computed view** — Today dashboard.

The user edits source data. The backend computes Today.

## Recommended first screen

The home screen should be Today:

1. Day state controls at the top.
2. Mandatory events.
3. Planned events.
4. Schedule blocks.
5. Deadline tasks.
6. Planned tasks.
7. Suggested tasks.

## Important UX principles

- Do not show archived tasks as normal active tasks.
- Make mandatory events visually obvious.
- Show overdue/today deadline tasks before suggestions.
- Let the user update health and energy quickly.
- After any mutation, refresh `/today`.
- Prefer soft-delete wording like “Archive task” or “Cancel event” instead of “Delete forever”.

## Client types

### Web/PWA

Best for full editing UI, forms, tables, and offline-friendly future work.

### Telegram bot

Best for quick capture and quick Today summary.

### Desktop app

Best for always-available personal dashboard.

### CLI/script

Best for automation and debugging.
