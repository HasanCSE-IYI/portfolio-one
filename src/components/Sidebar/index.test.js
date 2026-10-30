import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from './index';

describe('Sidebar Component', () => {
  test('renders brand logo and primary navigation links', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Home · Mahmud al Hasan/i)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /About/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Portfolio/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Focus/i }).length).toBeGreaterThan(0);
  });

  test('opens Command Palette when Spotlight search button is clicked', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    const paletteBtn = screen.getByRole('button', {
      name: /Open Command Search/i,
    });
    fireEvent.click(paletteBtn);

    expect(
      screen.getByRole('dialog', { name: /Command Spotlight Palette/i })
    ).toBeInTheDocument();
  });

  test('opens Resume Modal when Resume pill button is clicked', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    const cvBtn = screen.getByRole('button', {
      name: /View Resume/i,
    });
    fireEvent.click(cvBtn);

    expect(
      screen.getByRole('dialog', { name: /Executive Resume of Mahmud al Hasan/i })
    ).toBeInTheDocument();
  });
});
