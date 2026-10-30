import React, { useEffect, useState, useRef, useMemo } from 'react';
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
  faMagnifyingGlass,
  faLink,
  faHistory,
  faTrashCan,
  faRecordVinyl,
  faSpa,
  faKeyboard,
  faPlus,
  faWaveSquare,
  faShuffle,
  faEye,
  faEyeSlash,
  faTv,
  faBackward,
  faForward,
  faQuoteLeft,
  faStar,
  faMoon,
} from '@fortawesome/free-solid-svg-icons';
import AnimatedLetters from '../AnimatedLetters';
import {
  useFocus,
  SOUND_DEFINITIONS,
  FOCUS_PRESETS,
  BRAINWAVE_MODES,
  TIMER_MODES,
  FOCUS_SCENES,
  FOCUS_QUOTES,
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
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState('timer'); // 'timer' (Pomodoro & YouTube priority) | 'soundboard'
  const [customLinkInput, setCustomLinkInput] = useState('');
  const [isIslandExpanded, setIsIslandExpanded] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [showZenMixer, setShowZenMixer] = useState(false);
  const [visualizerMode, setVisualizerMode] = useState('bars'); // 'bars' | 'wave' | 'radial'
  const [showTimeToast, setShowTimeToast] = useState(true);
  const [visitStreak, setVisitStreak] = useState(1);
  const canvasRef = useRef(null);
  const idleTimerRef = useRef(null);
  const ytIframeRef = useRef(null);

  const {
    // Soundboard
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
    shuffleMix,
    favorites,
    toggleFavorite,
    sleepTimerMinutes,
    sleepTimerRemaining,
    setSleepTimer,

    // Scenes & Atmosphere
    activeScene,
    changeScene,

    // Quotes
    currentQuoteIndex,
    nextQuote,

    // YouTube Focus Player
    currentYtTrack,
    isYtPlaying,
    ytVolume,
    setYtVolume,
    isYtFolded,
    toggleYtFold,
    customYtLinks,
    playYtTrack,
    toggleYtPlay,
    nextYtTrack,
    prevYtTrack,
    addCustomYtLink,
    removeCustomYtLink,

    // Timer
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

    // Brainwave & Effects
    brainwaveMode,
    changeBrainwaveMode,
    isVinylWarmth,
    setIsVinylWarmth,

    // Custom Presets
    userPresets,
    saveUserPreset,
    deleteUserPreset,

    // Breathing
    isBreathingMode,
    setIsBreathingMode,
    breathingPhase,
    breathingSeconds,

    // Theme & Zen
    ambientTheme,
    isZenMode,
    setIsZenMode,
  } = useFocus();

  // Letter entrance animation trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setLetterClass('text-animate-hover');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Focus Visit Streak Tracker (Nahian portfolio mindfulness concept)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('focus_visit_streak') || '0';
      const streak = parseInt(raw, 10) + 1;
      localStorage.setItem('focus_visit_streak', streak.toString());
      setVisitStreak(streak);
    } catch {}
  }, []);

  // Dynamic Time-of-Day Mindfulness Greeting
  const timeGreeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return {
        icon: '🌅',
        period: 'Morning',
        message: 'Good morning! Hope your day’s off to a productive start. Assalamu alaikum!',
      };
    } else if (hour >= 12 && hour < 17) {
      return {
        icon: '☀️',
        period: 'Afternoon',
        message: 'Good afternoon! Ready for deep mindful flow. Stay hydrated and focused.',
      };
    } else if (hour >= 17 && hour < 22) {
      return {
        icon: '🌇',
        period: 'Evening',
        message: 'Good evening! Settle into your serene focus space and enjoy the soundscapes.',
      };
    } else {
      return {
        icon: '🌙',
        period: 'Late Night',
        message: 'Burning the midnight oil? Remember to take gentle breaks and rest your eyes.',
      };
    }
  }, []);

  // Zen Mode Auto-Idle Timeout (3.5s inactivity hides cursor and controls)
  useEffect(() => {
    if (!isZenMode) {
      setIsIdle(false);
      return;
    }
    const resetIdleTimer = () => {
      setIsIdle(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        setIsIdle(true);
      }, 3500);
    };

    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    idleTimerRef.current = setTimeout(() => {
      setIsIdle(true);
    }, 3500);

    return () => {
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [isZenMode]);

  // Manage body classes for Zen Mode and Mindful Breathing Mode
  useEffect(() => {
    if (isZenMode) {
      document.body.classList.add('zen-mode-active');
    } else {
      document.body.classList.remove('zen-mode-active');
    }
    return () => {
      document.body.classList.remove('zen-mode-active');
    };
  }, [isZenMode]);

  useEffect(() => {
    if (isBreathingMode) {
      document.body.classList.add('breathing-mode-active');
    } else {
      document.body.classList.remove('breathing-mode-active');
    }
    return () => {
      document.body.classList.remove('breathing-mode-active');
    };
  }, [isBreathingMode]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        toggleMasterPlay();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setIsMuted(!isMuted);
      } else if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        setIsZenMode((prev) => !prev);
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
          setIsZenMode(true);
        } else {
          document.exitFullscreen().catch(() => {});
        }
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        if (timerStatus === 'running') pauseTimer();
        else startTimer();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        resetTimer();
      } else if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        setIsBreathingMode((prev) => !prev);
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        shuffleMix();
      } else if (e.key === 'y' || e.key === 'Y') {
        e.preventDefault();
        toggleYtFold();
      } else if (e.key === '?') {
        e.preventDefault();
        setShowShortcutsModal((prev) => !prev);
      } else if (e.key === 'Escape') {
        if (showSaveModal) setShowSaveModal(false);
        if (showShortcutsModal) setShowShortcutsModal(false);
        if (isBreathingMode) setIsBreathingMode(false);
        if (isZenMode) setIsZenMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    toggleMasterPlay,
    isMuted,
    setIsMuted,
    setIsZenMode,
    timerStatus,
    startTimer,
    pauseTimer,
    resetTimer,
    setIsBreathingMode,
    shuffleMix,
    toggleYtFold,
    showSaveModal,
    showShortcutsModal,
    isBreathingMode,
    isZenMode,
  ]);

  // Real-time Web Audio Visualizer (Multi-mode: Bars, Wave, Radial)
  useEffect(() => {
    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth || 320;
    const height = canvas.clientHeight || 90;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    if (ctx.scale) ctx.scale(dpr, dpr);

    const renderSpectrum = () => {
      animId = requestAnimationFrame(renderSpectrum);
      ctx.clearRect(0, 0, width, height);

      let dataArray = new Uint8Array(32);
      if (analyserRef.current && isPlaying) {
        if (visualizerMode === 'wave') {
          dataArray = new Uint8Array(analyserRef.current.fftSize || 64);
          analyserRef.current.getByteTimeDomainData(dataArray);
        } else {
          dataArray = new Uint8Array(analyserRef.current.frequencyBinCount || 32);
          analyserRef.current.getByteFrequencyData(dataArray);
        }
      }

      if (visualizerMode === 'wave') {
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        const len = dataArray.length || 64;
        const sliceWidth = width / len;
        let x = 0;
        for (let i = 0; i < len; i++) {
          const v = isPlaying
            ? dataArray[i] / 128.0
            : 1 + Math.sin(Date.now() * 0.003 + i * 0.15) * 0.18;
          const y = (v * height) / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }
        if (ctx.stroke) ctx.stroke();
        ctx.shadowBlur = 0;
      } else if (visualizerMode === 'radial') {
        const cx = width / 2;
        const cy = height / 2;
        const baseRadius = Math.min(width, height) * 0.28;
        const ringPoints = 36;
        ctx.beginPath();
        for (let i = 0; i < ringPoints; i++) {
          const angle = (i / ringPoints) * Math.PI * 2;
          const val = isPlaying
            ? (dataArray[i % dataArray.length] || 10) / 255
            : 0.15 + Math.sin(Date.now() * 0.004 + i * 0.5) * 0.1;
          const r = baseRadius + val * 24;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        if (ctx.closePath) ctx.closePath();
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 12;
        if (ctx.stroke) ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        // 'bars' mode
        const barCount = 28;
        const totalSpacing = (barCount - 1) * 3;
        const barWidth = Math.max(3, (width - totalSpacing) / barCount);
        const grad = ctx.createLinearGradient(0, height, 0, 0);
        grad.addColorStop(0, '#f59e0b');
        grad.addColorStop(0.5, '#38bdf8');
        grad.addColorStop(1, '#a855f7');

        for (let i = 0; i < barCount; i++) {
          const value = isPlaying
            ? dataArray[Math.floor((i / barCount) * dataArray.length)] || 8
            : 6 + Math.sin(Date.now() * 0.003 + i * 0.4) * 4;

          const barHeight = Math.max(4, (value / 255) * (height - 8));
          const x = i * (barWidth + 3);
          const y = height - barHeight;

          ctx.fillStyle = grad;
          if (ctx.roundRect) {
            ctx.beginPath();
            ctx.roundRect(x, y, barWidth, barHeight, [3, 3, 0, 0]);
            ctx.fill();
          } else {
            ctx.fillRect(x, y, barWidth, barHeight);
          }
        }
      }
    };

    renderSpectrum();
    return () => cancelAnimationFrame(animId);
  }, [analyserRef, isPlaying, visualizerMode]);

  // Categories list and sound filtering
  const categories = useMemo(() => {
    return ['all', 'Favorites', 'Rain', 'Nature', 'Animals', 'Places', 'Transport', 'Things', 'City', 'Noise & Waves'];
  }, []);

  const getCategoryCount = (cat) => {
    if (cat.toLowerCase() === 'all') return SOUND_DEFINITIONS.length;
    if (cat.toLowerCase() === 'favorites') return SOUND_DEFINITIONS.filter((s) => favorites.includes(s.id)).length;
    return SOUND_DEFINITIONS.filter(
      (s) => s.category.toLowerCase() === cat.toLowerCase()
    ).length;
  };

  const filteredSounds = useMemo(() => {
    return SOUND_DEFINITIONS.filter((sound) => {
      const matchCat =
        activeCategory === 'all' ||
        (activeCategory === 'favorites' && favorites.includes(sound.id)) ||
        sound.category.toLowerCase() === activeCategory.toLowerCase();
      const matchSearch =
        !soundSearch.trim() ||
        sound.name.toLowerCase().includes(soundSearch.toLowerCase()) ||
        sound.desc.toLowerCase().includes(soundSearch.toLowerCase()) ||
        sound.category.toLowerCase().includes(soundSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, soundSearch, favorites]);

  // Time formatter
  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Dial progress calculations
  const totalDuration = useMemo(() => {
    const modeConfig = TIMER_MODES[timerMode] || TIMER_MODES.pomodoro;
    return timerPhase === 'focus'
      ? modeConfig.focusMinutes * 60
      : modeConfig.breakMinutes * 60;
  }, [timerMode, timerPhase]);

  const radius = 86;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = totalDuration > 0 ? (totalDuration - timeRemaining) / totalDuration : 0;
  const strokeDashoffset = circumference * (1 - progressRatio);

  // Handle Share Mix
  const handleShareMix = () => {
    const active = {};
    SOUND_DEFINITIONS.forEach((s) => {
      if (volumes[s.id] > 0) active[s.id] = volumes[s.id];
    });
    try {
      const encoded = btoa(JSON.stringify(active));
      const url = `${window.location.origin}/focus?mix=${encoded}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2500);
      }
    } catch {}
  };

  // Handle Custom YouTube Link Submission
  const handleCustomLinkSubmit = (e) => {
    e.preventDefault();
    if (!customLinkInput.trim()) return;
    const ok = addCustomYtLink(customLinkInput.trim());
    if (ok) {
      setCustomLinkInput('');
    }
  };

  const currentSceneObj = FOCUS_SCENES.find((s) => s.id === activeScene) || FOCUS_SCENES[0];

  return (
    <>
      <div className={`container focus-page focus-station-container theme-${ambientTheme} ${isZenMode ? 'zen-mode-active' : ''}`}>
        {/* Ambient Gradient Mesh Glow Backdrops */}
        <div className="ambient-mesh-glow" aria-hidden="true">
          <div className="mesh-glow orb-1"></div>
          <div className="mesh-glow orb-2"></div>
          <div className="mesh-glow orb-3"></div>
        </div>

        {/* =========================================================================
            ZEN MODE / FULLSCREEN IMMERSIVE ATMOSPHERIC OVERLAY
           ========================================================================= */}
        {isZenMode && (
          <div
            className={`zen-overlay ${isIdle ? 'data-idle' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label="Zen Mode Fullscreen Studio"
          >
            {/* Edge-to-edge atmospheric scene background with gentle Ken Burns drift */}
            <div className="zen-scene-backdrop" aria-hidden="true">
              <img
                src={currentSceneObj.image}
                alt=""
                className="zen-bg-image focus-drift"
              />
              <div className="zen-backdrop-gradient"></div>
            </div>

            {/* Apple Dynamic Island Top Dock */}
            <div className="zen-island-dock">
              <div
                className={`apple-dynamic-island ${isIslandExpanded ? 'expanded' : 'compact'}`}
                role="region"
                aria-label="Now Playing Dynamic Island"
              >
                {!isIslandExpanded ? (
                  <button
                    type="button"
                    className="island-compact-btn"
                    onClick={() => setIsIslandExpanded(true)}
                    aria-expanded="false"
                    aria-label="Expand now playing controller"
                  >
                    <img
                      src={
                        currentYtTrack
                          ? `https://i.ytimg.com/vi/${currentYtTrack.id}/mqdefault.jpg`
                          : currentSceneObj.image
                      }
                      alt=""
                      className="island-art-thumb"
                    />
                    <span className="island-compact-title">
                      {isYtPlaying && currentYtTrack
                        ? currentYtTrack.title
                        : activeSoundsCount > 0
                        ? `${activeSoundsCount} Nature Sounds Active`
                        : currentSceneObj.name}
                    </span>
                    {(isYtPlaying || (isPlaying && activeSoundsCount > 0)) && (
                      <span className="island-eq" aria-hidden="true">
                        <span></span><span></span><span></span><span></span>
                      </span>
                    )}
                  </button>
                ) : (
                  <div className="island-expanded-card">
                    <div className="island-card-top">
                      <img
                        src={
                          currentYtTrack
                            ? `https://i.ytimg.com/vi/${currentYtTrack.id}/mqdefault.jpg`
                            : currentSceneObj.image
                        }
                        alt=""
                        className="island-expanded-art"
                      />
                      <div className="island-track-meta">
                        <span className="island-status-pill">
                          {isYtPlaying ? 'YouTube Focus Audio' : 'Ambient Nature Sanctuary'}
                        </span>
                        <h4 className="island-title">
                          {currentYtTrack ? currentYtTrack.title : 'Atmospheric Soundscape'}
                        </h4>
                        <p className="island-sub">
                          {currentYtTrack ? currentYtTrack.sub : `${activeSoundsCount} active layers`}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="island-close-btn"
                        onClick={() => setIsIslandExpanded(false)}
                        aria-label="Close island controller"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>

                    <div className="island-controls-row">
                      <button
                        type="button"
                        className="island-step-btn"
                        onClick={prevYtTrack}
                        title="Previous Track"
                        aria-label="Previous Track"
                      >
                        <FontAwesomeIcon icon={faBackward} />
                      </button>
                      <button
                        type="button"
                        className="island-main-btn"
                        onClick={toggleYtPlay}
                        title={isYtPlaying ? 'Pause' : 'Play'}
                        aria-label={isYtPlaying ? 'Pause' : 'Play'}
                      >
                        <FontAwesomeIcon icon={isYtPlaying ? faPause : faPlay} />
                      </button>
                      <button
                        type="button"
                        className="island-step-btn"
                        onClick={nextYtTrack}
                        title="Next Track"
                        aria-label="Next Track"
                      >
                        <FontAwesomeIcon icon={faForward} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Top Right Exit and Fullscreen Buttons */}
            <div className="zen-top-actions">
              <button
                type="button"
                className="zen-action-pill-btn"
                onClick={() => {
                  if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(() => {});
                  } else {
                    document.exitFullscreen().catch(() => {});
                  }
                }}
                title="Toggle Fullscreen (F)"
                aria-label="Toggle Fullscreen"
              >
                <FontAwesomeIcon icon={faExpand} />
              </button>
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
            </div>

            {/* Center Stage: Minimalist Clock & Quote */}
            <div className="zen-center-stage">
              <div className="zen-task-line">
                <span className="zen-dot"></span>
                <span className="zen-task-text">{currentTask || 'Deep Nature Focus Session'}</span>
              </div>

              <div className="zen-timer-display" aria-live="polite">
                {timerMode === 'stopwatch' ? formatTime(stopwatchSeconds) : formatTime(timeRemaining)}
              </div>

              <div className="zen-phase-badge">
                {timerMode === 'stopwatch'
                  ? 'STOPWATCH FLOW'
                  : timerPhase === 'focus'
                  ? 'FOCUS INTERVAL'
                  : 'SHORT BREAK'}
              </div>

              {/* Inspiring Deep Work Quote */}
              <div className="zen-quote-display">
                <p>“{FOCUS_QUOTES[currentQuoteIndex]}”</p>
              </div>

              {/* Action Controls */}
              <div className="zen-controls-row">
                {timerStatus === 'running' ? (
                  <button type="button" className="zen-action-btn pause" onClick={pauseTimer}>
                    <FontAwesomeIcon icon={faPause} />
                    <span>Pause Timer</span>
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
                    ? `${activeSoundsCount} nature sound${activeSoundsCount > 1 ? 's' : ''} active`
                    : 'Nature soundscape generator ready'}
                </span>
              </div>
            </div>

            {/* Bottom Floating Control Dock */}
            <div className="zen-bottom-dock">
              {/* Scene Switcher Dropdown */}
              <div className="zen-dock-group">
                <span className="dock-label">Atmosphere:</span>
                <select
                  className="zen-scene-select"
                  value={activeScene}
                  onChange={(e) => changeScene(e.target.value)}
                  aria-label="Select Scene Atmosphere"
                >
                  {FOCUS_SCENES.map((sc) => (
                    <option key={sc.id} value={sc.id}>
                      {sc.icon} {sc.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Shuffle Surprise Mix */}
              <button
                type="button"
                className="zen-dock-btn"
                onClick={shuffleMix}
                title="Shuffle surprise mix (S)"
                aria-label="Shuffle surprise mix"
              >
                <FontAwesomeIcon icon={faShuffle} />
                <span>Surprise Mix</span>
              </button>

              {/* Next Quote Button */}
              <button
                type="button"
                className="zen-dock-btn"
                onClick={nextQuote}
                title="Next inspiring quote"
                aria-label="Next inspiring quote"
              >
                <span>Another Quote</span>
              </button>

              {/* Toggle Quick Mixer Overlay */}
              <button
                type="button"
                className={`zen-dock-btn ${showZenMixer ? 'active' : ''}`}
                onClick={() => setShowZenMixer(!showZenMixer)}
                title="Soundboard quick mixer"
                aria-label="Soundboard quick mixer"
              >
                <FontAwesomeIcon icon={faSliders} />
                <span>Mixer ({activeSoundsCount})</span>
              </button>
            </div>

            {/* Quick Mixer Drawer Overlay */}
            {showZenMixer && (
              <div className="zen-mixer-popup" role="dialog" aria-label="Zen Quick Sound Mixer">
                <div className="zen-mixer-header">
                  <h4>Active Sound Mix</h4>
                  <button
                    type="button"
                    className="mixer-close-btn"
                    onClick={() => setShowZenMixer(false)}
                    aria-label="Close mixer"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
                <div className="zen-mixer-list">
                  {SOUND_DEFINITIONS.filter((s) => (volumes[s.id] || 0) > 0).length === 0 ? (
                    <p className="mixer-empty-note">No sounds active. Tap below to shuffle a mix.</p>
                  ) : (
                    SOUND_DEFINITIONS.filter((s) => (volumes[s.id] || 0) > 0).map((s) => (
                      <div key={s.id} className="zen-mixer-row">
                        <span className="mixer-sound-icon">{s.icon}</span>
                        <span className="mixer-sound-name">{s.name}</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={volumes[s.id] || 0}
                          onChange={(e) => setSoundVolume(s.id, e.target.value)}
                          className="zen-mixer-slider"
                          aria-label={`${s.name} volume`}
                        />
                        <span className="mixer-vol-val">{volumes[s.id]}%</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            MINDFUL BOX BREATHING OVERLAY
           ========================================================================= */}
        {isBreathingMode && (
          <div
            className="mindful-breathing-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Apple Mindful Box Breathing"
            onClick={() => setIsBreathingMode(false)}
          >
            <button
              type="button"
              className="breathing-exit-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsBreathingMode(false);
              }}
              aria-label="Exit Mindful Breathing (Esc)"
              title="Exit Mindful Breathing (Esc)"
            >
              <FontAwesomeIcon icon={faTimes} />
              <span>Exit Breathing</span>
              <kbd>ESC</kbd>
            </button>

            <div className="breathing-stage" onClick={(e) => e.stopPropagation()}>
              <span className="breathing-kicker-badge">NEURAL MINDFULNESS RESET</span>

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

              {/* Prominent Center Finish Button */}
              <div className="breathing-bottom-actions">
                <button
                  type="button"
                  className="breathing-finish-btn"
                  onClick={() => setIsBreathingMode(false)}
                  aria-label="Done with breathing session"
                >
                  <FontAwesomeIcon icon={faCheck} className="finish-icon" />
                  <span>Done · Return to Focus</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SAVE PRESET MODAL
           ========================================================================= */}
        {showSaveModal && (
          <div className="modal-backdrop" onClick={() => setShowSaveModal(false)}>
            <div
              className="preset-save-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="save-preset-heading"
              onClick={(e) => e.stopPropagation()}
            >
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
                Save your active mix of {activeSoundsCount} nature sound layers directly to your personal soundscape library.
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
                  placeholder="e.g. Monsoon Tin Roof & Pines"
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

        {/* =========================================================================
            KEYBOARD SHORTCUTS HUD MODAL
           ========================================================================= */}
        {showShortcutsModal && (
          <div className="modal-backdrop" onClick={() => setShowShortcutsModal(false)}>
            <div
              className="shortcuts-hud-card"
              role="dialog"
              aria-modal="true"
              aria-labelledby="shortcuts-hud-heading"
              onClick={(e) => e.stopPropagation()}
            >
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
                  <span className="shortcut-label">Focus View / Zen Mode</span>
                  <div className="keys"><kbd>V</kbd></div>
                </div>
                <div className="shortcut-row">
                  <span className="shortcut-label">Zen Fullscreen Mode</span>
                  <div className="keys"><kbd>F</kbd></div>
                </div>
                <div className="shortcut-row">
                  <span className="shortcut-label">Surprise Mix (Shuffle)</span>
                  <div className="keys"><kbd>S</kbd></div>
                </div>
                <div className="shortcut-row">
                  <span className="shortcut-label">Toggle YouTube Video Fold</span>
                  <div className="keys"><kbd>Y</kbd></div>
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
                  <span className="shortcut-label">Reset Timer</span>
                  <div className="keys"><kbd>R</kbd></div>
                </div>
                <div className="shortcut-row">
                  <span className="shortcut-label">Show Shortcuts Help</span>
                  <div className="keys"><kbd>?</kbd></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            AL NAHIAN MINDFULNESS TIME-TOAST GREETING BANNER
           ========================================================================= */}
        {showTimeToast && (
          <div className="time-toast-banner" role="status" aria-live="polite">
            <div className="time-toast-left">
              <span className="toast-icon-badge">{timeGreeting.icon}</span>
              <div className="toast-text-col">
                <span className="toast-period-tag">{timeGreeting.period} Mindfulness</span>
                <p className="toast-message">{timeGreeting.message}</p>
              </div>
            </div>
            <div className="time-toast-right">
              <span className="toast-streak-badge">Focus Streak #{visitStreak}</span>
              <button
                type="button"
                className="toast-dismiss-btn"
                onClick={() => setShowTimeToast(false)}
                aria-label="Dismiss greeting"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            ATMOSPHERIC HERO SCENE & CINEMATIC HEADER ZONE
           ========================================================================= */}
        <section className="hero-scene-section" aria-labelledby="focus-hero-title">
          {/* Dynamic Atmospheric Scene Backdrop */}
          <div className="hero-scene-backdrop" data-scene={activeScene} aria-hidden="true">
            <img
              src={currentSceneObj.image}
              alt=""
              className="hero-scene-image focus-drift"
            />
            <div className="hero-scene-gradient"></div>
          </div>

          <div className="hero-scene-content">
            <div className="header-meta-row">
              <span className="focus-kicker-tag">
                <span className="kicker-pulse"></span>
                PURE NATURE SOUNDSCAPES
              </span>

              {/* Atmosphere Scene Selector Pills */}
              <div className="scene-selector-strip" role="toolbar" aria-label="Atmospheric Scenes">
                {FOCUS_SCENES.slice(0, 8).map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    className={`scene-pill ${activeScene === sc.id ? 'active' : ''}`}
                    onClick={() => changeScene(sc.id)}
                    title={`Atmospheric scene: ${sc.name}`}
                  >
                    <span>{sc.icon}</span>
                    <span className="sc-name">{sc.name}</span>
                  </button>
                ))}
              </div>

              <div className="focus-status-badge">
                <span className={`status-indicator ${isPlaying || isYtPlaying || timerStatus === 'running' ? 'active' : ''}`}></span>
                <span>
                  {isPlaying || isYtPlaying || timerStatus === 'running'
                    ? 'Deep Nature Focus In Progress'
                    : 'Ready to Focus'}
                </span>
              </div>
            </div>

            <h1 id="focus-hero-title" className="page-title">
              <AnimatedLetters
                letterClass={letterClass}
                strArray={'Focus Station'.split('')}
                idx={15}
              />
            </h1>

            {/* Rotating Deep Work Inspiration Quote */}
            <div className="hero-quote-container">
              <blockquote className="hero-quote-text">
                <FontAwesomeIcon icon={faQuoteLeft} className="quote-mark" />
                <span>{FOCUS_QUOTES[currentQuoteIndex]}</span>
              </blockquote>
              <button
                type="button"
                className="quote-next-btn"
                onClick={nextQuote}
                title="Another line"
                aria-label="Show another inspiring line"
              >
                <FontAwesomeIcon icon={faRotateRight} />
                <span>Another line</span>
              </button>
            </div>

          </div>
        </section>

        {/* =========================================================================
            MASTER FLOATING RIBBON (Studio Controls)
           ========================================================================= */}
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
              title="Toggle analog tape saturation & subtle warmth"
              aria-label={isVinylWarmth ? 'Turn off analog tape warmth' : 'Turn on analog tape warmth'}
            >
              <FontAwesomeIcon icon={faRecordVinyl} className={isVinylWarmth ? 'spin-icon' : ''} />
              <span>Analog Warmth</span>
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

            {/* Sleep Timer Countdown Trigger */}
            <button
              type="button"
              className={`sleep-timer-btn ${sleepTimerMinutes ? 'active' : ''}`}
              onClick={() => {
                const steps = [null, 15, 30, 45, 60];
                const curIdx = steps.indexOf(sleepTimerMinutes);
                const nextStep = steps[(curIdx + 1) % steps.length];
                setSleepTimer(nextStep);
              }}
              title={
                sleepTimerMinutes
                  ? `Sleep timer active: ${Math.ceil(sleepTimerRemaining / 60)}m remaining. Click to cycle.`
                  : 'Set audio auto-fade sleep timer (15m, 30m, 45m, 60m)'
              }
              aria-label="Set audio sleep timer"
            >
              <FontAwesomeIcon icon={faMoon} className={sleepTimerMinutes ? 'glowing' : ''} />
              <span>
                {sleepTimerMinutes
                  ? `${Math.floor(sleepTimerRemaining / 60)}:${(sleepTimerRemaining % 60)
                      .toString()
                      .padStart(2, '0')}`
                  : 'Sleep Timer'}
              </span>
            </button>

            {/* Shuffle Mix Button */}
            <button
              type="button"
              className="shuffle-mix-btn"
              onClick={shuffleMix}
              title="Shuffle: surprise mix (S)"
              aria-label="Shuffle: a surprise mix"
            >
              <FontAwesomeIcon icon={faShuffle} />
              <span>Surprise Mix</span>
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
                <div key={preset.id} className="user-preset-wrapper">
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
                    className="delete-user-preset-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteUserPreset(preset.id);
                    }}
                    title={`Delete "${preset.name}" preset`}
                    aria-label={`Delete "${preset.name}" preset`}
                  >
                    ×
                  </button>
                </div>
              );
            })}

            {/* Save & Share & Clear Actions */}
            {activeSoundsCount > 0 && (
              <>
                <button
                  type="button"
                  className="save-preset-btn"
                  onClick={() => setShowSaveModal(true)}
                  title="Save current nature mix as custom preset"
                  aria-label="Save current mix as preset"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Save Mix</span>
                </button>

                <button
                  type="button"
                  className={`share-mix-btn ${shareCopied ? 'copied' : ''}`}
                  onClick={handleShareMix}
                  title="Copy shareable link to this sound mix"
                  aria-label="Copy shareable mix link"
                >
                  <FontAwesomeIcon icon={shareCopied ? faCheck : faLink} />
                  <span>{shareCopied ? 'Copied Link!' : 'Share Mix'}</span>
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

        {/* =========================================================================
            APPLE SEGMENTED VIEW SWITCHER (Mobile / Tablet Minimalist Controller)
           ========================================================================= */}
        <div className="focus-view-switcher-sticky-wrap">
          <div className="focus-view-switcher" role="tablist" aria-label="Workspace views">
            <button
              type="button"
              role="tab"
              aria-selected={activeWorkspaceTab === 'soundboard'}
              className={`view-tab ${activeWorkspaceTab === 'soundboard' ? 'active' : ''}`}
              onClick={() => setActiveWorkspaceTab('soundboard')}
            >
              <span className="tab-symbol">🌿</span>
              <span className="tab-text">Nature Soundboard</span>
              {activeSoundsCount > 0 && (
                <span className="tab-badge">{activeSoundsCount}</span>
              )}
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeWorkspaceTab === 'timer'}
              className={`view-tab ${activeWorkspaceTab === 'timer' ? 'active' : ''}`}
              onClick={() => setActiveWorkspaceTab('timer')}
            >
              <span className="tab-symbol">⏱️</span>
              <span className="tab-text">Flow Timer &amp; Log</span>
              {(timerStatus === 'running' || isYtPlaying) && (
                <span className="tab-pulse-dot" title="Session in progress"></span>
              )}
            </button>
          </div>
        </div>

        {/* =========================================================================
            MAIN WORKSPACE GRID: Left (Pomodoro, Visualizer, YouTube & Log) vs Right (Soundboard)
           ========================================================================= */}
        <div className={`focus-grid-container view-${activeWorkspaceTab}`}>
          {/* LEFT COLUMN: Pomodoro Timer, Spectrum Visualizer, YouTube Studio & Today's Log */}
          <div className={`focus-left-column ${activeWorkspaceTab === 'timer' ? 'mobile-visible' : 'mobile-hidden'}`}>
            
            {/* 1. Pomodoro Timer Station */}
            <div className="focus-card pomodoro-card">
              <div className="card-top-header">
                <div className="header-title-group">
                  <FontAwesomeIcon icon={faClock} className="header-icon gold" />
                  <h3>Deep Work Pomodoro</h3>
                </div>
                <div className="sessions-counter" title="Completed focus sessions in this run">
                  <FontAwesomeIcon icon={faFire} className="fire-icon" />
                  <span>{completedSessions} sessions</span>
                </div>
              </div>

              {/* Mode Selector Tabs */}
              <div className="mode-selector-tabs" role="tablist">
                {Object.values(TIMER_MODES).map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    role="tab"
                    aria-selected={timerMode === mode.id}
                    aria-label={mode.label}
                    className={`mode-tab ${timerMode === mode.id ? 'active' : ''}`}
                    onClick={() => changeTimerMode(mode.id)}
                  >
                    <span className="mode-tab-title">{mode.label}</span>
                    <span className="mode-tab-duration">
                      {mode.id === 'stopwatch' ? '∞' : `${mode.focusMinutes}m`}
                    </span>
                  </button>
                ))}
              </div>

              {/* Circular Dial Progress Ring */}
              <div className="pomodoro-dial-wrap">
                <svg className="pomodoro-svg-ring" viewBox="0 0 240 240">
                  <circle
                    className="ring-bg"
                    cx="120"
                    cy="120"
                    r={radius}
                  />
                  <circle
                    className={`ring-progress ${timerPhase === 'break' ? 'break-phase' : ''}`}
                    cx="120"
                    cy="120"
                    r={radius}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>

                <div className="pomodoro-dial-content">
                  <span className={`phase-badge ${timerPhase === 'break' ? 'break' : ''}`}>
                    {timerMode === 'stopwatch'
                      ? 'STOPWATCH'
                      : timerPhase === 'focus'
                      ? 'FOCUS SPRINT'
                      : 'SHORT BREAK'}
                  </span>

                  <div className="dial-time-digits" aria-live="polite">
                    {timerMode === 'stopwatch' ? formatTime(stopwatchSeconds) : formatTime(timeRemaining)}
                  </div>

                  <span className="dial-status-caption">
                    {timerStatus === 'running'
                      ? 'Session In Progress'
                      : timerStatus === 'paused'
                      ? 'Paused'
                      : 'Ready to Start'}
                  </span>
                </div>
              </div>

              {/* Timer Primary Action Controls */}
              <div className="pomodoro-actions-bar">
                {timerStatus === 'running' ? (
                  <button
                    type="button"
                    className="timer-action-btn pause-btn"
                    onClick={pauseTimer}
                  >
                    <FontAwesomeIcon icon={faPause} />
                    <span>PAUSE</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="timer-action-btn start-btn"
                    onClick={startTimer}
                  >
                    <FontAwesomeIcon icon={faPlay} />
                    <span>{timerStatus === 'paused' ? 'RESUME' : 'START FOCUS'}</span>
                  </button>
                )}

                <button
                  type="button"
                  className="timer-reset-btn"
                  onClick={() => resetTimer()}
                  title="Reset Timer (R)"
                  aria-label="Reset Timer"
                >
                  <FontAwesomeIcon icon={faRotateRight} />
                </button>
              </div>

              {/* Active Focus Task Input */}
              <div className="active-task-container">
                <label htmlFor="focus-task-input" className="task-label">
                  CURRENT FOCUS GOAL:
                </label>
                <div className="task-input-wrap">
                  <input
                    id="focus-task-input"
                    type="text"
                    value={currentTask}
                    onChange={(e) => setCurrentTask(e.target.value)}
                    placeholder="e.g. Focused reading, architecture design, calm meditation..."
                    className="task-text-input"
                  />
                </div>
              </div>
            </div>

            {/* 2. Audio Wave Visualizer Card */}
            <div className="focus-card visualizer-card">
              <div className="card-top-header">
                <div className="header-title-group">
                  <FontAwesomeIcon icon={faWaveSquare} className="header-icon cyan" />
                  <h3>Acoustic Spectrum</h3>
                </div>
                <div className="viz-header-controls">
                  <div className="viz-mode-segmented" role="group" aria-label="Visualizer Mode">
                    <button
                      type="button"
                      className={`viz-mode-btn ${visualizerMode === 'bars' ? 'active' : ''}`}
                      onClick={() => setVisualizerMode('bars')}
                      aria-pressed={visualizerMode === 'bars'}
                    >
                      Bars
                    </button>
                    <button
                      type="button"
                      className={`viz-mode-btn ${visualizerMode === 'wave' ? 'active' : ''}`}
                      onClick={() => setVisualizerMode('wave')}
                      aria-pressed={visualizerMode === 'wave'}
                    >
                      Wave
                    </button>
                    <button
                      type="button"
                      className={`viz-mode-btn ${visualizerMode === 'radial' ? 'active' : ''}`}
                      onClick={() => setVisualizerMode('radial')}
                      aria-pressed={visualizerMode === 'radial'}
                    >
                      Radial
                    </button>
                  </div>
                  <span className="viz-status-pill">
                    {isPlaying ? 'ACTIVE FREQUENCY' : 'IDLE BREATH'}
                  </span>
                </div>
              </div>
              <div className="canvas-wrapper">
                <canvas ref={canvasRef} className="spectrum-canvas" />
              </div>
            </div>

            {/* 3. YouTube Focus Player & Stream Section */}
            <div className="focus-card youtube-card">
              <div className="card-top-header">
                <div className="header-title-group">
                  <FontAwesomeIcon icon={faTv} className="header-icon red" />
                  <h3>YouTube Video Player</h3>
                  {isYtPlaying && (
                    <span className="yt-live-tag">
                      <span className="live-dot"></span> LIVE
                    </span>
                  )}
                </div>
                <div className="yt-header-actions">
                  <button
                    type="button"
                    className="yt-fold-btn"
                    onClick={toggleYtFold}
                    title={isYtFolded ? 'Show video' : 'Hide video'}
                    aria-label={isYtFolded ? 'Show video' : 'Hide video'}
                  >
                    <FontAwesomeIcon icon={isYtFolded ? faEye : faEyeSlash} />
                    <span>{isYtFolded ? 'Show Video' : 'Hide Video'}</span>
                  </button>
                </div>
              </div>

              {/* YouTube Screen Container (Foldable) */}
              <div className={`yt-screen-fold ${isYtFolded ? 'folded' : 'expanded'}`}>
                <div className="yt-screen-aspect">
                  <iframe
                    ref={ytIframeRef}
                    title="YouTube Focus Player"
                    src={`https://www.youtube-nocookie.com/embed/${currentYtTrack ? currentYtTrack.id : '25wH52RSam8'}?autoplay=${isYtPlaying ? 1 : 0}&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
                    className="yt-iframe"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* Now Playing Bar with Dedicated Volume Slider */}
              <div className="yt-now-playing-bar">
                <div className="yt-info-group">
                  <button
                    type="button"
                    className={`yt-play-toggle-btn ${isYtPlaying ? 'playing' : ''}`}
                    onClick={toggleYtPlay}
                    aria-label={isYtPlaying ? 'Pause YouTube video' : 'Play YouTube video'}
                    title={isYtPlaying ? 'Pause video' : 'Play video'}
                  >
                    <FontAwesomeIcon icon={isYtPlaying ? faPause : faPlay} />
                  </button>
                  <div className="yt-title-meta">
                    <span className={`yt-state-pill ${isYtPlaying ? 'playing' : ''}`}>
                      {isYtPlaying ? 'Now playing' : 'Paused'}
                    </span>
                    <span className="yt-title-text" title={currentYtTrack ? currentYtTrack.title : ''}>
                      {currentYtTrack ? `${currentYtTrack.title}` : 'Paste a video link below'}
                    </span>
                  </div>
                </div>

                <div className="yt-volume-control">
                  <FontAwesomeIcon icon={faVolumeHigh} className="yt-vol-icon" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={ytVolume}
                    onChange={(e) => setYtVolume(Number(e.target.value))}
                    className="yt-volume-slider"
                    aria-label="YouTube Volume"
                  />
                  <span className="yt-vol-val">{ytVolume}%</span>
                </div>
              </div>

              {/* Direct Link Entry & Saved Videos Section */}
              <div className="yt-link-entry-section">
                <form className="yt-link-form" onSubmit={handleCustomLinkSubmit}>
                  <div className="yt-input-wrapper">
                    <FontAwesomeIcon icon={faLink} className="yt-input-icon" />
                    <input
                      type="text"
                      placeholder="Paste any YouTube video link or ID (e.g. https://youtu.be/...)"
                      value={customLinkInput}
                      onChange={(e) => setCustomLinkInput(e.target.value)}
                      className="yt-link-text-input"
                      aria-label="YouTube video link"
                    />
                    {customLinkInput && (
                      <button
                        type="button"
                        className="yt-clear-input-btn"
                        onClick={() => setCustomLinkInput('')}
                        aria-label="Clear link input"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    )}
                  </div>
                  <button type="submit" className="yt-link-add-btn">
                    <FontAwesomeIcon icon={faPlay} />
                    <span>Play Video</span>
                  </button>
                </form>

                {/* Saved / Recently Added Videos Tray */}
                {customYtLinks.length > 0 && (
                  <div className="yt-saved-links-tray">
                    <div className="yt-saved-header">
                      <span className="saved-title">Saved Videos ({customYtLinks.length})</span>
                    </div>
                    <div className="yt-saved-chips">
                      {customYtLinks.map((track) => {
                        const isCurrent = currentYtTrack && currentYtTrack.id === track.id;
                        return (
                          <div
                            key={track.id}
                            className={`yt-video-chip ${isCurrent ? 'active' : ''}`}
                          >
                            <button
                              type="button"
                              className="chip-select-btn"
                              onClick={() => playYtTrack(track)}
                              title={`Play ${track.title}`}
                            >
                              <FontAwesomeIcon
                                icon={isCurrent && isYtPlaying ? faPause : faPlay}
                                className="chip-play-icon"
                              />
                              <span className="chip-label">{track.title}</span>
                            </button>
                            <button
                              type="button"
                              className="chip-delete-btn"
                              onClick={() => removeCustomYtLink(track.id)}
                              title="Remove video"
                              aria-label={`Remove ${track.title}`}
                            >
                              <FontAwesomeIcon icon={faTrashCan} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {customYtLinks.length === 0 && (
                  <div className="yt-empty-helper">
                    <p>Paste any YouTube music, ambient soundscape, or tutorial link above to stream it seamlessly with your nature sounds.</p>
                  </div>
                )}
              </div>
            </div>

            {/* 4. Completed Sessions Log Card */}
            <div className="focus-card session-history-card">
              <div className="card-top-header">
                <div className="header-title-group">
                  <FontAwesomeIcon icon={faHistory} className="header-icon purple" />
                  <h3>Today's Focus Log</h3>
                </div>
                {sessionHistory.length > 0 && (
                  <div className="history-header-actions">
                    <span className="history-count-badge">
                      {sessionHistory.length} logged
                    </span>
                    <button
                      type="button"
                      className="history-clear-btn"
                      onClick={clearSessionHistory}
                      title="Clear session history"
                      aria-label="Clear session history"
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  </div>
                )}
              </div>

              {sessionHistory.length === 0 ? (
                <div className="history-empty-state">
                  <p>Completed focus sessions will appear here with your task details and duration.</p>
                </div>
              ) : (
                <div className="history-list">
                  {sessionHistory.map((item) => (
                    <div key={item.id} className="history-item">
                      <div className="history-item-left">
                        <span className="history-time">{item.time}</span>
                        <span className="history-task" title={item.task}>{item.task}</span>
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

          {/* RIGHT COLUMN: Complete Nature Soundboard (All 61 Sounds) */}
          <div className={`focus-right-column ${activeWorkspaceTab === 'soundboard' ? 'mobile-visible' : 'mobile-hidden'}`}>
            <div className="focus-card soundboard-card">
              <div className="soundboard-header">
                <div className="header-title-group">
                  <FontAwesomeIcon icon={faHeadphones} className="header-icon" />
                  <h3>All Nature Sounds Library</h3>
                </div>
                <span className="active-tracks-count">
                  {activeSoundsCount > 0
                    ? `${activeSoundsCount} sound${activeSoundsCount > 1 ? 's' : ''} active`
                    : `${SOUND_DEFINITIONS.length} sounds available`}
                </span>
              </div>

              {/* Sound Search Bar */}
              <div className="sound-search-wrap">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="sound-search-icon" />
                <input
                  type="text"
                  placeholder="Search 61 sounds (e.g. tin roof, cafe, train, rain, thunder)..."
                  value={soundSearch}
                  onChange={(e) => setSoundSearch(e.target.value)}
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

              {/* Category Filter Pills */}
              <div className="category-filter-bar" role="toolbar" aria-label="Sound Categories">
                {categories.map((cat) => {
                  const isCur = activeCategory.toLowerCase() === cat.toLowerCase();
                  return (
                    <button
                      key={cat}
                      type="button"
                      className={`cat-pill ${isCur ? 'active' : ''}`}
                      onClick={() => setActiveCategory(cat.toLowerCase())}
                    >
                      <span>{cat}</span>
                      <span className="cat-count">({getCategoryCount(cat)})</span>
                    </button>
                  );
                })}
              </div>

              {/* Neural Brainwave Tuner Panel */}
              <div className="brainwave-tuner-panel">
                <div className="tuner-header">
                  <div className="tuner-title-group">
                    <FontAwesomeIcon icon={faBrain} className="tuner-icon cyan" />
                    <span className="tuner-title">Neural Frequency Architecture</span>
                  </div>
                  <span className="current-hz-badge">
                    {BRAINWAVE_MODES[brainwaveMode]?.hz}Hz · {BRAINWAVE_MODES[brainwaveMode]?.tag}
                  </span>
                </div>

                <div className="brainwave-modes-grid" role="radiogroup" aria-label="Brainwave Frequency Modes">
                  {Object.values(BRAINWAVE_MODES).map((bw) => {
                    const isCur = brainwaveMode === bw.id;
                    return (
                      <button
                        key={bw.id}
                        type="button"
                        role="radio"
                        aria-label={`${bw.label} ${bw.hz} Hz`}
                        aria-checked={isCur}
                        className={`bw-mode-pill ${isCur ? 'active' : ''}`}
                        onClick={() => changeBrainwaveMode(bw.id)}
                        title={`${bw.label} (${bw.hz}Hz) - ${bw.desc}`}
                      >
                        <span className="bw-icon">{bw.icon}</span>
                        <div className="bw-info">
                          <span className="bw-name">{bw.label}</span>
                          <span className="bw-hz">{bw.hz} Hz</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sound Tiles Grid */}
              {filteredSounds.length === 0 ? (
                <div className="sound-empty-state">
                  <p>No sounds match your search query "{soundSearch}".</p>
                  <button
                    type="button"
                    className="clear-search-link"
                    onClick={() => {
                      setSoundSearch('');
                      setActiveCategory('all');
                    }}
                  >
                    Reset filter &amp; search
                  </button>
                </div>
              ) : (
                <div className="sound-tiles-grid">
                  {filteredSounds.map((sound) => {
                    const vol = volumes[sound.id] || 0;
                    const isActive = vol > 0 && isPlaying;
                    const isStarred = favorites.includes(sound.id);
                    return (
                      <div
                        key={sound.id}
                        className={`sound-tile ${isActive ? 'is-active' : ''} ${vol > 0 ? 'has-volume' : ''}`}
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
                            <span className="sound-emoji">{sound.icon}</span>
                            {isActive && <span className="avatar-pulse-glow" aria-hidden="true"></span>}
                          </div>
                          <div className="tile-title-col">
                            <div className="sound-name-row">
                              <span className="sound-name">{sound.name}</span>
                              {isActive && (
                                <span className="sound-eq-bars" aria-label="Playing" aria-hidden="true">
                                  <span></span><span></span><span></span>
                                </span>
                              )}
                            </div>
                            <span className="sound-desc">{sound.desc}</span>
                          </div>
                          <div className="tile-actions-col">
                            <button
                              type="button"
                              className={`sound-fav-star ${isStarred ? 'starred' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(sound.id);
                              }}
                              title={isStarred ? `Unfavorite ${sound.name}` : `Star ${sound.name} as favorite`}
                              aria-label={`Favorite ${sound.name}`}
                            >
                              <FontAwesomeIcon icon={faStar} />
                            </button>
                            <button
                              type="button"
                              className={`sound-power-toggle ${isActive ? 'active' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSound(sound.id);
                              }}
                              aria-label={isActive ? `Turn off ${sound.name}` : `Play ${sound.name}`}
                              title={isActive ? `Turn off ${sound.name}` : `Play ${sound.name}`}
                            >
                              <FontAwesomeIcon icon={isActive ? faVolumeHigh : faPlay} />
                            </button>
                          </div>
                        </div>

                        <div className="tile-slider-row">
                          <span className="slider-vol-label">VOL</span>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={vol}
                            onChange={(e) => setSoundVolume(sound.id, e.target.value)}
                            className="sound-volume-slider"
                            aria-label={`${sound.name} volume`}
                          />
                          <span className="tile-vol-readout">{vol}%</span>
                        </div>
                      </div>
                    );
                  })}
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
