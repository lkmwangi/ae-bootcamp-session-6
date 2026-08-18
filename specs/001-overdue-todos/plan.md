# Implementation Plan: Support for Overdue Todo Items

**Branch**: `001-overdue-todos` | **Date**: 2026-08-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-overdue-todos/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Incomplete todos whose due date is earlier than today must show a red "Overdue" text badge in the todo list, computed on the fly from the existing `dueDate` and `completed` fields (no new persisted state, no API changes). The determination is a pure, calendar-date-only comparison re-evaluated on every render, so it reflects create/edit/toggle actions immediately without a page refresh. Implementation is frontend-only: a small pure utility function (`isOverdue`) consumed by `TodoCard`, both covered by Jest/`@testing-library/react` unit tests using a fixed/mocked "today".

## Technical Context

**Language/Version**: JavaScript (ES2020+), React 18 (frontend), Node.js/Express (backend, unaffected by this feature)

**Primary Dependencies**: React, `@testing-library/react`, Jest (already in `packages/frontend`)

**Storage**: N/A — no schema or persisted-field changes; overdue status is derived, not stored

**Testing**: Jest unit tests for the `isOverdue` utility (`packages/frontend/src/utils/__tests__/`) and `@testing-library/react` component tests for the badge rendering (`packages/frontend/src/components/__tests__/TodoCard.test.js`), following existing repo patterns

**Target Platform**: Web (browser), served by the existing React frontend

**Project Type**: Web application (existing `packages/frontend` + `packages/backend` monorepo) — this feature only touches `packages/frontend`

**Performance Goals**: Negligible overhead; `isOverdue` is an O(1) date comparison run per todo per render, well within the existing render budget

**Constraints**: Must use calendar-date-only comparison (no time-of-day); must not introduce new persisted fields, API endpoints, or sort/filter behavior; must reuse existing danger color token and card layout per `docs/ui-guidelines.md`

**Scale/Scope**: Single component (`TodoCard`) plus one new pure utility module; no changes to `packages/backend`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Status |
|-----------|-------|--------|
| I. Code Quality & Consistency | New logic lives in a pure utility (`isOverdue`) per SRP (utilities stay pure, components render); follows existing `camelCase`/2-space style; comments limited to "why" | PASS |
| II. Test-First Development & Coverage | New `isOverdue` utility gets colocated unit tests; `TodoCard` badge rendering gets colocated component tests; both required by FR-008/SC-004 | PASS |
| III. User Experience Consistency | Badge reuses existing `--danger-color` token and todo-card layout from `docs/ui-guidelines.md`; text label ("Overdue") avoids color-only signaling, keeping WCAG AA text contrast | PASS |
| IV. Scope Discipline & Simplicity | No new persisted fields, no new views, no filtering/sorting changes; strictly the badge + derived state described in the spec | PASS |
| V. Monorepo & Workspace Architecture | Change is confined to `packages/frontend`; no backend/API coupling introduced | PASS |

No violations; Complexity Tracking table is not needed.

**Post-Phase 1 re-check**: The Phase 1 design (research.md, data-model.md, contracts/, quickstart.md) confirms
no new persisted fields, no new endpoints, and no deviation from `docs/ui-guidelines.md`/`docs/coding-guidelines.md`.
All gates above remain **PASS** after design.

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todos/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
packages/frontend/
├── src/
│   ├── utils/
│   │   ├── todoUtils.js         # NEW: isOverdue(todo, referenceDate) pure function
│   │   └── __tests__/
│   │       └── todoUtils.test.js # NEW: overdue-determination unit tests
│   ├── components/
│   │   ├── TodoCard.js           # MODIFIED: renders "Overdue" badge using isOverdue
│   │   └── __tests__/
│   │       └── TodoCard.test.js  # MODIFIED: adds badge rendering tests
│   └── styles/
│       └── theme.css             # Reused: existing --danger-color token (no changes expected)

packages/backend/                 # UNCHANGED — no API or schema changes required
```

**Structure Decision**: Web application monorepo (existing `packages/frontend` + `packages/backend`). This
feature is additive and frontend-only: a new `packages/frontend/src/utils/todoUtils.js` pure function plus
a small `TodoCard.js` rendering change. `packages/backend` is untouched because overdue status is derived
client-side from the existing `dueDate`/`completed` fields already returned by the API.

## Complexity Tracking

> Not applicable — Constitution Check reported no violations.
