# 02. Local Setup

This project is a Node.js + TypeScript backend. It uses Fastify for HTTP, Prisma for database access, and SQLite for local persistence.

## Prerequisites

Install:

- Node.js 20 or newer;
- npm;
- Git.

Optional but useful:

- VS Code;
- Prisma extension;
- REST Client/Postman/Insomnia, although Swagger UI is already included.

## Fast setup

```powershell
npm run setup
```

Aliases that do the same thing:

```powershell
npm run setup:local
npm run init
```

The setup script:

1. checks whether `.env` exists;
2. copies `.env.example` to `.env` if needed;
3. runs `npm install`;
4. runs `npm run prisma:generate`;
5. runs `npm run prisma:migrate:init`;
6. tells you to start the server with `npm run dev`.

## Manual setup

Use this if you want to run every step yourself:

```powershell
npm install
Copy-Item .env.example .env
npm run prisma:generate
npm run prisma:migrate:init
npm run dev
```

On macOS/Linux, replace the copy command with:

```bash
cp .env.example .env
```

## Environment variables

`.env.example` contains:

```env
DATABASE_URL="file:./prisma/dev.db"
PORT=3000
HOST=0.0.0.0
NODE_ENV=development
```

### `DATABASE_URL`

Points Prisma and the SQLite adapter to the local SQLite file. The default stores the database in `prisma/dev.db`.

### `PORT`

The HTTP port. Default: `3000`.

### `HOST`

The bind host. `0.0.0.0` means the server listens on all interfaces. For local-only development, `127.0.0.1` is also fine.

### `NODE_ENV`

The runtime environment name. Local development uses `development`.

## Running the server

```powershell
npm run dev
```

This starts `tsx watch src/server.ts`. The command does not exit because it keeps the server running and watches files for changes.

After startup, open:

- health check: `http://localhost:3000/health`;
- Swagger UI: `http://localhost:3000/docs`;
- OpenAPI JSON: `http://localhost:3000/openapi.json`.

## Prisma commands

### Generate Prisma Client

```powershell
npm run prisma:generate
```

This reads `prisma/schema.prisma` and generates TypeScript client code in `node_modules/@prisma/client`.

### Create the first migration

```powershell
npm run prisma:migrate:init
```

This creates and applies the initial SQLite migration.

### Add a later migration

```powershell
npm run prisma:migrate -- --name add_new_field
```

Use this after changing `prisma/schema.prisma`.

### Open Prisma Studio

```powershell
npm run prisma:studio
```

This gives a browser UI for inspecting local data.

## Common problems

### `Missing script: "setup"`

Your local `package.json` is stale. Update the branch and confirm scripts are listed:

```powershell
git pull
npm run
```

### Server appears to hang after `npm run dev`

That is expected. The server is running. Open another terminal or browser and call `/health` or `/docs`.

### Prisma Client types are missing

Run:

```powershell
npm run prisma:generate
```

### Database tables are missing

Run:

```powershell
npm run prisma:migrate:init
```

or, after schema changes:

```powershell
npm run prisma:migrate -- --name your_change_name
```
