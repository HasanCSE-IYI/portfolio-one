import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Layout from './index';

describe('Layout Component', () => {
  test('renders skip-to-content link pointing to #main-content', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<div>Test Child Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const skipLink = screen.getByRole('link', { name: /Skip to main content/i });
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  test('renders main content container with tabIndex -1 for accessible focus routing', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<div>Child Page Loaded</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveAttribute('id', 'main-content');
    expect(mainElement).toHaveAttribute('tabIndex', '-1');
    expect(screen.getByText('Child Page Loaded')).toBeInTheDocument();
  });
});
