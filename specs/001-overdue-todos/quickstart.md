# Quickstart: Validate Support for Overdue Todo Items

Use this guide to manually and automatically verify the overdue indicator once implemented, per
[spec.md](./spec.md), [data-model.md](./data-model.md), and [contracts/overdue-utility.md](./contracts/overdue-utility.md).

## Prerequisites

- Dependencies installed at the repo root: `npm run install:all`
- No environment variables or seed data required — the backend's existing SQLite store is sufficient

## Automated validation

```bash
# From repo root
npm test
```

Expected: the full suite (frontend + backend) passes, including the new tests:

```bash
# Just the new/changed frontend tests
npm run test --workspace=frontend -- todoUtils
npm run test --workspace=frontend -- TodoCard
```

Expected assertions covered (see [contracts/overdue-utility.md](./contracts/overdue-utility.md) for the full list):

- `isOverdue` returns `true` only for incomplete todos with a due date strictly before "today".
- `TodoCard` renders an "Overdue" badge if and only if `isOverdue(todo)` is `true`.

## Manual end-to-end validation

1. Start the app: `npm run start` (frontend on its dev port, backend on its API port).
2. Create a todo with a due date set to yesterday. **Expected**: the todo shows a red "Overdue" badge.
3. Create a todo with a due date set to today. **Expected**: no "Overdue" badge.
4. Create a todo with a due date set to tomorrow. **Expected**: no "Overdue" badge.
5. Create a todo with no due date. **Expected**: no "Overdue" badge.
6. Mark the overdue todo from step 2 as complete. **Expected**: the badge disappears immediately, no refresh.
7. Mark it incomplete again. **Expected**: the badge reappears immediately.
8. Edit the overdue todo's due date to tomorrow. **Expected**: the badge disappears immediately.
9. Edit it back to yesterday. **Expected**: the badge reappears immediately.
10. Edit an overdue todo and clear its due date. **Expected**: the badge disappears immediately.

## Success criteria mapping

| Step(s) | Spec reference |
|---------|-----------------|
| 2–5 | US1, FR-001–FR-004, FR-006, FR-007 |
| 6–7 | US2, FR-003, FR-005 |
| 8–10 | US3, FR-005 |
| `npm test` passing | SC-004, FR-008 |
