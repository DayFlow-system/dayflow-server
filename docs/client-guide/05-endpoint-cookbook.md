# 05. Endpoint Cookbook

This file gives client-ready endpoint examples. All examples assume:

```text
API_BASE_URL=http://localhost:3000
```

## Health

### `GET /health`

Purpose: verify the server is reachable.

```ts
await apiRequest('/health');
```

Expected:

```json
{ "status": "ok" }
```

## Tasks

### List tasks

```ts
const tasks = await apiRequest('/tasks');
```

### Create task

```ts
const task = await apiRequest('/tasks', {
  method: 'POST',
  body: JSON.stringify({
    title: 'Read TypeScript chapter',
    description: 'Read the generics section',
    descriptionRichText: {
      version: 1,
      blocks: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text: 'Read the generics section', marks: { bold: true } }],
        },
      ],
    },
    type: 'study',
    priority: 4,
    plannedDate: '2026-05-14',
    deadline: '2026-05-20',
    energyRequired: 'medium',
    healthRule: 'always',
  }),
});
```

### Update task

```ts
const updated = await apiRequest(`/tasks/${task.id}`, {
  method: 'PATCH',
  body: JSON.stringify({ status: 'in_progress' }),
});
```

### Archive task

```ts
await apiRequest(`/tasks/${task.id}`, { method: 'DELETE' });
```

Client behavior after mutation: refresh `/tasks` and `/today`.

## Events

### List events

```ts
const events = await apiRequest('/events');
```

### Create event

```ts
const event = await apiRequest('/events', {
  method: 'POST',
  body: JSON.stringify({
    title: 'Doctor appointment',
    date: '2026-05-14',
    startTime: '15:00',
    endTime: '16:00',
    importance: 'mandatory',
    location: 'Clinic',
  }),
});
```

### Cancel event

```ts
await apiRequest(`/events/${event.id}`, { method: 'DELETE' });
```

Client behavior after mutation: refresh `/events` and `/today`.

## Schedule

### List all schedule blocks

```ts
const schedule = await apiRequest('/schedule');
```

### List today's active blocks

```ts
const todayBlocks = await apiRequest('/schedule/today');
```

### Create schedule block

```ts
const block = await apiRequest('/schedule', {
  method: 'POST',
  body: JSON.stringify({
    title: 'Morning study',
    dayOfWeek: 4,
    startTime: '09:00',
    endTime: '11:00',
    type: 'study',
    importance: 'high',
  }),
});
```

### Archive schedule block

```ts
await apiRequest(`/schedule/${block.id}`, { method: 'DELETE' });
```

Client behavior after mutation: refresh `/schedule`, `/schedule/today`, and `/today`.

## Day State

### Get or create today's state

```ts
const dayState = await apiRequest('/day-state/today');
```

If missing, the backend creates:

```json
{ "health": "healthy", "energy": "medium" }
```

### Update today's state

```ts
const updatedDayState = await apiRequest('/day-state/today', {
  method: 'PUT',
  body: JSON.stringify({
    health: 'slightly_sick',
    energy: 'low',
    mood: 3,
    notes: 'Keep work light today',
    notesRichText: {
      version: 1,
      blocks: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text: 'Keep work light today', marks: { color: 'warning' } }],
        },
      ],
    },
  }),
});
```

Client behavior after mutation: refresh `/day-state/today` and `/today`.

## Today

### Get dashboard

```ts
const dashboard = await apiRequest('/today');
```

Recommended UI order:

1. `dayState`;
2. `mandatoryEvents`;
3. `plannedEvents`;
4. `scheduleBlocks`;
5. `deadlineTasks`;
6. `plannedTasks`;
7. `suggestedTasks`.

Client behavior: call this on app load and after any mutation.
