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
} from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import AnimatedLetters from '../AnimatedLetters';
import {
  useFocus,
  SOUND_DEFINITIONS,
  FOCUS_PRESETS,
  YOUTUBE_CHANNELS,
  TIMER_MODES,
} from '../../context/FocusContext';
import './index.scss';

const Focus = () => {
  const [letterClass, setLetterClass] = useState('text-animate');
  const [activeCategory, setActiveCategory] = useState('all');
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

  // Keyboard shortcut: F for Zen mode, Esc to exit
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key.toLowerCase() === 'f' && !isZenMode) {
        setIsZenMode(true);
      } else if (e.key === 'Escape' && isZenMode) {
        setIsZenMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZenMode, setIsZenMode]);

  // Prevent background scroll in Zen Mode
  useEffect(() => {
    if (isZenMode) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isZenMode]);

  // Real-Time Canvas Audio Frequency Visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId = null;

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
          const barHeight = (dataArray[i] / 255) * height * 0.9;
          const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
          gradient.addColorStop(0, 'rgba(245, 158, 11, 0.15)');
          gradient.addColorStop(1, 'rgba(56, 189, 248, 0.85)');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(x, height - barHeight, barWidth - 2, barHeight, [2, 2, 0, 0]);
          ctx.fill();

          x += barWidth;
        }
      } else {
        // Subtle resting baseline
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
      }

      animId = requestAnimationFrame(renderWave);
    };

    renderWave();
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [analyserRef, isPlaying]);

  // Format MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
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

  // Filter soundboard categories
  const categories = ['all', 'Noise', 'Nature', 'Ambience', 'Brainwave', 'Coding'];
  const filteredSounds = activeCategory === 'all'
    ? SOUND_DEFINITIONS
    : SOUND_DEFINITIONS.filter((s) => s.category.toLowerCase() === activeCategory.toLowerCase());

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
      <div className={`container focus-page ${isZenMode ? 'zen-mode-active' : ''}`}>
        {/* Zen Mode Immersive Overlay */}
        {isZenMode && (
          <div className="zen-overlay">
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

        {/* Regular Focus Page Surface */}
        <div className="focus-header-zone">
          <div className="header-meta-row">
            <span className="focus-kicker-badge">
              <span className="kicker-pulse"></span>
              <span>ENGINEERING FLOW STATE</span>
            </span>
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
              title={isPlaying ? 'Pause All Sounds' : 'Play All Sounds'}
            >
              <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} className="play-icon" />
              <span>{isPlaying ? 'PAUSE AMBIENCE' : 'START AMBIENCE'}</span>
            </button>

            <div className="master-volume-group">
              <button
                type="button"
                className="mute-btn"
                onClick={() => setIsMuted(!isMuted)}
                title={isMuted ? 'Unmute' : 'Mute'}
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

            {activeSoundsCount > 0 && (
              <button
                type="button"
                className="clear-mix-btn"
                onClick={clearAllSounds}
                title="Mute and reset all sound layers"
              >
                Clear Mix
              </button>
            )}
          </div>

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

              {/* Sound Categories Tabs */}
              <div className="category-filter-bar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`cat-pill ${activeCategory === cat.toLowerCase() ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat.toLowerCase())}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Soundboard Tiles Grid */}
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
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
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
