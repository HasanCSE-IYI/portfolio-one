import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from './index';

describe('NotFound Component', () => {
  test('renders 404 error code and return to home link', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /← Return to Home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Browse Projects/i })).toBeInTheDocument();
  });
});
