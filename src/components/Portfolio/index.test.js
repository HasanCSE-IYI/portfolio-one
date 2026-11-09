import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Portfolio from './index';

const renderPortfolio = (initialEntries = ['/portfolio']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Portfolio />
    </MemoryRouter>
  );
};

describe('Portfolio Component', () => {
  test('renders portfolio title and search input', () => {
    renderPortfolio();

    expect(screen.getByLabelText(/Portfolio/i)).toBeInTheDocument();
    const searchInput = screen.getByRole('textbox', { name: /Search repositories/i });
    expect(searchInput).toBeInTheDocument();
  });

  test('filters projects by search keyword', () => {
    renderPortfolio();

    const searchInput = screen.getByRole('textbox', { name: /Search repositories/i });
    fireEvent.change(searchInput, { target: { value: 'Mappi' } });

    expect(screen.getByText(/1 of/i)).toBeInTheDocument();
  });

  test('filters projects by category button', () => {
    renderPortfolio();

    const dotnetBtn = screen.getByRole('button', { name: /\.NET Core & C#/i });
    fireEvent.click(dotnetBtn);

    expect(dotnetBtn).toHaveAttribute('aria-pressed', 'true');
  });

  test('toggles simulator visibility when toggle button is clicked', () => {
    renderPortfolio();

    const toggleBtn = screen.getByRole('button', { name: /▲ Hide API Simulator/i });
    expect(toggleBtn).toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(screen.getByRole('button', { name: /▼ Open Interactive API Simulator/i })).toBeInTheDocument();
  });

  test('clicking tag pill filters projects and ensures all category', () => {
    renderPortfolio();

    const dotnetBtn = screen.getByRole('button', { name: /\.NET Core & C#/i });
    fireEvent.click(dotnetBtn);
    expect(dotnetBtn).toHaveAttribute('aria-pressed', 'true');

    // Click a tag pill
    const tagPill = screen.getAllByRole('button', { name: /Filter by /i })[0];
    fireEvent.click(tagPill);

    const allBtn = screen.getByRole('button', { name: /All Repositories/i });
    expect(allBtn).toHaveAttribute('aria-pressed', 'true');
  });

  test('navigates categories using keyboard arrow keys', () => {
    renderPortfolio();

    const allBtn = screen.getByRole('button', { name: /All Repositories/i });
    expect(allBtn).toHaveAttribute('aria-pressed', 'true');

    fireEvent.keyDown(allBtn, { key: 'ArrowRight' });
    const dotnetBtn = screen.getByRole('button', { name: /\.NET Core & C#/i });
    expect(dotnetBtn).toHaveAttribute('aria-pressed', 'true');

    fireEvent.keyDown(dotnetBtn, { key: 'ArrowRight' });
    const mobileBtn = screen.getByRole('button', { name: /Mobile & GIS/i });
    expect(mobileBtn).toHaveAttribute('aria-pressed', 'true');

    fireEvent.keyDown(mobileBtn, { key: 'ArrowLeft' });
    expect(dotnetBtn).toHaveAttribute('aria-pressed', 'true');
  });

  test('initializes with URL search parameters for category and query', () => {
    renderPortfolio(['/portfolio?cat=mobile&q=GIS']);

    const mobileBtn = screen.getByRole('button', { name: /Mobile & GIS/i });
    expect(mobileBtn).toHaveAttribute('aria-pressed', 'true');

    const searchInput = screen.getByRole('textbox', { name: /Search repositories/i });
    expect(searchInput.value).toBe('GIS');
  });
});
