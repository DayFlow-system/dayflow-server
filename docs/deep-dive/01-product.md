# 01. Product Concept

Dayflow Server is the backend for a personal planning system. It stores tasks, events, recurring schedule blocks, and the user's current day state, then turns that raw information into one practical dashboard: **Today**.

The goal is not to show every possible item. The goal is to answer a more useful question:

> Given my calendar, deadlines, plans, health, and energy, what should I realistically focus on today?

## Why this is more than a TODO list

A plain TODO list usually shows everything. That becomes noisy very quickly. Dayflow adds context:

- whether a task has a deadline today or is already overdue;
- whether a task was explicitly planned for today;
- whether there are mandatory events today;
- which recurring schedule blocks apply to the current weekday;
- whether the user is healthy, slightly sick, or sick;
- whether the user has low, medium, or high energy;
- how much energy each task requires;
- whether a task is already done, skipped, or archived.

The result is a system that can recommend a smaller and more realistic list of work.

## Core product objects

Dayflow stores four main types of source data:

- **Tasks** — actionable items that can have priority, deadline, planned date, health rules, and energy requirements.
- **Events** — dated calendar items with optional time, location, status, and importance.
- **Schedule blocks** — recurring weekly blocks such as study, work, health, routine, or free time.
- **Day state** — the user's state for a date: health, energy, mood, and notes.

Those objects are combined into the computed Today dashboard:

```json
{
  "date": "2026-05-14",
  "dayState": {},
  "mandatoryEvents": [],
  "plannedEvents": [],
  "scheduleBlocks": [],
  "deadlineTasks": [],
  "plannedTasks": [],
  "suggestedTasks": []
}
```

## Key user workflows

### Morning planning

1. Open `/today`.
2. Check mandatory events.
3. Check schedule blocks.
4. See deadline tasks.
5. Pick from suggested tasks based on current health and energy.

### Updating day state

If the user feels sick or low-energy, update `/day-state/today`. The next `/today` response will automatically filter or reorder suggested tasks.

### Planning ahead

Create tasks with `plannedDate` or `deadline`. They will appear in the right Today sections when the date arrives.

### Keeping historical context

Delete operations are soft deletes. This preserves history for future analytics and avoids accidental data loss.

## Intended future clients

The backend is intentionally client-agnostic. It can support:

- Web/PWA UI;
- Telegram bot;
- desktop app;
- scripts and automations;
- Cloudflare Tunnel exposure for private remote access.

## Product design principles

- The API should be predictable and boring.
- Today logic should be easy to change because personal planning rules evolve.
- Data should not disappear silently; use soft-delete states.
- Validation should reject bad input early.
- Documentation should be good enough that a new developer can rebuild the system.
