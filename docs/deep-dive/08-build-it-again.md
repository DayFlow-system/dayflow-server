# 08. Как написать такой же backend с нуля

Этот файл — рецепт, по которому можно повторить продукт.

## Шаг 1. Создать Node/TypeScript проект

Нужны:

- Node.js;
- TypeScript;
- Fastify;
- Zod;
- Prisma;
- SQLite;
- Vitest;
- ESLint;
- Prettier.

Сначала создаётся `package.json`, `tsconfig.json`, Prettier/ESLint config и npm scripts.

## Шаг 2. Настроить Prisma

Создать:

```text
prisma/schema.prisma
prisma.config.ts
src/db/prisma.ts
```

В schema описать модели:

- Task;
- Event;
- ScheduleBlock;
- DayState.

Для Prisma 7 datasource URL держать в `prisma.config.ts`, а runtime client создавать с SQLite adapter.

## Шаг 3. Создать Fastify app

Файлы:

```text
src/app.ts
src/server.ts
src/config.ts
```

`app.ts` собирает приложение, `server.ts` запускает listen, `config.ts` читает env.

## Шаг 4. Сделать общий error format

Создать:

```text
src/errors/AppError.ts
src/errors/errorCodes.ts
src/errors/errorHandler.ts
```

Все ошибки должны возвращаться в одном формате.

## Шаг 5. Сделать utils

Создать:

```text
src/utils/date.ts
src/utils/time.ts
src/utils/validation.ts
src/utils/sorting.ts
src/utils/object.ts
```

Не дублировать parsing/validation/sorting в modules.

## Шаг 6. Сделать первый module по шаблону

Например `tasks`:

```text
task.schema.ts      # Zod input validation
task.routes.ts      # HTTP endpoints
task.service.ts     # business logic
task.repository.ts  # Prisma operations
task.mapper.ts      # DB → API JSON
```

Потом повторить для events, schedule, day-state.

## Шаг 7. Сделать Today module

Today module отличается: он больше про алгоритм, чем CRUD.

Сначала написать маленькие функции:

- active filter;
- health filter;
- energy filter;
- deadline picker;
- planned picker;
- duplicate removal;
- sorting;
- limit.

Потом собрать их в `buildTodayDashboard`.

## Шаг 8. Подключить Swagger

Создать:

```text
src/docs/swagger.ts
src/docs/routeSchemas.ts
```

Swagger UI нужен, чтобы вручную тестировать API без отдельного frontend.

## Шаг 9. Добавить тесты

Минимальный набор:

- unit tests на utils и Today functions;
- service tests на business logic;
- repository tests на Prisma;
- API tests через Fastify inject;
- error tests.

## Шаг 10. Написать docs

Документация должна отвечать на вопросы:

- как запустить;
- какие endpoints есть;
- какие поля и enum values допустимы;
- как работает архитектура;
- как изменить проект;
- как тестировать;
- как устроен главный алгоритм Today.

Если после прочтения docs новый разработчик может повторить проект, документация хорошая.
