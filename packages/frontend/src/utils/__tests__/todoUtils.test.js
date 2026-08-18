import { isOverdue } from '../todoUtils';

describe('isOverdue', () => {
  const referenceDate = new Date('2025-06-15T12:00:00');

  it('returns true when incomplete and due date is strictly before the reference date', () => {
    const todo = { dueDate: '2025-06-14', completed: 0 };
    expect(isOverdue(todo, referenceDate)).toBe(true);
  });

  it('returns false when incomplete and due date equals the reference date', () => {
    const todo = { dueDate: '2025-06-15', completed: 0 };
    expect(isOverdue(todo, referenceDate)).toBe(false);
  });

  it('returns false when incomplete and due date is after the reference date', () => {
    const todo = { dueDate: '2025-06-16', completed: 0 };
    expect(isOverdue(todo, referenceDate)).toBe(false);
  });

  it.each([null, undefined, ''])(
    'returns false when incomplete and due date is %p',
    (dueDate) => {
      const todo = { dueDate, completed: 0 };
      expect(isOverdue(todo, referenceDate)).toBe(false);
    }
  );

  it('returns false when due date is strictly before the reference date but todo is completed (truthy)', () => {
    const todo = { dueDate: '2025-06-14', completed: 1 };
    expect(isOverdue(todo, referenceDate)).toBe(false);
  });

  it('returns false when due date is strictly before the reference date but todo is completed (boolean true)', () => {
    const todo = { dueDate: '2025-06-14', completed: true };
    expect(isOverdue(todo, referenceDate)).toBe(false);
  });
});
