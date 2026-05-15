# 09. Extension Guide

This guide explains how to extend Dayflow without breaking its architecture.

## Add a new field

Example: add `estimatedMinutes` to Task.

1. Add the field to `prisma/schema.prisma`.
2. Run a migration:

   ```powershell
   npm run prisma:migrate -- --name add_task_estimated_minutes
   ```

3. Update `task.schema.ts` so input can be validated.
4. Update `task.mapper.ts` if output needs formatting.
5. Update `docs/API.md` and Swagger route schemas.
6. Add tests for create/update/API behavior.

## Add a new enum value

Example: add task type `creative`.

1. Update constants in `src/types/common.ts`.
2. Update docs and OpenAPI schemas.
3. Add a validation test to prove the new value is accepted.
4. Add a validation test to prove unknown values are still rejected.

## Add a new endpoint to an existing module

Example: `GET /tasks/active`.

1. Add repository query if database filtering is needed.
2. Add service method with business naming.
3. Add route definition.
4. Add OpenAPI route schema.
5. Add API test.
6. Update API docs.

## Add a new module

Example: `habits`.

Create:

```text
src/modules/habits/habit.schema.ts
src/modules/habits/habit.routes.ts
src/modules/habits/habit.service.ts
src/modules/habits/habit.repository.ts
src/modules/habits/habit.mapper.ts
```

Then:

1. Add Prisma model.
2. Register routes in `src/app.ts`.
3. Add Swagger schemas.
4. Add tests at all relevant levels.
5. Update documentation.

## Change Today rules

Today rules should be changed by editing small functions first. Avoid rewriting `buildTodayDashboard` directly.

Examples:

- change health filtering → edit `filterTasksByHealth`;
- change energy filtering → edit `filterTasksByEnergy`;
- change order → edit `sortTasksByPriorityDeadlineEnergy`;
- change suggestion count → edit `SUGGESTED_TASK_LIMIT`.

Always add or update unit tests before changing the composed dashboard behavior.

## Add a future client

For a Web/PWA, Telegram bot, or desktop app:

1. Use Swagger/OpenAPI to inspect endpoints.
2. Use the error format from `docs/ERRORS.md`.
3. Keep client-specific logic out of backend services.
4. If a client needs a new aggregate endpoint, add it as a new route/service method.

## When to add a regression test

Add a regression test when:

- a real user reports a bug;
- a production-like workflow breaks;
- a date/time edge case is fixed;
- Today dashboard returns duplicated or unsafe suggestions;
- validation accepts something it should reject.

The test name should describe the bug in user terms.
