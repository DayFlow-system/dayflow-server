# 06. Алгоритм Today dashboard

`GET /today` — главная бизнес-функция проекта.

## Входные данные

Алгоритм берёт:

- сегодняшнюю дату;
- текущий день недели;
- day state на сегодня;
- events на сегодня;
- active schedule blocks на текущий weekday;
- все tasks.

Если DayState на сегодня отсутствует, он создаётся автоматически.

## Секции результата

### `mandatoryEvents`

События на сегодня, где:

```text
importance = mandatory
```

### `plannedEvents`

События на сегодня, где:

```text
status = planned
```

### `scheduleBlocks`

Блоки расписания, где:

```text
status = active
AND dayOfWeek = current weekday
```

### `deadlineTasks`

Активные задачи, где:

```text
deadline <= today
```

Активные значит status не входит в:

```text
done, skipped, archived
```

### `plannedTasks`

Активные задачи, где:

```text
plannedDate = today
```

### `suggestedTasks`

Кандидаты в suggestions проходят несколько этапов.

## Этап 1. Убрать неактивные задачи

Исключаются:

```text
done, skipped, archived
```

## Этап 2. Убрать дубликаты

Если задача уже есть в `deadlineTasks` или `plannedTasks`, она не должна повторяться в `suggestedTasks`.

## Этап 3. Health filtering

Если `health = sick`, исключаются:

```text
skip_if_sick, only_if_healthy
```

Если `health = slightly_sick`, исключаются:

```text
only_if_healthy
```

Если `health = healthy`, задачи не фильтруются по healthRule.

## Этап 4. Energy filtering

Если `energy = low`, suggested tasks включают только:

```text
energyRequired = low
```

Если `energy = medium`, suggested tasks включают:

```text
low, medium
```

Если `energy = high`, подходят все уровни.

## Этап 5. Sorting

Сортировка:

1. `priority DESC`;
2. ближайший `deadline` выше;
3. лучшая совместимость энергии выше.

## Этап 6. Limit

В `suggestedTasks` возвращается максимум 10 задач.

## Почему алгоритм разбит на функции

Правила Today будут часто меняться. Поэтому код разделён на маленькие функции:

- `filterActiveTasks`;
- `filterTasksByHealth`;
- `filterTasksByEnergy`;
- `getDeadlineTasks`;
- `getPlannedTasks`;
- `removeDuplicateTasks`;
- `sortTasksByPriorityDeadlineEnergy`;
- `limitSuggestedTasks`;
- `buildTodayDashboard`.

Так проще тестировать и безопаснее менять поведение.
