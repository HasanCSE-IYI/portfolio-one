import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UiProvider, useUi } from './UiContext';

const TestConsumer = () => {
  const {
    accentTheme,
    setAccentTheme,
    soundEnabled,
    toggleSound,
    isTerminalOpen,
    openTerminal,
    closeTerminal,
    isCheatsheetOpen,
    openCheatsheet,
    closeCheatsheet,
    isGuestbookOpen,
    openGuestbook,
    closeGuestbook,
    isThemePickerOpen,
    openThemePicker,
    closeThemePicker,
    playSound,
  } = useUi();

  return (
    <div>
      <div data-testid="theme-name">{accentTheme}</div>
      <button onClick={() => setAccentTheme('emerald')}>Set Emerald</button>

      <div data-testid="sound-status">{soundEnabled ? 'sound-on' : 'sound-off'}</div>
      <button onClick={toggleSound}>Toggle Sound</button>

      <div data-testid="terminal-status">{isTerminalOpen ? 'term-open' : 'term-closed'}</div>
      <button onClick={openTerminal}>Open Terminal</button>
      <button onClick={closeTerminal}>Close Terminal</button>

      <div data-testid="cheatsheet-status">{isCheatsheetOpen ? 'sheet-open' : 'sheet-closed'}</div>
      <button onClick={openCheatsheet}>Open Cheatsheet</button>
      <button onClick={closeCheatsheet}>Close Cheatsheet</button>

      <div data-testid="guestbook-status">{isGuestbookOpen ? 'gb-open' : 'gb-closed'}</div>
      <button onClick={openGuestbook}>Open Guestbook</button>
      <button onClick={closeGuestbook}>Close Guestbook</button>

      <div data-testid="theme-picker-status">{isThemePickerOpen ? 'picker-open' : 'picker-closed'}</div>
      <button onClick={openThemePicker}>Open Picker</button>
      <button onClick={closeThemePicker}>Close Picker</button>

      <button onClick={() => playSound('pop')}>Play Sound</button>
    </div>
  );
};

describe('UiContext & UiProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('provides default accent theme and updates when changed', () => {
    render(
      <MemoryRouter>
        <UiProvider>
          <TestConsumer />
        </UiProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId('theme-name')).toHaveTextContent('gold');

    fireEvent.click(screen.getByText('Set Emerald'));
    expect(screen.getByTestId('theme-name')).toHaveTextContent('emerald');
    expect(localStorage.getItem('portfolio_accent_theme')).toBe('emerald');
  });

  test('toggles sound on and off', () => {
    render(
      <MemoryRouter>
        <UiProvider>
          <TestConsumer />
        </UiProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId('sound-status')).toHaveTextContent('sound-on');

    fireEvent.click(screen.getByText('Toggle Sound'));
    expect(screen.getByTestId('sound-status')).toHaveTextContent('sound-off');
    expect(localStorage.getItem('portfolio_sfx_enabled')).toBe('false');

    fireEvent.click(screen.getByText('Toggle Sound'));
    expect(screen.getByTestId('sound-status')).toHaveTextContent('sound-on');
  });

  test('manages terminal, cheatsheet, guestbook, and theme picker modal states', () => {
    render(
      <MemoryRouter>
        <UiProvider>
          <TestConsumer />
        </UiProvider>
      </MemoryRouter>
    );

    // Terminal
    expect(screen.getByTestId('terminal-status')).toHaveTextContent('term-closed');
    fireEvent.click(screen.getByText('Open Terminal'));
    expect(screen.getByTestId('terminal-status')).toHaveTextContent('term-open');
    fireEvent.click(screen.getByText('Close Terminal'));
    expect(screen.getByTestId('terminal-status')).toHaveTextContent('term-closed');

    // Cheatsheet
    expect(screen.getByTestId('cheatsheet-status')).toHaveTextContent('sheet-closed');
    fireEvent.click(screen.getByText('Open Cheatsheet'));
    expect(screen.getByTestId('cheatsheet-status')).toHaveTextContent('sheet-open');
    fireEvent.click(screen.getByText('Close Cheatsheet'));
    expect(screen.getByTestId('cheatsheet-status')).toHaveTextContent('sheet-closed');

    // Guestbook
    expect(screen.getByTestId('guestbook-status')).toHaveTextContent('gb-closed');
    fireEvent.click(screen.getByText('Open Guestbook'));
    expect(screen.getByTestId('guestbook-status')).toHaveTextContent('gb-open');
    fireEvent.click(screen.getByText('Close Guestbook'));
    expect(screen.getByTestId('guestbook-status')).toHaveTextContent('gb-closed');

    // Theme Picker
    expect(screen.getByTestId('theme-picker-status')).toHaveTextContent('picker-closed');
    fireEvent.click(screen.getByText('Open Picker'));
    expect(screen.getByTestId('theme-picker-status')).toHaveTextContent('picker-open');
    fireEvent.click(screen.getByText('Close Picker'));
    expect(screen.getByTestId('theme-picker-status')).toHaveTextContent('picker-closed');
  });
});
