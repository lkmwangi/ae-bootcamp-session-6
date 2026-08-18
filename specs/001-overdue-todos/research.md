# Phase 0 Research: Support for Overdue Todo Items

All items from the spec's Clarifications session were already resolved before planning (badge form and color
were settled on 2026-08-18). No `NEEDS CLARIFICATION` markers remain in the Technical Context. This document
records the implementation-level decisions needed to move from spec to design.

## Decision: Where overdue determination lives

- **Decision**: Implement a single pure function `isOverdue(todo, referenceDate = new Date())` in a new
  `packages/frontend/src/utils/todoUtils.js` module, imported by `TodoCard`.
- **Rationale**: Constitution Principle I requires utilities to stay pure and components to only render.
  A pure function is trivially unit-testable (FR-008/SC-004) independent of React rendering, and reusable
  if another view ever needs the same check.
- **Alternatives considered**:
  - Inline date comparison inside `TodoCard.js` — rejected because it mixes business logic with rendering
    and would need to be duplicated if any other component required it.
  - Computing overdue status server-side in `packages/backend/src/services/todoService.js` — rejected
    because it would require either persisting a derived field (contradicts spec's "no new stored fields")
    or adding request-time server logic for a purely presentational, single-user, client-clock concern
    (the spec's Assumptions state "today" is the device's client-side date).

## Decision: Calendar-date-only comparison

- **Decision**: Normalize both the todo's `dueDate` and the reference date to `YYYY-MM-DD` (or equivalent
  local-date components) before comparing, ignoring time-of-day, so a todo is overdue only when
  `dueDate < today` (strictly earlier, not equal).
- **Rationale**: FR-006/FR-007 and the Edge Cases section require date-only comparison and treat "due today"
  as not overdue. Comparing full `Date` objects (with time components) would incorrectly flag same-day due
  dates as overdue depending on time of day.
- **Alternatives considered**: Comparing `Date` timestamps directly — rejected due to time-of-day sensitivity
  described above.

## Decision: Re-evaluation trigger (no refresh required)

- **Decision**: No explicit event/subscription mechanism is needed. Because `isOverdue` is computed inline
  during each `TodoCard` render from `todo.dueDate`/`todo.completed` props, any state update that already
  re-renders the todo list (create, edit, toggle) automatically re-evaluates overdue status.
- **Rationale**: The app already re-renders `TodoList`/`TodoCard` after these mutations (existing
  `onToggle`/`onEdit` flow in `App.js`). Deriving the value at render time satisfies FR-005/SC-003 with no
  additional state, caching, or effects — the simplest solution per Constitution Principle IV (KISS).
- **Alternatives considered**: Storing an `overdue` flag in component state and updating it via `useEffect`
  — rejected as unnecessary complexity for a value fully derived from existing props on every render.

## Decision: Badge presentation

- **Decision**: Render a `<span className="todo-badge todo-badge-overdue">Overdue</span>` next to/near the
  due date in `TodoCard`, styled with the existing `--danger-color` token; only rendered when `isOverdue(todo)`
  is true.
- **Rationale**: Matches the clarified answer (text badge/label in existing danger color) and reuses the
  design token already defined in `packages/frontend/src/styles/theme.css`, satisfying Constitution
  Principle III (UX consistency, no color-only signaling since it's a text label).
- **Alternatives considered**: Re-coloring the whole card or due-date text red only — rejected by the
  clarification answer, which specified a distinct text badge rather than a color-only change.

## Decision: Testing approach for date-dependent logic

- **Decision**: Unit tests for `isOverdue` pass an explicit `referenceDate` argument (no system clock
  mocking needed for the pure function). Component tests for `TodoCard` construct todo fixtures with
  due dates computed relative to `new Date()` at test-run time (e.g., yesterday/today/tomorrow offsets)
  to avoid hard-coded dates going stale.
- **Rationale**: Keeps tests deterministic and independent (Principle II / testing-guidelines.md "Test
  Isolation") without needing global timer mocks, consistent with the simplest approach that satisfies
  the requirement.
- **Alternatives considered**: `jest.useFakeTimers().setSystemTime(...)` — viable but unnecessary extra
  setup given `isOverdue` accepts an injectable reference date.

**Output**: All unknowns resolved; no `NEEDS CLARIFICATION` markers remain.
