# 07. Тестирование

Тесты лежат в `tests/`. Они разделены по уровням, чтобы быстро понять, что сломалось.

## Unit tests

Папка:

```text
tests/unit
```

Проверяют чистые функции без HTTP и базы:

- date utils;
- time utils;
- Today filters;
- Today sorting.

Если сломался unit test, проблема почти всегда в маленькой функции.

## Service tests

Папка:

```text
tests/services
```

Проверяют бизнес-логику сервисов:

- create/update/archive task;
- cancel event;
- archive schedule;
- auto-create/update day state;
- build Today dashboard.

## Repository tests

Папка:

```text
tests/repositories
```

Проверяют Prisma/SQLite операции:

- create;
- find;
- update/upsert;
- active schedule query.

## API tests

Папка:

```text
tests/api
```

Проверяют реальные Fastify endpoints через `app.inject`. Это быстрее, чем поднимать сетевой сервер, но проверяет почти весь стек.

## Error tests

Папка:

```text
tests/errors
```

Проверяют:

- invalid UUID;
- invalid enum;
- invalid ranges;
- invalid time range;
- missing entities.

## Regression tests

Папка:

```text
tests/regression
```

Сюда добавляются тесты на баги после их исправления. Правило: если баг был найден пользователем, лучше добавить regression test, чтобы он не вернулся.

## Test setup

`tests/setup.ts` перед каждым тестом чистит таблицы и после suite закрывает Prisma connection.

## Команды

```powershell
npm run test
npm run test -- tests/api/tasks.api.test.ts
npm run test:watch
```

## Что делать, если тесты падают

1. Запустить `npm run prisma:generate`.
2. Проверить `.env`.
3. Проверить, применены ли миграции.
4. Запустить один конкретный тест.
5. Смотреть самый первый error в выводе — остальные часто являются следствием.
