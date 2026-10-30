import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Portfolio from './index';

describe('Portfolio Component', () => {
  test('renders portfolio title and search input', () => {
    render(<Portfolio />);

    expect(screen.getByLabelText(/Portfolio/i)).toBeInTheDocument();
    const searchInput = screen.getByRole('textbox', { name: /Search repositories/i });
    expect(searchInput).toBeInTheDocument();
  });

  test('filters projects by search keyword', () => {
    render(<Portfolio />);

    const searchInput = screen.getByRole('textbox', { name: /Search repositories/i });
    fireEvent.change(searchInput, { target: { value: 'Mappi' } });

    expect(screen.getByText(/Found 1 of/i)).toBeInTheDocument();
  });

  test('filters projects by category button', () => {
    render(<Portfolio />);

    const dotnetBtn = screen.getByRole('button', { name: /\.NET Core & C#/i });
    fireEvent.click(dotnetBtn);

    expect(dotnetBtn).toHaveAttribute('aria-pressed', 'true');
  });

  test('toggles simulator visibility when toggle button is clicked', () => {
    render(<Portfolio />);

    const toggleBtn = screen.getByRole('button', { name: /▲ Hide API Simulator/i });
    expect(toggleBtn).toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(screen.getByRole('button', { name: /▼ Open Interactive API Simulator/i })).toBeInTheDocument();
  });
});
