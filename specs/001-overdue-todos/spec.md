# Feature Specification: Support for Overdue Todo Items

**Feature Branch**: `001-overdue-todos`

**Created**: 2026-08-18

**Status**: Draft

**Input**: User description: "Support for Overdue Todo Items - As a todo application user, I want to easily identify and distinguish overdue tasks in my todo list, so that I can prioritize my work and quickly see which tasks are past their due date. Users need a clear, visual way to identify which todos have not been completed by their due date. This feature must include automated tests covering the overdue determination logic and its display, following the existing Jest patterns in the repository."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See which todos are overdue at a glance (Priority: P1)

As a user viewing my todo list, I want incomplete todos whose due date has passed to be visually distinguished from other todos, so I can immediately tell which tasks need my attention without comparing dates myself.

**Why this priority**: This is the core value of the feature - without a visible distinction, users get no benefit at all. Every other behavior (edge cases, edits, completion) builds on this basic capability.

**Independent Test**: Can be fully tested by loading a todo list containing a mix of todos with past, present, and future due dates (and some with no due date), and verifying that only the incomplete todos with a past due date show the overdue indicator.

**Acceptance Scenarios**:

1. **Given** a todo with a due date earlier than today and status incomplete, **When** the todo list is displayed, **Then** that todo shows a clearly visible overdue indicator.
2. **Given** a todo with a due date of today or in the future, **When** the todo list is displayed, **Then** that todo does not show an overdue indicator.
3. **Given** a todo with no due date set, **When** the todo list is displayed, **Then** that todo does not show an overdue indicator.

---

### User Story 2 - Completed todos are never shown as overdue (Priority: P2)

As a user, I want a todo I already completed to never be flagged as overdue, even if I finished it after its due date, so my list reflects what still needs action rather than past history.

**Why this priority**: Without this rule the indicator would lose meaning - a list full of "overdue" but already-finished tasks would be noisy and would undermine trust in the indicator introduced by User Story 1.

**Independent Test**: Can be fully tested by marking a todo with a past due date as complete and verifying its overdue indicator disappears immediately, independent of any other todos.

**Acceptance Scenarios**:

1. **Given** a todo with a due date earlier than today and status complete, **When** the todo list is displayed, **Then** that todo does not show an overdue indicator.
2. **Given** a todo currently shown as overdue, **When** the user marks it complete, **Then** the overdue indicator is removed immediately without a page refresh.
3. **Given** a completed todo that is marked incomplete again and its due date is still in the past, **When** the todo list is displayed, **Then** the overdue indicator reappears.

---

### User Story 3 - Overdue status updates as due dates are edited (Priority: P3)

As a user, I want the overdue indicator to reflect the current due date whenever I edit a todo, so the list stays accurate after I reschedule a task.

**Why this priority**: Editing due dates is a supporting workflow already in the app; keeping the indicator correct after edits closes the loop but the feature already delivers value via Stories 1-2 without it being the first thing built.

**Independent Test**: Can be fully tested by editing an overdue todo's due date to a future date and verifying the indicator is removed, then editing it back to a past date and verifying the indicator reappears, independent of other todos.

**Acceptance Scenarios**:

1. **Given** a todo currently shown as overdue, **When** the user edits its due date to today or a future date, **Then** the overdue indicator is removed.
2. **Given** a todo that is not overdue, **When** the user edits its due date to a date earlier than today and the todo remains incomplete, **Then** the overdue indicator appears.
3. **Given** a todo with a due date, **When** the user clears the due date via edit, **Then** the overdue indicator is removed.

---

### Edge Cases

- A todo due exactly "today" is treated as not yet overdue (it becomes overdue starting the following day).
- A todo with no due date is never treated as overdue.
- Determination of "past due" is based on the calendar date only; due dates carry no time component, so overdue status does not change within a given day.
- If the list contains no overdue todos, the list displays normally with no overdue indicators and no error state.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST determine a todo to be overdue when its due date is earlier than the current date AND its status is incomplete.
- **FR-002**: System MUST NOT mark a todo as overdue if it has no due date set.
- **FR-003**: System MUST NOT mark a todo as overdue if its status is complete, regardless of its due date.
- **FR-004**: System MUST display a clearly visible, distinct visual indicator on each todo determined to be overdue in the todo list view.
- **FR-005**: System MUST re-evaluate a todo's overdue status whenever its due date or completion status changes (create, edit, toggle complete/incomplete), without requiring a page refresh.
- **FR-006**: System MUST treat a todo due on the current date as not overdue; a todo becomes overdue starting the day after its due date.
- **FR-007**: System MUST determine overdue status using calendar dates only (no time-of-day comparison), consistent with due dates having no time component.
- **FR-008**: The overdue indicator MUST be covered by automated tests that verify both the overdue-determination logic (which todos are/aren't overdue) and that the indicator renders correctly for overdue and non-overdue todos.

### Key Entities

- **Todo**: An existing entity representing a single task, with a title, an optional due date, and a completion status. This feature adds a derived, non-persisted "overdue" state computed from the existing due date and completion status - no new stored fields are introduced.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can identify all overdue todos in their list within 3 seconds of the list rendering, without checking any date manually.
- **SC-002**: 100% of incomplete todos with a due date earlier than today display the overdue indicator; 0% of completed todos or todos without a due date display it.
- **SC-003**: The overdue indicator updates to reflect a change (completion toggle or due date edit) without the user needing to refresh the page.
- **SC-004**: The overdue-determination logic and its display are covered by automated tests, and the full existing test suite continues to pass.

## Assumptions

- "Today" is determined by the date on the device displaying the todo list (client-side date), consistent with this being a single-user, non-collaborative application.
- The overdue indicator is a visual treatment only (e.g., color, label, or icon) applied within the existing todo list/card layout; it does not change sort order, filtering, or introduce a separate overdue view.
- Due dates continue to be stored and compared as calendar dates without a time component, matching current data model behavior.
- No new persisted data is required; overdue status is computed on the fly from existing `dueDate` and `completed` fields.
