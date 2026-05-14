# 02. Локальный запуск

## Минимальный путь

```powershell
npm install
Copy-Item .env.example .env
npm run prisma:generate
npm run prisma:migrate:init
npm run dev
```

После запуска сервера:

- health check: `http://localhost:3000/health`;
- Swagger UI: `http://localhost:3000/docs`;
- OpenAPI JSON: `http://localhost:3000/openapi.json`.

## Автоматический setup

```powershell
npm run setup
```

То же самое можно запустить через алиасы:

```powershell
npm run setup:local
npm run init
```

Setup script делает следующее:

1. Проверяет, есть ли `.env`.
2. Если `.env` нет — копирует `.env.example`.
3. Запускает `npm install`.
4. Запускает `npm run prisma:generate`.
5. Запускает `npm run prisma:migrate:init`.
6. Подсказывает, что дальше надо выполнить `npm run dev`.

## Что лежит в `.env`

```env
DATABASE_URL="file:./prisma/dev.db"
PORT=3000
HOST=0.0.0.0
NODE_ENV=development
```

`DATABASE_URL` указывает на локальный SQLite-файл. Для обычной разработки менять его не нужно.

## Зачем нужен Prisma generate

Prisma читает `prisma/schema.prisma` и генерирует TypeScript client в `node_modules/@prisma/client`. Без этого импорты `PrismaClient`, `Task`, `Event` и другие типы могут не работать.

## Зачем нужна миграция

Миграция создаёт реальные таблицы SQLite по Prisma schema. Код может быть правильным, но без миграции базы таблиц ещё нет.

## Частые проблемы

### `Missing script: "setup"`

Локальный `package.json` старый. Сделай:

```powershell
git pull
npm run
```

В списке должны быть `setup`, `setup:local`, `init`.

### Сервер висит после `npm run dev`

Это нормально. `tsx watch src/server.ts` держит процесс запущенным и ждёт запросы. Открой второй терминал или браузер и проверь `/health` или `/docs`.

### `npm warn Unknown cli config "--name"`

Для первой миграции используй готовую команду:

```powershell
npm run prisma:migrate:init
```

Для новых миграций можно использовать:

```powershell
npm run prisma:migrate -- --name add_new_field
```
