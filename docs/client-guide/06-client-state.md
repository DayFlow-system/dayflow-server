# 06. Client State, Caching, and Refresh Rules

A good client should keep state simple. The backend already computes the difficult Today logic.

## Recommended state shape

```ts
type ClientState = {
  today: TodayDashboard | null;
  tasks: Task[];
  events: Event[];
  schedule: ScheduleBlock[];
  dayState: DayState | null;
  loading: Record<string, boolean>;
  error: ApiError | null;
};
```

## First load

On app start:

1. call `GET /today`;
2. optionally call `GET /tasks`, `GET /events`, and `GET /schedule` if the UI has management tabs.

If the app only has a Today screen, `/today` is enough for the first render.

## Refresh rules after mutations

| Mutation                             | Refresh                                  |
| ------------------------------------ | ---------------------------------------- |
| Create/update/archive task           | `/tasks`, `/today`                       |
| Create/update/cancel event           | `/events`, `/today`                      |
| Create/update/archive schedule block | `/schedule`, `/schedule/today`, `/today` |
| Update day state                     | `/day-state/today`, `/today`             |

## Optimistic updates

For a first client, avoid optimistic updates. Prefer:

1. send mutation;
2. wait for success;
3. refresh affected data;
4. show success state.

Optimistic updates can be added later when behavior is stable.

## Loading states

Track loading separately for major areas:

- `today`;
- `tasks`;
- `events`;
- `schedule`;
- `dayState`;
- `mutation`.

This prevents the whole UI from freezing when only one section is refreshing.

## Error state

Store the last API error:

```ts
type ApiError = {
  code: string;
  message: string;
  details: unknown[];
};
```

Display validation errors near forms and unexpected errors as banners/toasts.

## Local persistence

Do not cache source data permanently until the API and UX are stable. If you add local persistence later, treat `/today` as server-authoritative and refresh it on startup.

## Polling

Polling is optional. A simple client can refresh Today when:

- app opens;
- user clicks refresh;
- a mutation succeeds;
- the date changes at midnight.

For a dashboard app, polling every 5–15 minutes may be acceptable.
