import { render, screen, fireEvent } from '@testing-library/react';
import RequestPipeline from './index';

test('renders request pipeline stages and details without scrolling window on mount', () => {
  const scrollIntoViewMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
  window.scrollTo = jest.fn();

  render(<RequestPipeline />);

  // Should render pipeline stages
  expect(screen.getByText(/REST API Request Lifecycle Pipeline/i)).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: /JWT Middleware/i })).toBeInTheDocument();

  // On initial mount, scrollIntoView must NOT be called so the page does not scroll down
  expect(scrollIntoViewMock).not.toHaveBeenCalled();

  // Switching stages updates inspector details
  const controllerBtn = screen.getByRole('tab', { name: /Controller & DTO/i });
  fireEvent.click(controllerBtn);

  expect(controllerBtn).toHaveClass('active');
  expect(screen.getByText(/Data Transfer Object \(DTO\) & Fluent Validation/i)).toBeInTheDocument();
});

test('handles arrow key navigation between stages without scrolling the window', () => {
  const scrollIntoViewMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

  render(<RequestPipeline />);

  const authBtn = screen.getByRole('tab', { name: /JWT Middleware/i });
  authBtn.focus();

  // Press ArrowRight to move to Controller & DTO
  fireEvent.keyDown(authBtn, { key: 'ArrowRight' });

  expect(screen.getByRole('tab', { name: /Controller & DTO/i })).toHaveClass('active');
  expect(scrollIntoViewMock).not.toHaveBeenCalled();
});
