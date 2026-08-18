# Contract: `isOverdue` Utility & Overdue Badge Rendering

This feature exposes no new HTTP/API endpoints (see [research.md](./research.md)). Its only "interface" is a
pure function contract consumed internally by the UI, and the resulting rendering contract for `TodoCard`.
Documented here in lieu of an API contract, per the plan's guidance to document the appropriate contract
format for the project type.

## Function contract: `isOverdue`

**Module**: `packages/frontend/src/utils/todoUtils.js`

```text
isOverdue(todo: { dueDate: string|null, completed: 0|1|boolean }, referenceDate?: Date) => boolean
```

| Aspect | Contract |
|--------|----------|
| Purity | Pure function — no side effects, no I/O, deterministic for given inputs |
| `todo.dueDate` | `null`/`undefined`/`''` → returns `false` (never overdue without a due date) |
| `todo.completed` | Truthy (`1`/`true`) → returns `false` regardless of `dueDate` |
| `referenceDate` | Optional; defaults to `new Date()` (client "today"). Only the calendar date component is used |
| Comparison | Calendar-date-only: `false` when `dueDate`'s date >= `referenceDate`'s date; `true` only when strictly earlier |
| Return type | `boolean` — never throws for well-formed `todo` objects |

## Rendering contract: `TodoCard`

| Condition | Rendered output |
|-----------|------------------|
| `isOverdue(todo)` is `true` | Card includes an element with text content `Overdue`, styled with the existing danger color token, in addition to existing title/due-date/actions markup |
| `isOverdue(todo)` is `false` | No "Overdue" text/element is rendered anywhere in the card |
| Any todo state change (toggle complete, edit due date) that flips `isOverdue` | Badge appears/disappears on next render with no page reload required |

## Test obligations (FR-008 / SC-004)

- Unit tests for `isOverdue` covering: past+incomplete → true; today/future+incomplete → false;
  no due date → false; past+complete → false (colocated in
  `packages/frontend/src/utils/__tests__/todoUtils.test.js`).
- Component tests for `TodoCard` covering: badge present for an overdue todo fixture; badge absent for
  non-overdue, completed, and no-due-date fixtures (colocated in
  `packages/frontend/src/components/__tests__/TodoCard.test.js`).
