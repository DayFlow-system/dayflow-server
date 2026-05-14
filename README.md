# Dayflow Server

Backend for a personal task/event/schedule manager that calculates a practical **Today** dashboard.

## Install

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
```

## Environment

```env
DATABASE_URL="file:./prisma/dev.db"
PORT=3000
HOST=0.0.0.0
NODE_ENV=development
```

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
