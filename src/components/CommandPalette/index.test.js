import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CommandPalette from './index';

describe('CommandPalette Component', () => {
  const mockOnClose = jest.fn();
  const mockOnOpenResumeModal = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not render dialog when isOpen is false', () => {
    render(
      <MemoryRouter>
        <CommandPalette
          isOpen={false}
          onClose={mockOnClose}
          onOpenResumeModal={mockOnOpenResumeModal}
        />
      </MemoryRouter>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('renders dialog and search input when isOpen is true', () => {
    render(
      <MemoryRouter>
        <CommandPalette
          isOpen={true}
          onClose={mockOnClose}
          onOpenResumeModal={mockOnOpenResumeModal}
        />
      </MemoryRouter>
    );

    const dialog = screen.getByRole('dialog', { name: /Command Spotlight Palette/i });
    expect(dialog).toBeInTheDocument();

    const input = screen.getByRole('combobox', { name: /Command search/i });
    expect(input).toBeInTheDocument();
  });

  test('filters commands dynamically on user input', () => {
    render(
      <MemoryRouter>
        <CommandPalette
          isOpen={true}
          onClose={mockOnClose}
          onOpenResumeModal={mockOnOpenResumeModal}
        />
      </MemoryRouter>
    );

    const input = screen.getByRole('combobox', { name: /Command search/i });
    fireEvent.change(input, { target: { value: 'Store API' } });

    expect(screen.getByText(/Launch Store API Simulator/i)).toBeInTheDocument();
  });

  test('closes on Escape key press', () => {
    render(
      <MemoryRouter>
        <CommandPalette
          isOpen={true}
          onClose={mockOnClose}
          onOpenResumeModal={mockOnOpenResumeModal}
        />
      </MemoryRouter>
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
