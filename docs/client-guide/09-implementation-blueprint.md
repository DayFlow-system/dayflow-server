# 09. Implementation Blueprint

This is a practical plan for building a client from zero.

## Step 1. Choose client platform

Recommended first client: Web/PWA.

Reason:

- easiest to build forms;
- easiest to test Swagger side by side;
- can later become mobile-friendly;
- good foundation for desktop wrappers.

## Step 2. Create API module

Create a single API wrapper with:

- base URL config;
- JSON headers;
- error parsing;
- typed functions per endpoint.

Example function list:

```ts
getToday();
getTasks();
createTask(input);
updateTask(id, input);
archiveTask(id);
getEvents();
createEvent(input);
updateEvent(id, input);
cancelEvent(id);
getSchedule();
getTodaySchedule();
createScheduleBlock(input);
updateScheduleBlock(id, input);
archiveScheduleBlock(id);
getTodayDayState();
updateTodayDayState(input);
```

## Step 3. Define shared types

Copy client-safe types from `04-domain-model.md`.

Keep them in one file:

```text
src/api/types.ts
```

## Step 4. Build Today screen first

Implement:

1. load `GET /today`;
2. render each section;
3. show loading state;
4. show error state;
5. add refresh button.

This proves API communication works.

## Step 5. Add DayState editor

DayState changes immediately affect Today suggestions, so this is the most important edit form.

After save:

```text
PUT /day-state/today → refresh /today
```

## Step 6. Add Task CRUD

Implement task list and form.

After create/update/archive:

```text
refresh /tasks
refresh /today
```

## Step 7. Add Events CRUD

Implement event list and form.

After create/update/cancel:

```text
refresh /events
refresh /today
```

## Step 8. Add Schedule CRUD

Implement weekly schedule manager.

After create/update/archive:

```text
refresh /schedule
refresh /schedule/today
refresh /today
```

## Step 9. Add validation

Add client-side validation matching `08-validation-and-errors.md`.

Do not rely only on client validation. Always handle backend errors too.

## Step 10. Polish UX

Add:

- empty states;
- success toasts;
- form reset after create;
- confirmation before archive/cancel;
- visual badges for priority, energy, health, importance;
- date/time pickers.

## Step 11. Add client tests

Recommended tests:

- API wrapper parses success;
- API wrapper throws `ApiError`;
- Today screen renders all sections;
- form validation rejects bad inputs;
- mutation refreshes Today.

## Step 12. Prepare for deployment

Make API base URL configurable:

```text
VITE_API_BASE_URL=http://localhost:3000
```

For Cloudflare Tunnel, set it to the tunnel URL.
