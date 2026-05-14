# 06. Today Dashboard Algorithm

`GET /today` is the main product endpoint. It combines stored data and current day context into one dashboard.

## Input data

The algorithm loads:

- today's date;
- current weekday;
- today's DayState;
- events on today's date;
- active schedule blocks for the weekday;
- all tasks.

If today's DayState does not exist, it is created automatically.

## Output sections

### `mandatoryEvents`

Events where:

```text
date = today
AND importance = mandatory
```

### `plannedEvents`

Events where:

```text
date = today
AND status = planned
```

### `scheduleBlocks`

Schedule blocks where:

```text
status = active
AND dayOfWeek = current weekday
```

### `deadlineTasks`

Active tasks where:

```text
deadline <= today
```

Active means status is not:

```text
done, skipped, archived
```

### `plannedTasks`

Active tasks where:

```text
plannedDate = today
```

### `suggestedTasks`

Suggested tasks are active tasks that are not already shown in `deadlineTasks` or `plannedTasks`, then filtered by health and energy, sorted, and limited.

## Step 1. Filter active tasks

Remove tasks with these statuses:

```text
done, skipped, archived
```

## Step 2. Build deadline and planned task lists

Deadline tasks are selected before suggestions. Planned tasks are selected before suggestions too.

This matters because a task should not appear in multiple dashboard sections.

## Step 3. Remove duplicates from suggestions

Any task already shown in `deadlineTasks` or `plannedTasks` is removed from `suggestedTasks` candidates.

## Step 4. Health filtering

If `health = sick`, remove tasks with:

```text
skip_if_sick, only_if_healthy
```

If `health = slightly_sick`, remove tasks with:

```text
only_if_healthy
```

If `health = healthy`, do not remove tasks by health rule.

## Step 5. Energy filtering

If `energy = low`, keep only:

```text
energyRequired = low
```

If `energy = medium`, keep:

```text
low, medium
```

If `energy = high`, keep all energy levels.

## Step 6. Sorting

Sort by:

1. `priority DESC`;
2. nearest deadline first;
3. energy compatibility.

Priority is first because an important task should not be hidden just because another task has a slightly better energy fit.

## Step 7. Limit

Return at most 10 `suggestedTasks`.

## Example

Assume today is `2026-05-14`, health is `slightly_sick`, and energy is `medium`.

- A high-priority overdue task goes to `deadlineTasks`.
- A task planned for today goes to `plannedTasks`.
- A task with `healthRule = only_if_healthy` is excluded from suggestions.
- A high-energy task is excluded from suggestions because energy is only medium.
- The remaining suggested tasks are sorted and capped at 10.

## Why the code is split into small functions

Today rules are likely to change. The code is intentionally split into functions like:

- `filterActiveTasks`;
- `filterTasksByHealth`;
- `filterTasksByEnergy`;
- `getDeadlineTasks`;
- `getPlannedTasks`;
- `removeDuplicateTasks`;
- `sortTasksByPriorityDeadlineEnergy`;
- `limitSuggestedTasks`;
- `buildTodayDashboard`.

This makes each rule easy to test and easy to replace.
