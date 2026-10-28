import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faPause,
  faRotateRight,
  faVolumeHigh,
  faVolumeXmark,
  faSliders,
  faExpand,
  faTimes,
  faHeadphones,
  faClock,
  faCheck,
  faFire,
  faBrain,
  faTerminal,
  faEye,
  faEyeSlash,
  faMusic,
  faMagnifyingGlass,
  faLink,
  faHistory,
  faTrashCan,
  faRecordVinyl,
  faSpa,
  faKeyboard,
  faPlus,
  faWaveSquare,
} from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import AnimatedLetters from '../AnimatedLetters';
import {
  useFocus,
  SOUND_DEFINITIONS,
  FOCUS_PRESETS,
  BRAINWAVE_MODES,
  AMBIENT_THEMES,
  YOUTUBE_CHANNELS,
  TIMER_MODES,
} from '../../context/FocusContext';
import './index.scss';

const Focus = () => {
  const [letterClass, setLetterClass] = useState('text-animate');
  const [activeCategory, setActiveCategory] = useState('all');
  const [soundSearch, setSoundSearch] = useState('');
  const [shareCopied, setShareCopied] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [customYtId, setCustomYtId] = useState('');
  const [ytError, setYtError] = useState(false);
  const canvasRef = useRef(null);

  const {
    isPlaying,
    toggleMasterPlay,
    masterVolume,
    setMasterVolume,
    isMuted,
    setIsMuted,
    volumes,
    setSoundVolume,
    toggleSound,
    activePreset,
    applyPreset,
    clearAllSounds,
    activeSoundsCount,
    analyserRef,

    timerMode,
    changeTimerMode,
    timerStatus,
    timerPhase,
    timeRemaining,
    stopwatchSeconds,
    startTimer,
    pauseTimer,
    resetTimer,
    completedSessions,
    currentTask,
    setCurrentTask,
    sessionHistory,
    clearSessionHistory,

    brainwaveMode,
    changeBrainwaveMode,

    isVinylWarmth,
    setIsVinylWarmth,

    userPresets,
    saveUserPreset,
    deleteUserPreset,

    isBreathingMode,
    setIsBreathingMode,
    breathingPhase,
    breathingSeconds,

    ambientTheme,
    changeAmbientTheme,

    activeYouTube,
    setActiveYouTube,
    isYtFolded,
    setIsYtFolded,

    isZenMode,
    setIsZenMode,
  } = useFocus();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetterClass('text-animate-hover');
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  // Update document title for Focus Station
  useEffect(() => {
    if (timerStatus === 'idle') {
      document.title = 'Focus Station | Mahmud al Hasan · Deep Work & Ambient Beats';
    }
    return () => {
      if (timerStatus === 'idle') {
        document.title = 'Mahmud al Hasan | Backend Software Engineer (Laravel, Node.js & .NET)';
      }
    };
  }, [timerStatus]);

  // Global Keyboard Shortcuts (Space, M, F, B, T, R, ?, Esc)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const key = e.key.toLowerCase();
      if (key === ' ' || e.code === 'Space') {
        e.preventDefault();
        toggleMasterPlay();
      } else if (key === 'm') {
        setIsMuted(!isMuted);
      } else if (key === 'f') {
        setIsZenMode(!isZenMode);
      } else if (key === 'b') {
        setIsBreathingMode(!isBreathingMode);
      } else if (key === 't') {
        if (timerStatus === 'running') pauseTimer();
        else startTimer();
      } else if (key === 'r') {
        resetTimer();
      } else if (key === '?' || (e.shiftKey && key === '/')) {
        setShowShortcutsModal(!showShortcutsModal);
      } else if (e.key === 'Escape') {
        if (showShortcutsModal) setShowShortcutsModal(false);
        else if (showSaveModal) setShowSaveModal(false);
        else if (isBreathingMode) setIsBreathingMode(false);
        else if (isZenMode) setIsZenMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isZenMode,
    setIsZenMode,
    isBreathingMode,
    setIsBreathingMode,
    isMuted,
    setIsMuted,
    timerStatus,
    startTimer,
    pauseTimer,
    resetTimer,
    toggleMasterPlay,
    showShortcutsModal,
    showSaveModal,
  ]);

  // Prevent background scroll in Zen Mode or Breathing Mode
  useEffect(() => {
    if (isZenMode || isBreathingMode) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isZenMode, isBreathingMode]);

  // Real-Time Canvas Audio Frequency Visualizer (Retina High-DPI & Organic Breath)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId = null;

    const handleResize = () => {
      if (canvas.parentElement) {
        const clientWidth = canvas.parentElement.clientWidth || 440;
        const clientHeight = 74;
        canvas.width = clientWidth;
        canvas.height = clientHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    let idleTime = 0;
    const renderWave = () => {
      const analyser = analyserRef.current;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      if (analyser && isPlaying) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        const barWidth = (width / bufferLength) * 2.2;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * height * 0.92;
          const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
          gradient.addColorStop(0, 'rgba(245, 158, 11, 0.2)');
          gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.85)');
          gradient.addColorStop(1, 'rgba(168, 85, 247, 0.95)');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(x, height - barHeight, barWidth - 2, barHeight, [3, 3, 0, 0]);
          } else {
            ctx.rect(x, height - barHeight, barWidth - 2, barHeight);
          }
          ctx.fill();

          x += barWidth;
        }
      } else {
        // Serene ambient sine ripple when idle/paused
        idleTime += 0.03;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        for (let x = 0; x < width; x += 4) {
          const y = height / 2 + Math.sin(x * 0.025 + idleTime) * Math.sin(idleTime * 0.4) * 5;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.28)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animId = requestAnimationFrame(renderWave);
    };

    renderWave();
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [analyserRef, isPlaying]);

  // Format MM:SS or H:MM:SS
  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Circular timer progress calculation
  const totalModeSeconds = (timerPhase === 'focus'
    ? TIMER_MODES[timerMode]?.focusMinutes || 25
    : TIMER_MODES[timerMode]?.breakMinutes || 5) * 60;

  const timerProgress = timerMode === 'stopwatch'
    ? 1
    : Math.max(0, Math.min(1, 1 - timeRemaining / (totalModeSeconds || 1)));

  const radius = 105;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - timerProgress * circumference;

  // Filter soundboard categories & search
  const categories = ['all', 'Noise', 'Nature', 'Ambience', 'Brainwave', 'Coding'];

  const getCategoryCount = (cat) => {
    if (cat.toLowerCase() === 'all') return SOUND_DEFINITIONS.length;
    return SOUND_DEFINITIONS.filter((s) => s.category.toLowerCase() === cat.toLowerCase()).length;
  };

  const filteredSounds = SOUND_DEFINITIONS.filter((s) => {
    const matchesCat = activeCategory === 'all' || s.category.toLowerCase() === activeCategory.toLowerCase();
    const query = soundSearch.trim().toLowerCase();
    const matchesSearch = !query ||
      s.name.toLowerCase().includes(query) ||
      s.desc.toLowerCase().includes(query) ||
      s.category.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  // Handle Share / Copy Mix Link
  const handleShareMix = () => {
    const mixStr = Object.entries(volumes)
      .filter(([_, v]) => v > 0)
      .map(([k, v]) => `${k}:${v}`)
      .join(',');

    const base = `${window.location.origin}${window.location.pathname}`;
    const shareUrl = mixStr ? `${base}#/focus?mix=${encodeURIComponent(mixStr)}` : `${base}#/focus`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2500);
      }).catch(() => {});
    }
  };

  // Auto-load mix from URL parameters
  useEffect(() => {
    try {
      let mixParam = null;
      if (window.location.search) {
        mixParam = new URLSearchParams(window.location.search).get('mix');
      }
      if (!mixParam && window.location.hash.includes('?')) {
        const hashQuery = window.location.hash.split('?')[1];
        if (hashQuery) {
          mixParam = new URLSearchParams(hashQuery).get('mix');
        }
      }
      if (mixParam) {
        const decoded = decodeURIComponent(mixParam);
        decoded.split(',').forEach((part) => {
          const [soundId, volStr] = part.split(':');
          const vol = parseInt(volStr, 10);
          if (soundId && !isNaN(vol) && vol >= 0 && vol <= 100) {
            setSoundVolume(soundId, vol);
          }
        });
      }
    } catch {
      // ignore
    }
  }, [setSoundVolume]);

  // Handle custom YouTube input
  const handlePlayCustomYt = (e) => {
    e.preventDefault();
    if (!customYtId.trim()) return;

    let id = customYtId.trim();
    // Parse URL if user pastes a full YouTube link
    if (id.includes('v=')) {
      id = id.split('v=')[1]?.split('&')[0];
    } else if (id.includes('youtu.be/')) {
      id = id.split('youtu.be/')[1]?.split('?')[0];
    }

    if (id && id.length >= 8) {
      setYtError(false);
      setActiveYouTube({
        id,
        title: 'Custom YouTube Stream',
        artist: 'User Input',
        tag: 'Custom',
      });
      setCustomYtId('');
    } else {
      setYtError(true);
    }
  };

  return (
    <>
      <div className={`container focus-page theme-${ambientTheme} ${isZenMode ? 'zen-mode-active' : ''}`}>
        {/* Dynamic Ambient Mesh Glow Background */}
        <div className="ambient-backdrop-mesh" aria-hidden="true">
          <div className="mesh-glow orb-1"></div>
          <div className="mesh-glow orb-2"></div>
          <div className="mesh-glow orb-3"></div>
        </div>

        {/* Zen Mode Immersive Overlay */}
        {isZenMode && (
          <div className="zen-overlay" role="dialog" aria-modal="true" aria-label="Zen Mode Fullscreen Studio">
            <button
              type="button"
              className="zen-exit-btn"
              onClick={() => setIsZenMode(false)}
              aria-label="Exit Zen Mode (Esc)"
              title="Exit Zen Mode (Esc)"
            >
              <FontAwesomeIcon icon={faTimes} />
              <span>Exit Zen Mode</span>
              <kbd>ESC</kbd>
            </button>

            <div className="zen-center-card">
              <div className="zen-task-line">
                <span className="zen-dot"></span>
                <span className="zen-task-text">{currentTask || 'Deep Work Session'}</span>
              </div>

              <div className="zen-timer-display">
                {timerMode === 'stopwatch' ? formatTime(stopwatchSeconds) : formatTime(timeRemaining)}
              </div>

              <div className="zen-phase-badge">
                {timerMode === 'stopwatch' ? 'STOPWATCH' : timerPhase === 'focus' ? 'FOCUS INTERVAL' : 'BREAK INTERVAL'}
              </div>

              <div className="zen-controls-row">
                {timerStatus === 'running' ? (
                  <button type="button" className="zen-action-btn pause" onClick={pauseTimer}>
                    <FontAwesomeIcon icon={faPause} />
                    <span>Pause</span>
                  </button>
                ) : (
                  <button type="button" className="zen-action-btn start" onClick={startTimer}>
                    <FontAwesomeIcon icon={faPlay} />
                    <span>Start Timer</span>
                  </button>
                )}

                <button
                  type="button"
                  className={`zen-action-btn sound ${isPlaying ? 'playing' : ''}`}
                  onClick={toggleMasterPlay}
                >
                  <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
                  <span>{isPlaying ? 'Pause Sounds' : 'Play Sounds'}</span>
                </button>
              </div>

              <div className="zen-now-playing">
                <FontAwesomeIcon icon={faHeadphones} />
                <span>
                  {activeSoundsCount > 0
                    ? `${activeSoundsCount} ambient sound${activeSoundsCount > 1 ? 's' : ''} active`
                    : 'Ambient generator ready'}
                  {activeYouTube && ` · YouTube: ${activeYouTube.title}`}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Apple Mindfulness Box Breathing Fullscreen Experience */}
        {isBreathingMode && (
          <div className="mindful-breathing-overlay" role="dialog" aria-modal="true" aria-label="Apple Mindful Box Breathing">
            <button
              type="button"
              className="breathing-exit-btn"
              onClick={() => setIsBreathingMode(false)}
              aria-label="Exit Mindful Breathing (Esc)"
              title="Exit Mindful Breathing (Esc)"
            >
              <FontAwesomeIcon icon={faTimes} />
              <span>Exit Reset</span>
              <kbd>ESC</kbd>
            </button>

            <div className="breathing-stage">
              <div className="breathing-kicker-badge">
                <span>NEURAL MINDFULNESS RESET</span>
              </div>

              {/* Glowing Concentric Breathing Circle */}
              <div className={`breathing-circle-wrap phase-${breathingPhase}`}>
                <div className="breathing-aura-outer"></div>
                <div className="breathing-aura-mid"></div>
                <div className="breathing-circle-core">
                  <span className="breathing-countdown">{breathingSeconds}</span>
                  <span className="breathing-action-label">
                    {breathingPhase === 'inhale' && 'Inhale Slowly'}
                    {breathingPhase === 'hold-in' && 'Hold Breath'}
                    {breathingPhase === 'exhale' && 'Exhale Gently'}
                    {breathingPhase === 'hold-out' && 'Rest & Hold'}
                  </span>
                </div>
              </div>

              <div className="box-guide-diagram">
                <span className={`box-edge top ${breathingPhase === 'inhale' ? 'active' : ''}`}>Inhale 4s</span>
                <span className={`box-edge right ${breathingPhase === 'hold-in' ? 'active' : ''}`}>Hold 4s</span>
                <span className={`box-edge bottom ${breathingPhase === 'exhale' ? 'active' : ''}`}>Exhale 4s</span>
                <span className={`box-edge left ${breathingPhase === 'hold-out' ? 'active' : ''}`}>Hold 4s</span>
              </div>

              <p className="breathing-subtext">
                Box Breathing regulates autonomic vagal tone, reduces cortisol, and re-primes your prefrontal cortex for deep architectural problem solving.
              </p>
            </div>
          </div>
        )}

        {/* Save Custom Preset Modal */}
        {showSaveModal && (
          <div className="modal-backdrop" onClick={() => setShowSaveModal(false)}>
            <div className="preset-save-modal" role="dialog" aria-modal="true" aria-labelledby="save-preset-heading" onClick={(e) => e.stopPropagation()}>
              <div className="modal-top">
                <h3 id="save-preset-heading">Save Custom Soundscape</h3>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setShowSaveModal(false)}
                  aria-label="Close save modal"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <p className="modal-desc">
                Save your active mix of {activeSoundsCount} ambient sound layers directly to your personal soundscape library.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newPresetName.trim()) {
                    saveUserPreset(newPresetName.trim());
                    setNewPresetName('');
                    setShowSaveModal(false);
                  }
                }}
              >
                <input
                  type="text"
                  placeholder="e.g. Midnight Microservices Flow"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  autoFocus
                  maxLength={40}
                  className="modal-input"
                  aria-label="Custom soundscape preset name"
                />
                <div className="modal-actions-row">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowSaveModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-save"
                    disabled={!newPresetName.trim()}
                  >
                    Save Preset
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Keyboard Shortcuts HUD Modal */}
        {showShortcutsModal && (
          <div className="modal-backdrop" onClick={() => setShowShortcutsModal(false)}>
            <div className="shortcuts-hud-card" role="dialog" aria-modal="true" aria-labelledby="shortcuts-hud-heading" onClick={(e) => e.stopPropagation()}>
              <div className="modal-top">
                <div className="header-title-group">
                  <FontAwesomeIcon icon={faKeyboard} className="header-icon gold" />
                  <h3 id="shortcuts-hud-heading">Studio Keyboard Shortcuts</h3>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setShowShortcutsModal(false)}
                  aria-label="Close shortcuts modal"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              <div className="shortcuts-list">
                <div className="shortcut-row">
                  <span className="shortcut-label">Toggle Master Ambience</span>
                  <div className="keys"><kbd>Space</kbd></div>
                </div>
                <div className="shortcut-row">
                  <span className="shortcut-label">Mute / Unmute Audio</span>
                  <div className="keys"><kbd>M</kbd></div>
                </div>
                <div className="shortcut-row">
                  <span className="shortcut-label">Zen Fullscreen Mode</span>
                  <div className="keys"><kbd>F</kbd></div>
                </div>
                <div className="shortcut-row">
                  <span className="shortcut-label">Mindful Box Breathing</span>
                  <div className="keys"><kbd>B</kbd></div>
                </div>
                <div className="shortcut-row">
                  <span className="shortcut-label">Start / Pause Pomodoro</span>
                  <div className="keys"><kbd>T</kbd></div>
                </div>
                <div className="shortcut-row">
                  <span className="shortcut-label">Reset Pomodoro Dial</span>
                  <div className="keys"><kbd>R</kbd></div>
                </div>
                <div className="shortcut-row">
                  <span className="shortcut-label">Toggle Shortcuts Help</span>
                  <div className="keys"><kbd>?</kbd></div>
                </div>
                <div className="shortcut-row">
                  <span className="shortcut-label">Exit Fullscreen or Modal</span>
                  <div className="keys"><kbd>ESC</kbd></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Focus Page Surface */}
        <div className="focus-header-zone">
          <div className="header-meta-row">
            <span className="focus-kicker-badge">
              <span className="kicker-pulse"></span>
              <span>ENGINEERING FLOW STATE · STUDIO</span>
            </span>

            {/* Ambient Studio Theme Switcher */}
            <div className="theme-switcher-bar" role="toolbar" aria-label="Ambient Backdrops">
              {AMBIENT_THEMES.map((th) => (
                <button
                  key={th.id}
                  type="button"
                  className={`theme-chip ${ambientTheme === th.id ? 'active' : ''}`}
                  onClick={() => changeAmbientTheme(th.id)}
                  title={th.desc}
                >
                  <span className="th-icon">{th.icon}</span>
                  <span className="th-name">{th.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            <div className="focus-status-badge">
              <span className={`status-indicator ${isPlaying || timerStatus === 'running' ? 'active' : ''}`}></span>
              <span>
                {isPlaying || timerStatus === 'running'
                  ? 'Deep Work Session In Progress'
                  : 'Ready to Focus'}
              </span>
            </div>
          </div>

          <h1 className="page-title">
            <AnimatedLetters
              letterClass={letterClass}
              strArray={'Focus Station'.split('')}
              idx={15}
            />
          </h1>

          <p className="focus-lead">
            High-fidelity ambient soundscapes, Pomodoro flow timer, and background coding beats.
            Leave this tab open and lock into deep backend development.
          </p>
        </div>

        {/* Master Control Floating Ribbon */}
        <div className="focus-master-ribbon">
          <div className="ribbon-left">
            <button
              type="button"
              className={`master-play-btn ${isPlaying ? 'playing' : ''}`}
              onClick={toggleMasterPlay}
              aria-label={isPlaying ? 'Pause All Ambient Sounds' : 'Play All Ambient Sounds'}
              title={isPlaying ? 'Pause All Sounds (Space)' : 'Play All Sounds (Space)'}
            >
              <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} className="play-icon" />
              <span>{isPlaying ? 'PAUSE AMBIENCE' : 'START AMBIENCE'}</span>
            </button>

            <div className="master-volume-group">
              <button
                type="button"
                className="mute-btn"
                onClick={() => setIsMuted(!isMuted)}
                title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
                aria-label={isMuted ? 'Unmute master volume' : 'Mute master volume'}
              >
                <FontAwesomeIcon icon={isMuted ? faVolumeXmark : faVolumeHigh} />
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : masterVolume}
                onChange={(e) => {
                  setMasterVolume(Number(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="master-volume-slider"
                aria-label="Master volume slider"
              />
              <span className="vol-percent">{isMuted ? '0%' : `${masterVolume}%`}</span>
            </div>

            {/* Analog Tape Warmth Effect Button */}
            <button
              type="button"
              className={`analog-warmth-btn ${isVinylWarmth ? 'active' : ''}`}
              onClick={() => setIsVinylWarmth(!isVinylWarmth)}
              title="Toggle analog tape saturation & subtle vinyl warmth"
              aria-label={isVinylWarmth ? 'Turn off analog tape warmth' : 'Turn on analog tape warmth'}
            >
              <FontAwesomeIcon icon={faRecordVinyl} className={isVinylWarmth ? 'spin-icon' : ''} />
              <span>Analog Tape</span>
            </button>

            {/* Mindful Box Breathing Trigger */}
            <button
              type="button"
              className={`mindful-btn ${isBreathingMode ? 'active' : ''}`}
              onClick={() => setIsBreathingMode(true)}
              title="Open Mindful Box Breathing Reset (B)"
              aria-label="Open Mindful Box Breathing Reset (Press B)"
            >
              <FontAwesomeIcon icon={faSpa} />
              <span>Mindful Breath</span>
              <kbd>B</kbd>
            </button>
          </div>

          {/* Quick Presets Strip */}
          <div className="ribbon-presets-scroll" role="toolbar" aria-label="Curated Sound Presets">
            <span className="presets-label">
              <FontAwesomeIcon icon={faSliders} /> Presets:
            </span>
            {FOCUS_PRESETS.map((preset) => {
              const isActive = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  className={`preset-pill ${isActive ? 'active' : ''}`}
                  onClick={() => applyPreset(preset)}
                  title={preset.desc}
                >
                  <span className="preset-icon">{preset.icon}</span>
                  <span className="preset-name">{preset.name}</span>
                  {isActive && <span className="preset-active-dot"></span>}
                </button>
              );
            })}

            {/* Custom User Presets */}
            {userPresets.map((preset) => {
              const isActive = activePreset === preset.id;
              return (
                <div key={preset.id} className="user-preset-chip-wrap">
                  <button
                    type="button"
                    className={`preset-pill user-preset ${isActive ? 'active' : ''}`}
                    onClick={() => applyPreset(preset)}
                    title={preset.desc}
                  >
                    <span className="preset-icon">{preset.icon}</span>
                    <span className="preset-name">{preset.name}</span>
                    {isActive && <span className="preset-active-dot"></span>}
                  </button>
                  <button
                    type="button"
                    className="delete-preset-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteUserPreset(preset.id);
                    }}
                    title="Delete custom preset"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              );
            })}

            {activeSoundsCount > 0 && (
              <>
                <button
                  type="button"
                  className="save-preset-btn"
                  onClick={() => setShowSaveModal(true)}
                  title="Save current mix as custom preset"
                  aria-label="Save current sound mix as custom preset"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Save Preset</span>
                </button>
                <button
                  type="button"
                  className={`share-mix-btn ${shareCopied ? 'copied' : ''}`}
                  onClick={handleShareMix}
                  title="Copy shareable link to this custom sound mix"
                  aria-label="Copy shareable link to this custom sound mix"
                >
                  <FontAwesomeIcon icon={shareCopied ? faCheck : faLink} />
                  <span>{shareCopied ? 'Link Copied!' : 'Share Mix'}</span>
                </button>
                <button
                  type="button"
                  className="clear-mix-btn"
                  onClick={clearAllSounds}
                  title="Mute and reset all sound layers"
                  aria-label="Mute and clear all active ambient sound layers"
                >
                  Clear Mix
                </button>
              </>
            )}
          </div>

          <div className="ribbon-right">
            {/* Keyboard Shortcuts Button */}
            <button
              type="button"
              className="shortcuts-hud-btn"
              onClick={() => setShowShortcutsModal(true)}
              title="Keyboard Shortcuts (?)"
              aria-label="Keyboard Shortcuts"
            >
              <FontAwesomeIcon icon={faKeyboard} />
              <kbd>?</kbd>
            </button>

            {/* Zen Fullscreen Button */}
            <button
              type="button"
              className="zen-mode-toggle-btn"
              onClick={() => setIsZenMode(true)}
              title="Enter Zen Fullscreen Mode (Press F)"
              aria-label="Enter Zen Fullscreen Mode"
            >
              <FontAwesomeIcon icon={faExpand} />
              <span className="btn-label">Zen Mode</span>
              <kbd>F</kbd>
            </button>
          </div>
        </div>

        {/* Main Workspace Grid: Timer & Visualizer (Left) vs Sounds & YouTube (Right) */}
        <div className="focus-grid-container">
          {/* Left Column: Pomodoro & Live Visualizer */}
          <div className="focus-left-column">
            {/* Pomodoro Timer Station */}
            <div className="focus-card pomodoro-card">
              <div className="card-top-header">
                <div className="header-title-group">
                  <FontAwesomeIcon icon={faClock} className="header-icon gold" />
                  <h3>Deep Work Pomodoro</h3>
                </div>
                <div className="mode-selector-tabs" role="tablist" aria-label="Pomodoro Intervals">
                  {Object.values(TIMER_MODES).map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      role="tab"
                      aria-selected={timerMode === mode.id}
                      className={`mode-tab ${timerMode === mode.id ? 'active' : ''}`}
                      onClick={() => changeTimerMode(mode.id)}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Circular Radial Countdown */}
              <div className="pomodoro-dial-wrap">
                <svg className="pomodoro-svg-ring" viewBox="0 0 240 240">
                  <circle
                    className="ring-bg"
                    cx="120"
                    cy="120"
                    r={radius}
                    strokeWidth="10"
                  />
                  <circle
                    className={`ring-progress ${timerPhase === 'break' ? 'phase-break' : ''}`}
                    cx="120"
                    cy="120"
                    r={radius}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>

                <div className="dial-center-content">
                  <span className={`phase-badge ${timerPhase}`}>
                    {timerMode === 'stopwatch'
                      ? 'STOPWATCH'
                      : timerPhase === 'focus'
                      ? 'FOCUS TIME'
                      : 'SHORT BREAK'}
                  </span>
                  <div className="dial-timer-readout">
                    {timerMode === 'stopwatch'
                      ? formatTime(stopwatchSeconds)
                      : formatTime(timeRemaining)}
                  </div>
                  <span className="dial-sub-hint">
                    {timerStatus === 'running'
                      ? 'Stay in the zone'
                      : timerStatus === 'paused'
                      ? 'Paused'
                      : 'Ready to initiate'}
                  </span>
                </div>
              </div>

              {/* Timer Controls Row */}
              <div className="timer-actions-row">
                {timerStatus === 'running' ? (
                  <button
                    type="button"
                    className="timer-btn pause"
                    onClick={pauseTimer}
                  >
                    <FontAwesomeIcon icon={faPause} />
                    <span>PAUSE INTERVAL</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="timer-btn start"
                    onClick={startTimer}
                  >
                    <FontAwesomeIcon icon={faPlay} />
                    <span>
                      {timerStatus === 'paused' ? 'RESUME FLOW' : 'START FOCUS'}
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  className="timer-btn reset"
                  onClick={() => resetTimer()}
                  title="Reset Interval"
                  aria-label="Reset interval"
                >
                  <FontAwesomeIcon icon={faRotateRight} />
                </button>
              </div>

              {/* Current Objective Input */}
              <div className="focus-objective-field">
                <label htmlFor="focus-task-input" className="objective-label">
                  <FontAwesomeIcon icon={faFire} className="label-icon" />
                  <span>CURRENT OBJECTIVE</span>
                </label>
                <div className="objective-input-wrap">
                  <input
                    id="focus-task-input"
                    type="text"
                    value={currentTask}
                    onChange={(e) => setCurrentTask(e.target.value)}
                    placeholder="e.g. Building ASP.NET Core EF Core Migrations"
                    maxLength={90}
                  />
                  {completedSessions > 0 && (
                    <span className="sessions-badge" title="Completed sessions today">
                      <FontAwesomeIcon icon={faCheck} /> {completedSessions} done
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Audio Waveform Canvas Visualizer */}
            <div className="focus-card visualizer-card">
              <div className="card-top-header">
                <div className="header-title-group">
                  <FontAwesomeIcon icon={faBrain} className="header-icon cyan" />
                  <h3>Live Audio Visualizer</h3>
                </div>
                <span className="viz-status">
                  {isPlaying ? 'ACTIVE FREQUENCY' : 'STANDBY'}
                </span>
              </div>
              <div className="visualizer-canvas-wrap">
                <canvas
                  ref={canvasRef}
                  width="440"
                  height="70"
                  className="waveform-canvas"
                />
              </div>
            </div>

            {/* Focus Session Log / History Card */}
            <div className="focus-card history-card">
              <div className="card-top-header">
                <div className="header-title-group">
                  <FontAwesomeIcon icon={faHistory} className="header-icon purple" />
                  <h3>Today's Focus Log</h3>
                </div>
                <div className="history-header-actions">
                  <span className="history-count-badge">
                    {sessionHistory.length} completed
                  </span>
                  {sessionHistory.length > 0 && (
                    <button
                      type="button"
                      className="history-clear-btn"
                      onClick={clearSessionHistory}
                      title="Clear session history"
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  )}
                </div>
              </div>

              {sessionHistory.length === 0 ? (
                <div className="history-empty-state">
                  <p>No completed intervals yet today. Lock into a Pomodoro sprint to log your engineering achievements!</p>
                </div>
              ) : (
                <div className="history-list">
                  {sessionHistory.map((item) => (
                    <div key={item.id} className="history-item">
                      <div className="history-item-left">
                        <span className="history-time">{item.time}</span>
                        <span className="history-task">{item.task}</span>
                      </div>
                      <div className="history-item-right">
                        <span className="history-duration">{item.minutes}m</span>
                        <span className="history-mode-tag">{item.mode}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Multi-Track Soundboard & YouTube Lo-Fi Stream */}
          <div className="focus-right-column">
            {/* Ambient Soundboard Matrix */}
            <div className="focus-card soundboard-card">
              <div className="soundboard-header">
                <div className="header-title-group">
                  <FontAwesomeIcon icon={faHeadphones} className="header-icon gold" />
                  <h3>Synthesized Ambient Soundboard</h3>
                </div>
                <span className="active-tracks-count">
                  {activeSoundsCount} track{activeSoundsCount !== 1 ? 's' : ''} active
                </span>
              </div>

              {/* Sound Search Bar */}
              <div className="sound-search-wrap">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="sound-search-icon" />
                <input
                  type="text"
                  value={soundSearch}
                  onChange={(e) => setSoundSearch(e.target.value)}
                  placeholder="Search sounds (e.g. rain, ocean, waves, keys, wind, birds)..."
                  className="sound-search-input"
                  aria-label="Search sounds"
                />
                {soundSearch && (
                  <button
                    type="button"
                    className="sound-search-clear"
                    onClick={() => setSoundSearch('')}
                    aria-label="Clear search"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                )}
              </div>

              {/* Sound Categories Tabs with Item Counts */}
              <div className="category-filter-bar">
                {categories.map((cat) => {
                  const count = getCategoryCount(cat);
                  const isCur = activeCategory === cat.toLowerCase();
                  return (
                    <button
                      key={cat}
                      type="button"
                      className={`cat-pill ${isCur ? 'active' : ''}`}
                      onClick={() => setActiveCategory(cat.toLowerCase())}
                    >
                      <span>{cat}</span>
                      <span className="cat-count">({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Multi-State Brainwave Tuner Panel */}
              {(activeCategory === 'all' || activeCategory === 'brainwave') && !soundSearch && (
                <div className="brainwave-tuner-panel">
                  <div className="tuner-header">
                    <div className="tuner-title-group">
                      <FontAwesomeIcon icon={faWaveSquare} className="tuner-icon cyan" />
                      <span className="tuner-title">Neural Frequency Architecture</span>
                    </div>
                    <span className="current-hz-badge">
                      {BRAINWAVE_MODES[brainwaveMode]?.icon} {BRAINWAVE_MODES[brainwaveMode]?.tag} ({BRAINWAVE_MODES[brainwaveMode]?.hz} Hz)
                    </span>
                  </div>
                  <div className="brainwave-modes-grid" role="radiogroup" aria-label="Brainwave Frequency Modes">
                    {Object.values(BRAINWAVE_MODES).map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        role="radio"
                        aria-label={`${mode.label} ${mode.hz} Hz`}
                        aria-checked={brainwaveMode === mode.id}
                        className={`bw-mode-pill ${brainwaveMode === mode.id ? 'active' : ''}`}
                        onClick={() => changeBrainwaveMode(mode.id)}
                        title={mode.desc}
                      >
                        <span className="bw-icon">{mode.icon}</span>
                        <div className="bw-info">
                          <span className="bw-name">{mode.label}</span>
                          <span className="bw-hz">{mode.hz} Hz</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Soundboard Tiles Grid */}
              {filteredSounds.length === 0 ? (
                <div className="sound-empty-state">
                  <p>No ambient sounds match "{soundSearch}".</p>
                  <button
                    type="button"
                    className="clear-search-link"
                    onClick={() => {
                      setSoundSearch('');
                      setActiveCategory('all');
                    }}
                  >
                    Reset filter & search
                  </button>
                </div>
              ) : (
                <div className="sound-tiles-grid">
                  {filteredSounds.map((sound) => {
                    const vol = volumes[sound.id] || 0;
                    const isActive = vol > 0 && isPlaying;
                    return (
                      <div
                        key={sound.id}
                        className={`sound-tile ${isActive ? 'is-active' : ''}`}
                      >
                        <div
                          className="tile-top-row"
                          onClick={() => toggleSound(sound.id)}
                          role="button"
                          tabIndex={0}
                          aria-label={`Toggle ${sound.name}`}
                          aria-pressed={isActive}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              toggleSound(sound.id);
                            }
                          }}
                        >
                          <div className="tile-icon-avatar">
                            <span>{sound.icon}</span>
                          </div>
                          <div className="tile-title-col">
                            <span className="sound-name">{sound.name}</span>
                            <span className="sound-desc">{sound.desc}</span>
                          </div>
                          <span className={`sound-level-badge ${vol > 0 ? 'audible' : ''}`}>
                            {vol > 0 ? `${vol}%` : 'OFF'}
                          </span>
                        </div>

                        <div className="tile-slider-row">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={vol}
                            onChange={(e) => setSoundVolume(sound.id, e.target.value)}
                            className="sound-volume-slider"
                            aria-label={`${sound.name} volume`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* YouTube Developer Beats & Streams */}
            <div className="focus-card youtube-card">
              <div className="card-top-header">
                <div className="header-title-group">
                  <FontAwesomeIcon icon={faYoutube} className="header-icon red" />
                  <h3>Curated Coding Streams</h3>
                </div>
                {activeYouTube && (
                  <div className="yt-actions">
                    <button
                      type="button"
                      className="yt-fold-btn"
                      onClick={() => setIsYtFolded(!isYtFolded)}
                      title={isYtFolded ? 'Show Video Frame' : 'Hide Video (Audio Only)'}
                    >
                      <FontAwesomeIcon icon={isYtFolded ? faEye : faEyeSlash} />
                      <span>{isYtFolded ? 'Show Video' : 'Audio Mode'}</span>
                    </button>
                    <button
                      type="button"
                      className="yt-close-btn"
                      onClick={() => setActiveYouTube(null)}
                      title="Stop YouTube Stream"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                )}
              </div>

              {/* YouTube Channel Selector Pills */}
              <div className="yt-channels-grid">
                {YOUTUBE_CHANNELS.map((ch) => {
                  const isCur = activeYouTube?.id === ch.id;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      className={`yt-channel-card ${isCur ? 'active' : ''}`}
                      onClick={() => {
                        setActiveYouTube(ch);
                        setIsYtFolded(false);
                      }}
                    >
                      <div className="yt-card-header">
                        <FontAwesomeIcon icon={faMusic} className="ch-icon" />
                        <span className="ch-tag">{ch.tag}</span>
                      </div>
                      <span className="ch-title">{ch.title}</span>
                      <span className="ch-artist">{ch.artist}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom YouTube Input Form */}
              <form onSubmit={handlePlayCustomYt} className="custom-yt-form">
                <div className="input-group">
                  <FontAwesomeIcon icon={faTerminal} className="form-icon" />
                  <input
                    type="text"
                    value={customYtId}
                    onChange={(e) => {
                      setCustomYtId(e.target.value);
                      if (ytError) setYtError(false);
                    }}
                    placeholder="Paste any YouTube URL or Video ID (e.g. 4xDzrJKXOOY)"
                    aria-label="Custom YouTube Video URL"
                  />
                  <button type="submit" className="custom-play-btn">
                    Play
                  </button>
                </div>
                {ytError && (
                  <span className="yt-error-msg">
                    Please provide a valid YouTube video ID or link.
                  </span>
                )}
              </form>

              {/* Active Embedded Player Frame */}
              {activeYouTube && !isYtFolded && (
                <div className="yt-embed-container">
                  <iframe
                    className="yt-iframe"
                    src={`https://www.youtube-nocookie.com/embed/${activeYouTube.id}?autoplay=1&enablejsapi=1`}
                    title={activeYouTube.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Focus;
