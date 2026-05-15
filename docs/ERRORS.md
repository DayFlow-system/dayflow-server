# Errors

All errors use:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [] } }
```

## `VALIDATION_ERROR`

- When: invalid UUID, enum, ranges, dates, or time ranges.
- Handled: Zod branch in `src/errors/errorHandler.ts`.

## `NOT_FOUND`

- When: requested entity does not exist.
- Handled: service methods throw `AppError`.

## `BAD_REQUEST`

- When: malformed business request not covered by validation.
- Handled: throw `AppError(ERROR_CODES.BAD_REQUEST, ...)`.

## `CONFLICT`

- When: unique constraint fails, for example duplicate `DayState.date`.
- Handled: Prisma `P2002` branch in `src/errors/errorHandler.ts`.

## `INTERNAL_SERVER_ERROR`

- When: unexpected failures.
- Handled: fallback branch in `src/errors/errorHandler.ts`.

## Add a new error

1. Add code to `src/errors/errorCodes.ts`.
2. Throw `AppError` in service/business logic.
3. Add tests under `tests/errors`.
