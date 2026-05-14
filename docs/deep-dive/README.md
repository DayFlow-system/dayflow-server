# Dayflow Deep Dive

Эта папка объясняет проект максимально подробно: что он делает, из каких частей состоит, как запрос проходит через сервер, как устроена база, как считается Today dashboard и как повторить такую архитектуру с нуля.

Читать лучше по порядку:

1. [`01-product.md`](01-product.md) — что за продукт мы строим и какие задачи он решает.
2. [`02-local-setup.md`](02-local-setup.md) — как поднять проект локально и что делает каждая команда.
3. [`03-architecture.md`](03-architecture.md) — общая архитектура и зачем нужны routes/services/repositories/mappers.
4. [`04-data-model.md`](04-data-model.md) — таблицы, поля, enum-значения и связи с бизнес-логикой.
5. [`05-request-lifecycle.md`](05-request-lifecycle.md) — полный путь HTTP-запроса от клиента до SQLite и обратно.
6. [`06-today-algorithm.md`](06-today-algorithm.md) — подробное объяснение алгоритма `/today`.
7. [`07-testing-strategy.md`](07-testing-strategy.md) — какие тесты есть, зачем каждый уровень и как добавлять новые.
8. [`08-build-it-again.md`](08-build-it-again.md) — пошаговый план, как написать такой же backend с нуля.

Если хочется просто вручную потыкать API, запусти сервер и открой Swagger:

```text
http://localhost:3000/docs
```
