# 05. Request Lifecycle

This file traces one request through the backend. Example: `POST /tasks`.

## 1. Client sends HTTP

```powershell
$body = @{ title = "Read"; priority = 4 } | ConvertTo-Json
Invoke-RestMethod -Method POST -Uri http://localhost:3000/tasks -ContentType "application/json" -Body $body
```

The request includes:

- method: `POST`;
- path: `/tasks`;
- header: `Content-Type: application/json`;
- JSON body.

## 2. Fastify matches the route

`task.routes.ts` registers:

```text
POST /tasks
```

The handler parses the request body with `taskCreateSchema` and then calls `TaskService.create`.

## 3. Zod validates input

Zod checks:

- `title` exists and is not empty;
- `priority` is between 1 and 5;
- enum values are allowed;
- dates are valid `YYYY-MM-DD` strings;
- optional fields are either valid values or `null`.

If validation fails, Zod throws `ZodError`.

## 4. Error handler normalizes failures

Instead of returning a random stack trace, the API returns:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": []
  }
}
```

The same error shape is used for not found, conflict, bad request, and internal errors.

## 5. Service handles business logic

`TaskService.create` receives already validated data. It does not know about HTTP. Its job is to perform business behavior and delegate persistence.

For update/delete flows, services also translate Prisma missing-record errors into `NOT_FOUND` API errors.

## 6. Repository talks to Prisma

`TaskRepository.create` calls Prisma:

```text
prisma.task.create(...)
```

Before writing, it removes `undefined` fields. This matters because optional properties and explicit `undefined` are different when TypeScript uses `exactOptionalPropertyTypes`.

## 7. Prisma writes to SQLite

Prisma converts the TypeScript call into SQL for SQLite. SQLite stores the row in `prisma/dev.db` by default.

## 8. Mapper shapes the response

The mapper converts Prisma output into API JSON:

- Date objects become strings;
- date-only fields become `YYYY-MM-DD`;
- optional missing dates become `null`.

## 9. Client receives JSON

The client receives the created task with generated `id`, `createdAt`, and `updatedAt`.

## How Swagger fits in

Swagger UI is just another client. When you click **Try it out**, Swagger sends HTTP requests to the same Fastify routes.

## How tests fit in

API tests use Fastify `inject`, which sends requests directly into the app without opening a network port. This tests routes, services, repositories, validation, error handling, and mappers together.
