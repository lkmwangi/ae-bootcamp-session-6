<!--
Sync Impact Report
==================
Version change: [TEMPLATE] → 1.0.0 (initial ratification)
Modified principles: N/A (first concrete adoption; template placeholders replaced)
Added sections:
  - Core Principles I-V (Code Quality & Consistency, Test-First Development &
    Coverage, User Experience Consistency, Scope Discipline & Simplicity,
    Monorepo & Workspace Architecture)
  - Technology Stack Requirements
  - Development Workflow & Quality Gates
  - Governance
Removed sections: none (all template placeholders resolved)
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ no changes required (Constitution
    Check section is generic, gates derived from this file at runtime)
  - .specify/templates/spec-template.md ✅ no changes required
  - .specify/templates/tasks-template.md ✅ no changes required
Follow-up TODOs: none
-->

# Todo App Constitution

## Core Principles

### I. Code Quality & Consistency
All code MUST follow the conventions in [docs/coding-guidelines.md](../../docs/coding-guidelines.md):
2-space indentation, `camelCase` for variables/functions, `PascalCase` for
components and classes, `UPPER_SNAKE_CASE` for constants. Modules MUST follow
Single Responsibility: components render, services fetch/persist data, and
utilities stay pure. DRY MUST be applied by extracting shared logic into
utilities or reusable components; KISS MUST be applied by preferring the
simplest solution that satisfies the requirement. Comments MUST explain "why",
never restate "what" the code already shows. ESLint MUST run clean (no
unresolved errors) before a change is considered complete.
Rationale: Consistent structure and naming keep a small, multi-package
codebase navigable and reduce onboarding and review friction.

### II. Test-First Development & Coverage (NON-NEGOTIABLE)
Every new behavior MUST have unit and/or integration tests colocated in a
`__tests__/` directory next to the code it covers, per
[docs/testing-guidelines.md](../../docs/testing-guidelines.md). Tests MUST
verify observable behavior, not implementation details, and MUST be
independent (no shared mutable state, no ordering dependencies). The project
MUST maintain 80%+ coverage across packages, with critical user workflows
(create, view, complete, delete, edit a todo) covered by integration tests.
`npm test` MUST pass for all workspaces before a change is merged.
Rationale: A small team relying on Copilot-assisted changes needs a reliable
safety net; tests are the primary defense against regressions introduced by
fast iteration.

### III. User Experience Consistency
All UI changes MUST conform to
[docs/ui-guidelines.md](../../docs/ui-guidelines.md): the defined color
palette and typography scale for light/dark mode, the 8px spacing grid, and
existing component patterns (todo card layout, confirmation dialog before
delete, Material-inspired elevation and 4-8px border radius). Interactive
elements MUST remain keyboard accessible, meet WCAG AA contrast, and expose
descriptive labels/`aria-label`s on icon-only controls. Destructive actions
(delete) MUST require explicit confirmation before taking effect.
Rationale: A consistent, accessible interface is part of the product's
functional contract, not a cosmetic afterthought.

### IV. Scope Discipline & Simplicity
Features MUST stay within the boundaries defined in
[docs/functional-requirements.md](../../docs/functional-requirements.md): a
single-user todo app supporting create, view, complete/incomplete, edit, and
delete with confirmation. Authentication, multi-user support, categories/tags,
priorities, recurring todos, reminders, undo/redo, bulk operations, and
advanced search/filtering are explicitly out of scope and MUST NOT be added
without first amending the functional requirements. When a requirement is
ambiguous, the simplest interpretation consistent with existing scope MUST be
chosen.
Rationale: Bounded scope keeps the bootcamp reference app easy to reason about
and prevents scope creep that would obscure the patterns being taught.

### V. Monorepo & Workspace Architecture
The project MUST remain organized as an npm-workspaces monorepo with a clear
separation between `packages/frontend` (React) and `packages/backend`
(Express.js), per [docs/project-overview.md](../../docs/project-overview.md).
Cross-package coupling MUST go through the backend's HTTP API, not direct
imports between frontend and backend source. Root-level scripts (`npm run
start`, `npm test`) MUST continue to operate across both packages without
requiring package-specific setup.
Rationale: Preserving the workspace boundary keeps frontend and backend
independently testable and deployable, matching the documented architecture.

## Technology Stack Requirements

- Frontend: React with React DOM, styled with plain CSS following the design
  tokens in [docs/ui-guidelines.md](../../docs/ui-guidelines.md).
- Backend: Node.js with Express.js exposing a REST API consumed by the
  frontend.
- Testing: Jest for both packages; `@testing-library/react` for frontend
  component and integration tests.
- Package management: npm workspaces at the repository root; new
  dependencies MUST be added to the appropriate package's `package.json`,
  not the root, unless the tool is shared tooling for the whole monorepo.

## Development Workflow & Quality Gates

- Work MUST happen on feature branches (e.g. `feature/<short-description>`);
  direct commits to `main` are discouraged.
- Commit messages MUST describe the "why" behind the change, following the
  format shown in [docs/coding-guidelines.md](../../docs/coding-guidelines.md).
- Before opening a pull request: linting MUST be clean, all tests MUST pass
  (`npm test`), and new/changed behavior MUST have corresponding tests.
- Pull requests MUST be reviewed before merging; reviewers MUST verify
  compliance with the Core Principles above.

## Governance

This constitution supersedes ad-hoc conventions when they conflict. Amendments
are made by editing this file and MUST include an updated Sync Impact Report,
a version bump, and, when principles change meaning, a review of the
`.specify/templates/` files for consistency.

Versioning follows semantic versioning for governance documents:
- MAJOR: Backward-incompatible removal or redefinition of a principle.
- MINOR: A new principle or materially expanded section is added.
- PATCH: Clarifications, wording fixes, or non-semantic refinements.

All pull requests and Spec Kit workflow outputs (specs, plans, tasks) MUST be
checked against these principles; unjustified deviations MUST be corrected or
explicitly documented as an accepted exception in the relevant plan's
Complexity Tracking section. The docs in `docs/` remain the detailed reference
for day-to-day guidance; this constitution states the non-negotiable rules
derived from them.

**Version**: 1.0.0 | **Ratified**: 2026-08-18 | **Last Amended**: 2026-08-18
