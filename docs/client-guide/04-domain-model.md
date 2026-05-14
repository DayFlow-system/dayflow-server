# 04. Client Domain Model

The client should understand the same domain as the server. This does not mean duplicating all server logic, but the UI needs to present fields correctly.

## Task

Task fields:

```ts
type Task = {
  id: string;
  title: string;
  description: string | null;
  status: 'planned' | 'in_progress' | 'done' | 'skipped' | 'archived';
  type: 'task' | 'study' | 'health' | 'routine' | 'fun' | 'admin';
  priority: 1 | 2 | 3 | 4 | 5;
  deadline: string | null;
  plannedDate: string | null;
  lastDoneAt: string | null;
  energyRequired: 'low' | 'medium' | 'high';
  healthRule: 'always' | 'skip_if_sick' | 'only_if_healthy';
  createdAt: string;
  updatedAt: string;
};
```

UI hints:

- show `priority` as 1–5 or low-to-high indicator;
- make `deadline` visually prominent;
- hide or separate `archived` tasks in default lists;
- allow quick status changes.

## Event

```ts
type Event = {
  id: string;
  title: string;
  description: string | null;
  date: string;
  startTime: string | null;
  endTime: string | null;
  status: 'planned' | 'done' | 'cancelled';
  importance: 'low' | 'medium' | 'high' | 'mandatory';
  location: string | null;
  createdAt: string;
  updatedAt: string;
};
```

UI hints:

- highlight `mandatory` events;
- show time range if present;
- show cancelled events separately or muted.

## ScheduleBlock

```ts
type ScheduleBlock = {
  id: string;
  title: string;
  description: string | null;
  dayOfWeek: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  startTime: string;
  endTime: string | null;
  type: 'study' | 'work' | 'health' | 'routine' | 'admin' | 'free_time' | 'other';
  status: 'active' | 'paused' | 'archived';
  importance: 'low' | 'medium' | 'high' | 'mandatory';
  location: string | null;
  createdAt: string;
  updatedAt: string;
};
```

UI hints:

- map `dayOfWeek` to Monday–Sunday;
- use weekly calendar layout if possible;
- only active blocks matter for Today.

## DayState

```ts
type DayState = {
  id: string;
  date: string;
  health: 'healthy' | 'slightly_sick' | 'sick';
  energy: 'low' | 'medium' | 'high';
  mood: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};
```

UI hints:

- make health and energy easy to change;
- show mood as 1–5;
- notes can be a textarea.

## TodayDashboard

```ts
type TodayDashboard = {
  date: string;
  dayState: DayState;
  mandatoryEvents: Event[];
  plannedEvents: Event[];
  scheduleBlocks: ScheduleBlock[];
  deadlineTasks: Task[];
  plannedTasks: Task[];
  suggestedTasks: Task[];
};
```

UI hints:

- Today is a computed read model;
- do not let the user manually edit Today sections directly;
- edit source objects instead, then refresh Today.
