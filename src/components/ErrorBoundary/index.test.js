import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from './index';

// Component that throws error for testing
const ProblemChild = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test boundary crash');
  }
  return <div>Normal Content Running Safely</div>;
};

describe('ErrorBoundary Component', () => {
  // Suppress console.error in tests for intentional throw
  let consoleSpy;
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('renders children normally when there is no error', () => {
    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal Content Running Safely')).toBeInTheDocument();
  });

  test('catches errors and displays fallback UI with technical diagnostics', () => {
    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('System Runtime Exception')).toBeInTheDocument();
    expect(screen.getByText(/The application encountered an unexpected runtime fault/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reload application/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /return to home/i })).toBeInTheDocument();

    // Toggle diagnostics
    const toggleBtn = screen.getByRole('button', { name: /technical diagnostics/i });
    fireEvent.click(toggleBtn);

    expect(screen.getByText(/Test boundary crash/i)).toBeInTheDocument();
  });
});
