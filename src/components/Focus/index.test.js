import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Focus from './index';
import MiniPlayer from './MiniPlayer';
import { FocusProvider, useFocus } from '../../context/FocusContext';

// Mock canvas getContext for JSDOM
beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = () => ({
    clearRect: jest.fn(),
    createLinearGradient: () => ({
      addColorStop: jest.fn(),
    }),
    beginPath: jest.fn(),
    roundRect: jest.fn(),
    fill: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
  });
});

describe('Focus Station Page', () => {
  test('renders page title, pomodoro dial, preset buttons, and sound tiles', () => {
    render(
      <FocusProvider>
        <MemoryRouter initialEntries={['/focus']}>
          <Focus />
        </MemoryRouter>
      </FocusProvider>
    );

    // Page title or kicker badge
    expect(screen.getByText(/ENGINEERING FLOW STATE/i)).toBeInTheDocument();

    // Master ribbon buttons
    expect(screen.getByText(/START AMBIENCE/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Enter Zen Fullscreen Mode/i })).toBeInTheDocument();

    // Pomodoro section
    expect(screen.getByText(/Deep Work Pomodoro/i)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /^Deep Work$/i })).toBeInTheDocument();
    expect(screen.getByText(/Classic Pomodoro/i)).toBeInTheDocument();
    expect(screen.getByText(/START FOCUS/i)).toBeInTheDocument();

    // Presets
    expect(screen.getByText(/Deep Architecture Flow/i)).toBeInTheDocument();
    expect(screen.getByText(/Monsoon Coffee Shop/i)).toBeInTheDocument();

    // Soundboard
    expect(screen.getByText(/Synthesized Ambient Soundboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Brown Noise/i)).toBeInTheDocument();
    expect(screen.getByText(/Gentle Rain/i)).toBeInTheDocument();
    expect(screen.getByText(/Mechanical Keys/i)).toBeInTheDocument();

    // Coding streams
    expect(screen.getByText(/Curated Coding Streams/i)).toBeInTheDocument();

    // New ambient synthesizers
    expect(screen.getByText(/Ocean Waves/i)).toBeInTheDocument();
    expect(screen.getByText(/Mountain Wind/i)).toBeInTheDocument();
    expect(screen.getByText(/Morning Birds/i)).toBeInTheDocument();

    // Today's Focus Log card
    expect(screen.getByText(/Today's Focus Log/i)).toBeInTheDocument();
  });

  test('filters sounds via search input and resets on clear', () => {
    render(
      <FocusProvider>
        <MemoryRouter initialEntries={['/focus']}>
          <Focus />
        </MemoryRouter>
      </FocusProvider>
    );

    const searchInput = screen.getByLabelText(/Search sounds/i);
    expect(screen.getByText(/Ocean Waves/i)).toBeInTheDocument();
    expect(screen.getByText(/Mechanical Keys/i)).toBeInTheDocument();

    // Type query "waves"
    fireEvent.change(searchInput, { target: { value: 'waves' } });
    expect(screen.getByText(/Ocean Waves/i)).toBeInTheDocument();
    expect(screen.queryByText(/Mechanical Keys/i)).not.toBeInTheDocument();

    // Click clear search button
    const clearBtn = screen.getByLabelText(/Clear search/i);
    fireEvent.click(clearBtn);
    expect(screen.getByText(/Mechanical Keys/i)).toBeInTheDocument();
  });

  test('toggles timer mode and updates dial readout', () => {
    render(
      <FocusProvider>
        <MemoryRouter initialEntries={['/focus']}>
          <Focus />
        </MemoryRouter>
      </FocusProvider>
    );

    // Switch to Deep Work (50 min)
    const deepWorkTab = screen.getByRole('tab', { name: /Deep Work/i });
    fireEvent.click(deepWorkTab);
    expect(screen.getByText('50:00')).toBeInTheDocument();

    // Switch to Code Sprint (15 min)
    const sprintTab = screen.getByRole('tab', { name: /Code Sprint/i });
    fireEvent.click(sprintTab);
    expect(screen.getByText('15:00')).toBeInTheDocument();
  });

  test('allows entering and exiting Zen Fullscreen Mode', () => {
    render(
      <FocusProvider>
        <MemoryRouter initialEntries={['/focus']}>
          <Focus />
        </MemoryRouter>
      </FocusProvider>
    );

    // Enter Zen Mode
    const zenBtn = screen.getByRole('button', { name: /Enter Zen Fullscreen Mode/i });
    fireEvent.click(zenBtn);

    // Zen overlay should now be visible
    expect(screen.getByText(/Exit Zen Mode/i)).toBeInTheDocument();

    // Exit Zen Mode
    const exitBtn = screen.getByRole('button', { name: /Exit Zen Mode/i });
    fireEvent.click(exitBtn);

    expect(screen.queryByText(/Exit Zen Mode/i)).not.toBeInTheDocument();
  });

  test('enters and exits Apple Mindful Box Breathing session', () => {
    render(
      <FocusProvider>
        <MemoryRouter initialEntries={['/focus']}>
          <Focus />
        </MemoryRouter>
      </FocusProvider>
    );

    const mindfulBtn = screen.getByText(/Mindful Breath/i);
    fireEvent.click(mindfulBtn);

    // Breathing overlay should be visible
    expect(screen.getByText(/NEURAL MINDFULNESS RESET/i)).toBeInTheDocument();
    expect(screen.getByText(/Inhale Slowly/i)).toBeInTheDocument();

    // Exit Breathing mode
    const exitBtn = screen.getByRole('button', { name: /Exit Mindful Breathing/i });
    fireEvent.click(exitBtn);

    expect(screen.queryByText(/NEURAL MINDFULNESS RESET/i)).not.toBeInTheDocument();
  });

  test('renders brainwave tuner modes and allows mode selection', () => {
    render(
      <FocusProvider>
        <MemoryRouter initialEntries={['/focus']}>
          <Focus />
        </MemoryRouter>
      </FocusProvider>
    );

    expect(screen.getByText(/Neural Frequency Architecture/i)).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Beta 18 Hz/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Theta 6 Hz/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Gamma 40 Hz/i })).toBeInTheDocument();

    const betaPill = screen.getByRole('radio', { name: /Beta 18 Hz/i });
    fireEvent.click(betaPill);
    expect(betaPill).toHaveAttribute('aria-checked', 'true');
  });

  test('conforms to WCAG and Apple dialog accessibility best practices', () => {
    render(
      <FocusProvider>
        <MemoryRouter initialEntries={['/focus']}>
          <Focus />
        </MemoryRouter>
      </FocusProvider>
    );

    // Open Mindful Breathing overlay
    const mindfulBtn = screen.getByLabelText(/Open Mindful Box Breathing/i);
    fireEvent.click(mindfulBtn);
    const breathingDialog = screen.getByRole('dialog', { name: /Apple Mindful Box Breathing/i });
    expect(breathingDialog).toHaveAttribute('aria-modal', 'true');

    // Close via Exit button
    fireEvent.click(screen.getByLabelText(/Exit Mindful Breathing/i));
    expect(screen.queryByRole('dialog', { name: /Apple Mindful Box Breathing/i })).not.toBeInTheDocument();

    // Open Zen Mode overlay
    const zenBtn = screen.getByRole('button', { name: /Enter Zen Fullscreen Mode/i });
    fireEvent.click(zenBtn);
    const zenDialog = screen.getByRole('dialog', { name: /Zen Mode Fullscreen Studio/i });
    expect(zenDialog).toHaveAttribute('aria-modal', 'true');

    // Close via Exit button
    fireEvent.click(screen.getByLabelText(/Exit Zen Mode/i));
    expect(screen.queryByRole('dialog', { name: /Zen Mode Fullscreen Studio/i })).not.toBeInTheDocument();

    // Open Shortcuts HUD
    const hudBtn = screen.getByRole('button', { name: /Keyboard Shortcuts/i });
    fireEvent.click(hudBtn);
    const hudDialog = screen.getByRole('dialog', { name: /Studio Keyboard Shortcuts/i });
    expect(hudDialog).toHaveAttribute('aria-modal', 'true');
  });
});

describe('Focus MiniPlayer Dock', () => {
  const TriggerComponent = () => {
    const { toggleMasterPlay, setSoundVolume, startTimer } = useFocus();
    return (
      <div>
        <button onClick={() => {
          setSoundVolume('rain', 50);
          toggleMasterPlay();
        }}>
          Activate Audio
        </button>
        <button onClick={startTimer}>
          Activate Timer
        </button>
      </div>
    );
  };

  test('does not render when idle on non-focus route', () => {
    const { container } = render(
      <FocusProvider>
        <MemoryRouter initialEntries={['/portfolio']}>
          <MiniPlayer />
        </MemoryRouter>
      </FocusProvider>
    );

    expect(container.querySelector('.focus-mini-player')).toBeNull();
  });

  test('renders floating dock on non-focus route when sound is active', () => {
    render(
      <FocusProvider>
        <MemoryRouter initialEntries={['/portfolio']}>
          <TriggerComponent />
          <MiniPlayer />
        </MemoryRouter>
      </FocusProvider>
    );

    // Activate sound
    fireEvent.click(screen.getByText('Activate Audio'));

    // MiniPlayer should appear with sound active
    expect(screen.getByLabelText(/Background focus session audio and timer controls/i)).toBeInTheDocument();
    expect(screen.getByTitle(/Open Focus Station/i)).toBeInTheDocument();
  });
});
