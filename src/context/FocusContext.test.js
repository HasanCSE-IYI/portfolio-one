import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FocusProvider, useFocus } from './FocusContext';

// Helper consumer component to inspect and trigger FocusContext methods
const FocusTestConsumer = () => {
  const {
    isPlaying,
    toggleMasterPlay,
    masterVolume,
    setMasterVolume,
    activeSoundsCount,
    setSoundVolume,
    clearAllSounds,
    activeScene,
    changeScene,
    timerMode,
    changeTimerMode,
    timerStatus,
    startTimer,
    pauseTimer,
    resetTimer,
    currentTask,
    setCurrentTask,
    currentQuoteIndex,
    nextQuote,
    prevQuote,
  } = useFocus();

  return (
    <div>
      <div data-testid="is-playing">{isPlaying ? 'playing' : 'stopped'}</div>
      <button onClick={toggleMasterPlay}>Toggle Master Play</button>

      <div data-testid="master-vol">{masterVolume}</div>
      <button onClick={() => setMasterVolume(42)}>Set Vol 42</button>

      <div data-testid="active-sounds">{activeSoundsCount}</div>
      <button onClick={() => setSoundVolume('heavy-rain', 70)}>Set Rain 70</button>
      <button onClick={clearAllSounds}>Clear Sounds</button>

      <div data-testid="active-scene">{activeScene}</div>
      <button onClick={() => changeScene('cyberpunk')}>Set Cyberpunk Scene</button>

      <div data-testid="timer-mode">{timerMode}</div>
      <button onClick={() => changeTimerMode('shortBreak')}>Set Short Break</button>

      <div data-testid="timer-status">{timerStatus}</div>
      <button onClick={startTimer}>Start Timer</button>
      <button onClick={pauseTimer}>Pause Timer</button>
      <button onClick={resetTimer}>Reset Timer</button>

      <div data-testid="current-task">{currentTask}</div>
      <button onClick={() => setCurrentTask('Architecture Refactoring')}>Set Task</button>

      <div data-testid="quote-idx">{currentQuoteIndex}</div>
      <button onClick={nextQuote}>Next Quote</button>
      <button onClick={prevQuote}>Prev Quote</button>
    </div>
  );
};

describe('FocusContext & FocusProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('throws an error if useFocus is used outside FocusProvider', () => {
    // Silence expected React error boundary console log during test
    const originalError = console.error;
    console.error = jest.fn();

    const BrokenComponent = () => {
      useFocus();
      return null;
    };

    expect(() => render(<BrokenComponent />)).toThrow(
      'useFocus must be used within a FocusProvider'
    );

    console.error = originalError;
  });

  test('provides sound engine state and allows toggling playback and volumes', () => {
    render(
      <FocusProvider>
        <FocusTestConsumer />
      </FocusProvider>
    );

    expect(screen.getByTestId('is-playing')).toHaveTextContent('stopped');
    expect(screen.getByTestId('master-vol')).toHaveTextContent('75');
    expect(screen.getByTestId('active-sounds')).toHaveTextContent('0');

    // Toggle master play
    fireEvent.click(screen.getByText('Toggle Master Play'));
    expect(screen.getByTestId('is-playing')).toHaveTextContent('playing');

    // Set master volume
    fireEvent.click(screen.getByText('Set Vol 42'));
    expect(screen.getByTestId('master-vol')).toHaveTextContent('42');

    // Add active sound
    fireEvent.click(screen.getByText('Set Rain 70'));
    expect(screen.getByTestId('active-sounds')).toHaveTextContent('1');

    // Clear sounds
    fireEvent.click(screen.getByText('Clear Sounds'));
    expect(screen.getByTestId('active-sounds')).toHaveTextContent('0');
  });

  test('manages scenes and quote carousel correctly', () => {
    render(
      <FocusProvider>
        <FocusTestConsumer />
      </FocusProvider>
    );

    expect(screen.getByTestId('active-scene')).toHaveTextContent('forest');
    fireEvent.click(screen.getByText('Set Cyberpunk Scene'));
    expect(screen.getByTestId('active-scene')).toHaveTextContent('cyberpunk');

    const initialQuote = Number(screen.getByTestId('quote-idx').textContent);
    fireEvent.click(screen.getByText('Next Quote'));
    const nextQuote = Number(screen.getByTestId('quote-idx').textContent);
    expect(nextQuote).not.toBe(initialQuote);
  });

  test('manages timer modes, timer lifecycle, and current task', () => {
    render(
      <FocusProvider>
        <FocusTestConsumer />
      </FocusProvider>
    );

    expect(screen.getByTestId('timer-mode')).toHaveTextContent('pomodoro');
    expect(screen.getByTestId('timer-status')).toHaveTextContent('idle');

    // Change mode
    fireEvent.click(screen.getByText('Set Short Break'));
    expect(screen.getByTestId('timer-mode')).toHaveTextContent('shortBreak');

    // Start timer
    fireEvent.click(screen.getByText('Start Timer'));
    expect(screen.getByTestId('timer-status')).toHaveTextContent('running');

    // Pause timer
    fireEvent.click(screen.getByText('Pause Timer'));
    expect(screen.getByTestId('timer-status')).toHaveTextContent('paused');

    // Reset timer
    fireEvent.click(screen.getByText('Reset Timer'));
    expect(screen.getByTestId('timer-status')).toHaveTextContent('idle');

    // Change task
    fireEvent.click(screen.getByText('Set Task'));
    expect(screen.getByTestId('current-task')).toHaveTextContent(
      'Architecture Refactoring'
    );
  });
});
