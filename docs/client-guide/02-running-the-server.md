# 02. Running the Server for Client Development

Before building a client, run Dayflow Server locally.

## Install and initialize

```powershell
npm install
Copy-Item .env.example .env
npm run prisma:generate
npm run prisma:migrate:init
```

Or use the automatic setup:

```powershell
npm run setup
```

## Start development server

```powershell
npm run dev
```

The server stays running. That is expected.

## Verify backend is alive

Open:

```text
http://localhost:3000/health
```

Expected response:

```json
{ "status": "ok" }
```

## Open Swagger UI

```text
http://localhost:3000/docs
```

Swagger is the fastest way to understand and manually test endpoints before writing client code.

## Open raw OpenAPI JSON

```text
http://localhost:3000/openapi.json
```

A client generator or AI agent can use this document to infer endpoint shapes.

## Environment values the client cares about

The backend `.env` contains:

```env
DATABASE_URL="file:./prisma/dev.db"
PORT=3000
HOST=0.0.0.0
NODE_ENV=development
```

The client usually only needs the HTTP base URL:

```text
http://localhost:3000
```

In a future deployment through Cloudflare Tunnel, this base URL becomes the tunnel URL.

## Resetting local backend state

If compiled files are weird:

```powershell
npm run clean
npm run build
```

If you want a true from-scratch local setup:

```powershell
npm run clean:full
npm run setup
```

Warning: `clean:full` deletes `.env`, `node_modules`, and local SQLite database files.
