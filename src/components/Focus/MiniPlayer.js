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
  faTv,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
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
    currentYtTrack,
    isYtPlaying,
    toggleYtPlay,
    isYtFolded,
    toggleYtFold,
  } = useFocus();

  // Hide on Focus page itself or when completely idle
  if (location.pathname === '/focus') return null;

  const isAudioActive = isPlaying && activeSoundsCount > 0;
  const isTimerActive = timerStatus === 'running' || timerStatus === 'paused';
  const isYoutubeActive = isYtPlaying && currentYtTrack;

  if (!isAudioActive && !isTimerActive && !isYoutubeActive) {
    return null;
  }

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

  const presetObj = activePreset ? FOCUS_PRESETS.find((p) => p.id === activePreset) : null;

  const handleStopAll = () => {
    if (isPlaying) toggleMasterPlay();
    if (isYtPlaying) toggleYtPlay();
    clearAllSounds();
    if (timerStatus === 'running') pauseTimer();
  };

  return (
    <aside
      className="focus-mini-player"
      aria-label="Background focus session audio and timer controls"
    >
      {/* Optional YouTube Video Fold Preview if active and not folded */}
      {isYoutubeActive && !isYtFolded && (
        <div className="mini-video-fold">
          <iframe
            title="Mini YouTube Video"
            src={`https://www.youtube-nocookie.com/embed/${currentYtTrack.id}?autoplay=1&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
            className="mini-video-frame"
            allow="autoplay; encrypted-media; picture-in-picture"
          />
        </div>
      )}

      <div className="mini-player-inner">
        {/* Left: Active Nature Audio / YouTube / Timer Status */}
        <div className="mini-meta-section">
          <span className="mini-pulse-beacon"></span>
          <div className="mini-text-wrap">
            {/* YouTube Track Line */}
            {isYoutubeActive && (
              <span className="mini-source-line yt-line">
                <FontAwesomeIcon icon={faTv} className="source-icon red" />
                <span className="source-name" title={currentYtTrack.title}>
                  {currentYtTrack.title}
                </span>
              </span>
            )}

            {/* Ambient Nature Sounds Line */}
            {isAudioActive && (
              <span className="mini-source-line">
                <FontAwesomeIcon icon={faHeadphones} className="source-icon gold" />
                <span className="source-name">
                  {presetObj ? presetObj.name : `${activeSoundsCount} nature sound${activeSoundsCount > 1 ? 's' : ''}`}
                </span>
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
          {/* YouTube Video Fold Toggle if YT active */}
          {isYoutubeActive && (
            <button
              type="button"
              className="mini-btn yt-toggle"
              onClick={toggleYtFold}
              aria-label={isYtFolded ? 'Show video' : 'Hide video'}
              title={isYtFolded ? 'Show video' : 'Hide video'}
            >
              <FontAwesomeIcon icon={isYtFolded ? faEye : faEyeSlash} />
            </button>
          )}

          {/* Audio Master Play/Pause */}
          <button
            type="button"
            className={`mini-btn sound-toggle ${isPlaying || isYtPlaying ? 'playing' : ''}`}
            onClick={() => {
              if (isYoutubeActive) toggleYtPlay();
              toggleMasterPlay();
            }}
            aria-label={isPlaying || isYtPlaying ? 'Pause ambient sounds' : 'Play ambient sounds'}
            title={isPlaying || isYtPlaying ? 'Pause ambience' : 'Resume ambience'}
          >
            <FontAwesomeIcon icon={isPlaying || isYtPlaying ? faPause : faPlay} />
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
