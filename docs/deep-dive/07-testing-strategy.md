# 07. Testing Strategy

Tests live in `tests/` and are split by level. Each level protects a different kind of behavior.

## Unit tests

Folder:

```text
tests/unit
```

Unit tests cover pure logic without HTTP and usually without database access:

- date utilities;
- time utilities;
- Today filters;
- Today sorting;
- suggestion limits.

If a unit test fails, the bug is usually in one small function.

## Service tests

Folder:

```text
tests/services
```

Service tests cover business behavior:

- create/update/archive task;
- cancel event;
- archive schedule block;
- auto-create and update DayState;
- build Today dashboard.

Services are where business rules should live, so this layer is important.

## Repository tests

Folder:

```text
tests/repositories
```

Repository tests cover Prisma/SQLite operations:

- create;
- find by ID;
- find by date;
- upsert;
- active schedule queries;
- soft-delete updates.

If a repository test fails, check Prisma schema, migrations, or query shape.

## API tests

Folder:

```text
tests/api
```

API tests use Fastify `inject`. This means no network port is opened, but the request still travels through Fastify routes.

API tests verify:

- route registration;
- request parsing;
- validation;
- service integration;
- mapper output;
- HTTP status codes.

## Error tests

Folder:

```text
tests/errors
```

Error tests protect the API error contract. They check cases like:

- invalid UUID;
- invalid enum;
- invalid ranges;
- invalid time ranges;
- missing entities.

## Regression tests

Folder:

```text
tests/regression
```

Use regression tests for bugs found during real usage. A good regression test should answer:

> What user-visible behavior broke, and what exact behavior must never break again?

## Test setup

`tests/setup.ts` clears database tables before each test and disconnects Prisma after the suite.

This keeps tests isolated. One test should not depend on data created by another test.

## Commands

Run everything:

```powershell
npm run test
```

Run one file:

```powershell
npm run test -- tests/api/tasks.api.test.ts
```

Watch mode:

```powershell
npm run test:watch
```

## Debugging failed tests

1. Run `npm run prisma:generate`.
2. Confirm `.env` exists.
3. Confirm migrations were applied.
4. Run one failing test file.
5. Read the first error first; later errors are often consequences.
6. If API tests fail but service tests pass, inspect routes and schemas.
7. If service tests fail but repository tests pass, inspect business logic.
8. If repository tests fail, inspect Prisma schema and database state.
