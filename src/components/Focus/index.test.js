import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
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
    closePath: jest.fn(),
    roundRect: jest.fn(),
    fill: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
  });
});

describe('Focus Station Page', () => {
  test('renders page title, pomodoro dial, preset buttons, and nature sound tiles', () => {
    render(
      <FocusProvider>
        <MemoryRouter initialEntries={['/focus']}>
          <Focus />
        </MemoryRouter>
      </FocusProvider>
    );

    // Kicker tag
    expect(screen.getByText(/PURE NATURE SOUNDSCAPES/i)).toBeInTheDocument();

    // Master ribbon buttons
    expect(screen.getByText(/START AMBIENCE/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Enter Zen Fullscreen Mode/i })).toBeInTheDocument();

    // Pomodoro section
    expect(screen.getByText(/Deep Work Pomodoro/i)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /^Deep Work$/i })).toBeInTheDocument();
    expect(screen.getByText(/Classic Pomodoro/i)).toBeInTheDocument();
    expect(screen.getByText(/START FOCUS/i)).toBeInTheDocument();

    // Curated Nature Presets (including Nahian's Monsoon Tin Roof & Nordic Rain)
    expect(screen.getByText(/Monsoon Tin Roof/i)).toBeInTheDocument();
    expect(screen.getByText(/Nordic Pine Rain/i)).toBeInTheDocument();

    // All Nature Sounds Library header
    expect(screen.getByText(/All Nature Sounds Library/i)).toBeInTheDocument();

    // Nature Sounds from Nahian & Moodist
    expect(screen.getByText('Tin Roof Rain')).toBeInTheDocument();
    expect(screen.getByText('Light Rain')).toBeInTheDocument();
    expect(screen.getByText('Heavy Rain')).toBeInTheDocument();
    expect(screen.getByText('Forest Woods')).toBeInTheDocument();
    expect(screen.getByText('Flowing River')).toBeInTheDocument();
    expect(screen.getByText('Ocean Waves')).toBeInTheDocument();
    expect(screen.getByText('Waterfall')).toBeInTheDocument();
    expect(screen.getByText('Songbirds')).toBeInTheDocument();
    expect(screen.getByText('Campfire')).toBeInTheDocument();

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
    expect(screen.getByText(/Tin Roof Rain/i)).toBeInTheDocument();
    expect(screen.getByText(/Ocean Waves/i)).toBeInTheDocument();

    // Type query "tin roof"
    fireEvent.change(searchInput, { target: { value: 'tin roof' } });
    expect(screen.getByText(/Tin Roof Rain/i)).toBeInTheDocument();
    expect(screen.queryByText(/Ocean Waves/i)).not.toBeInTheDocument();

    // Click clear search button
    const clearBtn = screen.getByLabelText(/Clear search/i);
    fireEvent.click(clearBtn);
    expect(screen.getByText(/Ocean Waves/i)).toBeInTheDocument();
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

    // Switch to Focus Sprint (15 min)
    const sprintTab = screen.getByRole('tab', { name: /Focus Sprint/i });
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
    expect(screen.getByRole('radio', { name: /Beta 15 Hz/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Theta 6 Hz/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Gamma 40 Hz/i })).toBeInTheDocument();

    const betaPill = screen.getByRole('radio', { name: /Beta 15 Hz/i });
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

  test('renders Nahian atmospheric scene switcher and rotates inspiring quotes', () => {
    render(
      <FocusProvider>
        <MemoryRouter initialEntries={['/focus']}>
          <Focus />
        </MemoryRouter>
      </FocusProvider>
    );

    // Atmospheric scene pills
    expect(screen.getByRole('button', { name: /Pine Forest/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Calm Rain/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Monsoon Showers/i })).toBeInTheDocument();

    // Quotes cycle button
    const anotherLineBtn = screen.getByLabelText(/Show another inspiring line/i);
    expect(anotherLineBtn).toBeInTheDocument();
    fireEvent.click(anotherLineBtn);
  });

  test('renders YouTube Video player with direct link paste and fold toggle', () => {
    render(
      <FocusProvider>
        <MemoryRouter initialEntries={['/focus']}>
          <Focus />
        </MemoryRouter>
      </FocusProvider>
    );

    // YouTube section header
    expect(screen.getByText(/YouTube Video Player/i)).toBeInTheDocument();

    // Direct link input & Play Video button
    const linkInput = screen.getByLabelText(/YouTube video link/i);
    expect(linkInput).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Play Video/i })).toBeInTheDocument();

    // Video fold toggle
    const foldBtn = screen.getByLabelText(/Hide video/i);
    expect(foldBtn).toBeInTheDocument();
    fireEvent.click(foldBtn);
    expect(screen.getByLabelText(/Show video/i)).toBeInTheDocument();
  });

  test('renders Apple Dynamic Island inside Zen Mode with expand action', () => {
    render(
      <FocusProvider>
        <MemoryRouter initialEntries={['/focus']}>
          <Focus />
        </MemoryRouter>
      </FocusProvider>
    );

    // Enter Zen Mode
    fireEvent.click(screen.getByRole('button', { name: /Enter Zen Fullscreen Mode/i }));

    // Dynamic island compact button should be present
    const islandBtn = screen.getByLabelText(/Expand now playing controller/i);
    expect(islandBtn).toBeInTheDocument();

    // Expand Dynamic Island
    fireEvent.click(islandBtn);
    expect(screen.getAllByText(/Calm Ambient Stream/i)[0]).toBeInTheDocument();

    // Close Zen Mode
    fireEvent.click(screen.getByRole('button', { name: /Exit Zen Mode/i }));
  });

  test('renders mindfulness time toast greeting and allows dismissal', () => {
    render(
      <FocusProvider>
        <MemoryRouter initialEntries={['/focus']}>
          <Focus />
        </MemoryRouter>
      </FocusProvider>
    );

    // Toast greeting should be visible
    expect(screen.getByText(/Mindfulness/i)).toBeInTheDocument();
    expect(screen.getByText(/Focus Streak/i)).toBeInTheDocument();

    // Dismiss toast
    const dismissBtn = screen.getByLabelText(/Dismiss greeting/i);
    fireEvent.click(dismissBtn);
    expect(screen.queryByText(/Focus Streak/i)).not.toBeInTheDocument();
  });

  test('cycles sleep timer when clicked', () => {
    render(
      <FocusProvider>
        <MemoryRouter initialEntries={['/focus']}>
          <Focus />
        </MemoryRouter>
      </FocusProvider>
    );

    const sleepBtn = screen.getByLabelText(/Set audio sleep timer/i);
    expect(screen.getByText(/Sleep Timer/i)).toBeInTheDocument();

    // Click to cycle to 15m
    fireEvent.click(sleepBtn);
    expect(screen.getByText(/15:00|14:59/i)).toBeInTheDocument();
  });

  test('toggles acoustic spectrum visualizer modes', () => {
    render(
      <FocusProvider>
        <MemoryRouter initialEntries={['/focus']}>
          <Focus />
        </MemoryRouter>
      </FocusProvider>
    );

    const waveBtn = screen.getByRole('button', { name: /^Wave$/i });
    const radialBtn = screen.getByRole('button', { name: /^Radial$/i });
    const barsBtn = screen.getByRole('button', { name: /^Bars$/i });

    expect(barsBtn).toHaveClass('active');
    fireEvent.click(waveBtn);
    expect(waveBtn).toHaveClass('active');
    fireEvent.click(radialBtn);
    expect(radialBtn).toHaveClass('active');
  });

  test('toggles sound favorite and filters via Favorites category', () => {
    render(
      <FocusProvider>
        <MemoryRouter initialEntries={['/focus']}>
          <Focus />
        </MemoryRouter>
      </FocusProvider>
    );

    const favCategoryBtn = screen.getByRole('button', { name: /Favorites/i });
    expect(favCategoryBtn).toBeInTheDocument();

    // Click Favorites category
    fireEvent.click(favCategoryBtn);
    expect(favCategoryBtn).toHaveClass('active');
  });
});

describe('Focus MiniPlayer Dock', () => {
  const TriggerComponent = () => {
    const { toggleMasterPlay, setSoundVolume, startTimer } = useFocus();
    return (
      <div>
        <button onClick={() => {
          setSoundVolume('tin-roof', 50);
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
    render(
      <FocusProvider>
        <MemoryRouter initialEntries={['/portfolio']}>
          <MiniPlayer />
        </MemoryRouter>
      </FocusProvider>
    );

    expect(screen.queryByRole('complementary', { name: /background focus session/i })).not.toBeInTheDocument();
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
