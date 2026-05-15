# Dayflow Server

Dayflow Server is the backend for a personal task, event, schedule, and daily-state manager. It is designed as a lightweight replacement for a Notion-style planning system: the API stores tasks, calendar events, recurring schedule blocks, and the current day state, then computes a practical **Today** dashboard with the items that are most relevant right now.

## Project overview

- **Purpose:** help decide what to do today by combining deadlines, planned tasks, mandatory events, recurring schedule blocks, health, and energy.
- **Core entities:** tasks, events, schedule blocks, day state, and the computed Today dashboard.
- **Today logic:** excludes completed/skipped/archived tasks, separates deadline and planned tasks, avoids duplicates, applies health and energy filters, sorts by priority/deadline/energy compatibility, and limits suggested tasks.
- **Architecture:** modular Fastify API with routes, Zod schemas, services, repositories, mappers, reusable utilities, and centralized error handling.
- **Storage:** local SQLite through Prisma ORM, configured for Prisma 7 with `prisma.config.ts` and a Better SQLite3 adapter. Formatted descriptions and notes are preserved as versioned rich-text JSON companion fields (`descriptionRichText` / `notesRichText`).
- **Future clients:** prepared for Web/PWA, Telegram bot, Cloudflare Tunnel, and desktop app integrations.

## Quick start

One command prepares local development on Windows, macOS, and Linux:

```bash
npm run setup
```

It creates `.env` if it does not exist, installs dependencies, generates Prisma Client, and creates/applies the initial SQLite migration.

You can also run the same setup through either alias:

```bash
npm run setup:local
npm run init
```

If npm prints `Missing script: "setup"`, your local `package.json` is older than this code. Run `git pull` / update the branch, then check that `npm run` lists `setup`. If you cannot update immediately, use the manual install commands below.

## Manual install

```bash
npm install
# PowerShell / Windows
Copy-Item .env.example .env
# macOS / Linux
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate:init
```

## Environment

```env
DATABASE_URL="file:./prisma/dev.db"
PORT=3000
HOST=0.0.0.0
NODE_ENV=development
```

`DATABASE_URL` points to a local SQLite file. You normally do not need to edit it for local development.

## Run

```bash
npm run dev
# or
npm run build && npm run start
```

## Cleaning generated files

Use these commands when compiled output or local generated artifacts look stale:

```bash
npm run clean
# same as:
npm run clean:build
```

`npm run clean` / `npm run clean:build` removes only compiled/cache artifacts: `dist`, `coverage`, `.cache`, `.turbo`, and `tsconfig.tsbuildinfo`. It keeps `node_modules`, `.env`, and local SQLite databases.

For a full local reset from source:

```bash
npm run clean:full
```

`npm run clean:full` removes reproducible local files: build/cache output, `node_modules`, `.env`, and local SQLite database files. After it, run `npm run setup` again. Back up local `.env` or database files first if you need them.

## Tests and checks

```bash
npm run test
npm run typecheck
npm run lint
npm run format
```

## Cloudflare Tunnel example

```bash
cloudflared tunnel --url http://localhost:3000
```

## Swagger / manual API testing

After `npm run dev`, open Swagger UI in your browser:

```text
http://localhost:3000/docs
```

Raw OpenAPI JSON is available at:

```text
http://localhost:3000/openapi.json
```

## API overview

- `GET /health`
- `GET|POST /tasks`, `GET|PATCH|DELETE /tasks/:id`
- `GET|POST /events`, `GET|PATCH|DELETE /events/:id`
- `GET|POST /schedule`, `GET /schedule/today`, `GET|PATCH|DELETE /schedule/:id`
- `GET|PUT /day-state/today`
- `GET /today`

See [`docs/API.md`](docs/API.md) for request formats, allowed values, rules, PowerShell examples, and response examples. See [`docs/RICH_TEXT.md`](docs/RICH_TEXT.md) for the server-side formatting contract. For a full beginner-friendly English explanation of how the whole backend works and how to extend it, read [`docs/deep-dive/README.md`](docs/deep-dive/README.md). To build a client from zero, read [`docs/client-guide/README.md`](docs/client-guide/README.md).
