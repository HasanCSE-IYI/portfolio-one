import React from 'react';
import { render, screen } from '@testing-library/react';
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
});
