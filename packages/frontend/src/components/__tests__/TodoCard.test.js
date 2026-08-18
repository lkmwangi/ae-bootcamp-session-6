import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoCard from '../TodoCard';

describe('TodoCard Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    dueDate: '2025-12-25',
    completed: 0,
    createdAt: '2025-11-01T00:00:00Z'
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo title and due date', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText(/December 25, 2025/)).toBeInTheDocument();
  });

  it('should render unchecked checkbox when todo is incomplete', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox when todo is complete', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should show edit button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    expect(editButton).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should enter edit mode when edit button is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  it('should apply completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    const { container } = render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('completed');
  });

  it('should not render due date when dueDate is null', () => {
    const todoNoDate = { ...mockTodo, dueDate: null };
    render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });

  describe('Overdue badge', () => {
    const toDateString = (date) => date.toISOString().split('T')[0];
    const addDays = (days) => {
      const date = new Date();
      date.setDate(date.getDate() + days);
      return toDateString(date);
    };
    const yesterday = addDays(-1);
    const today = addDays(0);
    const tomorrow = addDays(1);

    it('should render "Overdue" badge for an incomplete todo with a past due date', () => {
      const overdueTodo = { ...mockTodo, dueDate: yesterday, completed: 0 };
      render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);

      expect(screen.getByText('Overdue')).toBeInTheDocument();
    });

    it('should not render "Overdue" badge for an incomplete todo due today', () => {
      const todoDueToday = { ...mockTodo, dueDate: today, completed: 0 };
      render(<TodoCard todo={todoDueToday} {...mockHandlers} isLoading={false} />);

      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
    });

    it('should not render "Overdue" badge for an incomplete todo with a future due date', () => {
      const todoFutureDate = { ...mockTodo, dueDate: tomorrow, completed: 0 };
      render(<TodoCard todo={todoFutureDate} {...mockHandlers} isLoading={false} />);

      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
    });

    it('should not render "Overdue" badge for a todo with no due date', () => {
      const todoNoDate = { ...mockTodo, dueDate: null, completed: 0 };
      render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);

      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
    });

    it('should not render "Overdue" badge for a completed todo with a past due date', () => {
      const completedOverdueTodo = { ...mockTodo, dueDate: yesterday, completed: 1 };
      render(<TodoCard todo={completedOverdueTodo} {...mockHandlers} isLoading={false} />);

      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
    });

    it('should remove the badge on re-render after the todo is marked complete, and restore it when marked incomplete again', () => {
      const overdueTodo = { ...mockTodo, dueDate: yesterday, completed: 0 };
      const { rerender } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
      expect(screen.getByText('Overdue')).toBeInTheDocument();

      rerender(<TodoCard todo={{ ...overdueTodo, completed: 1 }} {...mockHandlers} isLoading={false} />);
      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();

      rerender(<TodoCard todo={{ ...overdueTodo, completed: 0 }} {...mockHandlers} isLoading={false} />);
      expect(screen.getByText('Overdue')).toBeInTheDocument();
    });

    it('should remove the badge on re-render when an overdue due date is edited to today/future', () => {
      const overdueTodo = { ...mockTodo, dueDate: yesterday, completed: 0 };
      const { rerender } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
      expect(screen.getByText('Overdue')).toBeInTheDocument();

      rerender(<TodoCard todo={{ ...overdueTodo, dueDate: tomorrow }} {...mockHandlers} isLoading={false} />);
      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
    });

    it('should show the badge on re-render when a non-overdue due date is edited to a past date (still incomplete)', () => {
      const futureTodo = { ...mockTodo, dueDate: tomorrow, completed: 0 };
      const { rerender } = render(<TodoCard todo={futureTodo} {...mockHandlers} isLoading={false} />);
      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();

      rerender(<TodoCard todo={{ ...futureTodo, dueDate: yesterday }} {...mockHandlers} isLoading={false} />);
      expect(screen.getByText('Overdue')).toBeInTheDocument();
    });

    it('should remove the badge on re-render when an overdue due date is cleared to null', () => {
      const overdueTodo = { ...mockTodo, dueDate: yesterday, completed: 0 };
      const { rerender } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
      expect(screen.getByText('Overdue')).toBeInTheDocument();

      rerender(<TodoCard todo={{ ...overdueTodo, dueDate: null }} {...mockHandlers} isLoading={false} />);
      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
    });
  });
});
