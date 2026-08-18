/**
 * Determines whether a todo is overdue: incomplete, has a due date, and that
 * due date's calendar date is strictly earlier than the reference date's calendar date.
 * @param {{ dueDate: string|null, completed: 0|1|boolean }} todo
 * @param {Date} [referenceDate] - defaults to now; only the calendar date is used
 * @returns {boolean}
 */
function isOverdue(todo, referenceDate = new Date()) {
  if (!todo.dueDate) {
    return false;
  }

  if (todo.completed) {
    return false;
  }

  const dueDate = new Date(todo.dueDate);
  const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  const referenceDateOnly = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate()
  );

  return dueDateOnly.getTime() < referenceDateOnly.getTime();
}

export { isOverdue };
