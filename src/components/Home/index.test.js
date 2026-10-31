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

  test('renders Mahmud initial M logo vector image with correct class and attributes', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const logoM = screen.getByRole('img', { name: 'M' });
    expect(logoM).toBeInTheDocument();
    expect(logoM).toHaveClass('name-logo-m');
  });

  test('supports command autocompletion with Tab and executes neofetch command', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const input = screen.getByLabelText(/Interactive CLI command prompt/i);
    fireEvent.change(input, { target: { value: 'neo' } });
    fireEvent.keyDown(input, { key: 'Tab' });

    expect(input.value).toBe('neofetch');

    const runBtn = screen.getByRole('button', { name: /Execute CLI command/i });
    fireEvent.click(runBtn);

    expect(screen.getByText(/Ubuntu 24.04 LTS/i)).toBeInTheDocument();
  });

  test('executes health probe and clears terminal with Ctrl+L shortcut', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const healthBtn = screen.getByRole('button', { name: /curl health/i });
    fireEvent.click(healthBtn);

    expect(screen.getAllByText(/HTTP\/2 200 OK \(14ms\)/i).length).toBeGreaterThan(0);

    const input = screen.getByLabelText(/Interactive CLI command prompt/i);
    fireEvent.keyDown(input, { key: 'l', ctrlKey: true });

    expect(screen.queryByText(/HTTP\/2 200 OK \(14ms\)/i)).not.toBeInTheDocument();
  });

  test('toggles expanded terminal mode', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const expandBtn = screen.getByRole('button', { name: /Expand terminal height/i });
    expect(expandBtn).toBeInTheDocument();

    fireEvent.click(expandBtn);
    expect(screen.getByRole('button', { name: /Collapse terminal height/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Collapse terminal height/i }));
    expect(screen.getByRole('button', { name: /Expand terminal height/i })).toBeInTheDocument();
  });
});
