import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ThemeSwitcher from './index';
import { UiProvider } from '../../context/UiContext';

describe('ThemeSwitcher Component', () => {
  it('does not render when isOpen is false', () => {
    render(
      <MemoryRouter>
        <UiProvider>
          <ThemeSwitcher isOpen={false} onClose={() => {}} />
        </UiProvider>
      </MemoryRouter>
    );

    expect(screen.queryByText('Global Accent Theme')).not.toBeInTheDocument();
  });

  it('renders all 5 curated themes when isOpen is true', () => {
    render(
      <MemoryRouter>
        <UiProvider>
          <ThemeSwitcher isOpen={true} onClose={() => {}} />
        </UiProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Global Accent Theme')).toBeInTheDocument();
    expect(screen.getByText('Amber Gold')).toBeInTheDocument();
    expect(screen.getByText('Cyber Cyan')).toBeInTheDocument();
    expect(screen.getByText('Emerald Mint')).toBeInTheDocument();
    expect(screen.getByText('Electric Violet')).toBeInTheDocument();
    expect(screen.getByText('Neon Rose')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(
      <MemoryRouter>
        <UiProvider>
          <ThemeSwitcher isOpen={true} onClose={handleClose} />
        </UiProvider>
      </MemoryRouter>
    );

    const closeBtn = screen.getByLabelText('Close theme switcher');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
