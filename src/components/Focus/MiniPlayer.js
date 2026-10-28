import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faPause,
  faHeadphones,
  faClock,
  faTimes,
  faExpand,
} from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { useFocus, FOCUS_PRESETS } from '../../context/FocusContext';
import './MiniPlayer.scss';

const MiniPlayer = () => {
  const location = useLocation();
  const {
    isPlaying,
    toggleMasterPlay,
    activeSoundsCount,
    activePreset,
    clearAllSounds,
    timerStatus,
    timerPhase,
    timerMode,
    timeRemaining,
    stopwatchSeconds,
    pauseTimer,
    startTimer,
    activeYouTube,
    setActiveYouTube,
  } = useFocus();

  // Hide on Focus page itself or when completely idle
  if (location.pathname === '/focus') return null;

  const isAudioActive = isPlaying && activeSoundsCount > 0;
  const isTimerActive = timerStatus === 'running' || timerStatus === 'paused';
  const isYtActive = Boolean(activeYouTube);

  if (!isAudioActive && !isTimerActive && !isYtActive) {
    return null;
  }

  // Format time MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const presetObj = activePreset ? FOCUS_PRESETS.find((p) => p.id === activePreset) : null;

  const handleStopAll = () => {
    if (isPlaying) toggleMasterPlay();
    clearAllSounds();
    if (activeYouTube) setActiveYouTube(null);
    if (timerStatus === 'running') pauseTimer();
  };

  return (
    <aside
      className="focus-mini-player"
      aria-label="Background focus session audio and timer controls"
    >
      <div className="mini-player-inner">
        {/* Left: Active Audio / YouTube Status */}
        <div className="mini-meta-section">
          <span className="mini-pulse-beacon"></span>
          <div className="mini-text-wrap">
            {isAudioActive && (
              <span className="mini-source-line">
                <FontAwesomeIcon icon={faHeadphones} className="source-icon gold" />
                <span className="source-name">
                  {presetObj ? presetObj.name : `${activeSoundsCount} sound${activeSoundsCount > 1 ? 's' : ''}`}
                </span>
              </span>
            )}

            {isYtActive && !isAudioActive && (
              <span className="mini-source-line">
                <FontAwesomeIcon icon={faYoutube} className="source-icon red" />
                <span className="source-name">{activeYouTube.title}</span>
              </span>
            )}

            {/* Pomodoro Timer Badge if active */}
            {isTimerActive && (
              <span className="mini-timer-pill">
                <FontAwesomeIcon icon={faClock} className="timer-icon" />
                <span className="timer-readout">
                  {timerMode === 'stopwatch'
                    ? formatTime(stopwatchSeconds)
                    : formatTime(timeRemaining)}
                </span>
                <span className="phase-indicator">
                  {timerMode === 'stopwatch'
                    ? 'FLOW'
                    : timerPhase === 'focus'
                    ? 'FOCUS'
                    : 'BREAK'}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Center: Quick Controls */}
        <div className="mini-controls-row">
          {/* Audio Master Play/Pause */}
          <button
            type="button"
            className={`mini-btn sound-toggle ${isPlaying ? 'playing' : ''}`}
            onClick={toggleMasterPlay}
            aria-label={isPlaying ? 'Pause ambient sounds' : 'Play ambient sounds'}
            title={isPlaying ? 'Pause ambience' : 'Resume ambience'}
          >
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
          </button>

          {/* Timer Play/Pause if timer is engaged */}
          {isTimerActive && (
            <button
              type="button"
              className={`mini-btn timer-toggle ${timerStatus === 'running' ? 'running' : ''}`}
              onClick={timerStatus === 'running' ? pauseTimer : startTimer}
              aria-label={timerStatus === 'running' ? 'Pause Pomodoro timer' : 'Resume Pomodoro timer'}
              title={timerStatus === 'running' ? 'Pause Timer' : 'Resume Timer'}
            >
              <FontAwesomeIcon icon={timerStatus === 'running' ? faPause : faPlay} />
            </button>
          )}

          {/* Jump to Full Focus Station */}
          <Link
            to="/focus"
            className="mini-btn expand-link"
            aria-label="Open full Focus Station"
            title="Open Focus Station"
          >
            <FontAwesomeIcon icon={faExpand} />
          </Link>

          {/* Stop / Dismiss Everything */}
          <button
            type="button"
            className="mini-btn stop-btn"
            onClick={handleStopAll}
            aria-label="Stop all sounds and timer"
            title="Stop & Dismiss"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default MiniPlayer;
