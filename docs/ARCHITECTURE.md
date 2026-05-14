# Architecture

## Layers

- Routes parse HTTP input, attach OpenAPI metadata, and return HTTP responses.
- Schemas define Zod validation and inferred TypeScript input types.
- Services own business logic and domain decisions.
- Repositories own Prisma database operations.
- Mappers convert database dates to API-friendly strings.
- Utils hold reusable date, time, sorting, and validation helpers.
- Swagger docs expose interactive manual testing at `/docs` and raw OpenAPI JSON at `/openapi.json`.
- Errors centralize API error formatting.

## Prisma schema

`prisma/schema.prisma` stores Tasks, Events, ScheduleBlocks, and DayState in SQLite. Prisma 7 keeps the SQLite URL in `prisma.config.ts`, while runtime access uses the Better SQLite3 driver adapter in `src/db/prisma.ts`. Enums are represented as strings for easy future enum evolution.

## Config

`src/config.ts` loads `.env` via dotenv and validates runtime configuration with Zod.

## Today module

`src/modules/today/today.service.ts` is intentionally split into small filter/sort/build functions so new rules can be added without changing HTTP or database code.

## Tests

The `tests` tree mirrors app layers: unit, service, repository, API, errors, and regression.

## Deep dive

For a beginner-friendly English, end-to-end explanation of how to rebuild and extend the same backend, see [`docs/deep-dive/README.md`](deep-dive/README.md).
