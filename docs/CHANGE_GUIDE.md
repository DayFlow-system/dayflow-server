# Change Guide

## Add a field

1. Add it to `prisma/schema.prisma`.
2. Run `npm run prisma:migrate -- --name add_field`.
3. Update the module schema, mapper, tests, and docs.

## Change an enum

1. Update constants in `src/types/common.ts`.
2. Update affected Zod schemas.
3. Add validation tests.

## Add an endpoint

1. Add route handler in `*.routes.ts`.
2. Put business logic in service.
3. Put database access in repository.
4. Add Fastify inject API tests.

## Change Today logic

1. Modify or add a small function in `src/modules/today/today.service.ts`.
2. Add unit tests for the function.
3. Add a service/API test if dashboard output changes.

## Add an entity

1. Add Prisma model.
2. Create module folder with schema, routes, service, repository, mapper.
3. Register routes in `src/app.ts`.
4. Add docs and tests.

## Add an error

1. Add code in `src/errors/errorCodes.ts`.
2. Throw `AppError` from services.
3. Document in `docs/ERRORS.md`.
4. Add error tests.

## Add a test

Choose the narrowest test layer first. Use regression tests only for fixed bugs that should never return.

When changing user-facing text fields, update both plain fallback fields and rich-text companion fields (`descriptionRichText` / `notesRichText`) plus [`RICH_TEXT.md`](RICH_TEXT.md).
