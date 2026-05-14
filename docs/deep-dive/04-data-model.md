# 04. Модель данных

Данные описаны в `prisma/schema.prisma`. Хранилище — SQLite.

## Task

Task — действие, которое можно выполнить.

Главные поля:

- `status` — жизненный цикл задачи;
- `type` — категория;
- `priority` — важность от 1 до 5;
- `deadline` — дедлайн;
- `plannedDate` — запланирована на день;
- `energyRequired` — сколько энергии требует;
- `healthRule` — можно ли делать при болезни.

Task участвует в Today dashboard в трёх секциях:

- `deadlineTasks`;
- `plannedTasks`;
- `suggestedTasks`.

Неактивные статусы:

```text
done, skipped, archived
```

Они не попадают в активную Today-логику.

## Event

Event — календарное событие на конкретную дату.

Ключевые поля:

- `date`;
- `startTime`;
- `endTime`;
- `status`;
- `importance`.

Если `importance = mandatory`, событие попадает в `mandatoryEvents`.

Если `status = planned`, событие попадает в `plannedEvents`.

## ScheduleBlock

ScheduleBlock — повторяющийся блок недели.

Ключевые поля:

- `dayOfWeek` от 1 до 7;
- `startTime`;
- `endTime`;
- `type`;
- `status`.

Только `status = active` и совпадающий `dayOfWeek` попадают в `/schedule/today` и Today dashboard.

## DayState

DayState хранит состояние конкретного дня.

Поля:

- `date` — unique;
- `health`;
- `energy`;
- `mood`;
- `notes`.

Если записи на сегодня нет, backend создаёт её автоматически:

```json
{
  "health": "healthy",
  "energy": "medium"
}
```

## Почему enum хранится строками

В Prisma schema поля enum сейчас описаны как `String`, а допустимые значения проверяются Zod schemas. Это делает раннюю разработку проще: можно менять enum-наборы без сложных DB migrations. Когда модель стабилизируется, строки можно заменить на Prisma enum.

## Почему soft delete

Tasks и schedule blocks не удаляются физически. Они переводятся в `archived`. Events переводятся в `cancelled`. Это сохраняет историю и позволит позже строить аналитику.
