# Dayflow Client Implementation Guide

This folder is a complete guide for building a client for Dayflow Server from zero. It intentionally repeats some API and architecture information so a human developer or an AI agent can receive only this folder and still build a correct client.

Read in order:

1. [`01-client-goals.md`](01-client-goals.md) — what the client must achieve and what UX problems it solves.
2. [`02-running-the-server.md`](02-running-the-server.md) — how to set up and run the backend locally before building a client.
3. [`03-api-communication.md`](03-api-communication.md) — base URL, headers, JSON, dates, errors, and request conventions.
4. [`04-domain-model.md`](04-domain-model.md) — client-side understanding of tasks, events, schedule blocks, day state, and Today.
5. [`05-endpoint-cookbook.md`](05-endpoint-cookbook.md) — endpoint-by-endpoint request/response behavior and examples.
6. [`06-client-state.md`](06-client-state.md) — recommended client state shape, caching, invalidation, and refresh rules.
7. [`07-ui-flows.md`](07-ui-flows.md) — screens and user flows for a Web/PWA, Telegram bot, or desktop app.
8. [`08-validation-and-errors.md`](08-validation-and-errors.md) — how the client should validate input and display API errors.
9. [`09-implementation-blueprint.md`](09-implementation-blueprint.md) — step-by-step plan to implement an ideal client.
10. [`10-client-checklist.md`](10-client-checklist.md) — final checklist before calling the client complete.

## The shortest useful path

If you only want to start quickly:

1. Run the backend with `npm run dev`.
2. Open Swagger at `http://localhost:3000/docs`.
3. Build a client with `API_BASE_URL = "http://localhost:3000"`.
4. Implement `/today` first.
5. Implement CRUD screens for tasks, events, schedule, and day state.
