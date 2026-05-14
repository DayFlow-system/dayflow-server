# Architecture

## Layers

- Routes parse HTTP input and return HTTP responses.
- Schemas define Zod validation and inferred TypeScript input types.
- Services own business logic and domain decisions.
- Repositories own Prisma database operations.
- Mappers convert database dates to API-friendly strings.
- Utils hold reusable date, time, sorting, and validation helpers.
- Errors centralize API error formatting.

## Prisma schema

`prisma/schema.prisma` stores Tasks, Events, ScheduleBlocks, and DayState in SQLite. Enums are represented as strings for easy future enum evolution.

## Config

`src/config.ts` loads `.env` via dotenv and validates runtime configuration with Zod.

## Today module

`src/modules/today/today.service.ts` is intentionally split into small filter/sort/build functions so new rules can be added without changing HTTP or database code.

## Tests

The `tests` tree mirrors app layers: unit, service, repository, API, errors, and regression.
