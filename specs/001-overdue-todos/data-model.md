# Phase 1 Data Model: Support for Overdue Todo Items

No new persisted entities or fields are introduced. This feature adds a **derived, non-persisted** value
computed from the existing `Todo` entity.

## Todo (existing entity, unchanged shape)

| Field | Type | Notes |
|-------|------|-------|
| `id` | number | Existing, unchanged |
| `title` | string | Existing, unchanged |
| `dueDate` | string (`YYYY-MM-DD`) \| `null` | Existing, unchanged. Optional calendar date, no time component |
| `completed` | 0 \| 1 (boolean-like) | Existing, unchanged |
| `createdAt` | string (ISO datetime) | Existing, unchanged |

## Derived value: `overdue` (not persisted)

| Property | Value |
|----------|-------|
| Type | `boolean` |
| Computed by | `isOverdue(todo, referenceDate = new Date())` in `packages/frontend/src/utils/todoUtils.js` |
| Inputs | `todo.dueDate`, `todo.completed`, `referenceDate` (defaults to current client date) |
| Storage | None — computed at render time, never written to the database or API |

### Determination rule

`overdue === true` when **all** of the following hold (FR-001–FR-003, FR-006, FR-007):

1. `todo.dueDate` is present (not `null`/empty) — FR-002
2. `todo.completed` is falsy (`0`) — FR-003
3. The calendar date of `todo.dueDate` is strictly earlier than the calendar date of `referenceDate` — FR-001, FR-006, FR-007
   (comparison ignores time-of-day; a due date equal to today is **not** overdue)

Otherwise `overdue === false`.

### State transitions (all re-derived on next render, no explicit transition logic needed)

| Event | Effect on `overdue` |
|-------|----------------------|
| Todo created with a past due date, incomplete | `true` |
| Todo marked complete | `false` (rule 2 fails), regardless of due date — US2 |
| Completed todo marked incomplete again, due date still past | `true` again — US2 AS3 |
| Due date edited from future/none → past (still incomplete) | `true` — US3 AS2 |
| Due date edited from past → today/future | `false` — US3 AS1 |
| Due date cleared via edit | `false` (rule 1 fails) — US3 AS3 |

### Validation rules

None beyond existing `Todo` validation (title required, ≤255 chars, `dueDate` optional calendar date) —
this feature adds no new input fields or validation.
