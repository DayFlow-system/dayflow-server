# 03. Архитектура

Проект построен слоями. Это нужно, чтобы не смешивать HTTP, бизнес-логику и работу с базой.

## Главный поток зависимостей

```text
client
  ↓ HTTP
Fastify route
  ↓ validates input with Zod
service
  ↓ business rules
repository
  ↓ Prisma ORM
SQLite
```

Ответ идёт обратно через mapper:

```text
Prisma model → mapper → API JSON response
```

## `src/app.ts`

Создаёт Fastify app:

- регистрирует общий error handler;
- регистрирует Swagger;
- регистрирует CORS;
- добавляет `/health`;
- подключает feature routes.

## `src/server.ts`

Запускает app на `HOST` и `PORT` из config. Также корректно закрывает Fastify и Prisma при shutdown.

## Modules

Каждая сущность живёт в своей папке:

```text
src/modules/tasks/
  task.schema.ts
  task.routes.ts
  task.service.ts
  task.repository.ts
  task.mapper.ts
```

Такой же шаблон есть для events, schedule и day-state.

## Routes

Routes отвечают только за HTTP:

- какой endpoint;
- какой метод;
- как прочитать params/body;
- какую Zod schema применить;
- какой service вызвать;
- какой HTTP status вернуть.

Routes не должны знать детали SQL/Prisma.

## Schemas

Schemas на Zod описывают входные данные:

- required fields;
- enum values;
- date format;
- time format;
- priority range;
- dayOfWeek range;
- time range `endTime > startTime`.

## Services

Services содержат бизнес-решения:

- что делать, если сущность не найдена;
- что такое soft delete;
- как собрать Today dashboard;
- как auto-create day state.

## Repositories

Repositories содержат только операции базы:

- `findMany`;
- `findById`;
- `create`;
- `update`;
- soft-delete update.

Если завтра заменить SQLite на PostgreSQL, в основном менять придётся repositories и Prisma config, а не routes.

## Mappers

Prisma возвращает `Date` объекты. API должен отдавать строки. Mappers приводят данные к стабильному JSON contract:

- `createdAt`/`updatedAt` → ISO string;
- date-only поля → `YYYY-MM-DD`.

## Utils

`src/utils` содержит повторно используемые функции:

- date parsing;
- time parsing;
- validation helpers;
- sorting helpers;
- object cleanup helpers.

## Errors

Все ошибки приводятся к одному формату:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": []
  }
}
```

Это удобно для будущего frontend/Telegram bot: клиент всегда знает, где искать ошибку.
