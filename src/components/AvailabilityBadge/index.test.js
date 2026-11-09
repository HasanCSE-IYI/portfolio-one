import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AvailabilityBadge from './index';
import { UiProvider } from '../../context/UiContext';

describe('AvailabilityBadge Component', () => {
  it('renders live availability status and timezone text', () => {
    render(
      <MemoryRouter>
        <UiProvider>
          <AvailabilityBadge />
        </UiProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Available/i)).toBeInTheDocument();
    expect(screen.getAllByText(/BST/i).length).toBeGreaterThan(0);
  });

  it('renders in compact mode without crashing', () => {
    render(
      <MemoryRouter>
        <UiProvider>
          <AvailabilityBadge compact={true} showTooltip={false} />
        </UiProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Available/i)).toBeInTheDocument();
  });

  it('shows detailed popover on hover/focus and dismisses on Escape key', () => {
    const { container } = render(
      <MemoryRouter>
        <UiProvider>
          <AvailabilityBadge compact={false} showTooltip={true} />
        </UiProvider>
      </MemoryRouter>
    );

    const pill = screen.getByRole('link', { name: /Available for hire/i });
    expect(pill).toBeInTheDocument();

    const popover = container.querySelector('.availability-popover');
    expect(popover).not.toHaveClass('visible');

    // Hover to reveal popover
    fireEvent.mouseEnter(pill.parentElement);
    expect(popover).toHaveClass('visible');
    expect(screen.getByText(/Live Availability Status/i)).toBeInTheDocument();
    expect(screen.getByText(/Chattogram, Bangladesh/i)).toBeInTheDocument();

    // Press Escape to dismiss
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(popover).not.toHaveClass('visible');
  });
});
