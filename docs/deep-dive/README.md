# Dayflow Deep Dive

This folder explains Dayflow Server in detail: what the product is, how the backend is structured, how a request moves through the system, how the database is modeled, how the Today dashboard is computed, and how to rebuild the same product from scratch.

Read the files in order:

1. [`01-product.md`](01-product.md) — the product idea, user problem, core workflows, and design constraints.
2. [`02-local-setup.md`](02-local-setup.md) — local setup, environment variables, Prisma commands, and common troubleshooting.
3. [`03-architecture.md`](03-architecture.md) — layered architecture, module boundaries, and why routes/services/repositories/mappers are separated.
4. [`04-data-model.md`](04-data-model.md) — tables, fields, allowed values, persistence decisions, and how data connects to business rules.
5. [`05-request-lifecycle.md`](05-request-lifecycle.md) — the full path from HTTP request to SQLite and back to JSON.
6. [`06-today-algorithm.md`](06-today-algorithm.md) — the complete `/today` algorithm and how every dashboard section is built.
7. [`07-testing-strategy.md`](07-testing-strategy.md) — test layers, what each layer protects, and how to add new tests.
8. [`08-build-it-again.md`](08-build-it-again.md) — a step-by-step blueprint for building the same backend again.

For manual API testing, start the server and open Swagger UI:

```text
http://localhost:3000/docs
```

## What you should understand after reading this folder

After reading the deep dive, a developer should be able to:

- explain what Dayflow stores and why;
- run the project locally;
- send API requests through Swagger or PowerShell;
- trace a request from route to service to repository to database;
- change a model field safely;
- add a new endpoint;
- modify Today dashboard rules;
- write tests for a bug fix;
- rebuild a similar Fastify + Prisma + Zod backend from scratch.

The deep dive also covers server-side rich-text persistence: formatted descriptions and notes are validated as versioned JSON and stored through Prisma/SQLite companion fields.
