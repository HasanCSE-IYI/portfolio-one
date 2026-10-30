import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ResumeModal from './index';

describe('ResumeModal Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not render dialog when isOpen is false', () => {
    render(
      <MemoryRouter>
        <ResumeModal isOpen={false} onClose={mockOnClose} />
      </MemoryRouter>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('renders dialog and resume content when isOpen is true', () => {
    render(
      <MemoryRouter>
        <ResumeModal isOpen={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    const dialog = screen.getByRole('dialog', { name: /Executive Resume of Mahmud al Hasan/i });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText(/Curriculum Vitae · Mahmud al Hasan/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Close modal/i })).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    render(
      <MemoryRouter>
        <ResumeModal isOpen={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    const closeBtn = screen.getByRole('button', { name: /Close modal/i });
    fireEvent.click(closeBtn);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when Escape key is pressed', () => {
    render(
      <MemoryRouter>
        <ResumeModal isOpen={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('invokes window.print when print button is clicked', () => {
    const originalPrint = window.print;
    window.print = jest.fn();

    render(
      <MemoryRouter>
        <ResumeModal isOpen={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    const printBtn = screen.getByRole('button', { name: /Print \/ Save PDF/i });
    fireEvent.click(printBtn);
    expect(window.print).toHaveBeenCalledTimes(1);

    window.print = originalPrint;
  });
});
