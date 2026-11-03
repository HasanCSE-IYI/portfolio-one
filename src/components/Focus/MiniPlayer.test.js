import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MiniPlayer from './MiniPlayer';
import { FocusProvider } from '../../context/FocusContext';
import { UiProvider } from '../../context/UiContext';

describe('MiniPlayer Component', () => {
  test('returns null when completely idle on a non-focus page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <UiProvider>
          <FocusProvider>
            <MiniPlayer />
          </FocusProvider>
        </UiProvider>
      </MemoryRouter>
    );

    expect(
      screen.queryByLabelText(/Background focus session audio/i)
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });

  test('returns null when on /focus page even if audio or timer is running', () => {
    render(
      <MemoryRouter initialEntries={['/focus']}>
        <UiProvider>
          <FocusProvider>
            <MiniPlayer />
          </FocusProvider>
        </UiProvider>
      </MemoryRouter>
    );

    expect(
      screen.queryByLabelText(/Background focus session audio/i)
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });
});
