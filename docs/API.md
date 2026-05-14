# API

Base URL: `http://localhost:3000`.

## Health

`GET /health` → `{ "status": "ok" }`

## Tasks

- `GET /tasks`
- `GET /tasks/:id`
- `POST /tasks`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id` soft deletes by setting `status = "archived"`.

Create body:

```json
{ "title": "Read", "priority": 4, "type": "study", "deadline": "2026-05-14" }
```

## Events

- `GET /events`
- `GET /events/:id`
- `POST /events`
- `PATCH /events/:id`
- `DELETE /events/:id` sets `status = "cancelled"`.

Create body:

```json
{ "title": "Exam", "date": "2026-05-14", "startTime": "10:00", "importance": "mandatory" }
```

## Schedule

- `GET /schedule`
- `GET /schedule/today`
- `GET /schedule/:id`
- `POST /schedule`
- `PATCH /schedule/:id`
- `DELETE /schedule/:id` sets `status = "archived"`.

Create body:

```json
{ "title": "Study", "dayOfWeek": 4, "startTime": "09:00", "endTime": "11:00" }
```

## Day State

- `GET /day-state/today` auto-creates `{ "health": "healthy", "energy": "medium" }` if missing.
- `PUT /day-state/today`

Put body:

```json
{ "health": "slightly_sick", "energy": "low", "mood": 3 }
```

## Today

`GET /today` returns date, day state, mandatory events, planned events, schedule blocks, deadline tasks, planned tasks, and suggested tasks.

## Errors

All endpoints return the common error shape described in `docs/ERRORS.md`.
