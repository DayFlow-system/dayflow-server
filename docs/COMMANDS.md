# Commands

## `npm run setup`

- What: creates `.env` from `.env.example` when needed, installs dependencies, generates Prisma Client, and runs the initial migration.
- When: first local setup or when you want to repair a missing local database/client.
- Example: `npm run setup`.
- Errors: npm registry access or Prisma validation errors. Solution: check internet access, then verify `.env`, `prisma.config.ts`, and `prisma/schema.prisma`.

## `npm install`

- What: installs runtime and development dependencies.
- When: after cloning or changing `package.json`.
- Example: `npm install`.
- Errors: registry/network failures. Solution: retry with working npm registry access.

## `npm run dev`

- What: starts Fastify with `tsx watch`.
- When: local development.
- Example: `npm run dev`.
- Errors: port already in use. Solution: change `PORT` in `.env`.

## `npm run build`

- What: compiles TypeScript to `dist/`.
- When: before production start.
- Example: `npm run build`.
- Errors: type errors. Solution: run `npm run typecheck` and fix reported files.

## `npm run start`

- What: runs `dist/server.js`.
- When: production-like execution after build.
- Example: `npm run start`.
- Errors: missing `dist`. Solution: run `npm run build` first.

## `npm run test` / `npm run test:watch`

- What: runs Vitest once or in watch mode.
- When: before commits or during development.
- Example: `npm run test -- tests/api/tasks.api.test.ts`.
- Errors: stale Prisma client/database. Solution: run `npm run setup`, or run `npm run prisma:generate` and `npm run prisma:migrate -- --name init` manually.

## `npm run prisma:generate`

- What: generates Prisma Client from `prisma/schema.prisma` using `prisma.config.ts`.
- When: after installing dependencies or changing the Prisma schema.
- Example: `npm run prisma:generate`.
- Errors: datasource configuration errors. Solution: ensure `.env` has `DATABASE_URL` and `prisma.config.ts` points at `prisma/schema.prisma`.

## `npm run prisma:migrate`

- What: applies Prisma migrations in development.
- When: after schema changes.
- Example: `npm run prisma:migrate -- --name add_field` for schema changes, or `npm run prisma:migrate -- --name init` for the first migration.
- Errors: migration conflict. Solution: inspect `prisma/migrations` and reset only disposable dev databases.

## `npm run prisma:studio`

- What: opens Prisma Studio.
- When: manual database inspection.
- Example: `npm run prisma:studio`.
- Errors: database URL missing. Solution: check `.env` and `prisma.config.ts`.

## `npm run lint`

- What: runs ESLint.
- When: before commits.
- Example: `npm run lint`.
- Errors: style/type-aware lint issues. Solution: update code, do not disable rules without reason.

## `npm run format`

- What: checks Prettier formatting.
- When: before commits.
- Example: `npm run format`.
- Errors: formatting differences. Solution: run `npx prettier --write .`.

## `npm run typecheck`

- What: runs TypeScript without emitting files.
- When: before commits.
- Example: `npm run typecheck`.
- Errors: type failures. Solution: fix strict TypeScript issues.
