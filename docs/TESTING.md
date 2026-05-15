# Testing

## Types

- Unit: `tests/unit` covers dates, times, Today filters, sorting, and limits.
- Services: `tests/services` covers business logic independently from HTTP.
- Repositories: `tests/repositories` covers SQLite/Prisma persistence operations.
- API: `tests/api` uses Fastify `inject` for endpoint integration tests.
- Errors: `tests/errors` checks validation and missing entity responses.
- Regression: `tests/regression` is reserved for future bugfix lock tests.

## Run tests

```bash
npm run test
npm run test:watch
npm run test -- tests/api/tasks.api.test.ts
```

## Add a test

1. Put the test in the smallest matching folder.
2. Use factories from `tests/helpers/factories.ts` when possible.
3. Keep one behavior per `it` block.
4. For bug fixes, add a regression test explaining the fixed behavior.

Rich-text behavior should be covered at the utility level and through API round-trip tests so formatting survives validation, repository serialization, and response mapping.
