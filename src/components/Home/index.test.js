import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './index';

describe('Home Component', () => {
  test('renders hero status, greeting, and call to action links', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/Open to Opportunities · Senior Backend Software Engineer/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /EXECUTIVE RESUME/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /GET IN TOUCH/i })).toBeInTheDocument();
  });

  test('collapses and expands system specifications card', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const toggleBtn = screen.getByRole('button', { name: /Minimize system specs/i });
    expect(toggleBtn).toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(screen.getByRole('button', { name: /Expand system specs/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Expand system specs/i }));
    expect(screen.getByRole('button', { name: /Minimize system specs/i })).toBeInTheDocument();
  });

  test('executes CLI terminal commands like whoami and clear', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const whoamiBtn = screen.getByRole('button', { name: 'whoami' });
    fireEvent.click(whoamiBtn);

    expect(screen.getByText(/Mahmud al Hasan — Senior Backend Software Engineer/i)).toBeInTheDocument();

    const clearBtn = screen.getByRole('button', { name: 'clear' });
    fireEvent.click(clearBtn);

    expect(screen.queryByText(/Mahmud al Hasan — Senior Backend Software Engineer/i)).not.toBeInTheDocument();
  });

  test('switches architectural capability and displays deep inspector breakdown', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const telemedicineNode = screen.getByText('High-Concurrency Telemedicine');
    fireEvent.click(telemedicineNode);

    expect(screen.getByRole('region', { name: /Selected Domain Architecture/i })).toBeInTheDocument();
    expect(screen.getByText(/Real-Time Telemedicine Engine \(Doctor Dekhao\)/i)).toBeInTheDocument();
  });
});
