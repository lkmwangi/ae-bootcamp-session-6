---

description: "Task list template for feature implementation"
---

# Tasks: Support for Overdue Todo Items

**Input**: Design documents from `/workspaces/ae-bootcamp-session-6/specs/001-overdue-todos/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/overdue-utility.md](./contracts/overdue-utility.md), [quickstart.md](./quickstart.md)

**Tests**: Tests are explicitly required by the feature spec (FR-008, SC-004: "must include automated tests covering the overdue determination logic and its display"). All test tasks below are mandatory, not optional.

**Organization**: Tasks are grouped by user story (US1, US2, US3 from spec.md) to enable independent implementation and testing of each story. This is a frontend-only change confined to `packages/frontend`; `packages/backend` is untouched.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Web app monorepo: `packages/frontend/src/...` (this feature does not touch `packages/backend`)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the new module location; no new dependencies or scaffolding required (existing Jest/`@testing-library/react` tooling is reused).

- [ ] T001 Create the `packages/frontend/src/utils/` and `packages/frontend/src/utils/__tests__/` directories to host the new `todoUtils` module and its colocated tests

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement the single pure `isOverdue` function that every user story's tests and rendering depend on. Per [contracts/overdue-utility.md](./contracts/overdue-utility.md), the function must satisfy the full determination rule (due date presence, completed check, calendar-date comparison) in one implementation — it cannot be meaningfully split across stories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T002 Implement `isOverdue(todo, referenceDate = new Date())` pure function in `packages/frontend/src/utils/todoUtils.js` per [contracts/overdue-utility.md](./contracts/overdue-utility.md) and [data-model.md](./data-model.md): returns `false` when `todo.dueDate` is falsy (FR-002), `false` when `todo.completed` is truthy (FR-003), and otherwise compares calendar dates only (ignoring time-of-day) so the result is `true` only when `dueDate` is strictly earlier than `referenceDate`'s calendar date (FR-001, FR-006, FR-007)

**Checkpoint**: `isOverdue` exists and is importable — user story implementation can now begin

---

## Phase 3: User Story 1 - See which todos are overdue at a glance (Priority: P1) 🎯 MVP

**Goal**: Incomplete todos with a due date strictly before today show a visible "Overdue" text badge in the todo list; todos due today/future or without a due date show no badge.

**Independent Test**: Load a todo list containing a mix of todos with past, present, future, and no due dates (all incomplete) and verify only the past-due incomplete todos show the "Overdue" badge.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T003 [P] [US1] Unit tests in `packages/frontend/src/utils/__tests__/todoUtils.test.js` for `isOverdue`: incomplete + due date strictly before reference date → `true`; incomplete + due date equal to reference date → `false`; incomplete + due date after reference date → `false`; incomplete + no due date (`null`/`undefined`/`''`) → `false`
- [ ] T004 [P] [US1] Component tests in `packages/frontend/src/components/__tests__/TodoCard.test.js` asserting an "Overdue" text badge renders for an incomplete todo fixture with a past due date, and does NOT render for incomplete todo fixtures with a today/future due date or no due date

### Implementation for User Story 1

- [ ] T005 [US1] Add `.todo-badge` and `.todo-badge-overdue` styles to `packages/frontend/src/App.css` (near the existing `.todo-due-date` rule) using the existing `--danger-color` token per `docs/ui-guidelines.md`
- [ ] T006 [US1] In `packages/frontend/src/components/TodoCard.js`, import `isOverdue` from `../utils/todoUtils` and render `<span className="todo-badge todo-badge-overdue">Overdue</span>` next to the due date only when `isOverdue(todo)` is `true` (depends on T002, T005)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently — `npm test` passes for the new/changed tests and the badge shows/hides correctly for past/today/future/no-due-date todos

---

## Phase 4: User Story 2 - Completed todos are never shown as overdue (Priority: P2)

**Goal**: A todo with a past due date never shows the "Overdue" badge once marked complete, and the badge reappears immediately (no refresh) if the todo is marked incomplete again.

**Independent Test**: Mark a todo with a past due date as complete and verify its overdue indicator disappears immediately; mark it incomplete again and verify it reappears — independent of any other todos.

### Tests for User Story 2 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T007 [P] [US2] Unit test in `packages/frontend/src/utils/__tests__/todoUtils.test.js` for `isOverdue`: due date strictly before reference date + `completed` truthy → `false`
- [ ] T008 [P] [US2] Component tests in `packages/frontend/src/components/__tests__/TodoCard.test.js`: no "Overdue" badge renders for a completed todo fixture with a past due date; clicking the checkbox on an overdue todo (via `onToggle`) followed by re-rendering with `completed: 1` removes the badge; re-rendering again with `completed: 0` (same past due date) restores the badge

### Implementation for User Story 2

- [ ] T009 [US2] Verify (and adjust only if needed) that `TodoCard.js`'s badge rendering from T006 reads `isOverdue(todo)` directly from props on every render, so no extra state/effects are introduced — completion toggling already flows through `onToggle` → parent state update → re-render (depends on T002, T006)

**Checkpoint**: User Stories 1 AND 2 both work independently — completed todos never show the badge regardless of due date, and toggling completion updates the badge with no refresh

---

## Phase 5: User Story 3 - Overdue status updates as due dates are edited (Priority: P3)

**Goal**: Editing a todo's due date immediately updates whether the "Overdue" badge is shown, including when the due date is cleared entirely.

**Independent Test**: Edit an overdue todo's due date to a future date and verify the badge is removed; edit it back to a past date and verify the badge reappears — independent of other todos.

### Tests for User Story 3 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T010 [P] [US3] Component tests in `packages/frontend/src/components/__tests__/TodoCard.test.js`: re-rendering an overdue todo with its `dueDate` edited to today/future removes the badge; re-rendering a non-overdue todo with its `dueDate` edited to a past date (still incomplete) shows the badge; re-rendering with `dueDate` cleared to `null` removes the badge

### Implementation for User Story 3

- [ ] T011 [US3] Verify (and adjust only if needed) that `TodoCard.js`'s badge rendering from T006 re-evaluates `isOverdue(todo)` from the latest `dueDate` prop on every render, so due-date edits via `onEdit` → parent state update → re-render already reflect the new overdue status with no additional code (depends on T002, T006)

**Checkpoint**: All user stories (US1, US2, US3) work independently and together — the full quickstart.md manual validation steps pass

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across the whole feature

- [ ] T012 Run `npm test` from the repo root and confirm the full suite (frontend + backend) passes, including all new `todoUtils.test.js` and updated `TodoCard.test.js` tests (SC-004)
- [ ] T013 Manually walk through all 10 steps in [quickstart.md](./quickstart.md) "Manual end-to-end validation" against `npm run start` to confirm badge behavior matches every acceptance scenario

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - US1 (P1): Can start once Foundational is done — no dependency on other stories
  - US2 (P2): Can start once Foundational is done; T009 builds on the badge rendering introduced in T006 (US1), so implement US1 first for a clean sequence, though US2's tests can be written in parallel with US1
  - US3 (P3): Same relationship as US2 — depends on T006 (US1) existing, tests can be authored in parallel
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- US1 (P1): No dependencies on other stories — pure MVP
- US2 (P2): Relies on the badge markup added in US1 (T006) but adds no new markup of its own, only confirms/adjusts behavior
- US3 (P3): Same as US2 — relies on T006's markup, adds no new markup

### Within Each User Story

- Tests (marked `[P]`) should be written and failing before their corresponding implementation task
- T005 (styles) and the test tasks are parallelizable with each other; T006 depends on both T002 (foundational) and T005

### Parallel Opportunities

- T003 and T004 (US1 tests) can run in parallel — different files
- T005 (styles) can run in parallel with T003/T004 (tests) — different files
- T007 and T008 (US2 tests) can run in parallel with each other and with US3's T010, once Foundational (T002) is done
- All test-writing tasks across US1/US2/US3 (T003, T004, T007, T008, T010) touch only two files (`todoUtils.test.js`, `TodoCard.test.js`) — tasks in the same file must be applied sequentially even though they're conceptually independent; tasks in different files (`todoUtils.test.js` vs `TodoCard.test.js`) can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch T003 and T004 together (different files):
Task: "Unit tests for isOverdue in packages/frontend/src/utils/__tests__/todoUtils.test.js"
Task: "Component tests for Overdue badge in packages/frontend/src/components/__tests__/TodoCard.test.js"

# T005 can run alongside the above (different file, no shared code):
Task: "Add .todo-badge/.todo-badge-overdue styles in packages/frontend/src/App.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (`isOverdue` implementation) — CRITICAL, blocks all stories
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Run `npm test`, confirm badge shows/hides correctly for past/today/future/no-due-date todos
5. Deploy/demo if ready — this alone satisfies the core value proposition (SC-001, SC-002)

### Incremental Delivery

1. Setup + Foundational → US1 → Test independently → Deploy/Demo (MVP!)
2. Add US2 → Test independently (completed todos never overdue) → Deploy/Demo
3. Add US3 → Test independently (edits update overdue status) → Deploy/Demo
4. Each story adds test coverage and confidence without requiring changes to prior stories' code

### Notes

- Because `isOverdue` is computed at render time from existing props, US2 and US3 require **no new production code beyond T006** — their tasks are primarily test coverage that proves the existing derived-state approach already satisfies FR-005/SC-003. This matches the plan's Scope Discipline (Constitution Principle IV) and the research.md decision to avoid extra state/effects.
- `packages/backend` requires no changes for this feature — do not add tasks there.
