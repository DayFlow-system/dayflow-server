# 03. Architecture

Dayflow uses a layered architecture. The main rule is simple:

> Do not mix HTTP logic, business logic, and database logic.

Keeping those concerns separate makes the code easier to test and safer to change.

## Dependency flow

```text
client
  ↓ HTTP
Fastify route
  ↓ Zod validation
service
  ↓ business rules
repository
  ↓ Prisma ORM
SQLite
```

The response is mapped back:

```text
Prisma model → mapper → API JSON response
```

## Folder structure

```text
src/
  app.ts
  server.ts
  config.ts
  db/
  docs/
  errors/
  modules/
  types/
  utils/
```

## Application bootstrap

### `src/app.ts`

Builds the Fastify app:

- registers the shared error handler;
- registers Swagger/OpenAPI;
- registers CORS;
- adds `/health`;
- registers all feature route modules.

### `src/server.ts`

Starts listening on `HOST` and `PORT`, then handles shutdown by closing Fastify and disconnecting Prisma.

### `src/config.ts`

Loads `.env` and validates runtime settings with Zod. Config validation at startup is useful because bad env values fail early.

## Module pattern

Each CRUD-like module follows the same shape:

```text
module/
  module.schema.ts      # Zod request validation
  module.routes.ts      # HTTP endpoints
  module.service.ts     # business logic
  module.repository.ts  # database operations
  module.mapper.ts      # DB model → API response
```

This pattern is repeated for:

- tasks;
- events;
- schedule;
- day-state.

The Today module is slightly different because it is algorithm-heavy instead of CRUD-heavy.

## Routes

Routes should answer:

- what HTTP method and path exist;
- where params/body come from;
- which Zod schema validates input;
- which service method is called;
- which response status is returned.

Routes should not contain Prisma queries or complex business decisions.

## Schemas

Zod schemas validate request input. Examples:

- UUID path params;
- enum values;
- required title;
- priority range;
- day-of-week range;
- date-only strings;
- `HH:mm` time strings;
- `endTime > startTime`.

OpenAPI route schemas live separately in `src/docs/routeSchemas.ts`. Zod is the source of runtime validation; OpenAPI schemas describe the API for humans and Swagger UI.

## Services

Services contain business decisions:

- throw `NOT_FOUND` when a record is missing;
- soft-delete instead of hard-delete;
- auto-create DayState;
- build Today dashboard;
- call repositories in the right order.

Services should be testable without a real HTTP request.

## Repositories

Repositories are the only layer that should know Prisma details.

Examples:

- `findMany`;
- `findById`;
- `create`;
- `update`;
- `archive`;
- `cancel`.

Repositories also remove `undefined` fields before sending data to Prisma. This matters because TypeScript runs with `exactOptionalPropertyTypes`.

## Mappers

Mappers convert database records to API-friendly objects. Prisma returns JavaScript `Date` objects, but the API should return stable strings:

- timestamps as ISO date-time strings;
- date-only fields as `YYYY-MM-DD`;
- missing optional dates as `null`.

## Utilities

Utility files keep shared logic out of modules:

- `date.ts` — date-only parsing and weekday helpers;
- `time.ts` — `HH:mm` parsing and comparison;
- `validation.ts` — reusable Zod helpers;
- `sorting.ts` — energy compatibility scoring;
- `object.ts` — remove `undefined` before Prisma writes.

## Error handling

All errors use the same JSON contract:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": []
  }
}
```

This makes future clients simpler because they only need to implement one error shape.

## Swagger/OpenAPI

Swagger is registered at `/docs`. It is for manual testing and API discovery. The raw OpenAPI document is exposed at `/openapi.json`.

## Rich text formatting path

Rich text is intentionally not treated as opaque client-only text. The server validates a versioned JSON document, stores it as a string column through Prisma/SQLite, and returns parsed JSON to API clients. This keeps formatting stable across clients while letting the database remain simple for local development.
