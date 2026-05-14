# 05. Жизненный цикл запроса

Разберём пример `POST /tasks`.

## 1. Клиент отправляет HTTP

```powershell
$body = @{ title = "Read"; priority = 4 } | ConvertTo-Json
Invoke-RestMethod -Method POST -Uri http://localhost:3000/tasks -ContentType "application/json" -Body $body
```

## 2. Fastify находит route

Route определён в `task.routes.ts`:

```text
POST /tasks → taskCreateSchema.parse(body) → TaskService.create(...)
```

## 3. Zod валидирует body

Zod проверяет:

- есть ли `title`;
- входит ли `priority` в 1..5;
- правильные ли enum values;
- правильные ли даты.

Если body неправильный, выбрасывается `ZodError`.

## 4. Error handler форматирует ошибки

Вместо случайного stack trace клиент получает стабильный JSON:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": []
  }
}
```

## 5. Service выполняет бизнес-логику

`TaskService.create` не знает про HTTP. Он получает уже валидные данные и вызывает repository.

## 6. Repository пишет в SQLite через Prisma

`TaskRepository.create` вызывает Prisma:

```text
prisma.task.create(...)
```

Перед записью repository удаляет `undefined` поля. Это важно для строгого TypeScript и Prisma: поле либо отсутствует, либо имеет реальное значение/null.

## 7. Mapper готовит ответ

Mapper превращает Prisma model в API JSON:

- Date objects → strings;
- nullable dates → `null` или `YYYY-MM-DD`.

## 8. Клиент получает JSON

Клиент видит созданную задачу с `id`, timestamps и дефолтными значениями.

## Где тестировать вручную

Swagger UI:

```text
http://localhost:3000/docs
```

Там можно выбрать endpoint, нажать **Try it out**, вставить JSON и увидеть response.
