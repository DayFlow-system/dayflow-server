# Dayflow Server

Backend for a personal task/event/schedule manager that calculates a practical **Today** dashboard.

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
npm run prisma:migrate -- --name init
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

## API overview

- `GET /health`
- `GET|POST /tasks`, `GET|PATCH|DELETE /tasks/:id`
- `GET|POST /events`, `GET|PATCH|DELETE /events/:id`
- `GET|POST /schedule`, `GET /schedule/today`, `GET|PATCH|DELETE /schedule/:id`
- `GET|PUT /day-state/today`
- `GET /today`

See [`docs/API.md`](docs/API.md) for request and response examples.
