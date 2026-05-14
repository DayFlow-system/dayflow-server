# 08. Build the Same Backend From Scratch

This file is a blueprint for rebuilding Dayflow Server. Follow it in order if you want to create a similar product.

## Step 1. Define the product rules

Before writing code, define the domain:

- What is a task?
- What is an event?
- What is a recurring schedule block?
- What is day state?
- What should Today dashboard contain?
- Which items should be hidden, prioritized, or suggested?

Write those rules down. They will become schemas, database fields, services, and tests.

## Step 2. Create the Node/TypeScript project

Add:

- `package.json`;
- `tsconfig.json`;
- `tsconfig.build.json`;
- Prettier config;
- ESLint config;
- Vitest config;
- npm scripts.

Core dependencies:

- Fastify;
- Zod;
- Prisma;
- SQLite adapter;
- dotenv;
- Vitest;
- TypeScript.

## Step 3. Configure environment loading

Create `src/config.ts`.

Load `.env` with dotenv, then validate values with Zod. Do not let the server start with invalid environment variables.

## Step 4. Configure Prisma

Create:

```text
prisma/schema.prisma
prisma.config.ts
src/db/prisma.ts
```

For Prisma 7:

- keep datasource URL in `prisma.config.ts`;
- use a driver adapter in `src/db/prisma.ts`;
- run `npm run prisma:generate` after schema changes.

## Step 5. Model the database

Create models:

- Task;
- Event;
- ScheduleBlock;
- DayState.

Add indexes for fields used in filters:

- status;
- date;
- deadline;
- plannedDate;
- dayOfWeek.

## Step 6. Build the Fastify shell

Create:

```text
src/app.ts
src/server.ts
```

`app.ts` should register plugins and routes. `server.ts` should only start/stop the server.

## Step 7. Add shared error handling

Create:

```text
src/errors/AppError.ts
src/errors/errorCodes.ts
src/errors/errorHandler.ts
```

Decide on one response shape and use it everywhere.

## Step 8. Add utilities

Create reusable helpers before duplicating logic:

```text
src/utils/date.ts
src/utils/time.ts
src/utils/validation.ts
src/utils/sorting.ts
src/utils/object.ts
```

## Step 9. Build one CRUD module

Use Tasks as the first module:

```text
task.schema.ts      # Zod input validation
task.routes.ts      # HTTP endpoints
task.service.ts     # business behavior
task.repository.ts  # Prisma queries
task.mapper.ts      # API response shape
```

Once Tasks works, repeat the pattern for Events, Schedule, and DayState.

## Step 10. Build Today logic

Today is not CRUD. Treat it as an algorithm module.

Start with small pure functions:

- filter active tasks;
- filter by health;
- filter by energy;
- pick deadline tasks;
- pick planned tasks;
- remove duplicates;
- sort;
- limit.

Then compose those functions in `buildTodayDashboard`.

## Step 11. Add Swagger

Create:

```text
src/docs/swagger.ts
src/docs/routeSchemas.ts
```

Register Swagger UI at `/docs` and OpenAPI JSON at `/openapi.json`.

## Step 12. Add tests

Add tests in layers:

- unit tests for pure functions;
- service tests for business rules;
- repository tests for Prisma queries;
- API tests for Fastify routes;
- error tests for validation and missing entities.

## Step 13. Add documentation

At minimum, write:

- README;
- API docs;
- command docs;
- testing docs;
- error docs;
- architecture docs;
- change guide;
- deep-dive docs.

## Step 14. Verify everything

Run:

```powershell
npm run format
npm run lint
npm run typecheck
npm run build
npm run test
```

If all pass, the backend is ready for the next feature.
